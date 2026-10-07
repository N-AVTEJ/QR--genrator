'use client';

import React from 'react';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Background glow subtle effect */}
      <div 
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[220px] bg-gradient-to-tr from-blue-500/10 via-violet-500/10 to-transparent blur-3xl pointer-events-none -z-10"
      />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-xs animate-in fade-in duration-500">
        <Zap className="w-3.5 h-3.5 text-blue-500" />
        <span>FAST • PRIVATE • FREE</span>
      </div>

      {/* Primary Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] sm:leading-[1.15]">
        Turn anything into <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
          a scannable QR code.
        </span>
      </h1>

      {/* Supporting Text */}
      <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Generate clean, high-quality QR codes from URLs, text, contact information, and more — instantly.
      </p>

      {/* Reassurance Badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Client-side privacy
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          PNG & SVG export
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
          Zero tracking cookies
        </span>
      </div>
    </section>
  );
}
