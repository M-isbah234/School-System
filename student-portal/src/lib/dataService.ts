import { supabase } from './supabase';
import { homeworkEntries, notices, teacherRemarks, queryTickets } from './mockData';

const STU_HW_KEY = 'student_erp_homework';
const STU_REMARKS_KEY = 'student_erp_remarks';
const STU_TICKETS_KEY = 'student_erp_tickets';

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

// ── HOMEWORK ────────────────────────────────────────────────
export async function getHomeworkList() {
  const cached = getLocal(STU_HW_KEY, homeworkEntries);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('homework').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((h: any) => ({
      id: h.id, subject: h.subject_name, title: h.title,
      description: h.description || '', assignedDate: h.assigned_date,
      dueDate: h.due_date, isCompleted: false, teacher: 'Subject Teacher',
    }));
  });
  if (result) { setLocal(STU_HW_KEY, result); return result; }
  return cached;
}

export async function toggleHomework(id: string) {
  const current = getLocal(STU_HW_KEY, homeworkEntries);
  const updated = (current as any[]).map((h: any) => h.id === id ? { ...h, isCompleted: !h.isCompleted } : h);
  setLocal(STU_HW_KEY, updated);
  return updated;
}

// ── TICKETS ─────────────────────────────────────────────────
export async function getTicketsList() {
  return getLocal(STU_TICKETS_KEY, queryTickets);
}

export async function createTicket(ticket: { category: string; subject: string; description: string }) {
  const newTicket = {
    id: `t-${Date.now().toString().slice(-5)}`,
    ticketNo: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
    category: ticket.category, subject: ticket.subject, description: ticket.description,
    status: 'Pending', createdDate: new Date().toISOString().split('T')[0],
  };
  void (async () => {
    try {
      await supabase.from('tickets').insert([{
        student_id: '00000000-0000-0000-0000-000000000021',
        ticket_no: newTicket.ticketNo, category: newTicket.category,
        subject: newTicket.subject, description: newTicket.description, status: 'Pending',
      }]);
    } catch { }
  })();
  const current = getLocal(STU_TICKETS_KEY, queryTickets);
  const updated = [newTicket, ...(current as any[])];
  setLocal(STU_TICKETS_KEY, updated);
  return updated;
}

// ── REMARKS ─────────────────────────────────────────────────
export async function getTeacherRemarksList() {
  return getLocal(STU_REMARKS_KEY, teacherRemarks);
}

export async function acknowledgeRemark(id: string) {
  void (async () => { try { await supabase.from('teacher_remarks').update({ is_acknowledged: true }).eq('id', id); } catch { } })();
  const current = getLocal(STU_REMARKS_KEY, teacherRemarks);
  const updated = (current as any[]).map((r: any) => r.id === id ? { ...r, isAcknowledged: true } : r);
  setLocal(STU_REMARKS_KEY, updated);
  return updated;
}
