"use client";

import React from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Button, Badge } from '@/components/ui';
import { BookOpen, Plus, MoreHorizontal, FileText } from 'lucide-react';

const assignments = [
  { id: '1', title: 'Algebra Worksheet 1', class: '9-A', type: 'Assignment', dueDate: '2026-06-28', submitted: 28, total: 30, status: 'grading' },
  { id: '2', title: 'Trigonometry Quiz', class: '9-A', type: 'Quiz', dueDate: '2026-06-25', submitted: 30, total: 30, status: 'completed' },
  { id: '3', title: 'Geometry Chapter 4', class: '10-B', type: 'Monthly Test', dueDate: '2026-06-20', submitted: 25, total: 25, status: 'published' },
];

export default function ManageGrades() {
  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Manage Grades" subtitle="Assessments, Quizzes, and Term Papers" />
      
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <select className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none">
              <option>All Classes</option>
              <option>Class 9-A</option>
              <option>Class 10-B</option>
            </select>
            <select className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none">
              <option>All Types</option>
              <option>Quiz</option>
              <option>Assignment</option>
              <option>Monthly Test</option>
            </select>
          </div>
          <Button icon={<Plus size={16} />}>New Assessment</Button>
        </div>

        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Class</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Submissions</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">Due: {item.dueDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{item.class}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{item.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${(item.submitted / item.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {item.submitted}/{item.total}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'grading' && <Badge variant="warning">Needs Grading</Badge>}
                      {item.status === 'completed' && <Badge variant="info">Graded</Badge>}
                      {item.status === 'published' && <Badge variant="success">Published</Badge>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">Grade</Button>
                      <Button variant="ghost" size="icon" className="ml-1 text-slate-400">
                        <MoreHorizontal size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
