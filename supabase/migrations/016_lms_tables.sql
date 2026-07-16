-- ============================================================================
-- Migration 016: Learning Management System (LMS)
-- Description: Member identity + program membership requests, a course library
--   (courses -> lessons -> quiz questions), per-program course assignments
--   (so the same course can live in multiple programs as separate instances),
--   and per-member progress + quiz attempts scoped to each assignment.
-- Apply by pasting into the Supabase SQL editor (this repo has no migration CLI).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enums (guarded so the file is re-runnable)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_kind') THEN
    CREATE TYPE member_kind AS ENUM ('father', 'youth', 'guardian', 'other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
    CREATE TYPE membership_status AS ENUM ('pending', 'approved', 'waitlisted', 'denied');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_status') THEN
    CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_level') THEN
    CREATE TYPE course_level AS ENUM ('intro', 'beginner', 'intermediate', 'advanced');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assignment_status') THEN
    CREATE TYPE assignment_status AS ENUM ('active', 'inactive');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_progress_status') THEN
    CREATE TYPE course_progress_status AS ENUM ('not_started', 'in_progress', 'completed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quiz_question_type') THEN
    CREATE TYPE quiz_question_type AS ENUM ('multiple_choice', 'true_false');
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- MEMBERS — self-service identity for fathers & youth (separate from staff `users`)
-- Keyed to auth.users so a logged-in member maps to exactly one members row.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  kind member_kind NOT NULL DEFAULT 'other',
  phone TEXT,
  date_of_birth DATE,
  guardian_name TEXT,
  guardian_email TEXT,
  participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);

-- ---------------------------------------------------------------------------
-- PROGRAM MEMBERSHIPS — a join request that becomes a membership on approval.
-- One row per (member, program). Admin approves / waitlists / denies.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS program_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  program program_type NOT NULL,
  status membership_status NOT NULL DEFAULT 'pending',
  message TEXT,
  decided_by UUID REFERENCES users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (member_id, program)
);
CREATE INDEX IF NOT EXISTS idx_program_memberships_member ON program_memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_program_memberships_program ON program_memberships(program);
CREATE INDEX IF NOT EXISTS idx_program_memberships_status ON program_memberships(status);

-- ---------------------------------------------------------------------------
-- COURSES — the program-agnostic library. A course is assigned to programs
-- separately (see course_program_assignments).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  audience TEXT,
  level course_level NOT NULL DEFAULT 'intro',
  cover_image_url TEXT,
  estimated_minutes INTEGER,
  status course_status NOT NULL DEFAULT 'draft',
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  ai_brief TEXT,
  pass_threshold INTEGER NOT NULL DEFAULT 70 CHECK (pass_threshold >= 0 AND pass_threshold <= 100),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- ---------------------------------------------------------------------------
-- COURSE LESSONS — the story-driven, real-world lesson pages of a course.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  story_body TEXT,
  workbook TEXT,
  image_url TEXT,
  image_prompt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_course_lessons_course ON course_lessons(course_id);

-- ---------------------------------------------------------------------------
-- QUIZ QUESTIONS — end-of-course assessment (lesson_id NULL) or per-lesson
-- checks (lesson_id set). options is a JSONB array of answer strings.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  prompt TEXT NOT NULL,
  type quiz_question_type NOT NULL DEFAULT 'multiple_choice',
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_index INTEGER NOT NULL DEFAULT 0,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_course ON quiz_questions(course_id);

-- ---------------------------------------------------------------------------
-- COURSE PROGRAM ASSIGNMENTS — attach a course to a program. The same course
-- assigned to two programs = two rows = two independent instances. Member
-- progress + quiz attempts reference this row, so instances never overlap.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS course_program_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  program program_type NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  status assignment_status NOT NULL DEFAULT 'active',
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, program)
);
CREATE INDEX IF NOT EXISTS idx_course_assignments_program ON course_program_assignments(program);
CREATE INDEX IF NOT EXISTS idx_course_assignments_course ON course_program_assignments(course_id);

-- ---------------------------------------------------------------------------
-- MEMBER COURSE PROGRESS — one row per (member, assignment).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS member_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES course_program_assignments(id) ON DELETE CASCADE,
  status course_progress_status NOT NULL DEFAULT 'not_started',
  completed_lesson_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_lesson_position INTEGER NOT NULL DEFAULT 0,
  percent INTEGER NOT NULL DEFAULT 0 CHECK (percent >= 0 AND percent <= 100),
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (member_id, assignment_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_member ON member_course_progress(member_id);
CREATE INDEX IF NOT EXISTS idx_progress_assignment ON member_course_progress(assignment_id);

-- ---------------------------------------------------------------------------
-- QUIZ ATTEMPTS — one row per submission of a course's assessment.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES course_program_assignments(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_member ON quiz_attempts(member_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_assignment ON quiz_attempts(assignment_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers (reuses update_updated_at_column() from migration 001)
-- ---------------------------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'members','program_memberships','courses','course_lessons',
    'quiz_questions','course_program_assignments','member_course_progress'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at_%1$s ON %1$s;', t);
    EXECUTE format(
      'CREATE TRIGGER set_updated_at_%1$s BEFORE UPDATE ON %1$s '
      'FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', t);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Members get self-scoped access to their own identity + memberships. All
-- course content and management is staff-only (case_worker+); member course
-- reads/writes are mediated by server actions using the service-role client,
-- which lets us hide quiz answers and grade on the server.
-- ---------------------------------------------------------------------------
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_program_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- members: self read/update + case_worker+ manage
DROP POLICY IF EXISTS "Members read own profile" ON members;
CREATE POLICY "Members read own profile" ON members
  FOR SELECT TO authenticated USING (id = auth.uid());
DROP POLICY IF EXISTS "Members update own profile" ON members;
CREATE POLICY "Members update own profile" ON members
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "Members insert own profile" ON members;
CREATE POLICY "Members insert own profile" ON members
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "Staff manage members" ON members;
CREATE POLICY "Staff manage members" ON members
  FOR ALL TO authenticated USING (is_case_worker_or_higher()) WITH CHECK (is_case_worker_or_higher());

-- program_memberships: member reads/creates own requests + case_worker+ manage
DROP POLICY IF EXISTS "Members read own memberships" ON program_memberships;
CREATE POLICY "Members read own memberships" ON program_memberships
  FOR SELECT TO authenticated USING (member_id = auth.uid());
DROP POLICY IF EXISTS "Members request membership" ON program_memberships;
CREATE POLICY "Members request membership" ON program_memberships
  FOR INSERT TO authenticated WITH CHECK (member_id = auth.uid() AND status = 'pending');
DROP POLICY IF EXISTS "Staff manage memberships" ON program_memberships;
CREATE POLICY "Staff manage memberships" ON program_memberships
  FOR ALL TO authenticated USING (is_case_worker_or_higher()) WITH CHECK (is_case_worker_or_higher());

-- content + progress tables: staff-only via RLS (member access flows through
-- server actions on the service-role client)
DROP POLICY IF EXISTS "Staff manage courses" ON courses;
CREATE POLICY "Staff manage courses" ON courses
  FOR ALL TO authenticated USING (is_case_worker_or_higher()) WITH CHECK (is_case_worker_or_higher());
DROP POLICY IF EXISTS "Staff manage lessons" ON course_lessons;
CREATE POLICY "Staff manage lessons" ON course_lessons
  FOR ALL TO authenticated USING (is_case_worker_or_higher()) WITH CHECK (is_case_worker_or_higher());
DROP POLICY IF EXISTS "Staff manage questions" ON quiz_questions;
CREATE POLICY "Staff manage questions" ON quiz_questions
  FOR ALL TO authenticated USING (is_case_worker_or_higher()) WITH CHECK (is_case_worker_or_higher());
DROP POLICY IF EXISTS "Staff manage assignments" ON course_program_assignments;
CREATE POLICY "Staff manage assignments" ON course_program_assignments
  FOR ALL TO authenticated USING (is_case_worker_or_higher()) WITH CHECK (is_case_worker_or_higher());
DROP POLICY IF EXISTS "Staff manage progress" ON member_course_progress;
CREATE POLICY "Staff manage progress" ON member_course_progress
  FOR ALL TO authenticated USING (is_case_worker_or_higher()) WITH CHECK (is_case_worker_or_higher());
DROP POLICY IF EXISTS "Members read own progress" ON member_course_progress;
CREATE POLICY "Members read own progress" ON member_course_progress
  FOR SELECT TO authenticated USING (member_id = auth.uid());
DROP POLICY IF EXISTS "Staff manage attempts" ON quiz_attempts;
CREATE POLICY "Staff manage attempts" ON quiz_attempts
  FOR ALL TO authenticated USING (is_case_worker_or_higher()) WITH CHECK (is_case_worker_or_higher());
DROP POLICY IF EXISTS "Members read own attempts" ON quiz_attempts;
CREATE POLICY "Members read own attempts" ON quiz_attempts
  FOR SELECT TO authenticated USING (member_id = auth.uid());
