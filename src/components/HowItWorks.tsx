'use client';

import React from 'react';
import { Edit3, Cpu, Share2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Enter',
    desc: 'Paste a URL or type any text.',
    icon: Edit3,
  },
  {
    step: '02',
    title: 'Generate',
    desc: 'Create your QR code instantly.',
    icon: Cpu,
  },
  {
    step: '03',
    title: 'Share',
    desc: 'Download and share it anywhere.',
    icon: Share2,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Three Simple Steps
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          From input to production-ready QR code in under 5 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 mb-4">
                <Icon className="w-5 h-5" />
              </div>

              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                STEP {s.step}
              </span>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {s.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {s.desc}
              </p>

              {idx < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-slate-300 dark:border-slate-700"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
