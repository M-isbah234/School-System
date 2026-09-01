"use client";

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Button, Modal } from '@/components/ui';
import { Plus, Calendar, Clock } from 'lucide-react';
import { HomeworkEntry } from '@/lib/mockData';
import { getHomeworkEntries, addHomework } from '@/lib/dataService';
import { supabase } from '@/lib/supabase';

export default function DiaryPage() {
  const [homework, setHomework] = useState<HomeworkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    class: '8-A',
    subject: 'Mathematics',
    title: '',
    description: '',
    dueDate: '',
  });

  const classes = ['8-A', '9-A', '10-A'];

  useEffect(() => {
    async function loadData() {
      const entries = await getHomeworkEntries();
      setHomework(entries);
      setLoading(false);
    }

    const handleFocus = () => { void loadData(); };
    const handleVisibility = () => { if (!document.hidden) void loadData(); };

    void loadData();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    try {
      const channel = supabase.channel('teacher-diary-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'homework' }, () => { void loadData(); });

      void channel.subscribe();

      return () => {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibility);
        void supabase.removeChannel(channel);
      };
    } catch {
      return () => {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.dueDate) return;
    const updated = await addHomework({
      class: form.class,
      subject: form.subject,
      title: form.title,
      description: form.description,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: form.dueDate,
      submissionsCount: 0,
      totalStudents: 5,
    });
    setHomework(updated);
    setForm({ class: '8-A', subject: 'Mathematics', title: '', description: '', dueDate: '' });
    setShowModal(false);
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Assign Homework" subtitle="Manage and track homework assignments — Supabase Connected" />

      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in-up">

        {/* Header action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{homework.length} assignments assigned</p>
          </div>
          <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>
            New Assignment
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card stat-card-accent accent-blue p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{homework.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total Assigned</p>
          </div>
          <div className="card stat-card-accent accent-emerald p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">
              {homework.reduce((a, h) => a + h.submissionsCount, 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Submissions Received</p>
          </div>
          <div className="card stat-card-accent accent-amber p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">
              {homework.reduce((a, h) => a + (h.totalStudents - h.submissionsCount), 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Pending Submissions</p>
          </div>
        </div>

        {/* Homework list */}
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading homework assignments...</div>
        ) : (
          <div className="space-y-3">
            {homework.map(hw => {
              const pct = Math.round((hw.submissionsCount / hw.totalStudents) * 100);
              const overdue = isOverdue(hw.dueDate);
              return (
                <div key={hw.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="badge badge-blue">Class {hw.class}</span>
                        <span className="badge badge-slate">{hw.subject}</span>
                        {overdue && hw.submissionsCount < hw.totalStudents && (
                          <span className="badge badge-rose">Overdue</span>
                        )}
                        {hw.submissionsCount === hw.totalStudents && (
                          <span className="badge badge-emerald">Complete</span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900">{hw.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{hw.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Assigned {hw.assignedDate}
                        </span>
                        <span className={`flex items-center gap-1 font-medium ${overdue ? 'text-rose-500' : 'text-slate-500'}`}>
                          <Clock size={12} /> Due {hw.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-2xl font-bold text-slate-900">{hw.submissionsCount}/{hw.totalStudents}</p>
                      <p className="text-xs text-slate-500">Submitted</p>
                      <div className="w-24 mt-2">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* New Homework Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Assign New Homework" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Class</label>
              <select
                value={form.class}
                onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
                className="input"
              >
                {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject</label>
              <select
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="input"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Pakistan Studies">Pakistan Studies</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title</label>
            <input
              type="text"
              placeholder="e.g. Solve Exercise 4.2"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Detailed instructions for students…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="input"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
            <Button fullWidth onClick={handleSubmit}>Assign</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
