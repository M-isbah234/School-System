"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import { ClayCard, ClayBadge } from '@/components/ui';
import { CalendarDays, CalendarCheck, TrendingUp, Clock, XCircle, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- ATTENDANCE RING COMPONENT ---
function AttendanceRing({ present, absent, leaves, totalDays }: any) {
  const data = [
    { name: 'Present', value: present, color: '#34d399' },
    { name: 'Absent', value: absent, color: '#f87171' },
    { name: 'Leave', value: leaves, color: '#fbbf24' }
  ];
  const percentage = Math.round((present / totalDays) * 100) || 0;

  return (
    <ClayCard color="mint" className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
        <CalendarCheck className="text-emerald-600" /> Overall Attendance
      </h3>
      <div className="flex-1 relative min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
          <span className="text-xs font-medium text-slate-500">Attendance</span>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium text-slate-600">{item.name}</span>
          </div>
        ))}
      </div>
    </ClayCard>
  );
}

// --- ATTENDANCE TIMELINE COMPONENT ---
function AttendanceTimeline({ periods }: { periods: any[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'absent': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'leave': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'upcoming': return <div className="w-4 h-4 rounded-full border-2 border-blue-400 ml-0.5 bg-white" />;
    }
  };

  return (
    <ClayCard color="blue" className="p-6">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
        <Clock className="text-blue-600" /> Today's Timeline
      </h3>
      <div className="relative">
        <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-200 z-0" />
        <div className="space-y-6">
          {periods.map((item, index) => {
            const isUpcoming = item.status === 'upcoming';
            return (
              <React.Fragment key={item.id}>
                {index === 4 && (
                  <div className="flex items-center gap-4 relative z-10 pl-10 opacity-70">
                    <div className="absolute left-[9px] w-2 h-2 rounded-full bg-slate-300" />
                    <div className="bg-slate-100 px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 tracking-wider">
                      BREAK • 10:40 AM - 11:00 AM
                    </div>
                  </div>
                )}
                <div className={`flex items-start gap-4 relative z-10 ${isUpcoming ? 'opacity-60' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-white mt-1 shrink-0 ${isUpcoming && item.period === 6 ? 'animate-pulse' : ''}`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 bg-white/60 rounded-xl p-4 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.7),_2px_2px_6px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">
                          Period {item.period} • {item.startTime} - {item.endTime}
                        </p>
                        <h4 className="text-lg font-bold text-slate-800">{item.subject}</h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {item.teacher} • <span className="text-slate-400">{item.room}</span>
                        </p>
                      </div>
                      {!isUpcoming && (
                        <ClayBadge variant={item.status as any}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </ClayBadge>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </ClayCard>
  );
}

import { monthlyAttendance, todayTimetable } from '@/lib/mockData';

export default function AttendancePage() {
  const [data, setData] = useState<any>({ monthly: monthlyAttendance, timetable: todayTimetable });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/portal?action=attendance')
      .then(res => res.json())
      .then(res => {
        if (res && res.monthly) {
          setData({
            monthly: res.monthly,
            timetable: res.timetable?.length ? res.timetable : todayTimetable
          });
        }
      })
      .catch(() => {});
  }, []);

  const monthly = data?.monthly || monthlyAttendance;
  const timetable = data?.timetable?.length ? data.timetable : todayTimetable;

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fade-in-up">
      <TopBar title="Attendance Tracker" subtitle="Track your daily and monthly presence" />
      
      <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ClayCard color="blue" className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-[2px_2px_4px_rgba(0,0,0,0.05),_inset_1px_1px_2px_rgba(255,255,255,0.8)]">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Days</p>
              <h4 className="text-2xl font-bold text-slate-800">{monthly.totalDays}</h4>
            </div>
          </ClayCard>

          <ClayCard color="mint" className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-[2px_2px_4px_rgba(0,0,0,0.05),_inset_1px_1px_2px_rgba(255,255,255,0.8)]">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Present</p>
              <h4 className="text-2xl font-bold text-slate-800">{monthly.present}</h4>
            </div>
          </ClayCard>

          <ClayCard color="pink" className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-[2px_2px_4px_rgba(0,0,0,0.05),_inset_1px_1px_2px_rgba(255,255,255,0.8)]">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Absent</p>
              <h4 className="text-2xl font-bold text-slate-800">{monthly.absent}</h4>
            </div>
          </ClayCard>

          <ClayCard color="cream" className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-[2px_2px_4px_rgba(0,0,0,0.05),_inset_1px_1px_2px_rgba(255,255,255,0.8)]">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">On Leave</p>
              <h4 className="text-2xl font-bold text-slate-800">{monthly.leaves}</h4>
            </div>
          </ClayCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <AttendanceRing present={monthly.present} absent={monthly.absent} leaves={monthly.leaves} totalDays={monthly.totalDays} />
            
            <ClayCard color="white" className="p-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Calendar className="text-indigo-500" /> June 2026
              </h3>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} className="text-xs font-semibold text-slate-400 py-1">{d}</div>)}
                {Array.from({length: 30}).map((_, i) => {
                  const isWeekend = (i + 1) % 7 === 0;
                  const isAbsent = i === 2 || i === 15;
                  const isLeave = i === 10;
                  const isPresent = !isWeekend && !isAbsent && !isLeave && i < 20;
                  
                  let bgColor = 'bg-slate-50';
                  if (isPresent) bgColor = 'bg-emerald-100 text-emerald-700 font-bold shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]';
                  if (isAbsent) bgColor = 'bg-red-100 text-red-700 font-bold shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]';
                  if (isLeave) bgColor = 'bg-amber-100 text-amber-700 font-bold shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]';
                  
                  return <div key={i} className={`text-sm py-2 rounded-md ${bgColor} ${isWeekend ? 'text-slate-300' : ''}`}>{i + 1}</div>;
                })}
              </div>
            </ClayCard>
          </div>
          
          <div className="lg:col-span-2">
            <AttendanceTimeline periods={timetable} />
          </div>
        </div>
      </main>
    </div>
  );
}
