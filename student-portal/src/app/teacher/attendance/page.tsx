"use client";

import React, { useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Button, Badge } from '@/components/ui';
import { CheckCircle2, XCircle, Clock, Save, UserCheck, AlertCircle } from 'lucide-react';

const students = [
  { id: '1', name: 'Ahmed Raza Khan', roll: '9A-001', status: 'present' },
  { id: '2', name: 'Ali Hassan', roll: '9A-002', status: 'absent' },
  { id: '3', name: 'Bilal Qureshi', roll: '9A-003', status: 'present' },
  { id: '4', name: 'Daniyal Tariq', roll: '9A-004', status: 'leave' },
  { id: '5', name: 'Ehsan Ullah', roll: '9A-005', status: 'present' },
  { id: '6', name: 'Fahad Mustafa', roll: '9A-006', status: 'present' },
];

export default function MarkAttendance() {
  const [attendance, setAttendance] = useState(students);
  const [selectedClass, setSelectedClass] = useState('9-A');

  const handleStatusChange = (id: string, status: string) => {
    setAttendance(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const getStatusStyle = (status: string, currentStatus: string) => {
    if (status !== currentStatus) return 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100';
    if (status === 'present') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'absent') return 'bg-red-100 text-red-700 border-red-200';
    if (status === 'leave') return 'bg-amber-100 text-amber-700 border-amber-200';
    return '';
  };

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Mark Attendance" subtitle="Record daily attendance for your classes" />
      
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:w-48">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Class</label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="9-A">Class 9-A (Mathematics)</option>
                <option value="9-B">Class 9-B (Mathematics)</option>
                <option value="10-A">Class 10-A (Mathematics)</option>
              </select>
            </div>
            <div className="flex-1 sm:w-40">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Date</label>
              <input 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <Button variant="default" icon={<Save size={16} />} onClick={() => alert("Attendance successfully submitted for " + selectedClass + "!")}>Submit Attendance</Button>
        </div>

        {/* Attendance List */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-slate-500" />
              <h3 className="font-semibold text-slate-800">Student List</h3>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="success">Present: {attendance.filter(s => s.status === 'present').length}</Badge>
              <Badge variant="destructive">Absent: {attendance.filter(s => s.status === 'absent').length}</Badge>
              <Badge variant="warning">Leave: {attendance.filter(s => s.status === 'leave').length}</Badge>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {attendance.map((student) => (
              <div key={student.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-900">{student.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Roll No: {student.roll}</p>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                  <button
                    onClick={() => handleStatusChange(student.id, 'present')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${getStatusStyle('present', student.status)}`}
                  >
                    <CheckCircle2 size={16} /> Present
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, 'absent')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${getStatusStyle('absent', student.status)}`}
                  >
                    <XCircle size={16} /> Absent
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, 'leave')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${getStatusStyle('leave', student.status)}`}
                  >
                    <Clock size={16} /> Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
