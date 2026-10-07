'use client';

import React from 'react';
import { Zap, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';

const FEATURES = [
  {
    id: 'instant',
    title: 'Instant Generation',
    desc: 'Generate QR codes in seconds with no unnecessary setup or delays.',
    icon: Zap,
    tag: 'Zero Latency',
  },
  {
    id: 'privacy',
    title: 'Privacy First',
    desc: 'Your QR content stays strictly in your browser. No server transmission.',
    icon: ShieldCheck,
    tag: 'Client-Only',
  },
  {
    id: 'quality',
    title: 'High Quality',
    desc: 'Download crisp vector SVGs or print-ready 1024px PNGs with precise quiet zones.',
    icon: CheckCircle2,
    tag: 'Vector & PNG',
  },
  {
    id: 'custom',
    title: 'Customizable',
    desc: 'Adjust size, colors, margin, and error-correction level with live contrast feedback.',
    icon: Sliders,
    tag: 'Precision Matrix',
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Everything you need. <br />
          <span className="text-slate-400 dark:text-slate-500 font-bold">
            Nothing you don&apos;t.
          </span>
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Engineered for speed, scannability, and client-side security. No sign-ups, no tracking, and no paywalls.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-105">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {f.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {f.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
