"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStaffUser } from "@/lib/auth";
import { slugify } from "@/lib/lms";
import type {
  Course,
  CourseLesson,
  QuizQuestion,
  CourseProgramAssignment,
  ProgramType,
  CourseStatus,
  CourseLevel,
} from "@/types/database";

type ActionResult<T = void> = { success: boolean; data?: T; error?: string };

/* --------------------------------------------------------------------------
 * Reads
 * ------------------------------------------------------------------------ */

export interface CourseListRow extends Course {
  lesson_count: number;
  question_count: number;
  program_count: number;
}

export async function listCourses(): Promise<ActionResult<CourseListRow[]>> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const { data: courses, error } = await db
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { success: false, error: error.message };

    const ids = (courses ?? []).map((c: Course) => c.id);
    const counts: Record<string, { lessons: number; questions: number; programs: number }> = {};
    ids.forEach((id: string) => (counts[id] = { lessons: 0, questions: 0, programs: 0 }));

    if (ids.length) {
      const [lessons, questions, assignments] = await Promise.all([
        db.from("course_lessons").select("course_id").in("course_id", ids),
        db.from("quiz_questions").select("course_id").in("course_id", ids),
        db.from("course_program_assignments").select("course_id").in("course_id", ids),
      ]);
      (lessons.data ?? []).forEach((r: { course_id: string }) => (counts[r.course_id].lessons += 1));
      (questions.data ?? []).forEach((r: { course_id: string }) => (counts[r.course_id].questions += 1));
      (assignments.data ?? []).forEach((r: { course_id: string }) => (counts[r.course_id].programs += 1));
    }

    const rows: CourseListRow[] = (courses ?? []).map((c: Course) => ({
      ...c,
      lesson_count: counts[c.id]?.lessons ?? 0,
      question_count: counts[c.id]?.questions ?? 0,
      program_count: counts[c.id]?.programs ?? 0,
    }));
    return { success: true, data: rows };
  } catch {
    return { success: false, error: "Failed to load courses" };
  }
}

export interface CourseDetail {
  course: Course;
  lessons: CourseLesson[];
  questions: QuizQuestion[];
  assignments: CourseProgramAssignment[];
}

export async function getCourse(id: string): Promise<ActionResult<CourseDetail>> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const { data: course, error } = await db.from("courses").select("*").eq("id", id).single();
    if (error || !course) return { success: false, error: "Course not found" };

    const [lessons, questions, assignments] = await Promise.all([
      db.from("course_lessons").select("*").eq("course_id", id).order("position"),
      db.from("quiz_questions").select("*").eq("course_id", id).order("position"),
      db.from("course_program_assignments").select("*").eq("course_id", id).order("created_at"),
    ]);

    return {
      success: true,
      data: {
        course: course as Course,
        lessons: (lessons.data ?? []) as CourseLesson[],
        questions: (questions.data ?? []) as QuizQuestion[],
        assignments: (assignments.data ?? []) as CourseProgramAssignment[],
      },
    };
  } catch {
    return { success: false, error: "Failed to load course" };
  }
}

/* --------------------------------------------------------------------------
 * Course CRUD
 * ------------------------------------------------------------------------ */

export async function createCourse(input: {
  title: string;
  summary?: string;
  audience?: string;
  level?: CourseLevel;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const staff = await getStaffUser();
    const db = createAdminClient();
    const slug = await uniqueSlug(db, slugify(input.title || "course"));
    const { data, error } = await db
      .from("courses")
      .insert({
        title: input.title,
        slug,
        summary: input.summary ?? null,
        audience: input.audience ?? null,
        level: input.level ?? "intro",
        status: "draft",
        created_by: staff.id,
      })
      .select("id")
      .single();
    if (error) return { success: false, error: error.message };
    revalidatePath("/courses");
    return { success: true, data: { id: data.id } };
  } catch {
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse(
  id: string,
  patch: Partial<{
    title: string;
    summary: string;
    audience: string;
    level: CourseLevel;
    status: CourseStatus;
    cover_image_url: string | null;
    estimated_minutes: number | null;
    pass_threshold: number;
  }>
): Promise<ActionResult> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const { error } = await db.from("courses").update(patch).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath(`/courses/${id}`);
    revalidatePath("/courses");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const { error } = await db.from("courses").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/courses");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete course" };
  }
}

/* --------------------------------------------------------------------------
 * Lessons
 * ------------------------------------------------------------------------ */

export async function saveLesson(input: {
  id?: string;
  course_id: string;
  position: number;
  title: string;
  story_body?: string;
  workbook?: string;
  image_url?: string | null;
  image_prompt?: string | null;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const row = {
      course_id: input.course_id,
      position: input.position,
      title: input.title,
      story_body: input.story_body ?? null,
      workbook: input.workbook ?? null,
      image_url: input.image_url ?? null,
      image_prompt: input.image_prompt ?? null,
    };
    if (input.id) {
      const { error } = await db.from("course_lessons").update(row).eq("id", input.id);
      if (error) return { success: false, error: error.message };
      revalidatePath(`/courses/${input.course_id}`);
      return { success: true, data: { id: input.id } };
    }
    const { data, error } = await db.from("course_lessons").insert(row).select("id").single();
    if (error) return { success: false, error: error.message };
    revalidatePath(`/courses/${input.course_id}`);
    return { success: true, data: { id: data.id } };
  } catch {
    return { success: false, error: "Failed to save lesson" };
  }
}

export async function deleteLesson(id: string, courseId: string): Promise<ActionResult> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const { error } = await db.from("course_lessons").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete lesson" };
  }
}

/* --------------------------------------------------------------------------
 * Quiz questions
 * ------------------------------------------------------------------------ */

export async function saveQuestion(input: {
  id?: string;
  course_id: string;
  position: number;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const row = {
      course_id: input.course_id,
      lesson_id: null,
      position: input.position,
      prompt: input.prompt,
      type: "multiple_choice" as const,
      options: input.options,
      correct_index: input.correct_index,
      explanation: input.explanation ?? null,
    };
    if (input.id) {
      const { error } = await db.from("quiz_questions").update(row).eq("id", input.id);
      if (error) return { success: false, error: error.message };
      revalidatePath(`/courses/${input.course_id}`);
      return { success: true, data: { id: input.id } };
    }
    const { data, error } = await db.from("quiz_questions").insert(row).select("id").single();
    if (error) return { success: false, error: error.message };
    revalidatePath(`/courses/${input.course_id}`);
    return { success: true, data: { id: data.id } };
  } catch {
    return { success: false, error: "Failed to save question" };
  }
}

export async function deleteQuestion(id: string, courseId: string): Promise<ActionResult> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const { error } = await db.from("quiz_questions").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete question" };
  }
}

/* --------------------------------------------------------------------------
 * Program assignments (course instances)
 * ------------------------------------------------------------------------ */

export async function assignCourseToProgram(
  courseId: string,
  program: ProgramType
): Promise<ActionResult> {
  try {
    const staff = await getStaffUser();
    const db = createAdminClient();
    const { error } = await db
      .from("course_program_assignments")
      .insert({ course_id: courseId, program, assigned_by: staff.id })
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505") return { success: false, error: "Already assigned to that program" };
      return { success: false, error: error.message };
    }
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to assign course" };
  }
}

export async function unassignCourse(
  assignmentId: string,
  courseId: string
): Promise<ActionResult> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const { error } = await db.from("course_program_assignments").delete().eq("id", assignmentId);
    if (error) return { success: false, error: error.message };
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to remove assignment" };
  }
}

/* --------------------------------------------------------------------------
 * helpers
 * ------------------------------------------------------------------------ */

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
