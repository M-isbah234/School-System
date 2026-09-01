"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, CreditCard, MessageSquare,
  Bell, LogOut, User, Search, ShieldCheck,
  GraduationCap, Menu, X, ChevronRight, Settings
} from 'lucide-react';
import Cookies from 'js-cookie';

const navItems = [
  { id: '/', label: 'Command Center', icon: LayoutDashboard, exact: true },
  { id: '/users', label: 'User Management', icon: Users },
  { id: '/finance', label: 'Finance Desk', icon: CreditCard },
  { id: '/communication', label: 'Notices & Approvals', icon: MessageSquare },
];

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate: (p: string) => void }) {
  const name = Cookies.get('admin_name') || 'System Admin';
  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.id : pathname.startsWith(item.id);

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-950 text-slate-300 z-40 border-r border-slate-800/70">
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Admin Portal</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">The Educators</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-slate-900/60">
          <div className="w-9 h-9 rounded-full border border-violet-500/20 bg-violet-500/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate leading-tight">{name}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Full Access</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 text-violet-400 bg-slate-800">Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`sidebar-link ${active ? 'active' : ''}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-slate-800/60 space-y-0.5">
        <button onClick={() => onNavigate('/settings')} className="sidebar-link">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => { Cookies.remove('admin_name'); window.location.href = '/login'; }}
          className="sidebar-link hover:!bg-rose-500/10 hover:!text-rose-400"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function MobileDrawer({ pathname, onNavigate, onClose }: { pathname: string; onNavigate: (p: string) => void; onClose: () => void }) {
  const isActive = (item: typeof navItems[0]) => item.exact ? pathname === item.id : pathname.startsWith(item.id);
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-950 border-r border-slate-800 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-sm font-bold text-white">Admin Portal</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }} className={`sidebar-link ${active ? 'active' : ''}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="px-3 pb-5 pt-3 border-t border-slate-800 space-y-0.5">
          <button onClick={() => { Cookies.remove('admin_name'); window.location.href = '/login'; }} className="sidebar-link hover:!bg-rose-500/10 hover:!text-rose-400">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [dateStr, setDateStr] = React.useState('');

  React.useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 hidden md:block mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {dateStr && <div className="hidden lg:block text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{dateStr}</div>}
        <button className="hidden md:flex w-9 h-9 rounded-lg bg-white border border-slate-200 items-center justify-center text-slate-500 hover:bg-slate-50">
          <Search size={15} />
        </button>
        <button className="relative w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <Bell size={15} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/login') return <div className="min-h-screen bg-slate-50">{children}</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar pathname={pathname} onNavigate={p => router.push(p)} />
      {mobileOpen && <MobileDrawer pathname={pathname} onNavigate={p => router.push(p)} onClose={() => setMobileOpen(false)} />}

      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <div className="md:hidden sticky top-0 z-30 flex items-center bg-white/90 backdrop-blur-md h-16 px-4 border-b border-slate-200 gap-3">
          <button onClick={() => setMobileOpen(true)} className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Menu className="w-4 h-4" />
          </button>
          <p className="font-bold text-slate-900">Admin Portal</p>
        </div>
        <div className="flex-1 hidden md:block">{children}</div>
        <div className="flex-1 md:hidden">{children}</div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40">
        <div className="flex items-center justify-around h-full px-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.id : pathname.startsWith(item.id);
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => router.push(item.id)} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${active ? 'text-violet-600' : 'text-slate-400'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-semibold">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <div className="md:hidden h-16" />
    </div>
  );
}
