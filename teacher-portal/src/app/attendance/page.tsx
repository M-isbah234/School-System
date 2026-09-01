"use client";

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Button, Modal } from '@/components/ui';
import { Check, X, Save, Users, CalendarCheck } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus } from '@/lib/mockData';
import { getAttendanceRecords, saveAttendanceRecords } from '@/lib/dataService';
import { supabase } from '@/lib/supabase';

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('8-A');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const classes = ['8-A', '9-A', '10-A'];

  useEffect(() => {
    async function loadAttendance() {
      const records = await getAttendanceRecords(selectedClass);
      setAttendance(records);
      setLoading(false);
    }

    const handleFocus = () => { void loadAttendance(); };
    const handleVisibility = () => { if (!document.hidden) void loadAttendance(); };

    void loadAttendance();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    try {
      const channel = supabase.channel(`teacher-attendance-sync-${Date.now()}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => { void loadAttendance(); });

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
  }, [selectedClass]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => prev.map(r => r.studentId === studentId ? { ...r, status } : r));
  };

  const presentCount = attendance.filter(r => r.status === 'present').length;
  const absentCount = attendance.filter(r => r.status === 'absent').length;
  const leaveCount = attendance.filter(r => r.status === 'leave').length;

  const handleSave = async () => {
    await saveAttendanceRecords(attendance);
    setShowModal(true);
  };

  const statusBtnClass = (current: AttendanceStatus, target: AttendanceStatus) => {
    const base = 'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all';
    if (current === target) {
      if (target === 'present') return `${base} bg-emerald-500 text-white border-emerald-500`;
      if (target === 'absent')  return `${base} bg-rose-500 text-white border-rose-500`;
      if (target === 'leave')   return `${base} bg-amber-500 text-white border-amber-500`;
    }
    return `${base} bg-white text-slate-500 border-slate-200 hover:border-slate-300`;
  };

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Mark Attendance" subtitle={`Class ${selectedClass} — ${new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}`} />

      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in-up">

        {/* Class selector */}
        <div className="flex flex-wrap gap-2">
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                selectedClass === cls
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Present', count: presentCount, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'Absent', count: absentCount, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
            { label: 'On Leave', count: leaveCount, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          ].map((s, i) => (
            <div key={i} className={`card ${s.bg} ${s.border} p-4 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-slate-600">Mark all as:</span>
          <button
            className="btn btn-sm btn-success flex items-center gap-1"
            onClick={() => setAttendance(prev => prev.map(r => ({ ...r, status: 'present' })))}
          >
            <Check size={14} /> All Present
          </button>
          <button
            className="btn btn-sm btn-danger flex items-center gap-1"
            onClick={() => setAttendance(prev => prev.map(r => ({ ...r, status: 'absent' })))}
          >
            <X size={14} /> All Absent
          </button>
        </div>

        {/* Student list */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-slate-500" />
              <h3 className="font-bold text-slate-800">Class {selectedClass}</h3>
              <span className="text-xs text-slate-500 font-medium">({attendance.length} students)</span>
            </div>
            <Button onClick={handleSave} icon={<Save size={15} />} size="sm">
              Save Attendance
            </Button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading class attendance...</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {attendance.map((rec, i) => (
                <div key={rec.studentId} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{rec.name}</p>
                      <p className="text-xs text-slate-500">Roll No. {rec.rollNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['present', 'absent', 'leave'] as AttendanceStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => setStatus(rec.studentId, status)}
                        className={statusBtnClass(rec.status, status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Attendance Saved" size="sm">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-slate-700 text-sm font-medium">
            Attendance for <strong>Class {selectedClass}</strong> has been saved to Supabase & local database.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {presentCount} present · {absentCount} absent · {leaveCount} on leave
          </p>
          <Button className="mt-5 w-full" onClick={() => setShowModal(false)}>Done</Button>
        </div>
      </Modal>
    </div>
  );
}
