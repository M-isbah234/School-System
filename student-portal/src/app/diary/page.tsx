"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import { ClayCard, ClayBadge } from '@/components/ui';
import { BookOpen, Calendar, CheckCircle2, Circle, AlertTriangle, Megaphone, Info, PartyPopper, CloudRain, ChevronDown, ChevronUp } from 'lucide-react';
import { getHomeworkList, toggleHomework, getNoticesList } from '@/lib/dataService';
import { notices as defaultNotices } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

// --- HOMEWORK FEED COMPONENT ---
function HomeworkFeed({ homework, onToggleComplete }: { homework: any[], onToggleComplete: (id: string) => void }) {
  const sortedHomework = [...homework].sort((a, b) => {
    const today = new Date();
    const aDue = new Date(a.dueDate), bDue = new Date(b.dueDate);
    const aOverdue = !a.isCompleted && aDue < today, bOverdue = !b.isCompleted && bDue < today;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return aDue.getTime() - bDue.getTime();
  });

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'bg-blue-100 text-blue-700';
      case 'English': return 'bg-pink-100 text-pink-700';
      case 'Physics': return 'bg-purple-100 text-purple-700';
      case 'Urdu': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <ClayCard color="peach" className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-orange-600" /> Homework Feed
        </h3>
        <ClayBadge variant="neutral">{homework.filter(h => !h.isCompleted).length} Pending</ClayBadge>
      </div>
      <div className="space-y-4">
        {sortedHomework.map(item => {
          const isOverdue = !item.isCompleted && new Date(item.dueDate) < new Date();
          return (
            <ClayCard key={item.id} color="white" className={`p-5 transition-all duration-300 ${item.isCompleted ? 'opacity-70 grayscale-[30%]' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${getSubjectColor(item.subject)}`}>{item.subject}</span>
                {isOverdue ? (
                  <ClayBadge variant="urgent" className="flex items-center gap-1"><AlertTriangle size={12} /> Overdue</ClayBadge>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500"><Calendar size={12} /> {item.dueDate}</div>
                )}
              </div>
              <h4 className={`font-bold text-lg text-slate-800 mb-1 ${item.isCompleted ? 'line-through decoration-slate-400' : ''}`}>{item.title}</h4>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400">By {item.teacher}</span>
                <button onClick={() => onToggleComplete(item.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${item.isCompleted ? 'bg-emerald-100 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]' : 'bg-slate-100 text-slate-600 shadow-[2px_2px_4px_rgba(0,0,0,0.05)] hover:bg-slate-200'}`}>
                  {item.isCompleted ? <><CheckCircle2 size={14} /> Completed</> : <><Circle size={14} /> Mark Complete</>}
                </button>
              </div>
            </ClayCard>
          );
        })}
      </div>
    </ClayCard>
  );
}

// --- NOTICE BOARD COMPONENT ---
function NoticeBoard({ noticesList }: { noticesList: any[] }) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const toggleExpand = (id: string) => setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const sortedNotices = [...noticesList].sort((a, b) => {
    if (a.category === 'urgent' && b.category !== 'urgent') return -1;
    if (a.category !== 'urgent' && b.category === 'urgent') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'urgent': return <AlertTriangle size={14} />;
      case 'info': return <Info size={14} />;
      case 'event': return <PartyPopper size={14} />;
      case 'holiday': return <CloudRain size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <ClayCard color="lavender" className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Megaphone className="text-purple-600" /> School Notice Board
        </h3>
      </div>
      <div className="space-y-4">
        {sortedNotices.map(notice => {
          const isExpanded = expandedIds.includes(notice.id);
          const previewText = notice.content.length > 60 ? `${notice.content.substring(0, 60)}...` : notice.content;
          return (
            <ClayCard key={notice.id} color="white" className="overflow-hidden">
              <div className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors relative" onClick={() => toggleExpand(notice.id)}>
                {!notice.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                <div className="flex justify-between items-start mb-2">
                  <ClayBadge variant={notice.category as any} className="flex items-center gap-1">
                    {getCategoryIcon(notice.category)} <span className="capitalize">{notice.category}</span>
                  </ClayBadge>
                  <span className="text-xs font-semibold text-slate-400">{notice.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">{notice.title}</h4>
                  <div className="text-slate-400">{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
                </div>
                <div className={`mt-2 text-sm text-slate-600 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-6 opacity-80'}`}>
                  {isExpanded ? notice.content : previewText}
                </div>
              </div>
            </ClayCard>
          );
        })}
      </div>
    </ClayCard>
  );
}

// --- MAIN PAGE ---
export default function DiaryPage() {
  const [homework, setHomework] = useState<any[]>([]);
  const [noticesList, setNoticesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [hw, nt] = await Promise.all([getHomeworkList(), getNoticesList()]);
      setHomework(hw);
      setNoticesList(nt && nt.length ? nt : defaultNotices);
      setLoading(false);
    }

    const handleFocus = () => { void loadData(); };
    const handleVisibility = () => { if (!document.hidden) void loadData(); };

    void loadData();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    try {
      const channel = supabase.channel('student-diary-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'homework' }, () => { void loadData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => { void loadData(); });

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

  const handleToggleComplete = async (id: string) => {
    const updated = await toggleHomework(id);
    setHomework(updated);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50/50 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 font-medium">Loading Diary & Notices...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Digital Diary & Notices" subtitle="Track daily homework and stay updated with school announcements — Supabase Connected" />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
        <HomeworkFeed homework={homework} onToggleComplete={handleToggleComplete} />
        <NoticeBoard noticesList={noticesList} />
      </div>
    </div>
  );
}
