"use client";

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { X } from 'lucide-react';

// --- CARD ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  [key: string]: any;
}

const cardPaddingMap = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className = '',
  onClick,
  hover = false,
  padding = 'md',
}: CardProps) {
  const baseClasses = [
    'bg-white',
    'rounded-xl',
    'border border-slate-200',
    'shadow-sm',
    'transition-all duration-200',
    cardPaddingMap[padding],
  ];

  if (hover) baseClasses.push('hover:shadow-md hover:border-slate-300');
  if (onClick) baseClasses.push('active:scale-[0.98] cursor-pointer');

  return (
    <div
      className={`${baseClasses.join(' ')} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

// --- BUTTON ---
type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: any;
  size?: any;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  [key: string]: any;
}

const buttonVariantMap = {
  default: 'bg-slate-900 text-slate-50 hover:bg-slate-900/90 shadow-sm',
  destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/90 shadow-sm',
  outline: 'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 shadow-sm',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
  ghost: 'hover:bg-slate-100 hover:text-slate-900',
};

const buttonSizeMap = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-11 px-8 text-base',
  icon: 'h-10 w-10',
};

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    buttonVariantMap[variant as keyof typeof buttonVariantMap] || '',
    buttonSizeMap[size as keyof typeof buttonSizeMap] || '',
  ];

  if (fullWidth) baseClasses.push('w-full');
  if (icon && children) baseClasses.push('gap-2');

  return (
    <button className={`${baseClasses.join(' ')} ${className}`} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// --- BADGE ---
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: any;
  className?: string;
  [key: string]: any;
}

const badgeVariantMap = {
  default: 'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80',
  secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80',
  destructive: 'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80',
  outline: 'text-slate-950',
  success: 'border-transparent bg-emerald-500 text-white hover:bg-emerald-600',
  warning: 'border-transparent bg-amber-500 text-white hover:bg-amber-600',
  info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const classes = [
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
    badgeVariantMap[variant as keyof typeof badgeVariantMap] || badgeVariantMap.default,
  ];

  return (
    <div className={`${classes.join(' ')} ${className}`}>
      {children}
    </div>
  );
}

// --- PROGRESS ---
interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
  [key: string]: any;
}

export function Progress({ value, className = '', indicatorClassName = 'bg-slate-900' }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`relative h-4 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className={`h-full w-full flex-1 transition-all duration-500 ease-in-out ${indicatorClassName}`}
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </div>
  );
}

// --- CLAY ALIASES (backward compatibility for existing student pages) ---
export const ClayCard = Card;
export const ClayBadge = Badge;
export const ClayButton = Button;
export const ClayProgress = Progress;

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const modalSizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, description, children, size = 'md' }: ModalProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleEscape]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  if (!visible) return null;

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 transition-all duration-200 ${
        animating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${modalSizeMap[size]} w-full bg-white rounded-xl shadow-lg border border-slate-200 transition-all duration-200 ${
          animating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        <div className="p-6 pt-4">{children}</div>
      </div>
    </div>
  );
}

export const ClayModal = Modal;
