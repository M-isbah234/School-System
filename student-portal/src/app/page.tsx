"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import { ClayCard, ClayBadge } from '@/components/ui';
import { CalendarCheck, BookOpen, CreditCard, Megaphone, User, Phone, Mail } from 'lucide-react';
import { studentProfile, allStudentsList } from '@/lib/mockData';

export default function Dashboard() {
  const [selectedStudent, setSelectedStudent] = useState<any>(studentProfile);

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fade-in-up">
      <TopBar title="Student & Parent Dashboard" subtitle={`Welcome back, ${selectedStudent.name}!`} />
      
      <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">

        {/* Student Switcher Bar for Admin/Demo preview */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-slate-700">Active Student View:</span>
          </div>
          <select
            value={selectedStudent.id}
            onChange={e => {
              const found = allStudentsList.find(s => s.id === e.target.value);
              if (found) {
                setSelectedStudent({
                  ...studentProfile,
                  id: found.id,
                  name: found.name,
                  class: found.class,
                  fatherName: found.fatherName,
                  email: found.email,
                  rollNo: found.rollNo
                });
              }
            }}
            className="input text-xs font-semibold py-1 px-3 w-64 bg-slate-50 border-slate-200 cursor-pointer"
          >
            {allStudentsList.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.class}) — {s.rollNo}</option>
            ))}
          </select>
        </div>

        {/* Welcome Banner */}
        <ClayCard color="blue" className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white p-2 shadow-md flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt={selectedStudent.name}
              className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              {selectedStudent.name}
            </h2>
            <p className="text-slate-600 mt-1 flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="font-bold bg-white/60 px-3 py-1 rounded-full text-sm">Class {selectedStudent.class}</span>
              <span className="text-slate-400">•</span>
              <span>{selectedStudent.campus}</span>
            </p>

            {/* Parent Information Banner */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 font-medium">Father: </span>
                <strong className="text-slate-800">{selectedStudent.fatherName}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Mother: </span>
                <strong className="text-slate-800">{selectedStudent.motherName}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Emergency Contact: </span>
                <strong className="text-slate-800">{selectedStudent.emergencyContact}</strong>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col text-right">
            <p className="text-xs text-slate-400 font-medium">Roll No</p>
            <p className="font-mono font-bold text-slate-800 text-sm">{selectedStudent.rollNo}</p>
          </div>
        </ClayCard>

        {/* Quick Glance Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <ClayCard color="mint" className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
              <CalendarCheck size={24} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800">92%</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Attendance Rate</p>
            </div>
          </ClayCard>

          <ClayCard color="lavender" className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4 shadow-sm">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800">4</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Pending Homework</p>
            </div>
          </ClayCard>

          <ClayCard color="pink" className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mb-4 shadow-sm">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 truncate">Rs. 15,000</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">June Fee Status: Unpaid</p>
            </div>
          </ClayCard>

          <ClayCard color="peach" className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 shadow-sm">
              <Megaphone size={24} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800">4</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Active Notices</p>
            </div>
          </ClayCard>
        </div>

      </main>
    </div>
  );
}
