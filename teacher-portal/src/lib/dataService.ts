import { supabase } from './supabase';
import { AttendanceRecord, GradeEntry, HomeworkEntry, ParentMessage, classStudents, todayAttendance, gradeBook, homeworkEntries, parentMessages } from './mockData';

export type { AttendanceRecord, GradeEntry, HomeworkEntry, ParentMessage };

const ATTENDANCE_KEY = 'teacher_erp_attendance';
const GRADES_KEY = 'teacher_erp_grades';
const HOMEWORK_KEY = 'teacher_erp_homework';
const MESSAGES_KEY = 'teacher_erp_messages';

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : fallback; } catch { return fallback; }
}
function setLocal<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { }
}
async function withTimeout<T>(promise: Promise<T>, ms = 1400): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(val => { clearTimeout(id); resolve(val); }).catch(err => { clearTimeout(id); reject(err); });
  });
}
async function trySupabase<T>(fn: () => Promise<T>): Promise<T | null> {
  try { return await withTimeout(fn(), 1400); } catch { return null; }
}

// ── ATTENDANCE ─────────────────────────────────────────────
export async function getAttendanceRecords(className: string = '8-A'): Promise<AttendanceRecord[]> {
  const all = getLocal<AttendanceRecord[]>(ATTENDANCE_KEY, todayAttendance);
  return all.filter(a => !a.class || a.class === className);
}

export async function saveAttendanceRecords(records: AttendanceRecord[]): Promise<AttendanceRecord[]> {
  void (async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('attendance').upsert(
        records.map(r => ({ student_id: r.studentId, date: today, period: 1, subject_name: 'Mathematics', status: r.status })),
        { onConflict: 'student_id,date,period' }
      );
    } catch { }
  })();
  const current = getLocal<AttendanceRecord[]>(ATTENDANCE_KEY, todayAttendance);
  const map = new Map(records.map(r => [r.studentId, r]));
  const updated = current.map(r => map.has(r.studentId) ? map.get(r.studentId)! : r);
  setLocal(ATTENDANCE_KEY, updated);
  return updated;
}

// ── GRADES ──────────────────────────────────────────────────
export async function getGradeBook(className: string = '8-A'): Promise<GradeEntry[]> {
  const all = getLocal<GradeEntry[]>(GRADES_KEY, gradeBook);
  return all.filter(g => !g.class || g.class === className);
}

export async function updateGrade(studentId: string, field: keyof GradeEntry, value: number): Promise<GradeEntry[]> {
  const current = getLocal<GradeEntry[]>(GRADES_KEY, gradeBook);
  const updated = current.map(g => {
    if (g.studentId !== studentId) return g;
    const next = { ...g, [field]: value };
    next.total = Math.round(((next.quiz / 10 + next.classTest / 20 + next.monthlyTest / 50 + next.assignment / 20) / 4) * 100);
    return next;
  });
  setLocal(GRADES_KEY, updated);
  return updated;
}

// ── HOMEWORK ────────────────────────────────────────────────
export async function getHomeworkEntries(): Promise<HomeworkEntry[]> {
  const cached = getLocal<HomeworkEntry[]>(HOMEWORK_KEY, homeworkEntries);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('homework').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((h: any): HomeworkEntry => ({
      id: h.id, class: h.class_name, subject: h.subject_name, title: h.title,
      description: h.description || '', assignedDate: h.assigned_date, dueDate: h.due_date,
      submissionsCount: h.submissions_count || 0, totalStudents: h.total_students || 5,
    }));
  });
  if (result) { setLocal(HOMEWORK_KEY, result); return result; }
  return cached;
}

export async function addHomework(entry: Omit<HomeworkEntry, 'id'>): Promise<HomeworkEntry[]> {
  const newEntry: HomeworkEntry = { ...entry, id: `HW-${Date.now().toString().slice(-5)}` };
  void (async () => {
    try {
      await supabase.from('homework').insert([{
        class_name: entry.class, subject_name: entry.subject, title: entry.title,
        description: entry.description, assigned_date: entry.assignedDate || new Date().toISOString().split('T')[0],
        due_date: entry.dueDate, total_students: entry.totalStudents || 5, submissions_count: 0,
      }]);
    } catch { }
  })();
  const current = getLocal<HomeworkEntry[]>(HOMEWORK_KEY, homeworkEntries);
  const updated = [newEntry, ...current];
  setLocal(HOMEWORK_KEY, updated);
  return updated;
}

// ── MESSAGES ────────────────────────────────────────────────
export async function getParentMessages(): Promise<ParentMessage[]> {
  const cached = getLocal<ParentMessage[]>(MESSAGES_KEY, parentMessages);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('parent_messages').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((m: any): ParentMessage => ({
      id: m.id, parentName: m.parent_name, studentName: m.student_name, class: m.class_name,
      message: m.message, date: m.date, isRead: m.is_read,
      type: (m.type === 'request' ? 'query' : m.type) as ParentMessage['type'],
    }));
  });
  if (result) { setLocal(MESSAGES_KEY, result); return result; }
  return cached;
}

export async function markMessageRead(id: string): Promise<ParentMessage[]> {
  void (async () => { try { await supabase.from('parent_messages').update({ is_read: true }).eq('id', id); } catch { } })();
  const current = getLocal<ParentMessage[]>(MESSAGES_KEY, parentMessages);
  const updated = current.map(m => m.id === id ? { ...m, isRead: true } : m);
  setLocal(MESSAGES_KEY, updated);
  return updated;
}
