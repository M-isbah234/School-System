"use client";
import React, { useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import {
  Search, Plus, Edit2, Trash2, X, Check, Filter,
  GraduationCap, BookOpen, ShieldCheck, User, Phone, Mail, Calendar
} from 'lucide-react';
import { adminUsers, AdminUser, UserRole } from '@/lib/mockData';

// ────────────────────────────────────────────
// Modal
// ────────────────────────────────────────────
function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser | null;
  onClose: () => void;
  onSave: (u: AdminUser) => void;
}) {
  const isNew = !user?.id;
  const [form, setForm] = useState<Partial<AdminUser>>(
    user ?? { role: 'student', status: 'active' }
  );

  const handle = (k: keyof AdminUser, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!form.name || !form.email) return;
    onSave({
      id: form.id ?? `USR-${Date.now()}`,
      name: form.name!,
      role: (form.role ?? 'student') as UserRole,
      email: form.email!,
      phone: form.phone ?? '',
      status: (form.status ?? 'active') as 'active' | 'inactive' | 'suspended',
      joinDate: form.joinDate ?? new Date().toISOString().split('T')[0],
      class: form.class,
      department: form.department,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">{isNew ? 'Add New User' : `Edit — ${user?.name}`}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'teacher', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handle('role', r)}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize border transition-all ${form.role === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name *</label>
              <input className="input" placeholder="e.g. Ahmed Raza Khan" value={form.name ?? ''} onChange={e => handle('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address *</label>
              <input type="email" className="input" placeholder="email@school.edu.pk" value={form.email ?? ''} onChange={e => handle('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number</label>
              <input className="input" placeholder="+92-300-0000000" value={form.phone ?? ''} onChange={e => handle('phone', e.target.value)} />
            </div>
            {form.role === 'student' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Class</label>
                <input className="input" placeholder="e.g. 9-A" value={form.class ?? ''} onChange={e => handle('class', e.target.value)} />
              </div>
            )}
            {form.role === 'teacher' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Department</label>
                <input className="input" placeholder="e.g. Science" value={form.department ?? ''} onChange={e => handle('department', e.target.value)} />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Status</label>
              <select className="input" value={form.status ?? 'active'} onChange={e => handle('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-slate-100">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={save} className="btn btn-primary">
            <Check className="w-4 h-4" />
            {isNew ? 'Add User' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────
const roleIcon = (role: UserRole) => {
  if (role === 'admin') return <ShieldCheck className="w-3.5 h-3.5" />;
  if (role === 'teacher') return <BookOpen className="w-3.5 h-3.5" />;
  return <GraduationCap className="w-3.5 h-3.5" />;
};
const roleBadge = (role: UserRole) => {
  if (role === 'admin') return 'badge badge-violet';
  if (role === 'teacher') return 'badge badge-blue';
  return 'badge badge-emerald';
};
const statusBadge = (status: string) => {
  if (status === 'active') return 'badge badge-emerald';
  if (status === 'suspended') return 'badge badge-rose';
  return 'badge badge-slate';
};

// ────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [modalUser, setModalUser] = useState<AdminUser | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.class ?? '').toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleSave = (u: AdminUser) => {
    setUsers((prev) => {
      const exists = prev.find((x) => x.id === u.id);
      return exists ? prev.map((x) => (x.id === u.id ? u : x)) : [u, ...prev];
    });
    setModalUser(undefined);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteId(null);
  };

  const studentCount = users.filter((u) => u.role === 'student').length;
  const teacherCount = users.filter((u) => u.role === 'teacher').length;

  return (
    <div>
      <TopBar title="User Management" subtitle="Register, edit, and manage all students & staff" />

      <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">

        {/* Summary pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Total Users', value: users.length, cls: 'bg-slate-100 text-slate-700 border-slate-200' },
            { label: 'Students', value: studentCount, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { label: 'Teachers', value: teacherCount, cls: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Active', value: users.filter(u => u.status === 'active').length, cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${s.cls}`}>
              <span className="text-lg font-bold">{s.value}</span>
              <span className="font-medium opacity-80">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search by name, email, or class…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                className="input pl-9 pr-4 cursor-pointer"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              onClick={() => setModalUser(null)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th className="hidden md:table-cell">Contact</th>
                  <th className="hidden sm:table-cell">Class / Dept</th>
                  <th className="hidden lg:table-cell">Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400">No users match your search.</td></tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id}>
                      {/* User */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{user.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span className={roleBadge(user.role)}>
                          {roleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="hidden md:table-cell">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Mail className="w-3 h-3" />{user.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Phone className="w-3 h-3" />{user.phone}
                          </div>
                        </div>
                      </td>

                      {/* Class / Dept */}
                      <td className="hidden sm:table-cell">
                        <span className="text-sm text-slate-600">
                          {user.class ?? user.department ?? '—'}
                        </span>
                      </td>

                      {/* Join Date */}
                      <td className="hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />{user.joinDate}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={statusBadge(user.status)}>{user.status}</span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setModalUser(user)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(user.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">Showing {filtered.length} of {users.length} users</p>
          </div>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {modalUser !== undefined && (
        <UserModal
          user={modalUser}
          onClose={() => setModalUser(undefined)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="modal-box max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Delete User?</h3>
              <p className="text-sm text-slate-500">This action cannot be undone. The user will be permanently removed.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setDeleteId(null)} className="btn btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="btn btn-danger flex-1 justify-center">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
