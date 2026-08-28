"use client";
import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/AppLayout';
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  X,
  Megaphone,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import { ApprovalRequest, Notice } from '@/lib/mockData';
import { getNotices, addNotice, deleteNotice, getApprovals, updateApprovalStatus } from '@/lib/dataService';

const priorityBadge: Record<string, string> = {
  high: 'badge badge-rose',
  medium: 'badge badge-amber',
  low: 'badge badge-slate',
};
const typeBadge: Record<string, string> = {
  notice: 'badge badge-blue',
  leave: 'badge badge-violet',
  homework: 'badge badge-cyan',
};
const typeIcon: Record<string, React.ElementType> = {
  notice: Megaphone,
  leave: UserCheck,
  homework: FileText,
};

function BroadcastModal({ onClose, onSave }: { onClose: () => void; onSave: (n: Omit<Notice, 'id'>) => void }) {
  const [form, setForm] = useState<{ title: string; content: string; category: Notice['category'] }>({
    title: '',
    content: '',
    category: 'info',
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Broadcast New Notice</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Notice Title *</label>
            <input className="input" placeholder="e.g. School Holiday Announcement" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
            <select
              className="input cursor-pointer"
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value as Notice['category'] }))}
            >
              <option value="info">Info</option>
              <option value="urgent">Urgent</option>
              <option value="holiday">Holiday</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Content *</label>
            <textarea
              className="input resize-none"
              rows={4}
              placeholder="Write the full notice content here…"
              value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-slate-100">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button
            disabled={!form.title || !form.content}
            onClick={() => {
              onSave({
                title: form.title,
                content: form.content,
                date: new Date().toISOString().split('T')[0],
                category: form.category,
                status: 'approved',
                author: 'Admin',
              });
            }}
            className="btn btn-primary flex items-center gap-1.5"
          >
            <Megaphone className="w-4 h-4" />
            Broadcast Notice
          </button>
        </div>
      </div>
    </div>
  );
}

function ApprovalCard({
  req,
  onApprove,
  onReject,
}: {
  req: ApprovalRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const TypeIcon = typeIcon[req.type] ?? FileText;

  const statusIcon = req.status === 'approved'
    ? <CheckCircle className="w-4 h-4 text-emerald-500" />
    : req.status === 'rejected'
      ? <XCircle className="w-4 h-4 text-rose-500" />
      : <Clock className="w-4 h-4 text-amber-500" />;

  return (
    <div className={`card p-4 transition-all ${req.status === 'pending' ? 'border-l-4 border-l-amber-400' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <TypeIcon className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{req.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">By {req.submittedBy} · {req.submittedDate}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={typeBadge[req.type]}>{req.type}</span>
              <span className={priorityBadge[req.priority]}>{req.priority}</span>
              {statusIcon}
            </div>
          </div>

          {expanded && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl text-sm text-slate-600 leading-relaxed animate-fade-in">
              {req.content}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:underline"
            >
              {expanded ? <><ChevronUp className="w-3 h-3" />Hide</> : <><ChevronDown className="w-3 h-3" />Read More</>}
            </button>

            {req.status === 'pending' && (
              <div className="flex gap-2 ml-auto">
                <button onClick={() => onReject(req.id)} className="btn btn-danger btn-sm flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
                <button onClick={() => onApprove(req.id)} className="btn btn-success btn-sm flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
              </div>
            )}
            {req.status !== 'pending' && (
              <span className={`ml-auto text-xs font-semibold capitalize ${req.status === 'approved' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {req.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunicationPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [tab, setTab] = useState<'approvals' | 'notices'>('approvals');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [nData, aData] = await Promise.all([getNotices(), getApprovals()]);
      setNoticeList(nData);
      setRequests(aData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    const updated = await updateApprovalStatus(id, 'approved');
    setRequests(updated);
  };

  const handleReject = async (id: string) => {
    const updated = await updateApprovalStatus(id, 'rejected');
    setRequests(updated);
  };

  const handleAddNotice = async (n: Omit<Notice, 'id'>) => {
    const updated = await addNotice(n);
    setNoticeList(updated);
    setShowBroadcast(false);
  };

  const handleDeleteNotice = async (id: string) => {
    const updated = await deleteNotice(id);
    setNoticeList(updated);
  };

  const filteredRequests = requests.filter((r) =>
    filterStatus === 'all' ? true : r.status === filterStatus
  );

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <TopBar title="Notices & Approvals" subtitle="Broadcast announcements and manage approval workflows — Supabase Connected" />

      <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, cls: 'badge-amber', icon: Clock },
            { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, cls: 'badge-emerald', icon: CheckCircle },
            { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, cls: 'badge-rose', icon: XCircle },
            { label: 'Active Notices', value: noticeList.length, cls: 'badge-blue', icon: Bell },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.cls}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {(['approvals', 'notices'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === 'approvals' && pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-400 text-white text-[10px] font-bold rounded-full mr-1.5">
                    {pendingCount}
                  </span>
                )}
                {t === 'approvals' ? 'Approval Queue' : 'Notice Board'}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {tab === 'approvals' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select className="input pl-9 pr-4 cursor-pointer text-sm py-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
            <button onClick={() => setShowBroadcast(true)} className="btn btn-primary flex items-center gap-1">
              <Plus className="w-4 h-4" />
              New Notice
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading notices & approvals from Supabase...</div>
        ) : (
          <>
            {tab === 'approvals' && (
              <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                  <div className="card p-10 text-center text-slate-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-300" />
                    <p className="font-semibold">All caught up!</p>
                    <p className="text-sm">No requests match your filter.</p>
                  </div>
                ) : (
                  filteredRequests.map((req) => (
                    <ApprovalCard key={req.id} req={req} onApprove={handleApprove} onReject={handleReject} />
                  ))
                )}
              </div>
            )}

            {tab === 'notices' && (
              <div className="space-y-3">
                {noticeList.map((notice) => (
                  <div key={notice.id} className="card p-4">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{notice.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{notice.date} · By {notice.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`badge ${notice.category === 'urgent' ? 'badge-rose' : notice.category === 'holiday' ? 'badge-amber' : notice.category === 'event' ? 'badge-blue' : 'badge-slate'}`}>
                          {notice.category}
                        </span>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                          title="Delete notice"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">{notice.content}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showBroadcast && (
        <BroadcastModal
          onClose={() => setShowBroadcast(false)}
          onSave={handleAddNotice}
        />
      )}
    </div>
  );
}
