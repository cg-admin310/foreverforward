"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/auth";
import { programLabel } from "@/lib/lms";
import type {
  ProgramType,
  MembershipStatus,
  Course,
  CourseLesson,
  QuizQuestion,
  CourseProgramAssignment,
  MemberCourseProgress,
} from "@/types/database";

type ActionResult<T = void> = { success: boolean; data?: T; error?: string };

async function requireMemberId(): Promise<string | null> {
  const user = await getAuthUser();
  return user?.id ?? null;
}

/* --------------------------------------------------------------------------
 * Dashboard
 * ------------------------------------------------------------------------ */

export interface DashboardMembership {
  program: ProgramType;
  label: string;
  status: MembershipStatus;
}

export interface DashboardCourse {
  assignmentId: string;
  courseId: string;
  program: ProgramType;
  programLabel: string;
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  level: string;
  estimatedMinutes: number | null;
  percent: number;
  progressStatus: string;
}

export interface PortalDashboard {
  memberships: DashboardMembership[];
  courses: DashboardCourse[];
}

export async function getPortalDashboard(): Promise<ActionResult<PortalDashboard>> {
  try {
    const memberId = await requireMemberId();
    if (!memberId) return { success: false, error: "Not signed in" };
    const db = createAdminClient();

    const { data: memberships } = await db
      .from("program_memberships")
      .select("program, status")
      .eq("member_id", memberId);

    const membershipRows: DashboardMembership[] = (memberships ?? []).map(
      (m: { program: ProgramType; status: MembershipStatus }) => ({
        program: m.program,
        label: programLabel(m.program),
        status: m.status,
      })
    );

    const approved = membershipRows.filter((m) => m.status === "approved").map((m) => m.program);
    if (approved.length === 0) {
      return { success: true, data: { memberships: membershipRows, courses: [] } };
    }

    const { data: assignments } = await db
      .from("course_program_assignments")
      .select("id, course_id, program")
      .in("program", approved)
      .eq("status", "active");

    const assignmentList = (assignments ?? []) as Pick<
      CourseProgramAssignment,
      "id" | "course_id" | "program"
    >[];
    if (assignmentList.length === 0) {
      return { success: true, data: { memberships: membershipRows, courses: [] } };
    }

    const courseIds = [...new Set(assignmentList.map((a) => a.course_id))];
    const [{ data: courses }, { data: progress }] = await Promise.all([
      db.from("courses").select("*").in("id", courseIds).eq("status", "published"),
      db
        .from("member_course_progress")
        .select("assignment_id, percent, status")
        .eq("member_id", memberId)
        .in(
          "assignment_id",
          assignmentList.map((a) => a.id)
        ),
    ]);

    const courseById = new Map<string, Course>((courses ?? []).map((c: Course) => [c.id, c]));
    const progressByAssignment = new Map<string, { percent: number; status: string }>(
      (progress ?? []).map((p: { assignment_id: string; percent: number; status: string }) => [
        p.assignment_id,
        { percent: p.percent, status: p.status },
      ])
    );

    const courseCards: DashboardCourse[] = assignmentList
      .filter((a) => courseById.has(a.course_id))
      .map((a) => {
        const c = courseById.get(a.course_id)!;
        const pr = progressByAssignment.get(a.id);
        return {
          assignmentId: a.id,
          courseId: a.course_id,
          program: a.program,
          programLabel: programLabel(a.program),
          title: c.title,
          summary: c.summary,
          coverImageUrl: c.cover_image_url,
          level: c.level,
          estimatedMinutes: c.estimated_minutes,
          percent: pr?.percent ?? 0,
          progressStatus: pr?.status ?? "not_started",
        };
      });

    return { success: true, data: { memberships: membershipRows, courses: courseCards } };
  } catch {
    return { success: false, error: "Failed to load your dashboard" };
  }
}

/* --------------------------------------------------------------------------
 * Request to join a program
 * ------------------------------------------------------------------------ */

export async function requestMembership(program: ProgramType): Promise<ActionResult> {
  try {
    const memberId = await requireMemberId();
    if (!memberId) return { success: false, error: "Not signed in" };
    const db = createAdminClient();

    const { data: existing } = await db
      .from("program_memberships")
      .select("id, status")
      .eq("member_id", memberId)
      .eq("program", program)
      .maybeSingle();

    if (existing) {
      if (existing.status === "denied") {
        await db
          .from("program_memberships")
          .update({ status: "pending", decided_at: null, decided_by: null, admin_notes: null })
          .eq("id", existing.id);
        revalidatePath("/portal");
        return { success: true };
      }
      return { success: false, error: "You already have a request for that program." };
    }

    const { error } = await db
      .from("program_memberships")
      .insert({ member_id: memberId, program, status: "pending" });
    if (error) return { success: false, error: error.message };
    revalidatePath("/portal");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send request" };
  }
}

/* --------------------------------------------------------------------------
 * Course player
 * ------------------------------------------------------------------------ */

export interface PlayerQuestion {
  id: string;
  position: number;
  prompt: string;
  options: string[];
}

export interface CoursePlayerData {
  assignmentId: string;
  program: ProgramType;
  programLabel: string;
  course: Pick<Course, "id" | "title" | "summary" | "cover_image_url" | "level" | "pass_threshold">;
  lessons: CourseLesson[];
  questions: PlayerQuestion[];
  progress: { percent: number; status: string; completedLessonIds: string[] };
  bestScore: { score: number; total: number; passed: boolean } | null;
}

/** Verifies the member is approved in the assignment's program, then loads it. */
export async function getCoursePlayer(assignmentId: string): Promise<ActionResult<CoursePlayerData>> {
  try {
    const memberId = await requireMemberId();
    if (!memberId) return { success: false, error: "Not signed in" };
    const db = createAdminClient();

    const { data: assignment } = await db
      .from("course_program_assignments")
      .select("id, course_id, program, status")
      .eq("id", assignmentId)
      .single();
    if (!assignment || assignment.status !== "active") {
      return { success: false, error: "Course not available" };
    }

    const { data: membership } = await db
      .from("program_memberships")
      .select("status")
      .eq("member_id", memberId)
      .eq("program", assignment.program)
      .maybeSingle();
    if (!membership || membership.status !== "approved") {
      return { success: false, error: "You don't have access to this course yet." };
    }

    const { data: course } = await db
      .from("courses")
      .select("id, title, summary, cover_image_url, level, pass_threshold, status")
      .eq("id", assignment.course_id)
      .single();
    if (!course || course.status !== "published") {
      return { success: false, error: "Course not available" };
    }

    const [{ data: lessons }, { data: questions }, { data: progress }, { data: attempts }] =
      await Promise.all([
        db.from("course_lessons").select("*").eq("course_id", course.id).order("position"),
        db
          .from("quiz_questions")
          .select("id, position, prompt, options")
          .eq("course_id", course.id)
          .is("lesson_id", null)
          .order("position"),
        db
          .from("member_course_progress")
          .select("percent, status, completed_lesson_ids")
          .eq("member_id", memberId)
          .eq("assignment_id", assignmentId)
          .maybeSingle(),
        db
          .from("quiz_attempts")
          .select("score, total, passed")
          .eq("member_id", memberId)
          .eq("assignment_id", assignmentId)
          .order("score", { ascending: false })
          .limit(1),
      ]);

    const best = (attempts ?? [])[0] as
      | { score: number; total: number; passed: boolean }
      | undefined;

    return {
      success: true,
      data: {
        assignmentId,
        program: assignment.program,
        programLabel: programLabel(assignment.program),
        course: course as CoursePlayerData["course"],
        lessons: (lessons ?? []) as CourseLesson[],
        questions: (questions ?? []) as PlayerQuestion[],
        progress: {
          percent: (progress as MemberCourseProgress | null)?.percent ?? 0,
          status: (progress as MemberCourseProgress | null)?.status ?? "not_started",
          completedLessonIds:
            ((progress as MemberCourseProgress | null)?.completed_lesson_ids as string[]) ?? [],
        },
        bestScore: best ? { score: best.score, total: best.total, passed: best.passed } : null,
      },
    };
  } catch {
    return { success: false, error: "Failed to load course" };
  }
}

/** Marks a lesson complete and recomputes progress percent (lessons + quiz). */
export async function markLessonComplete(
  assignmentId: string,
  lessonId: string
): Promise<ActionResult<{ percent: number }>> {
  try {
    const memberId = await requireMemberId();
    if (!memberId) return { success: false, error: "Not signed in" };
    const db = createAdminClient();

    const { data: assignment } = await db
      .from("course_program_assignments")
      .select("course_id, program")
      .eq("id", assignmentId)
      .single();
    if (!assignment) return { success: false, error: "Course not available" };

    const { data: membership } = await db
      .from("program_memberships")
      .select("status")
      .eq("member_id", memberId)
      .eq("program", assignment.program)
      .maybeSingle();
    if (!membership || membership.status !== "approved") {
      return { success: false, error: "No access" };
    }

    const { count: lessonCount } = await db
      .from("course_lessons")
      .select("id", { count: "exact", head: true })
      .eq("course_id", assignment.course_id);

    const { data: existing } = await db
      .from("member_course_progress")
      .select("id, completed_lesson_ids")
      .eq("member_id", memberId)
      .eq("assignment_id", assignmentId)
      .maybeSingle();

    const done = new Set<string>(
      ((existing?.completed_lesson_ids as string[]) ?? []).concat(lessonId)
    );
    const totalLessons = lessonCount ?? 0;
    // Lessons are 90% of progress; passing the quiz is the last 10%.
    const percent = totalLessons > 0 ? Math.min(90, Math.round((done.size / totalLessons) * 90)) : 0;

    if (existing) {
      await db
        .from("member_course_progress")
        .update({
          completed_lesson_ids: [...done],
          percent: Math.max(percent, 0),
          status: "in_progress",
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await db.from("member_course_progress").insert({
        member_id: memberId,
        assignment_id: assignmentId,
        completed_lesson_ids: [...done],
        percent,
        status: "in_progress",
        last_activity_at: new Date().toISOString(),
      });
    }
    revalidatePath("/portal");
    return { success: true, data: { percent } };
  } catch {
    return { success: false, error: "Failed to save progress" };
  }
}

/* --------------------------------------------------------------------------
 * Quiz grading (server-side; answers never leave the server)
 * ------------------------------------------------------------------------ */

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  perQuestion: { id: string; correct: boolean; correctIndex: number; explanation: string | null }[];
}

export async function submitQuiz(
  assignmentId: string,
  answers: Record<string, number>
): Promise<ActionResult<QuizResult>> {
  try {
    const memberId = await requireMemberId();
    if (!memberId) return { success: false, error: "Not signed in" };
    const db = createAdminClient();

    const { data: assignment } = await db
      .from("course_program_assignments")
      .select("course_id, program")
      .eq("id", assignmentId)
      .single();
    if (!assignment) return { success: false, error: "Course not available" };

    const { data: membership } = await db
      .from("program_memberships")
      .select("status")
      .eq("member_id", memberId)
      .eq("program", assignment.program)
      .maybeSingle();
    if (!membership || membership.status !== "approved") {
      return { success: false, error: "No access" };
    }

    const [{ data: questions }, { data: course }] = await Promise.all([
      db
        .from("quiz_questions")
        .select("id, correct_index, explanation")
        .eq("course_id", assignment.course_id)
        .is("lesson_id", null),
      db.from("courses").select("pass_threshold").eq("id", assignment.course_id).single(),
    ]);

    const qs = (questions ?? []) as Pick<QuizQuestion, "id" | "correct_index" | "explanation">[];
    if (qs.length === 0) return { success: false, error: "This course has no quiz yet." };

    let score = 0;
    const perQuestion = qs.map((q) => {
      const chosen = answers[q.id];
      const correct = chosen === q.correct_index;
      if (correct) score += 1;
      return { id: q.id, correct, correctIndex: q.correct_index, explanation: q.explanation };
    });
    const total = qs.length;
    const threshold = (course?.pass_threshold as number) ?? 70;
    const passed = Math.round((score / total) * 100) >= threshold;

    await db.from("quiz_attempts").insert({
      member_id: memberId,
      assignment_id: assignmentId,
      course_id: assignment.course_id,
      score,
      total,
      passed,
      answers,
    });

    if (passed) {
      const { data: existing } = await db
        .from("member_course_progress")
        .select("id")
        .eq("member_id", memberId)
        .eq("assignment_id", assignmentId)
        .maybeSingle();
      if (existing) {
        await db
          .from("member_course_progress")
          .update({ status: "completed", percent: 100, last_activity_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await db.from("member_course_progress").insert({
          member_id: memberId,
          assignment_id: assignmentId,
          status: "completed",
          percent: 100,
          last_activity_at: new Date().toISOString(),
        });
      }
    }

    revalidatePath("/portal");
    return { success: true, data: { score, total, passed, perQuestion } };
  } catch {
    return { success: false, error: "Failed to submit quiz" };
  }
}
