'use client';

import React from 'react';
import { QRType } from '@/types/qr';
import { Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';

interface QRTypeSelectorProps {
  currentType: QRType;
  onSelectType: (type: QRType) => void;
}

const TYPES: { id: QRType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'url', label: 'URL', icon: Globe },
  { id: 'text', label: 'Plain Text', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
];

export function QRTypeSelector({ currentType, onSelectType }: QRTypeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="QR Code Content Types"
      className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar"
    >
      {TYPES.map((t) => {
        const Icon = t.icon;
        const isActive = currentType === t.id;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectType(t.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isActive
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700/80'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
