'use client';

import React from 'react';
import { QrCode } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand & tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight">
                QR Studio
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Simple QR generation for everyone.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Generator
            </a>
            <a href="#history" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              History
            </a>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy
            </a>
          </div>

          {/* Right */}
          <div className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-right">
            Built for the web.
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} QR Studio. Fast • Private • Free.
        </div>
      </div>
    </footer>
  );
}
