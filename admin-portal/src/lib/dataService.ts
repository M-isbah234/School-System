import { supabase } from './supabase';
import { adminUsers, AdminUser, adminFeeRecords, FeeRecord, notices, Notice, approvalRequests, ApprovalRequest } from './mockData';

const USERS_KEY = 'school_erp_users';
const FEES_KEY = 'school_erp_fees';
const NOTICES_KEY = 'school_erp_notices';
const APPROVALS_KEY = 'school_erp_approvals';

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

async function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(val => { clearTimeout(id); resolve(val); }).catch(err => { clearTimeout(id); reject(err); });
  });
}

async function trySupabase<T>(fn: () => Promise<T>): Promise<T | null> {
  try { return await withTimeout(fn(), 1400); } catch { return null; }
}

// ── USERS ──────────────────────────────────────────────────
export async function getUsers(): Promise<AdminUser[]> {
  const cached = getLocal<AdminUser[]>(USERS_KEY, adminUsers);

  const result = await trySupabase(async () => {
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
    if (profilesError || !profiles) throw profilesError || new Error('empty');

    const { data: students } = await supabase.from('students').select('*');
    const { data: teachers } = await supabase.from('teachers').select('*');
    const stuMap = new Map(students?.map(s => [s.id, s]) ?? []);
    const tchMap = new Map(teachers?.map(t => [t.id, t]) ?? []);

    return profiles.map((p): AdminUser => {
      const stu = stuMap.get(p.id) as any;
      const tch = tchMap.get(p.id) as any;
      return {
        id: p.id || `USR-${Math.random()}`,
        name: p.name || 'Unknown User',
        role: (p.role || 'student') as AdminUser['role'],
        email: p.email || 'user@school.edu.pk',
        phone: p.phone || '+92-300-0000000',
        status: (p.status || 'active') as AdminUser['status'],
        joinDate: p.join_date || new Date().toISOString().split('T')[0],
        class: stu?.class_name,
        department: tch?.department,
        subjects: tch?.subjects,
        avatar: p.avatar_url || stu?.avatar || tch?.avatar,
        fatherName: stu?.father_name,
        motherName: stu?.mother_name,
        parentEmail: stu?.parent_email,
        parentPhone: stu?.parent_phone,
      };
    });
  });

  if (result && result.length) {
    setLocal(USERS_KEY, result);
    return result;
  }
  return cached;
}

export async function addUser(user: Omit<AdminUser, 'id'> & { id?: string }): Promise<AdminUser> {
  const newId = user.id || `USR-${Date.now().toString().slice(-5)}`;
  const newUser: AdminUser = {
    id: newId, name: user.name, role: user.role, email: user.email,
    phone: user.phone || '+92-300-0000000', status: user.status || 'active',
    joinDate: user.joinDate || new Date().toISOString().split('T')[0],
    class: user.class, department: user.department, subjects: user.subjects,
    avatar: (user as any).avatar,
    fatherName: (user as any).fatherName, motherName: (user as any).motherName,
    parentEmail: (user as any).parentEmail, parentPhone: (user as any).parentPhone,
  };

  try {
    await supabase.from('profiles').insert([{
      id: newId, name: newUser.name, role: newUser.role,
      email: newUser.email, phone: newUser.phone, status: newUser.status, join_date: newUser.joinDate,
    }]);

    if (newUser.role === 'student' && newUser.class) {
      await supabase.from('students').insert([{ id: newId, roll_no: `SP-2026-${Date.now().toString().slice(-4)}`, class_name: newUser.class, section: 'A' }]);
    } else if (newUser.role === 'teacher') {
      await supabase.from('teachers').insert([{ id: newId, employee_id: `TCH-${Date.now().toString().slice(-3)}`, department: newUser.department || 'General', subjects: newUser.subjects || [] }]);
    }

    const freshUsers = await getUsers();
    setLocal(USERS_KEY, freshUsers);
    return freshUsers.find(u => u.id === newId) ?? newUser;
  } catch {
    const current = getLocal<AdminUser[]>(USERS_KEY, adminUsers);
    const updated = [newUser, ...current];
    setLocal(USERS_KEY, updated);
    return newUser;
  }
}

export async function toggleUserStatus(id: string): Promise<AdminUser[]> {
  const current = getLocal<AdminUser[]>(USERS_KEY, adminUsers);
  const target = current.find(u => u.id === id);
  const nextStatus: AdminUser['status'] = target?.status === 'active' ? 'inactive' : 'active';

  try {
    const { error } = await supabase.from('profiles').update({ status: nextStatus }).eq('id', id);
    if (error) throw error;
    const freshUsers = await getUsers();
    setLocal(USERS_KEY, freshUsers);
    return freshUsers;
  } catch {
    const updated = current.map(u => u.id === id ? { ...u, status: nextStatus } : u);
    setLocal(USERS_KEY, updated);
    return updated;
  }
}

export async function deleteUser(id: string): Promise<AdminUser[]> {
  try {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
    const freshUsers = await getUsers();
    setLocal(USERS_KEY, freshUsers);
    return freshUsers;
  } catch {
    const current = getLocal<AdminUser[]>(USERS_KEY, adminUsers);
    const updated = current.filter(u => u.id !== id);
    setLocal(USERS_KEY, updated);
    return updated;
  }
}

// ── FEES ───────────────────────────────────────────────────
export async function getFees(): Promise<FeeRecord[]> {
  const cached = getLocal<FeeRecord[]>(FEES_KEY, adminFeeRecords);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('fees').select('*, profiles(name)');
    if (error || !data?.length) throw new Error('empty');
    return data.map((f): FeeRecord => ({
      id: f.id, studentId: f.student_id, studentName: (f.profiles as any)?.name || 'Student',
      class: '—', month: f.month, year: f.year, amount: Number(f.amount),
      status: f.status as FeeRecord['status'], dueDate: f.due_date,
      paidDate: f.paid_date, paidAmount: f.paid_amount ? Number(f.paid_amount) : undefined, receiptNo: f.receipt_no,
    }));
  });
  if (result) { setLocal(FEES_KEY, result); return result; }
  return cached;
}

export async function addFeeRecord(record: Omit<FeeRecord, 'id'>): Promise<FeeRecord[]> {
  const newRecord: FeeRecord = { ...record, id: `FEE-${Date.now().toString().slice(-5)}` };
  void (async () => {
    try {
      await supabase.from('fees').insert([{
        student_id: record.studentId, month: record.month, year: record.year,
        amount: record.amount, status: record.status, due_date: record.dueDate,
        paid_amount: record.paidAmount, paid_date: record.paidDate, receipt_no: record.receiptNo,
      }]);
    } catch { }
  })();
  const current = getLocal<FeeRecord[]>(FEES_KEY, adminFeeRecords);
  const updated = [newRecord, ...current];
  setLocal(FEES_KEY, updated);
  return updated;
}

export async function updateFeeStatus(id: string, status: FeeRecord['status'], paidAmount?: number): Promise<FeeRecord[]> {
  const paidDate = status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined;
  const receiptNo = status === 'Paid' ? `R-${Math.floor(10000 + Math.random() * 90000)}` : undefined;
  void (async () => {
    try {
      await supabase.from('fees').update({ status, paid_amount: paidAmount, paid_date: paidDate, receipt_no: receiptNo }).eq('id', id);
    } catch { }
  })();
  const current = getLocal<FeeRecord[]>(FEES_KEY, adminFeeRecords);
  const updated = current.map(f => f.id === id ? { ...f, status, paidAmount: paidAmount || f.amount, paidDate, receiptNo } : f);
  setLocal(FEES_KEY, updated);
  return updated;
}

// ── NOTICES ────────────────────────────────────────────────
export async function getNotices(): Promise<Notice[]> {
  const cached = getLocal<Notice[]>(NOTICES_KEY, notices);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('notices').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((n): Notice => ({
      id: n.id, title: n.title, content: n.content, date: n.date,
      category: n.category as Notice['category'], status: n.status as Notice['status'], author: n.author_name || 'Admin',
    }));
  });
  if (result) { setLocal(NOTICES_KEY, result); return result; }
  return cached;
}

export async function addNotice(notice: Omit<Notice, 'id'>): Promise<Notice[]> {
  const newNotice: Notice = { ...notice, id: `N-${Date.now().toString().slice(-5)}` };
  void (async () => {
    try {
      await supabase.from('notices').insert([{
        title: notice.title, content: notice.content,
        date: notice.date || new Date().toISOString().split('T')[0],
        category: notice.category, status: notice.status || 'approved', author_name: notice.author || 'Admin',
      }]);
    } catch { }
  })();
  const current = getLocal<Notice[]>(NOTICES_KEY, notices);
  const updated = [newNotice, ...current];
  setLocal(NOTICES_KEY, updated);
  return updated;
}

export async function deleteNotice(id: string): Promise<Notice[]> {
  void (async () => { try { await supabase.from('notices').delete().eq('id', id); } catch { } })();
  const current = getLocal<Notice[]>(NOTICES_KEY, notices);
  const updated = current.filter(n => n.id !== id);
  setLocal(NOTICES_KEY, updated);
  return updated;
}

// ── APPROVALS ──────────────────────────────────────────────
export async function getApprovals(): Promise<ApprovalRequest[]> {
  const cached = getLocal<ApprovalRequest[]>(APPROVALS_KEY, approvalRequests);
  const result = await trySupabase(async () => {
    const { data, error } = await supabase.from('approval_requests').select('*');
    if (error || !data?.length) throw new Error('empty');
    return data.map((a): ApprovalRequest => ({
      id: a.id, type: a.type as ApprovalRequest['type'], title: a.title,
      submittedBy: a.submitted_by_name || 'Teacher', submittedDate: a.submitted_date,
      content: a.content, status: a.status as ApprovalRequest['status'], priority: a.priority as ApprovalRequest['priority'],
    }));
  });
  if (result) { setLocal(APPROVALS_KEY, result); return result; }
  return cached;
}

export async function updateApprovalStatus(id: string, status: 'approved' | 'rejected'): Promise<ApprovalRequest[]> {
  void (async () => { try { await supabase.from('approval_requests').update({ status }).eq('id', id); } catch { } })();
  const current = getLocal<ApprovalRequest[]>(APPROVALS_KEY, approvalRequests);
  const updated = current.map(a => a.id === id ? { ...a, status } : a);
  setLocal(APPROVALS_KEY, updated);
  return updated;
}
