-- ============================================================
-- SCHOOL ERP — SUPABASE DATABASE SCHEMA
-- Run this first in the Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- PROFILES (extends auth.users — one row per auth user)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT        NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  phone       TEXT,
  status      TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  join_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- STUDENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id                UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  roll_no           TEXT NOT NULL UNIQUE,
  class_name        TEXT NOT NULL,
  section           TEXT NOT NULL DEFAULT 'A',
  campus            TEXT NOT NULL DEFAULT 'Gulshan Campus',
  father_name       TEXT,
  mother_name       TEXT,
  emergency_contact TEXT,
  address           TEXT,
  blood_group       TEXT,
  date_of_birth     DATE,
  admission_date    DATE
);

-- ────────────────────────────────────────────────────────────
-- TEACHERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teachers (
  id          UUID     PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id TEXT     NOT NULL UNIQUE,
  department  TEXT     NOT NULL,
  subjects    TEXT[]   NOT NULL DEFAULT '{}',
  classes     TEXT[]   NOT NULL DEFAULT '{}'
);

-- ────────────────────────────────────────────────────────────
-- CLASSES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name    TEXT NOT NULL UNIQUE,
  grade   INT  NOT NULL,
  section TEXT NOT NULL,
  campus  TEXT NOT NULL DEFAULT 'Gulshan Campus'
);

-- ────────────────────────────────────────────────────────────
-- ATTENDANCE
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id           UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id   UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date         DATE        NOT NULL,
  period       INT,
  subject_name TEXT,
  status       TEXT        NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
  remarks      TEXT,
  marked_by    UUID        REFERENCES profiles(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, date, period)
);

-- ────────────────────────────────────────────────────────────
-- ASSESSMENTS (grades / marks)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id             UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_name   TEXT        NOT NULL,
  type           TEXT        NOT NULL CHECK (type IN ('Quiz', 'Class Test', 'Monthly Test', 'Assignment')),
  title          TEXT        NOT NULL,
  marks_obtained NUMERIC     NOT NULL,
  total_marks    NUMERIC     NOT NULL,
  date           DATE        NOT NULL,
  weightage      INT         NOT NULL DEFAULT 10,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- FEES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fees (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month       TEXT        NOT NULL,
  year        TEXT        NOT NULL,
  amount      NUMERIC     NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Unpaid', 'Partial', 'Overdue')),
  due_date    DATE        NOT NULL,
  paid_date   DATE,
  paid_amount NUMERIC,
  receipt_no  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- NOTICES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notices (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  date        DATE        NOT NULL DEFAULT CURRENT_DATE,
  category    TEXT        NOT NULL CHECK (category IN ('holiday', 'urgent', 'event', 'info')),
  status      TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('approved', 'draft')),
  author_id   UUID        REFERENCES profiles(id),
  author_name TEXT        NOT NULL DEFAULT 'Admin',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- APPROVAL REQUESTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approval_requests (
  id                UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  type              TEXT        NOT NULL CHECK (type IN ('notice', 'leave', 'homework')),
  title             TEXT        NOT NULL,
  submitted_by_id   UUID        REFERENCES profiles(id),
  submitted_by_name TEXT        NOT NULL,
  submitted_date    DATE        NOT NULL DEFAULT CURRENT_DATE,
  content           TEXT        NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  priority          TEXT        NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- HOMEWORK
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS homework (
  id                UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_name        TEXT        NOT NULL,
  subject_name      TEXT        NOT NULL,
  teacher_id        UUID        REFERENCES profiles(id),
  title             TEXT        NOT NULL,
  description       TEXT,
  assigned_date     DATE        NOT NULL DEFAULT CURRENT_DATE,
  due_date          DATE        NOT NULL,
  total_students    INT         NOT NULL DEFAULT 0,
  submissions_count INT         NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- HOMEWORK COMPLETIONS (per student)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS homework_completions (
  id           UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  homework_id  UUID    NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  student_id   UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(homework_id, student_id)
);

-- ────────────────────────────────────────────────────────────
-- TICKETS (student support)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_no     TEXT        NOT NULL UNIQUE,
  category      TEXT        NOT NULL,
  subject       TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
  created_date  DATE        NOT NULL DEFAULT CURRENT_DATE,
  resolved_date DATE,
  response      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TEACHER REMARKS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teacher_remarks (
  id              UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id      UUID        NOT NULL REFERENCES profiles(id),
  teacher_name    TEXT        NOT NULL,
  subject         TEXT        NOT NULL,
  date            DATE        NOT NULL DEFAULT CURRENT_DATE,
  remark          TEXT        NOT NULL,
  type            TEXT        NOT NULL DEFAULT 'neutral' CHECK (type IN ('positive', 'negative', 'neutral')),
  is_acknowledged BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- PARENT MESSAGES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parent_messages (
  id           UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id   UUID        NOT NULL REFERENCES profiles(id),
  student_id   UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_name  TEXT        NOT NULL,
  student_name TEXT        NOT NULL,
  class_name   TEXT        NOT NULL,
  message      TEXT        NOT NULL,
  date         DATE        NOT NULL DEFAULT CURRENT_DATE,
  is_read      BOOLEAN     NOT NULL DEFAULT FALSE,
  type         TEXT        NOT NULL DEFAULT 'query' CHECK (type IN ('query', 'complaint', 'appreciation')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════

ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE students             ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers             ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance           ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices              ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework             ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets              ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_remarks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_messages      ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ── PROFILES ──────────────────────────────────────────────
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  USING (id = auth.uid() OR get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "profiles_insert" ON profiles FOR INSERT
  WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  USING (id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "profiles_delete" ON profiles FOR DELETE
  USING (get_my_role() = 'admin');

-- ── STUDENTS ──────────────────────────────────────────────
CREATE POLICY "students_select" ON students FOR SELECT
  USING (id = auth.uid() OR get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "students_insert_admin" ON students FOR INSERT
  WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "students_update_admin" ON students FOR UPDATE
  USING (get_my_role() = 'admin');
CREATE POLICY "students_delete_admin" ON students FOR DELETE
  USING (get_my_role() = 'admin');

-- ── TEACHERS ──────────────────────────────────────────────
CREATE POLICY "teachers_select" ON teachers FOR SELECT
  USING (id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "teachers_insert_admin" ON teachers FOR INSERT
  WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "teachers_update_admin" ON teachers FOR UPDATE
  USING (get_my_role() = 'admin');
CREATE POLICY "teachers_delete_admin" ON teachers FOR DELETE
  USING (get_my_role() = 'admin');

-- ── CLASSES ───────────────────────────────────────────────
CREATE POLICY "classes_select" ON classes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "classes_write_admin" ON classes FOR ALL USING (get_my_role() = 'admin');

-- ── ATTENDANCE ────────────────────────────────────────────
CREATE POLICY "attendance_select" ON attendance FOR SELECT
  USING (student_id = auth.uid() OR get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "attendance_insert_teacher" ON attendance FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "attendance_update_teacher" ON attendance FOR UPDATE
  USING (get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "attendance_delete_teacher" ON attendance FOR DELETE
  USING (get_my_role() IN ('admin', 'teacher'));

-- ── ASSESSMENTS ───────────────────────────────────────────
CREATE POLICY "assessments_select" ON assessments FOR SELECT
  USING (student_id = auth.uid() OR get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "assessments_insert_teacher" ON assessments FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "assessments_update_teacher" ON assessments FOR UPDATE
  USING (get_my_role() IN ('admin', 'teacher'));

-- ── FEES ──────────────────────────────────────────────────
CREATE POLICY "fees_select" ON fees FOR SELECT
  USING (student_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "fees_insert_admin" ON fees FOR INSERT
  WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "fees_update_admin" ON fees FOR UPDATE
  USING (get_my_role() = 'admin');

-- ── NOTICES ───────────────────────────────────────────────
CREATE POLICY "notices_select" ON notices FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "notices_insert_admin" ON notices FOR INSERT
  WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "notices_update_admin" ON notices FOR UPDATE
  USING (get_my_role() = 'admin');
CREATE POLICY "notices_delete_admin" ON notices FOR DELETE
  USING (get_my_role() = 'admin');

-- ── APPROVAL REQUESTS ─────────────────────────────────────
CREATE POLICY "approvals_select" ON approval_requests FOR SELECT
  USING (submitted_by_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "approvals_insert" ON approval_requests FOR INSERT TO authenticated
  WITH CHECK (TRUE);
CREATE POLICY "approvals_update_admin" ON approval_requests FOR UPDATE
  USING (get_my_role() = 'admin');

-- ── HOMEWORK ──────────────────────────────────────────────
CREATE POLICY "homework_select" ON homework FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "homework_insert_teacher" ON homework FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "homework_update_teacher" ON homework FOR UPDATE
  USING (get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "homework_delete_teacher" ON homework FOR DELETE
  USING (get_my_role() IN ('admin', 'teacher'));

-- ── HOMEWORK_COMPLETIONS ──────────────────────────────────
CREATE POLICY "hw_comp_select" ON homework_completions FOR SELECT
  USING (student_id = auth.uid() OR get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "hw_comp_insert" ON homework_completions FOR INSERT
  WITH CHECK (student_id = auth.uid() OR get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "hw_comp_update" ON homework_completions FOR UPDATE
  USING (student_id = auth.uid() OR get_my_role() IN ('admin', 'teacher'));

-- ── TICKETS ───────────────────────────────────────────────
CREATE POLICY "tickets_select" ON tickets FOR SELECT
  USING (student_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "tickets_insert" ON tickets FOR INSERT
  WITH CHECK (student_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "tickets_update_admin" ON tickets FOR UPDATE
  USING (get_my_role() = 'admin');

-- ── TEACHER REMARKS ───────────────────────────────────────
CREATE POLICY "remarks_select" ON teacher_remarks FOR SELECT
  USING (student_id = auth.uid() OR teacher_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "remarks_insert_teacher" ON teacher_remarks FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'teacher'));
CREATE POLICY "remarks_update" ON teacher_remarks FOR UPDATE
  USING (student_id = auth.uid() OR get_my_role() IN ('admin', 'teacher'));

-- ── PARENT MESSAGES ───────────────────────────────────────
CREATE POLICY "msgs_select" ON parent_messages FOR SELECT
  USING (teacher_id = auth.uid() OR student_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "msgs_insert" ON parent_messages FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "msgs_update_teacher" ON parent_messages FOR UPDATE
  USING (teacher_id = auth.uid() OR get_my_role() = 'admin');

-- ════════════════════════════════════════════════════════════
-- TRIGGERS
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER fees_updated_at BEFORE UPDATE ON fees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ════════════════════════════════════════════════════════════
-- REALTIME PUBLICATION SETUP
-- ════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE assessments;
ALTER PUBLICATION supabase_realtime ADD TABLE fees;
ALTER PUBLICATION supabase_realtime ADD TABLE notices;
ALTER PUBLICATION supabase_realtime ADD TABLE approval_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE homework;
ALTER PUBLICATION supabase_realtime ADD TABLE homework_completions;
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE teacher_remarks;
ALTER PUBLICATION supabase_realtime ADD TABLE parent_messages;

