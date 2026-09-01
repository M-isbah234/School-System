"use client";

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Badge, Button, Modal } from '@/components/ui';
import {
  Users, UserPlus, Search, GraduationCap, BookOpen,
  ShieldCheck, CheckCircle, XCircle, AlertCircle, Trash2, ExternalLink, Camera, Image, Phone, Mail, User as UserIcon
} from 'lucide-react';
import { adminUsers, AdminUser, UserRole } from '@/lib/mockData';
import { getUsers, addUser, toggleUserStatus, deleteUser } from '@/lib/dataService';
import { supabase } from '@/lib/supabase';

const statusConfig: Record<string, { label: string; badge: string; icon: React.ElementType }> = {
  active: { label: 'Active', badge: 'success', icon: CheckCircle },
  inactive: { label: 'Inactive', badge: 'default', icon: XCircle },
  suspended: { label: 'Suspended', badge: 'danger', icon: AlertCircle },
};

const roleConfig: Record<UserRole, { label: string; badge: string; icon: React.ElementType }> = {
  student: { label: 'Student', badge: 'info', icon: GraduationCap },
  teacher: { label: 'Teacher', badge: 'warning', icon: BookOpen },
  admin: { label: 'Admin', badge: 'violet', icon: ShieldCheck },
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  const [newUser, setNewUser] = useState({
    name: '', email: '', phone: '', role: 'student' as UserRole, class: '8-A', department: 'Science',
    fatherName: '', motherName: '', parentEmail: '', parentPhone: '', avatar: ''
  });

  useEffect(() => {
    async function loadData() {
      const data = await getUsers();
      if (data && data.length > 0) {
        setUsers(data);
      }
    }

    const handleFocus = () => {
      void loadData();
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        void loadData();
      }
    };

    void loadData();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    let channel: ReturnType<typeof supabase.channel> | null = null;

    try {
      channel = supabase.channel(`admin-users-sync-${Date.now()}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => { void loadData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => { void loadData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, () => { void loadData(); });

      void channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') return;
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Realtime sync unavailable, using manual refresh fallback.');
        }
      });
    } catch (error) {
      console.warn('Realtime subscription failed:', error);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);

  const filtered = (users || []).filter(u => {
    if (!u) return false;
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchClass = classFilter === 'all' || u.class === classFilter;
    const nameStr = (u.name || '').toLowerCase();
    const emailStr = (u.email || '').toLowerCase();
    const fatherStr = (u.fatherName || '').toLowerCase();
    const searchLower = (search || '').toLowerCase();
    const matchSearch = !search ||
      nameStr.includes(searchLower) ||
      emailStr.includes(searchLower) ||
      fatherStr.includes(searchLower);
    return matchRole && matchClass && matchSearch;
  });

  const handleToggleStatus = async (id: string) => {
    const updated = await toggleUserStatus(id);
    setUsers(updated);
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser(updated.find(u => u.id === id) || null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user account?")) {
      const updated = await deleteUser(id);
      setUsers(updated);
      setSelectedUser(null);
    }
  };

  const handleUpdateAvatar = () => {
    if (!selectedUser || !newAvatarUrl.trim()) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, avatar: newAvatarUrl.trim() } : u));
    setSelectedUser(prev => prev ? { ...prev, avatar: newAvatarUrl.trim() } : null);
    setEditingAvatar(false);
    setNewAvatarUrl('');
  };

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const added = await addUser({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '+92-300-0000000',
      role: newUser.role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      class: newUser.role === 'student' ? newUser.class : undefined,
      department: newUser.role === 'teacher' ? newUser.department : undefined,
      fatherName: newUser.fatherName,
      motherName: newUser.motherName,
      parentEmail: newUser.parentEmail,
      parentPhone: newUser.parentPhone,
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    const refreshed = await getUsers();
    setUsers(refreshed ?? [added]);
    setNewUser({
      name: '', email: '', phone: '', role: 'student', class: '8-A', department: 'Science',
      fatherName: '', motherName: '', parentEmail: '', parentPhone: '', avatar: ''
    });
    setShowAdd(false);
  };

  const studentCount = users.filter(u => u.role === 'student').length;
  const teacherCount = users.filter(u => u.role === 'teacher').length;
  const activeCount = users.filter(u => u.status === 'active').length;

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="User & Student Management" subtitle="Manage students (36 across 3 classes), parent details, picture assignments & portal visits" />

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="card stat-card-accent accent-blue p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{studentCount}</p>
            <p className="text-xs text-slate-500 mt-1">Total Students (12/class)</p>
          </div>
          <div className="card stat-card-accent accent-violet p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{teacherCount}</p>
            <p className="text-xs text-slate-500 mt-1">Teachers (7 Staff)</p>
          </div>
          <div className="card stat-card-accent accent-cyan p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">3</p>
            <p className="text-xs text-slate-500 mt-1">Classes (8-A, 9-A, 10-A)</p>
          </div>
          <div className="card stat-card-accent accent-emerald p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
            <p className="text-xs text-slate-500 mt-1">Active Accounts</p>
          </div>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="flex gap-2 flex-wrap items-center">
            {(['all', 'student', 'teacher', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold border transition-all capitalize ${
                  roleFilter === role ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-200'
                }`}
              >
                {role === 'all' ? 'All Users' : `${role}s`}
              </button>
            ))}

            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="input text-xs font-semibold py-1.5 px-3 bg-white w-32 cursor-pointer"
            >
              <option value="all">All Classes</option>
              <option value="8-A">Class 8-A</option>
              <option value="9-A">Class 9-A</option>
              <option value="10-A">Class 10-A</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, parent, email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 w-60"
              />
            </div>
            <Button icon={<UserPlus size={15} />} onClick={() => setShowAdd(true)}>
              Add User
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Photo & Name</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Class / Dept</th>
                  <th>Parents Info</th>
                  <th>Status</th>
                  <th className="text-center">Actions / Visit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => {
                  const role = roleConfig[user.role] || roleConfig.student;
                  const status = statusConfig[user.status] || statusConfig.active;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                              {(user.name || 'User').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={role.badge as any}>{role.label}</Badge>
                      </td>
                      <td>
                        <p className="text-xs font-medium text-slate-700">{user.email}</p>
                        <p className="text-[11px] text-slate-400">{user.phone}</p>
                      </td>
                      <td>
                        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                          {user.class ? `Class ${user.class}` : user.department || '—'}
                        </span>
                      </td>
                      <td>
                        {user.role === 'student' ? (
                          <div className="text-xs space-y-0.5">
                            <p className="font-semibold text-slate-800">{user.fatherName || 'Father N/A'}</p>
                            <p className="text-slate-400 text-[11px]">{user.parentPhone || user.phone}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          user.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                          user.status === 'suspended' ? 'bg-rose-50 text-rose-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-600 transition-colors flex items-center gap-1"
                            title="View Full Profile & Parents Info"
                          >
                            Details
                          </button>

                          {/* Admin Portal Visitor Button */}
                          <a
                            href={user.role === 'teacher' ? 'http://localhost:3001' : 'http://localhost:3002'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
                            title={`Visit ${user.role} portal`}
                          >
                            <ExternalLink size={12} /> Visit Portal
                          </a>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
            Showing {filtered.length} of {users.length} accounts
          </div>
        </Card>

      </div>

      {/* User & Parents Detail Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Profile & Parent Details" size="md">
        {selectedUser && (
          <div className="space-y-5">
            {/* Header / Picture Assignment */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="relative group">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-violet-100 border-2 border-white shadow-md flex items-center justify-center text-xl font-bold text-violet-600">
                    {(selectedUser.name || 'User').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
                  </div>
                )}
                <button
                  onClick={() => setEditingAvatar(true)}
                  className="absolute -bottom-1 -right-1 bg-violet-600 text-white p-1.5 rounded-full shadow-lg hover:bg-violet-700 transition-all"
                  title="Assign / Change Picture"
                >
                  <Camera size={13} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">{selectedUser.name}</h3>
                  <Badge variant={(roleConfig[selectedUser.role] || roleConfig.student).badge as any}>
                    {(roleConfig[selectedUser.role] || roleConfig.student).label}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedUser.id}</p>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  {selectedUser.class ? `Class ${selectedUser.class}` : selectedUser.department || '—'}
                </p>

                <div className="mt-3 flex gap-2">
                  <a
                    href={selectedUser.role === 'teacher' ? 'http://localhost:3001' : 'http://localhost:3002'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary text-xs flex items-center gap-1.5"
                  >
                    <ExternalLink size={13} /> Visit Student/Teacher Portal
                  </a>
                </div>
              </div>
            </div>

            {/* Avatar URL Edit Modal Section */}
            {editingAvatar && (
              <div className="p-3 bg-violet-50 border border-violet-200 rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-violet-900">Assign Student Picture URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    className="input text-xs py-1.5"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newAvatarUrl}
                    onChange={e => setNewAvatarUrl(e.target.value)}
                  />
                  <button onClick={handleUpdateAvatar} className="btn btn-sm btn-primary text-xs">Save</button>
                  <button onClick={() => setEditingAvatar(false)} className="btn btn-sm btn-secondary text-xs">Cancel</button>
                </div>
              </div>
            )}

            {/* Account Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Account Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Email</p>
                  <p className="font-semibold text-slate-800 truncate">{selectedUser.email}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Phone</p>
                  <p className="font-semibold text-slate-800">{selectedUser.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Status</p>
                  <p className="font-semibold text-emerald-600 capitalize">{selectedUser.status}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Join Date</p>
                  <p className="font-semibold text-slate-800">{selectedUser.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Parents Information */}
            {selectedUser.role === 'student' && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Parents & Guardian Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">Father Name</p>
                    <p className="font-bold text-slate-800">{selectedUser.fatherName || 'Muhammad Raza Khan'}</p>
                  </div>
                  <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">Mother Name</p>
                    <p className="font-bold text-slate-800">{selectedUser.motherName || 'Fatima Khan'}</p>
                  </div>
                  <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">Parent Phone</p>
                    <p className="font-bold text-slate-800">{selectedUser.parentPhone || selectedUser.phone}</p>
                  </div>
                  <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">Parent Email</p>
                    <p className="font-bold text-slate-800 truncate">{selectedUser.parentEmail || `parent.${selectedUser.email}`}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" fullWidth onClick={() => setSelectedUser(null)}>Close</Button>
              <Button variant="destructive" fullWidth icon={<Trash2 size={14} />} onClick={() => handleDelete(selectedUser.id)}>
                Delete Account
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New User Account" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
              <input type="text" className="input" placeholder="e.g. Rayyan Ahmed" value={newUser.name} onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Role *</label>
              <select className="input" value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value as UserRole }))}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email *</label>
              <input type="email" className="input" placeholder="student@school.edu.pk" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
              <input type="text" className="input" placeholder="+92-300-0000000" value={newUser.phone} onChange={e => setNewUser(u => ({ ...u, phone: e.target.value }))} />
            </div>
          </div>

          {newUser.role === 'student' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
                <select className="input" value={newUser.class} onChange={e => setNewUser(u => ({ ...u, class: e.target.value }))}>
                  <option value="8-A">Class 8-A</option>
                  <option value="9-A">Class 9-A</option>
                  <option value="10-A">Class 10-A</option>
                </select>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Parents Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Father Name</label>
                    <input type="text" className="input" placeholder="Father's full name" value={newUser.fatherName} onChange={e => setNewUser(u => ({ ...u, fatherName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mother Name</label>
                    <input type="text" className="input" placeholder="Mother's full name" value={newUser.motherName} onChange={e => setNewUser(u => ({ ...u, motherName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Parent Phone</label>
                    <input type="text" className="input" placeholder="+92-300-1234567" value={newUser.parentPhone} onChange={e => setNewUser(u => ({ ...u, parentPhone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Parent Email</label>
                    <input type="email" className="input" placeholder="parent@gmail.com" value={newUser.parentEmail} onChange={e => setNewUser(u => ({ ...u, parentEmail: e.target.value }))} />
                  </div>
                </div>
              </div>
            </>
          )}

          {newUser.role === 'teacher' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
              <select className="input" value={newUser.department} onChange={e => setNewUser(u => ({ ...u, department: e.target.value }))}>
                <option value="Science">Science</option>
                <option value="Languages">Languages</option>
                <option value="Computer">Computer</option>
                <option value="Social Studies">Social Studies</option>
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button fullWidth icon={<UserPlus size={14} />} onClick={handleAddUser}>Add Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
