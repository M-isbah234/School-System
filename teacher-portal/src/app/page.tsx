"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/AppLayout';
import { Card, Badge, Button, Progress } from '@/components/ui';
import {
  Users, CalendarCheck, BookOpen, Clock, ChevronRight,
  Notebook, MessageSquare, TrendingUp, CheckCircle2, LayoutGrid
} from 'lucide-react';
import { todaySchedule, classStudents, homeworkEntries, parentMessages } from '@/lib/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Cookies from 'js-cookie';

const weekTrend = [
  { day: 'Mon', present: 7, absent: 1 },
  { day: 'Tue', present: 8, absent: 0 },
  { day: 'Wed', present: 6, absent: 2 },
  { day: 'Thu', present: 7, absent: 1 },
  { day: 'Fri', present: 5, absent: 3 },
  { day: 'Sat', present: 8, absent: 0 },
];

export default function TeacherDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('Mr. Tariq Mehmood');

  useEffect(() => {
    const name = Cookies.get('user_name');
    if (name) setUserName(name);
  }, []);

  const currentClass = todaySchedule.find(s => s.status === 'current');
  const upcomingClasses = todaySchedule.filter(s => s.status === 'upcoming').length;
  const unreadMsgs = parentMessages.filter(m => !m.isRead).length;
  const pendingHW = homeworkEntries.length;

  const stats = [
    { title: 'Total Students', value: classStudents.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', accent: 'accent-blue', trend: 'Across all classes' },
    { title: 'Classes Today', value: todaySchedule.filter(s => s.subject !== 'Free Period').length, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50', accent: 'accent-violet', trend: `${upcomingClasses} upcoming` },
    { title: 'Homework Assigned', value: pendingHW, icon: Notebook, color: 'text-amber-500', bg: 'bg-amber-50', accent: 'accent-amber', trend: 'This week' },
    { title: 'Parent Messages', value: unreadMsgs, icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50', accent: 'accent-emerald', trend: 'Unread' },
  ];

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Teacher Dashboard" subtitle={`Welcome back, ${userName}`} />

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`card stat-card-accent ${s.accent} p-5`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.title}</p>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{s.value}</p>
                <p className="text-xs text-slate-500">{s.trend}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Today's Schedule</h2>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View Timetable
              </Button>
            </div>
            <Card padding="none" className="overflow-hidden">
              <div className="divide-y divide-slate-100">
                {todaySchedule.map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 flex items-center justify-between ${item.status === 'current' ? 'bg-blue-50/60' : 'hover:bg-slate-50'} transition-colors`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-12 rounded-full ${
                        item.status === 'completed' ? 'bg-slate-300' :
                        item.status === 'current' ? 'bg-blue-500' : 'bg-slate-200'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{item.period}</h4>
                          {item.status === 'current' && <Badge variant="info">In Progress</Badge>}
                          {item.status === 'completed' && <Badge variant="secondary">Done</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {item.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{item.subject}</p>
                      <p className="text-xs text-slate-500 font-medium">Class {item.class} · {item.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Current class callout */}
            {currentClass && (
              <Card padding="md" className="bg-blue-600 border-blue-600 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">Currently In</p>
                <h3 className="text-xl font-bold">{currentClass.subject}</h3>
                <p className="text-blue-100 text-sm mt-1">Class {currentClass.class} · {currentClass.room}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push('/attendance')}
                    className="flex-1 btn btn-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 rounded-lg"
                  >
                    Mark Attendance
                  </button>
                </div>
              </Card>
            )}

            {/* Attendance trend */}
            <Card padding="md">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Weekly Attendance</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={weekTrend} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Bar dataKey="present" name="Present" fill="#2563eb" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="absent" name="Absent" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Task completion */}
            <Card padding="md" className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Today's Tasks</h3>
              {[
                { label: 'Attendance Marked', value: 40, color: 'bg-blue-500' },
                { label: 'Syllabus Coverage (9-A)', value: 75, color: 'bg-emerald-500' },
                { label: 'Papers Graded', value: 90, color: 'bg-purple-500' },
              ].map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-600">{t.label}</span>
                    <span className="text-xs font-bold text-slate-900">{t.value}%</span>
                  </div>
                  <Progress value={t.value} indicatorClassName={t.color} />
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Mark Attendance', icon: CalendarCheck, path: '/attendance', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
            { label: 'Enter Grades', icon: BookOpen, path: '/academics', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
            { label: 'Assign Homework', icon: Notebook, path: '/diary', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
            { label: 'Parent Messages', icon: MessageSquare, path: '/communication', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
            { label: 'Seating Plan', icon: LayoutGrid, path: '/seating', color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => router.push(action.path)}
                className={`card p-4 flex flex-col items-center gap-3 text-center transition-all hover:scale-[1.02] ${action.color}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-semibold">{action.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
