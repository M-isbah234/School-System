import { supabase } from './supabase';
import { homeworkEntries, notices, teacherRemarks, queryTickets } from './mockData';

const STU_HW_KEY = 'student_erp_homework';
const STU_REMARKS_KEY = 'student_erp_remarks';
const STU_TICKETS_KEY = 'student_erp_tickets';
const STU_NOTICES_KEY = 'student_erp_notices';

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { }
}

async function withTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(val => { clearTimeout(id); resolve(val); }).catch(err => { clearTimeout(id); reject(err); });
  });
}

async function trySupabase<T>(fn: () => Promise<T>, ms = 6000): Promise<T | null> {
  try { return await withTimeout(fn(), ms); } catch { return null; }
}

// ── HOMEWORK ────────────────────────────────────────────────
export async function getHomeworkList() {
  const cached = getLocal(STU_HW_KEY, homeworkEntries);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('homework').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((h: any) => ({
      id: h.id,
      subject: h.subject_name || 'General',
      title: h.title,
      description: h.description || '',
      assignedDate: h.assigned_date,
      dueDate: h.due_date,
      isCompleted: !!h.is_completed,
      teacher: h.teacher_name || 'Subject Teacher',
    }));
  });
  if (result) { setLocal(STU_HW_KEY, result); return result; }
  return cached;
}

export async function toggleHomework(id: string) {
  const current = getLocal<any[]>(STU_HW_KEY, homeworkEntries);
  const target = current.find((h: any) => h.id === id);
  const nextVal = !target?.isCompleted;
  try {
    await supabase.from('homework').update({ is_completed: nextVal }).eq('id', id);
  } catch { }

  const fresh = await getHomeworkList();
  if (fresh && fresh.length) return fresh;

  const updated = current.map((h: any) => h.id === id ? { ...h, isCompleted: nextVal } : h);
  setLocal(STU_HW_KEY, updated);
  return updated;
}

// ── TICKETS ─────────────────────────────────────────────────
export async function getTicketsList() {
  const cached = getLocal(STU_TICKETS_KEY, queryTickets);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('tickets').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((t: any) => ({
      id: t.id,
      ticketNo: t.ticket_no,
      category: t.category,
      subject: t.subject,
      description: t.description || '',
      status: t.status || 'Pending',
      createdDate: t.created_at ? t.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      resolvedDate: t.resolved_at ? t.resolved_at.split('T')[0] : undefined,
      response: t.response,
    }));
  });
  if (result) { setLocal(STU_TICKETS_KEY, result); return result; }
  return cached;
}

export async function createTicket(ticket: { category: string; subject: string; description: string }) {
  const newTicket = {
    id: `t-${Date.now().toString().slice(-5)}`,
    ticketNo: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
    category: ticket.category, subject: ticket.subject, description: ticket.description,
    status: 'Pending', createdDate: new Date().toISOString().split('T')[0],
  };
  try {
    await supabase.from('tickets').insert([{
      student_id: '00000000-0000-0000-0000-000000000021',
      ticket_no: newTicket.ticketNo, category: newTicket.category,
      subject: newTicket.subject, description: newTicket.description, status: 'Pending',
    }]);
  } catch { }

  const fresh = await getTicketsList();
  if (fresh && fresh.length) return fresh;

  const current = getLocal(STU_TICKETS_KEY, queryTickets);
  const updated = [newTicket, ...(current as any[])];
  setLocal(STU_TICKETS_KEY, updated);
  return updated;
}

// ── REMARKS ─────────────────────────────────────────────────
export async function getTeacherRemarksList() {
  const cached = getLocal(STU_REMARKS_KEY, teacherRemarks);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('teacher_remarks').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((r: any) => ({
      id: r.id,
      teacher: r.teacher_name || 'Teacher',
      subject: r.subject_name || 'General',
      date: r.date || new Date().toISOString().split('T')[0],
      remark: r.remark || '',
      type: r.type || 'neutral',
      isAcknowledged: !!r.is_acknowledged,
    }));
  });
  if (result) { setLocal(STU_REMARKS_KEY, result); return result; }
  return cached;
}

export async function acknowledgeRemark(id: string) {
  try {
    await supabase.from('teacher_remarks').update({ is_acknowledged: true }).eq('id', id);
  } catch { }

  const fresh = await getTeacherRemarksList();
  if (fresh && fresh.length) return fresh;

  const current = getLocal(STU_REMARKS_KEY, teacherRemarks);
  const updated = (current as any[]).map((r: any) => r.id === id ? { ...r, isAcknowledged: true } : r);
  setLocal(STU_REMARKS_KEY, updated);
  return updated;
}

// ── NOTICES ────────────────────────────────────────────────
export async function getNoticesList() {
  const cached = getLocal(STU_NOTICES_KEY, notices);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('notices').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((n: any) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      date: n.date,
      category: n.category || 'info',
      status: n.status || 'approved',
      author: n.author_name || 'Admin',
    }));
  });
  if (result) { setLocal(STU_NOTICES_KEY, result); return result; }
  return cached;
}
