'use client';

import React from 'react';
import Image from 'next/image';
import { HistoryItem } from '@/types/qr';
import { formatRelativeTime } from '@/lib/qr-utils';
import { Download, Trash2, Copy, Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
}

const TYPE_ICONS = {
  url: Globe,
  text: FileText,
  email: Mail,
  phone: Phone,
  wifi: Wifi,
};

export function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const toast = useToast();
  const Icon = TYPE_ICONS[item.type] || FileText;

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = item.dataUrl;
      link.download = `qr-studio-${item.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded.');
    } catch {
      toast.error('Download failed.');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.rawContent);
      toast.info('Copied to clipboard.');
    } catch {
      toast.error('Clipboard copy failed.');
    }
  };

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
        {/* QR Thumbnail */}
        <div className="relative shrink-0 w-16 h-16 rounded-xl bg-white dark:bg-white p-1.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center">
          <Image
            src={item.dataUrl}
            alt={item.displayTitle}
            width={64}
            height={64}
            unoptimized
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              <Icon className="w-3 h-3 text-blue-500" />
              {item.type}
            </span>
            <span className="text-[11px] text-slate-400">
              {formatRelativeTime(item.timestamp)}
            </span>
          </div>

          <h4
            className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[280px] sm:max-w-xs"
            title={item.displayTitle}
          >
            {item.displayTitle}
          </h4>

          <p
            className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[280px] sm:max-w-xs"
            title={item.rawContent}
          >
            {item.rawContent}
          </p>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Copy content"
          aria-label="Copy content"
        >
          <Copy className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          title="Download PNG"
          aria-label="Download PNG"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Delete from history"
          aria-label="Delete from history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
