"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

// --- CARD ---
interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void; padding?: 'none' | 'sm' | 'md' | 'lg'; [key: string]: any; }
const cardPaddingMap = { none: 'p-0', sm: 'p-4', md: 'p-6', lg: 'p-8' };
export function Card({ children, className = '', onClick, padding = 'md' }: CardProps) {
  const base = `bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200 ${cardPaddingMap[padding]} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`;
  return <div className={`${base} ${className}`} onClick={onClick}>{children}</div>;
}

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: string; size?: string; icon?: React.ReactNode; fullWidth?: boolean; [key: string]: any; }
const btnVariant: Record<string, string> = {
  default: 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm',
  outline: 'border border-slate-200 bg-white hover:bg-slate-50 shadow-sm',
  ghost: 'hover:bg-slate-100 text-slate-700',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  destructive: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm',
};
const btnSize: Record<string, string> = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 py-2 text-sm', lg: 'h-11 px-8 text-base', icon: 'h-10 w-10' };
export function Button({ children, variant = 'default', size = 'md', className = '', icon, fullWidth = false, ...props }: ButtonProps) {
  const base = [
    'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
    btnVariant[variant] ?? btnVariant.default,
    btnSize[size] ?? btnSize.md,
    fullWidth ? 'w-full' : '',
    icon && children ? 'gap-2' : '',
  ].join(' ');
  return <button className={`${base} ${className}`} {...props}>{icon && <span className="flex-shrink-0">{icon}</span>}{children}</button>;
}

// --- BADGE ---
interface BadgeProps { children: React.ReactNode; variant?: string; className?: string; }
const badgeVariant: Record<string, string> = {
  default: 'bg-slate-100 text-slate-700',
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-700',
  violet: 'bg-violet-100 text-violet-700',
};
export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeVariant[variant] ?? badgeVariant.default} ${className}`}>{children}</span>;
}

// --- PROGRESS ---
interface ProgressProps { value: number; className?: string; indicatorClassName?: string; }
export function Progress({ value, className = '', indicatorClassName = 'bg-violet-500' }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className={`h-full transition-all duration-700 ${indicatorClassName}`} style={{ width: `${v}%` }} />
    </div>
  );
}

// --- MODAL ---
interface ModalProps { isOpen: boolean; onClose: () => void; title: string; description?: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg'; }
const modalSize = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };
export function Modal({ isOpen, onClose, title, description, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`${modalSize[size]} w-full bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
