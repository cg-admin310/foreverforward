"use server";

import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStaffUser } from "@/lib/auth";
import { slugify } from "@/lib/lms";
import {
  getCourseGeneratorSystemPrompt,
  getCourseGenerationPrompt,
  type CourseGenerationInput,
} from "@/lib/ai/prompts/course-generator";
import type { CourseLevel } from "@/types/database";

type ActionResult<T = void> = { success: boolean; data?: T; error?: string };

interface GeneratedLesson {
  title: string;
  story_body: string;
  workbook: string;
  image_prompt: string;
}
interface GeneratedQuestion {
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
}
interface GeneratedCourse {
  title: string;
  summary: string;
  audience: string;
  level: CourseLevel;
  estimated_minutes: number;
  cover_image_prompt: string;
  lessons: GeneratedLesson[];
  questions: GeneratedQuestion[];
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

/**
 * Generates a full course (story lessons + workbook + end-of-course quiz) from a
 * plain-English brief and saves it as a DRAFT for the case worker to review.
 * Returns the new course id.
 */
export async function generateCourse(
  input: CourseGenerationInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const staff = await getStaffUser();

    if (!process.env.ANTHROPIC_API_KEY) {
      return { success: false, error: "AI is not configured (missing ANTHROPIC_API_KEY)." };
    }
    if (!input.brief || input.brief.trim().length < 8) {
      return { success: false, error: "Tell the AI a bit more about the course you want." };
    }

    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: getCourseGeneratorSystemPrompt(),
      messages: [{ role: "user", content: getCourseGenerationPrompt(input) }],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return { success: false, error: "The AI returned an empty response. Try again." };
    }

    let parsed: GeneratedCourse;
    try {
      parsed = JSON.parse(extractJson(textContent.text)) as GeneratedCourse;
    } catch {
      return { success: false, error: "The AI response could not be parsed. Try again." };
    }
    if (!parsed.title || !Array.isArray(parsed.lessons) || parsed.lessons.length === 0) {
      return { success: false, error: "The AI did not return a usable course. Try again." };
    }

    const db = createAdminClient();
    const slug = await uniqueSlug(db, slugify(parsed.title));

    const { data: course, error: courseError } = await db
      .from("courses")
      .insert({
        title: parsed.title,
        slug,
        summary: parsed.summary ?? null,
        audience: parsed.audience ?? input.audience ?? null,
        level: (["intro", "beginner", "intermediate", "advanced"].includes(parsed.level)
          ? parsed.level
          : input.level) as CourseLevel,
        estimated_minutes:
          typeof parsed.estimated_minutes === "number" ? parsed.estimated_minutes : null,
        status: "draft",
        ai_generated: true,
        ai_brief: input.brief,
        created_by: staff.id,
      })
      .select("id")
      .single();
    if (courseError || !course) {
      return { success: false, error: courseError?.message ?? "Failed to save course" };
    }

    const lessonRows = parsed.lessons.map((l, i) => ({
      course_id: course.id,
      position: i,
      title: l.title ?? `Lesson ${i + 1}`,
      story_body: l.story_body ?? null,
      workbook: l.workbook ?? null,
      image_prompt: l.image_prompt ?? null,
    }));
    await db.from("course_lessons").insert(lessonRows);

    const questionRows = (parsed.questions ?? [])
      .filter((q) => q.prompt && Array.isArray(q.options) && q.options.length >= 2)
      .map((q, i) => ({
        course_id: course.id,
        lesson_id: null,
        position: i,
        prompt: q.prompt,
        type: "multiple_choice" as const,
        options: q.options,
        correct_index:
          typeof q.correct_index === "number" && q.correct_index >= 0 && q.correct_index < q.options.length
            ? q.correct_index
            : 0,
        explanation: q.explanation ?? null,
      }));
    if (questionRows.length) await db.from("quiz_questions").insert(questionRows);

    revalidatePath("/courses");
    return { success: true, data: { id: course.id } };
  } catch (error) {
    console.error("generateCourse error:", error);
    return { success: false, error: "The AI course builder hit an error. Try again." };
  }
}

async function uniqueSlug(db: ReturnType<typeof createAdminClient>, base: string): Promise<string> {
  const root = base || "course";
  let candidate = root;
  for (let i = 2; i < 50; i++) {
    const { data } = await db.from("courses").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${root}-${i}`;
  }
  return `${root}-${Date.now()}`;
}
