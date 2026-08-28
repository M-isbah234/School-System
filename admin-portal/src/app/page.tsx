"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/AppLayout';
import {
  GraduationCap, BookOpen, Layers, Activity, Clock, CreditCard,
  TrendingUp, TrendingDown, ChevronRight, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { schoolStats, approvalRequests, notices, adminFeeRecords } from '@/lib/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold text-slate-700">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}{p.name === 'rate' ? '%' : ''}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

interface StatCardProps {
  label: string; value: string | number; sub: string;
  icon: React.ElementType; accent: string; trend?: number;
}
function StatCard({ label, value, sub, icon: Icon, accent, trend }: StatCardProps) {
  return (
    <div className={`card stat-card-accent ${accent} p-5 animate-fade-in-up`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <div className="flex items-center gap-1.5">
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const stats = schoolStats;
  const pendingApprovals = approvalRequests.filter(a => a.status === 'pending');
  const recentNotices = notices.slice(0, 3);
  const paidFees = adminFeeRecords.filter(f => f.status === 'Paid').length;
  const unpaidFees = adminFeeRecords.filter(f => f.status === 'Unpaid' || f.status === 'Overdue').length;
  const collectionPercent = Math.round((stats.monthlyRevenueCollected / stats.monthlyRevenueTarget) * 100);

  return (
    <div>
      <TopBar title="Command Center" subtitle="School-wide overview — The Educators School System" />

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto animate-fade-in-up">

        {/* ── STAT GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard label="Total Students" value={stats.totalStudents.toLocaleString()} sub="Enrolled" icon={GraduationCap} accent="accent-blue" trend={3.2} />
          <StatCard label="Total Staff" value={stats.totalTeachers} sub="Active Teachers" icon={BookOpen} accent="accent-violet" trend={0} />
          <StatCard label="Total Classes" value={stats.totalClasses} sub="Across all grades" icon={Layers} accent="accent-cyan" />
          <StatCard label="Today's Attendance" value={`${stats.todayAttendanceRate}%`} sub="vs 89.1% yesterday" icon={Activity} accent="accent-emerald" trend={2.3} />
          <StatCard label="Pending Approvals" value={pendingApprovals.length} sub="Awaiting review" icon={Clock} accent="accent-amber" />
          <StatCard label="Fee Collection" value={`${collectionPercent}%`} sub="of Jun target" icon={CreditCard} accent="accent-rose" trend={-4.1} />
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Attendance Trend */}
          <div className="lg:col-span-3 card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Attendance Trend</h2>
                <p className="text-xs text-slate-500">This week's daily attendance rate</p>
              </div>
              <span className="badge badge-emerald">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.attendanceTrend}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" name="rate" stroke="#7c3aed" strokeWidth={2.5} fill="url(#attGrad)" dot={{ fill: '#7c3aed', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Fee Collection Summary */}
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Fee Collection</h2>
                <p className="text-xs text-slate-500">June 2026</p>
              </div>
              <button onClick={() => router.push('/finance')} className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">
                Manage <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Collected</span>
                <span className="font-semibold text-slate-700">{collectionPercent}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-1000"
                  style={{ width: `${collectionPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>PKR {(stats.monthlyRevenueCollected / 1_000_000).toFixed(2)}M</span>
                <span>Target: PKR {(stats.monthlyRevenueTarget / 1_000_000).toFixed(2)}M</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Paid Challans
                </div>
                <span className="text-sm font-bold text-emerald-600">{paidFees}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  Unpaid / Overdue
                </div>
                <span className="text-sm font-bold text-rose-500">{unpaidFees}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pending Approvals */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Pending Approvals</h2>
                <p className="text-xs text-slate-500">Requests awaiting your action</p>
              </div>
              <button onClick={() => router.push('/communication')} className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No pending approvals 🎉</p>
              ) : (
                pendingApprovals.map(req => (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{req.title}</p>
                      <p className="text-xs text-slate-500">By {req.submittedBy} · {req.submittedDate}</p>
                    </div>
                    <span className={`badge flex-shrink-0 ${req.priority === 'high' ? 'badge-rose' : req.priority === 'medium' ? 'badge-amber' : 'badge-slate'}`}>
                      {req.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Revenue vs Target bar chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Revenue vs Target</h2>
                <p className="text-xs text-slate-500">Last 6 months (PKR)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.feeCollectionByMonth} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => `PKR ${(v / 1_000_000).toFixed(2)}M`} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── RECENT NOTICES ── */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Recent Notices</h2>
              <p className="text-xs text-slate-500">School-wide announcements</p>
            </div>
            <button onClick={() => router.push('/communication')} className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">
              Manage <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentNotices.map(notice => (
              <div key={notice.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{notice.title}</p>
                  <span className={`badge flex-shrink-0 ${
                    notice.category === 'urgent' ? 'badge-rose' :
                    notice.category === 'holiday' ? 'badge-amber' :
                    notice.category === 'event' ? 'badge-blue' : 'badge-slate'
                  }`}>{notice.category}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{notice.content}</p>
                <p className="text-[11px] text-slate-400 mt-2">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
