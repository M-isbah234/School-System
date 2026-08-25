"use client";
import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/AppLayout';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  X,
  Check,
  Plus
} from 'lucide-react';
import { FeeRecord, adminFeeRecords } from '@/lib/mockData';
import { getFees, updateFeeStatus, addFeeRecord } from '@/lib/dataService';

const statusConfig: Record<string, { badge: string; icon: React.ElementType }> = {
  Paid: { badge: 'badge badge-emerald', icon: CheckCircle },
  Unpaid: { badge: 'badge badge-slate', icon: Clock },
  Partial: { badge: 'badge badge-amber', icon: AlertTriangle },
  Overdue: { badge: 'badge badge-rose', icon: XCircle },
};

function formatPKR(n: number) {
  return `PKR ${n.toLocaleString('en-PK')}`;
}

function ChallanModal({ record, onClose }: { record: FeeRecord; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Fee Challan</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 print-area space-y-4">
          <div className="text-center border-b border-slate-200 pb-4">
            <h3 className="font-bold text-slate-900 text-lg">The Educators School System</h3>
            <p className="text-sm text-slate-500">Gulshan-e-Iqbal Campus, Karachi</p>
            <p className="text-xs text-slate-400 mt-1">Fee Challan — {record.month} {record.year}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Student Name', record.studentName],
              ['Student ID', record.studentId],
              ['Class', record.class],
              ['Challan ID', record.id],
              ['Due Date', record.dueDate],
              ['Status', record.status],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-400 font-medium">{label}</span>
                <span className="font-semibold text-slate-800">{value}</span>
              </div>
            ))}
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Breakdown</p>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Tuition Fee</span>
                <span className="font-medium">{formatPKR(record.amount)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">General Fund</span>
                <span className="font-medium">{formatPKR(1000)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-600">Computer Lab Fee</span>
                <span className="font-medium">{formatPKR(500)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm font-bold bg-slate-50">
                <span className="text-slate-800">Total Payable</span>
                <span className="text-indigo-700">{formatPKR(record.amount + 1500)}</span>
              </div>
            </div>
          </div>

          {record.paidDate && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Paid {formatPKR(record.paidAmount ?? 0)} on {record.paidDate} · Receipt #{record.receiptNo}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-slate-100 no-print">
          <button onClick={onClose} className="btn btn-secondary">Close</button>
          <button onClick={() => window.print()} className="btn btn-primary flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            Print / Download
          </button>
        </div>
      </div>
    </div>
  );
}

function MarkPaidModal({ record, onClose, onConfirm }: { record: FeeRecord; onClose: () => void; onConfirm: (id: string, amount: number) => void }) {
  const [amount, setAmount] = useState(record.amount + 1500);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Mark as Paid</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600">Mark fee for <strong>{record.studentName}</strong> ({record.month} {record.year}) as paid.</p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Amount Received (PKR)</label>
            <input type="number" className="input" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100">
          <button onClick={onClose} className="btn btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => onConfirm(record.id, amount)} className="btn btn-success flex-1 justify-center flex items-center gap-1">
            <Check className="w-4 h-4" />Confirm Paid
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FinanceDesk() {
  const [records, setRecords] = useState<FeeRecord[]>(adminFeeRecords);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [challanRecord, setChallanRecord] = useState<FeeRecord | null>(null);
  const [paidRecord, setPaidRecord] = useState<FeeRecord | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getFees();
      if (data && data.length > 0) setRecords(data);
    }
    loadData();
  }, []);

  const filtered = records.filter((r) => {
    const matchSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase()) ||
      r.class.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleMarkPaid = async (id: string, amount: number) => {
    const updated = await updateFeeStatus(id, 'Paid', amount);
    setRecords(updated);
    setPaidRecord(null);
  };

  const totalCollected = records.filter(r => r.status === 'Paid').reduce((sum, r) => sum + (r.paidAmount ?? r.amount), 0);
  const totalPending = records.filter(r => r.status !== 'Paid').reduce((sum, r) => sum + r.amount, 0);
  const paidCount = records.filter(r => r.status === 'Paid').length;
  const overdueCount = records.filter(r => r.status === 'Overdue').length;

  return (
    <div>
      <TopBar title="Finance Desk" subtitle="Generate challans, track payments & manage fee ledger — Supabase Connected" />

      <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Collected', value: formatPKR(totalCollected), icon: TrendingUp, cls: 'accent-emerald' },
            { label: 'Total Pending', value: formatPKR(totalPending), icon: Clock, cls: 'accent-amber' },
            { label: 'Paid Records', value: `${paidCount} / ${records.length}`, icon: CheckCircle, cls: 'accent-blue' },
            { label: 'Overdue', value: overdueCount, icon: AlertTriangle, cls: 'accent-rose' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`card stat-card-accent ${s.cls} p-4`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search by student name, ID, or class…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select className="input pl-9 pr-4 cursor-pointer" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Month</th>
                    <th className="hidden sm:table-cell">Amount</th>
                    <th className="hidden md:table-cell">Due Date</th>
                    <th>Status</th>
                    <th className="hidden lg:table-cell">Receipt / Paid</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-10 text-slate-400">No records found.</td></tr>
                  ) : (
                    filtered.map((record) => {
                      const cfg = statusConfig[record.status] ?? statusConfig['Unpaid'];
                      const StatusIcon = cfg.icon;
                      return (
                        <tr key={record.id}>
                          <td>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{record.studentName}</p>
                              <p className="text-xs text-slate-400">{record.studentId} · Class {record.class}</p>
                            </div>
                          </td>
                          <td>
                            <span className="text-sm text-slate-700 font-medium">{record.month} {record.year}</span>
                          </td>
                          <td className="hidden sm:table-cell">
                            <span className="text-sm font-semibold text-slate-800">{formatPKR(record.amount)}</span>
                          </td>
                          <td className="hidden md:table-cell">
                            <span className="text-sm text-slate-600">{record.dueDate}</span>
                          </td>
                          <td>
                            <span className={`${cfg.badge} inline-flex items-center gap-2 py-1 px-2 text-xs font-semibold`}> 
                              <StatusIcon className="w-3.5 h-3.5" /> {record.status}
                            </span>
                          </td>
                          <td className="hidden lg:table-cell">
                            {record.paidDate ? (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-700">{record.paidDate}</p>
                                <p className="text-xs text-slate-500">{record.receiptNo}</p>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Not paid</span>
                            )}
                          </td>
                          <td className="space-x-2">
                            <button onClick={() => setChallanRecord(record)} className="btn btn-secondary btn-sm">Challan</button>
                            {record.status !== 'Paid' && (
                              <button onClick={() => setPaidRecord(record)} className="btn btn-primary btn-sm">Mark Paid</button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>

      {challanRecord && <ChallanModal record={challanRecord} onClose={() => setChallanRecord(null)} />}
      {paidRecord && <MarkPaidModal record={paidRecord} onClose={() => setPaidRecord(null)} onConfirm={handleMarkPaid} />}
    </div>
  );
}
