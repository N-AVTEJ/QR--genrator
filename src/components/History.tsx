'use client';

import React, { useState } from 'react';
import { HistoryItem } from '@/types/qr';
import { HistoryCard } from './HistoryCard';
import { Clock, Trash2, QrCode } from 'lucide-react';
import { deleteHistoryItem, clearAllHistory } from '@/lib/storage';
import { useToast } from '@/context/ToastContext';

interface HistoryProps {
  items: HistoryItem[];
  onRefreshHistory: () => void;
}

export function History({ items, onRefreshHistory }: HistoryProps) {
  const toast = useToast();
  const [filterType, setFilterType] = useState<string>('all');

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    onRefreshHistory();
    toast.info('Item removed from history.');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire QR history?')) {
      clearAllHistory();
      onRefreshHistory();
      toast.info('History cleared.');
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <section id="history" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent QR Codes
            </h3>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Stored locally in your browser for privacy.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            {/* Filter pills */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types ({items.length})</option>
              <option value="url">URLs</option>
              <option value="text">Text</option>
              <option value="wifi">Wi-Fi</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>

            {/* Clear All button */}
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* History Items or Empty State */}
      <div className="mt-6">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map((item) => (
              <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="text-center py-12 text-slate-400">
            No items matching selected filter.
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 mb-3 shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No QR codes yet.
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Generate your first QR code and it will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
