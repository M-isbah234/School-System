"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import { ClayCard, ClayButton, ClayBadge, ClayModal } from '@/components/ui';
import { MessageSquare, CheckCircle2, User, Ticket, Plus, Send, Calendar } from 'lucide-react';
import { getTeacherRemarksList, acknowledgeRemark, getTicketsList, createTicket } from '@/lib/dataService';
import { supabase } from '@/lib/supabase';

// --- TEACHER REMARKS COMPONENT ---
function TeacherRemarks({ remarks, onAcknowledge }: { remarks: any[], onAcknowledge: (id: string) => void }) {
  const sortedRemarks = [...remarks].sort((a, b) => {
    if (!a.isAcknowledged && b.isAcknowledged) return -1;
    if (a.isAcknowledged && !b.isAcknowledged) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getAccentColor = (type: string) => {
    if (type === 'positive') return 'border-emerald-500';
    if (type === 'negative') return 'border-red-500';
    return 'border-blue-500';
  };

  return (
    <ClayCard color="pink" className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="text-pink-600" /> Teacher Remarks
        </h3>
        <ClayBadge variant="neutral">{remarks.filter(r => !r.isAcknowledged).length} Pending</ClayBadge>
      </div>

      <div className="space-y-4">
        {sortedRemarks.map(remark => (
          <ClayCard key={remark.id} color="white" className={`overflow-hidden transition-all duration-300 ${remark.isAcknowledged ? 'opacity-70' : ''}`}>
            <div className={`border-l-4 ${getAccentColor(remark.type)} p-5`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white shadow-[2px_2px_6px_rgba(0,0,0,0.1)]">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-slate-800">{remark.teacher}</h4>
                      <p className="text-xs font-semibold text-slate-500">{remark.subject}</p>
                    </div>
                    <span className="text-xs text-slate-400">{remark.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-3 mb-4 leading-relaxed">"{remark.remark}"</p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <ClayBadge variant={remark.type as any} className="capitalize">{remark.type}</ClayBadge>
                    {!remark.isAcknowledged ? (
                      <ClayButton variant="primary" size="sm" icon={<CheckCircle2 size={16} />} onClick={() => onAcknowledge(remark.id)}>
                        Acknowledge & Sign
                      </ClayButton>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={14} /> Acknowledged ✓
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ClayCard>
        ))}
      </div>
    </ClayCard>
  );
}

// --- QUERY DESK COMPONENT ---
function QueryDesk({ tickets, onSubmitTicket }: { tickets: any[], onSubmitTicket: (ticket: any) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('Academic');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    onSubmitTicket({ category, subject, description });
    setIsModalOpen(false);
    setSubject('');
    setDescription('');
  };

  const filteredTickets = tickets.filter(t => filter === 'All' || t.status === filter);
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const statusOrder: Record<string, number> = { 'Pending': 0, 'Scheduled': 1, 'Resolved': 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) return (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Academic': return 'info';
      case 'Sports': return 'event';
      case 'Admin': return 'neutral';
      case 'Fees': return 'urgent';
      default: return 'neutral';
    }
  };

  return (
    <ClayCard color="blue" className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Ticket className="text-blue-600" /> Query Desk
        </h3>
        <ClayBadge variant="pending">{tickets.filter(t => t.status === 'Pending').length} Open</ClayBadge>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex bg-white/50 p-1 rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.03)] overflow-x-auto max-w-full">
          {['All', 'Pending', 'Resolved'].map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filter === f ? 'bg-blue-500 text-white shadow-[2px_2px_4px_rgba(59,130,246,0.3)]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <ClayButton variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>New Query</ClayButton>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {sortedTickets.map(ticket => (
          <ClayCard key={ticket.id} color="white" className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{ticket.ticketNo}</span>
                <ClayBadge variant={getCategoryColor(ticket.category) as any}>{ticket.category}</ClayBadge>
              </div>
              <ClayBadge variant={ticket.status.toLowerCase() as any}>{ticket.status}</ClayBadge>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">{ticket.subject}</h4>
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">{ticket.description}</p>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1"><Calendar size={12} /> Created: {ticket.createdDate}</div>
              {ticket.resolvedDate && (
                <div className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={12} /> Resolved: {ticket.resolvedDate}</div>
              )}
            </div>
            {ticket.response && (
              <div className="mt-3 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-800 mb-1">Official Response:</p>
                <p className="text-sm text-emerald-700">{ticket.response}</p>
              </div>
            )}
          </ClayCard>
        ))}
      </div>

      <ClayModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Support Ticket">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Academic">Academic</option>
              <option value="Fees">Fees</option>
              <option value="Admin">Admin</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
            <input
              type="text" placeholder="Brief summary of your query" value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={4} placeholder="Describe your issue in detail..." value={description} onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <ClayButton variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</ClayButton>
            <ClayButton variant="primary" type="submit" icon={<Send size={16} />}>Submit Ticket</ClayButton>
          </div>
        </form>
      </ClayModal>
    </ClayCard>
  );
}

export default function CommunicationPage() {
  const [remarks, setRemarks] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [rList, tList] = await Promise.all([getTeacherRemarksList(), getTicketsList()]);
      setRemarks(rList);
      setTickets(tList);
      setLoading(false);
    }

    const handleFocus = () => { void loadData(); };
    const handleVisibility = () => { if (!document.hidden) void loadData(); };

    void loadData();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    try {
      const channel = supabase.channel('student-comm-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teacher_remarks' }, () => { void loadData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => { void loadData(); });

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

  const handleAcknowledge = async (id: string) => {
    const updated = await acknowledgeRemark(id);
    setRemarks(updated);
  };

  const handleSubmitTicket = async (ticket: any) => {
    const updated = await createTicket(ticket);
    setTickets(updated);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50/50 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 font-medium">Loading Remarks & Tickets...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Communication Hub" subtitle="Teacher remarks & support ticket desk — Supabase Connected" />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
        <TeacherRemarks remarks={remarks} onAcknowledge={handleAcknowledge} />
        <QueryDesk tickets={tickets} onSubmitTicket={handleSubmitTicket} />
      </div>
    </div>
  );
}
