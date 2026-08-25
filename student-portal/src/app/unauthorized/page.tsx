"use client";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-rose-400" />
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 text-sm mb-1 font-mono tracking-widest">403 FORBIDDEN</p>
        <p className="text-slate-500 mt-4 text-sm leading-relaxed">
          You don&apos;t have permission to view this page. This area is restricted to authorized roles only.
        </p>

        {/* Current role pill */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Your role: <strong className="text-white capitalize">{Cookies.get('user_role') || 'student'}</strong>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
