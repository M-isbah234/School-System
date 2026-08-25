"use client";

import React from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Button, Badge } from '@/components/ui';
import { Notebook, Plus, Calendar, Edit3 } from 'lucide-react';

const homeworkList = [
  { id: '1', title: 'Chapter 5 Exercise', class: '9-A', subject: 'Mathematics', dueDate: 'Tomorrow', status: 'active', assigned: 'Today' },
  { id: '2', title: 'Algebra Equations', class: '9-B', subject: 'Mathematics', dueDate: 'In 3 days', status: 'active', assigned: 'Yesterday' },
  { id: '3', title: 'Basic Trigonometry', class: '10-A', subject: 'Mathematics', dueDate: 'Last Week', status: 'past', assigned: '10 days ago' },
];

export default function AssignHomework() {
  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Digital Diary" subtitle="Assign and track daily homework" />
      
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">Recent Assignments</h3>
            <p className="text-sm text-slate-500">Manage homework across all your classes.</p>
          </div>
          <Button icon={<Plus size={16} />}>Create New Assignment</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeworkList.map((hw) => (
            <Card key={hw.id} padding="md" className="flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={hw.status === 'active' ? 'success' : 'secondary'}>
                    {hw.status === 'active' ? 'Active' : 'Past Due'}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-700">
                    <Edit3 size={16} />
                  </Button>
                </div>
                
                <h4 className="font-bold text-slate-900 mb-1">{hw.title}</h4>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Class {hw.class} • {hw.subject}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> Assigned:</span>
                    <span className="font-medium text-slate-900">{hw.assigned}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> Due:</span>
                    <span className={`font-medium ${hw.status === 'active' ? 'text-amber-600' : 'text-slate-900'}`}>{hw.dueDate}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
      </div>
    </div>
  );
}
