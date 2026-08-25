"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import { ClayCard, ClayButton, ClayBadge } from '@/components/ui';
import { CreditCard, Calendar, Download, TrendingDown, DollarSign, AlertCircle, Printer, X } from 'lucide-react';
import { studentProfile } from '@/lib/mockData';

// --- FEE CHALLAN COMPONENT ---
function FeeChallan({ challanData, studentProfile, selectedMonth, onClose }: any) {
  const handlePrint = () => window.print();
  const formatCurrency = (amount: number) => amount.toLocaleString('en-PK');

  const CopyContent = ({ type }: { type: string }) => (
    <div className="w-full flex flex-col h-full bg-white p-4 text-[10px] sm:text-xs">
      <div className="text-center mb-4 border-b-2 border-black pb-2">
        <h2 className="font-bold text-sm sm:text-base">{challanData.bankName}</h2>
        <p>Branch Code: {challanData.branchCode}</p>
        <h3 className="font-bold text-sm mt-2">{challanData.schoolName}</h3>
        <p className="mb-2">{challanData.schoolAddress}</p>
        <div className="inline-block border border-black px-4 py-1 font-bold uppercase tracking-widest text-sm">{type} COPY</div>
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-y-1">
          <span className="font-semibold">Challan No:</span><span>{challanData.challanNo}</span>
          <span className="font-semibold">Due Date:</span><span className="font-bold">{challanData.dueDate}</span>
          <span className="font-semibold mt-2">Student Name:</span><span className="mt-2 font-bold">{studentProfile.name}</span>
          <span className="font-semibold">Father's Name:</span><span>{studentProfile.fatherName}</span>
          <span className="font-semibold">Class / Sec:</span><span>{studentProfile.class}</span>
          <span className="font-semibold">Roll No:</span><span>{studentProfile.rollNo}</span>
          <span className="font-semibold mt-2">Fee Month:</span><span className="mt-2 font-bold">{selectedMonth} 2026</span>
        </div>
      </div>
      <table className="w-full mb-4 border-collapse border border-black font-mono">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="p-1 border-r border-black">Particulars</th>
            <th className="p-1 text-right">Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-black border-dashed"><td className="p-1 border-r border-black">Tuition Fee</td><td className="p-1 text-right">{formatCurrency(challanData.tuitionFee)}</td></tr>
          <tr className="border-b border-black border-dashed"><td className="p-1 border-r border-black">General Fund</td><td className="p-1 text-right">{formatCurrency(challanData.generalFund)}</td></tr>
          <tr className="border-b border-black border-dashed"><td className="p-1 border-r border-black">Computer Lab</td><td className="p-1 text-right">{formatCurrency(challanData.computerLabFee)}</td></tr>
          <tr className="border-b border-black border-dashed"><td className="p-1 border-r border-black">Exam Fee</td><td className="p-1 text-right">{formatCurrency(challanData.examFee)}</td></tr>
          <tr className="border-b border-black border-dashed"><td className="p-1 border-r border-black font-semibold">Arrears</td><td className="p-1 text-right font-semibold">{formatCurrency(8500)}</td></tr>
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-black">
            <th className="p-1 border-r border-black text-left">TOTAL PAYABLE</th>
            <th className="p-1 text-right text-sm sm:text-base">{formatCurrency(challanData.totalAmount)}</th>
          </tr>
        </tfoot>
      </table>
      <div className="mb-6 mt-auto">
        <p className="font-bold border border-black p-1 text-center bg-gray-100">Fine after Due Date: Rs. {challanData.fineAfterDueDate}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-auto pt-8">
        <div className="text-center border-t border-black pt-1">Cashier</div>
        <div className="text-center border-t border-black pt-1">Depositor</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print overflow-y-auto">
        <div className="bg-slate-100 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-full">
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-800 text-lg">Fee Challan Preview</h3>
            <div className="flex gap-3">
              <ClayButton variant="primary" icon={<Printer size={16} />} onClick={handlePrint}>Print Challan</ClayButton>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"><X size={20} /></button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto bg-slate-200">
            <div className="bg-white mx-auto shadow-sm" style={{ width: '210mm', minHeight: '297mm' }}>
              <div className="grid grid-cols-3 divide-x-2 divide-dashed divide-black h-full print-content">
                <CopyContent type="BANK" /><CopyContent type="SCHOOL" /><CopyContent type="PARENT" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="print-area hidden print:flex print:fixed print:inset-0 print:bg-white print:z-50 print:p-8">
        <div className="grid grid-cols-3 divide-x-2 divide-dashed divide-black h-full w-full">
          <CopyContent type="BANK" /><CopyContent type="SCHOOL" /><CopyContent type="PARENT" />
        </div>
      </div>
    </>
  );
}

// --- FEE PORTAL COMPONENT ---
function FeePortal({ ledger, onDownloadChallan }: { ledger: any, onDownloadChallan: (month: string) => void }) {
  const totalDue = ledger.monthlyFee + ledger.arrears + ledger.transportFee + ledger.examFee - ledger.discount;
  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-PK')}`;

  return (
    <ClayCard color="cream" className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><CreditCard className="text-amber-600" /> Fee Ledger</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <ClayCard color="blue" className="p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign size={16} className="text-blue-500" /><p className="text-xs font-semibold text-slate-500 uppercase">Monthly Fee</p></div>
          <h4 className="text-xl font-bold text-slate-800">{formatCurrency(ledger.monthlyFee)}</h4>
        </ClayCard>
        <ClayCard color="pink" className="p-4 relative overflow-hidden">
          {ledger.arrears > 0 && <div className="absolute top-0 right-0 w-8 h-8 bg-red-100 rounded-bl-2xl flex items-center justify-center"><AlertCircle size={14} className="text-red-500" /></div>}
          <div className="flex items-center gap-2 mb-2"><TrendingDown size={16} className="text-pink-500" /><p className="text-xs font-semibold text-slate-500 uppercase">Arrears</p></div>
          <h4 className="text-xl font-bold text-slate-800">{formatCurrency(ledger.arrears)}</h4>
        </ClayCard>
        <ClayCard color="mint" className="p-4">
          <div className="flex items-center gap-2 mb-2"><Calendar size={16} className="text-emerald-500" /><p className="text-xs font-semibold text-slate-500 uppercase">Transport</p></div>
          <h4 className="text-xl font-bold text-slate-800">{formatCurrency(ledger.transportFee)}</h4>
        </ClayCard>
        <ClayCard color="peach" className="p-4 border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-2"><DollarSign size={16} className="text-orange-500" /><p className="text-xs font-semibold text-orange-600 uppercase tracking-widest">Total Due</p></div>
          <h4 className="text-2xl font-bold text-orange-600">{formatCurrency(totalDue)}</h4>
        </ClayCard>
      </div>
      <div className="bg-white rounded-2xl overflow-hidden shadow-[inset_2px_2px_8px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
          <div className="col-span-2">Month</div><div className="col-span-2">Amount</div><div className="col-span-2">Due Date</div><div className="col-span-2 text-center">Status</div><div className="col-span-4 text-right">Action / Details</div>
        </div>
        <div className="divide-y divide-slate-100">
          {ledger.months.map((item: any, idx: number) => (
            <div key={idx} className={`p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-slate-50 transition-colors ${item.status === 'Paid' ? 'bg-emerald-50/30' : ''}`}>
              <div className="md:col-span-2 font-bold text-slate-800 flex items-center justify-between md:justify-start mb-2 md:mb-0">
                <span>{item.month} {item.year}</span><span className="md:hidden"><ClayBadge variant={item.status.toLowerCase() as any}>{item.status}</ClayBadge></span>
              </div>
              <div className="md:col-span-2 font-semibold text-slate-700 flex justify-between md:block mb-1 md:mb-0">
                <span className="md:hidden text-xs text-slate-400 font-normal">Amount: </span>{formatCurrency(item.amount)}
              </div>
              <div className="md:col-span-2 text-sm text-slate-500 flex justify-between md:block mb-3 md:mb-0">
                <span className="md:hidden text-xs text-slate-400 font-normal">Due Date: </span>{item.dueDate}
              </div>
              <div className="md:col-span-2 text-center hidden md:block">
                <ClayBadge variant={item.status.toLowerCase() as any}>{item.status}</ClayBadge>
              </div>
              <div className="md:col-span-4 flex justify-end">
                {item.status === 'Paid' ? (
                  <div className="text-right text-xs">
                    <p className="font-semibold text-emerald-700 mb-0.5">Paid: {item.paidDate}</p><p className="text-emerald-600/70 font-mono">Receipt: {item.receiptNo}</p>
                  </div>
                ) : (
                  <ClayButton variant="outline" size="sm" icon={<Download size={14} />} onClick={() => onDownloadChallan(item.month)} className="w-full md:w-auto">Download Challan</ClayButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClayCard>
  );
}

import { feeLedger, challanData } from '@/lib/mockData';

export default function FeesPage() {
  const [data, setData] = useState<any>({ ledger: feeLedger, challan: challanData });
  const [showChallan, setShowChallan] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetch('/api/portal?action=fees')
      .then(res => res.json())
      .then(res => {
        if (res && res.ledger && res.ledger.monthlyFee) {
          setData({
            ledger: res.ledger,
            challan: res.challan && res.challan.bankName ? res.challan : challanData
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleDownloadChallan = (month: string) => {
    setSelectedMonth(month);
    setShowChallan(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fade-in-up pb-24 md:pb-6 relative">
      <TopBar title="Fee & Arrears Portal" subtitle="Manage your school dues and download challans" />
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <FeePortal ledger={data.ledger} onDownloadChallan={handleDownloadChallan} />
      </main>
      {showChallan && (
        <FeeChallan challanData={data.challan} studentProfile={studentProfile} selectedMonth={selectedMonth} onClose={() => setShowChallan(false)} />
      )}
    </div>
  );
}
