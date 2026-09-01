"use client";

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/AppLayout';
import { Badge, Button, Modal } from '@/components/ui';
import { MessageSquare, Send, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ParentMessage } from '@/lib/mockData';
import { getParentMessages, markMessageRead } from '@/lib/dataService';
import { supabase } from '@/lib/supabase';

export default function CommunicationPage() {
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<ParentMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    async function loadData() {
      const data = await getParentMessages();
      setMessages(data);
      setLoading(false);
    }

    const handleFocus = () => { void loadData(); };
    const handleVisibility = () => { if (!document.hidden) void loadData(); };

    void loadData();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    try {
      const channel = supabase.channel('teacher-comm-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'parent_messages' }, () => { void loadData(); });

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

  const handleOpen = async (msg: ParentMessage) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      const updated = await markMessageRead(msg.id);
      setMessages(updated);
    }
    setReplyText('');
    setShowReply(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplyText('');
    setShowReply(false);
    setSelectedMsg(null);
  };

  const typeIcon = (type: ParentMessage['type']) => {
    if (type === 'appreciation') return <Star size={14} className="text-amber-500" />;
    if (type === 'complaint') return <AlertCircle size={14} className="text-rose-500" />;
    return <MessageSquare size={14} className="text-blue-500" />;
  };

  const typeBadge = (type: ParentMessage['type']) => {
    if (type === 'appreciation') return <span className="badge badge-amber">Appreciation</span>;
    if (type === 'complaint') return <span className="badge badge-rose">Complaint</span>;
    return <span className="badge badge-blue">Query</span>;
  };

  const filtered = filter === 'unread' ? messages.filter(m => !m.isRead) : messages;
  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Parent Communications" subtitle="Messages from parents and guardians — Supabase Connected" />

      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in-up">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card stat-card-accent accent-blue p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{messages.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total Messages</p>
          </div>
          <div className="card stat-card-accent accent-amber p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{unreadCount}</p>
            <p className="text-xs text-slate-500 mt-1">Unread</p>
          </div>
          <div className="card stat-card-accent accent-emerald p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{messages.filter(m => m.type === 'appreciation').length}</p>
            <p className="text-xs text-slate-500 mt-1">Appreciation</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {f === 'all' ? 'All Messages' : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Message list */}
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading messages...</div>
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="card p-10 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">All caught up! No unread messages.</p>
              </div>
            ) : (
              filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleOpen(msg)}
                  className={`card w-full p-5 text-left transition-all hover:scale-[1.005] ${!msg.isRead ? 'border-blue-100 bg-blue-50/30' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.type === 'appreciation' ? 'bg-amber-100' :
                      msg.type === 'complaint' ? 'bg-rose-100' : 'bg-blue-100'
                    }`}>
                      {typeIcon(msg.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-slate-900">{msg.parentName}</span>
                        {typeBadge(msg.type)}
                        {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                      </div>
                      <p className="text-xs text-slate-500 mb-1">
                        Re: <strong>{msg.studentName}</strong> — Class {msg.class}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-2">{msg.message}</p>
                      <p className="text-xs text-slate-400 mt-2">{msg.date}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

      </div>

      {/* Message detail modal */}
      <Modal
        isOpen={!!selectedMsg}
        onClose={() => setSelectedMsg(null)}
        title={`Message from ${selectedMsg?.parentName}`}
        description={`Re: ${selectedMsg?.studentName} — Class ${selectedMsg?.class}`}
        size="md"
      >
        {selectedMsg && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {typeBadge(selectedMsg.type)}
              <span className="text-xs text-slate-400">{selectedMsg.date}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed border border-slate-100">
              {selectedMsg.message}
            </div>

            {showReply ? (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  className="input resize-none"
                  placeholder="Type your reply to the parent..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="outline" fullWidth onClick={() => setShowReply(false)}>Cancel</Button>
                  <Button fullWidth icon={<Send size={14} />} onClick={handleSendReply}>Send Reply</Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" fullWidth onClick={() => setSelectedMsg(null)}>Close</Button>
                <Button fullWidth icon={<Send size={14} />} onClick={() => setShowReply(true)}>Reply</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
