"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Badge, Button, Progress } from '@/components/ui';
import { Users, CalendarCheck, BookOpen, Clock, ChevronRight, Notebook } from 'lucide-react';
import Cookies from 'js-cookie';

export default function TeacherDashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(Cookies.get('user_name') || 'Teacher');
  }, []);

  const stats = [
    { title: 'Total Students', value: '145', icon: <Users size={20} className="text-blue-500" />, trend: '+2 new' },
    { title: 'Classes Today', value: '5', icon: <Clock size={20} className="text-purple-500" />, trend: '2 remaining' },
    { title: 'Pending Assignments', value: '12', icon: <Notebook size={20} className="text-amber-500" />, trend: 'Needs grading' },
    { title: 'Overall Attendance', value: '94%', icon: <CalendarCheck size={20} className="text-emerald-500" />, trend: '+1.2% this week' }
  ];

  const schedule = [
    { period: '1st Period', time: '08:00 AM - 08:45 AM', subject: 'Mathematics', class: '9-A', status: 'completed' },
    { period: '2nd Period', time: '08:45 AM - 09:30 AM', subject: 'Mathematics', class: '9-B', status: 'completed' },
    { period: '3rd Period', time: '09:30 AM - 10:15 AM', subject: 'Free', class: '-', status: 'current' },
    { period: '4th Period', time: '10:45 AM - 11:30 AM', subject: 'Mathematics', class: '10-A', status: 'upcoming' },
    { period: '5th Period', time: '11:30 AM - 12:15 PM', subject: 'Mathematics', class: '10-B', status: 'upcoming' },
  ];

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Teacher Dashboard" subtitle="Welcome back to your command center" />
      
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, {userName}</h2>
            <p className="text-sm text-slate-500 mt-1">Here is what's happening in your classes today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={<CalendarCheck size={16} />}>Mark Attendance</Button>
            <Button variant="default" icon={<BookOpen size={16} />}>Grade Assignments</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} padding="sm" className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  {stat.icon}
                </div>
                <Badge variant="secondary" className="text-[10px] font-medium">{stat.trend}</Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Today's Schedule</h3>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">View Full Timetable</Button>
            </div>
            
            <Card padding="none" className="overflow-hidden">
              <div className="divide-y divide-slate-100">
                {schedule.map((item, i) => (
                  <div key={i} className={`p-4 flex items-center justify-between ${item.status === 'current' ? 'bg-blue-50/50' : 'hover:bg-slate-50'} transition-colors`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-12 rounded-full ${
                        item.status === 'completed' ? 'bg-slate-300' : 
                        item.status === 'current' ? 'bg-blue-500' : 'bg-slate-200'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{item.period}</h4>
                          {item.status === 'current' && <Badge variant="info">In Progress</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {item.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{item.subject}</p>
                      <p className="text-xs text-slate-500 font-medium">Class {item.class}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions & Tasks */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Task Completion</h3>
            
            <Card padding="md" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Attendance Marked</span>
                  <span className="text-sm font-bold text-slate-900">2/5 Classes</span>
                </div>
                <Progress value={40} indicatorClassName="bg-blue-500" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Syllabus Coverage (9-A)</span>
                  <span className="text-sm font-bold text-slate-900">75%</span>
                </div>
                <Progress value={75} indicatorClassName="bg-emerald-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Term Papers Graded</span>
                  <span className="text-sm font-bold text-slate-900">90%</span>
                </div>
                <Progress value={90} indicatorClassName="bg-purple-500" />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button variant="outline" fullWidth icon={<ChevronRight size={16} />} className="justify-between">
                  View All Tasks
                </Button>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
