'use client';

import React from 'react';
import { ShieldCheck, HardDrive, EyeOff } from 'lucide-react';

export function PrivacySection() {
  return (
    <section id="privacy" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950 p-8 sm:p-10 shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your data stays with you.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            QR Studio generates codes directly in your browser. No account is required and your generated history is stored locally.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-500" />
              LocalStorage retention only
            </span>
            <span className="flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-blue-500" />
              No remote database tracking
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
