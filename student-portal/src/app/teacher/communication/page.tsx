"use client";

import React from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Button, Badge } from '@/components/ui';
import { MessageSquare, Plus, Reply, AlertCircle, CheckCircle2 } from 'lucide-react';

const parentMessages = [
  { id: '1', parent: 'Muhammad Raza Khan', student: 'Ahmed Raza Khan', class: '9-A', message: 'Sir, Ahmed has been struggling with algebra. Could you provide extra worksheets?', date: 'Today, 09:30 AM', status: 'unread' },
  { id: '2', parent: 'Fatima Ali', student: 'Ali Hassan', class: '9-A', message: 'Will there be a parent-teacher meeting next week?', date: 'Yesterday', status: 'read' },
];

export default function TeacherCommunication() {
  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Parent Communication" subtitle="Manage parent inquiries and student remarks" />
      
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Quick Actions / New Remark */}
          <div className="w-full md:w-1/3 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Send Remark</h3>
            <Card padding="md" className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Student</label>
                <select className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Student...</option>
                  <option>Ahmed Raza Khan (9-A)</option>
                  <option>Ali Hassan (9-A)</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Remark Type</label>
                <div className="flex gap-2">
                  <Badge variant="success" className="cursor-pointer">Positive</Badge>
                  <Badge variant="destructive" className="cursor-pointer opacity-50 hover:opacity-100">Needs Improvement</Badge>
                  <Badge variant="info" className="cursor-pointer opacity-50 hover:opacity-100">Neutral/Info</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Message</label>
                <textarea 
                  rows={4}
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type your remark here..."
                ></textarea>
              </div>
              
              <Button fullWidth icon={<Plus size={16} />} onClick={() => alert("Remark sent to parent successfully!")}>Send to Parent</Button>
            </Card>
          </div>

          {/* Inbox */}
          <div className="w-full md:w-2/3 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Parent Inbox</h3>
            
            <div className="space-y-4">
              {parentMessages.map(msg => (
                <Card key={msg.id} padding="md" className={`transition-all ${msg.status === 'unread' ? 'border-l-4 border-l-blue-500 shadow-md' : 'opacity-80 hover:opacity-100'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {msg.parent.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{msg.parent}</h4>
                        <p className="text-xs text-slate-500">Parent of {msg.student} ({msg.class})</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{msg.date}</span>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 mb-4">
                    "{msg.message}"
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    {msg.status === 'unread' && (
                      <Button variant="ghost" size="sm" icon={<CheckCircle2 size={16} className="text-slate-400" />}>Mark Read</Button>
                    )}
                    <Button variant="outline" size="sm" icon={<Reply size={16} />}>Reply</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
