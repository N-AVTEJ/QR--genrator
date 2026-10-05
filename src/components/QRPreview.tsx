'use client';

import React from 'react';
import Image from 'next/image';
import { CustomizationOptions, SIZE_DISPLAY_MAP } from '@/types/qr';
import { QrCode, Download, Copy, RefreshCw, FileCode, Check } from 'lucide-react';

interface QRPreviewProps {
  dataUrl: string | null;
  svgString: string | null;
  rawContent: string;
  isGenerating: boolean;
  options: CustomizationOptions;
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onCopyContent: () => void;
  onCopyImage: () => void;
  onReset: () => void;
  hasCopiedContent: boolean;
  hasCopiedImage: boolean;
}

export function QRPreview({
  dataUrl,
  rawContent,
  isGenerating,
  options,
  onDownloadPNG,
  onDownloadSVG,
  onCopyContent,
  onCopyImage,
  onReset,
  hasCopiedContent,
  hasCopiedImage,
}: QRPreviewProps) {
  const pixelSize = SIZE_DISPLAY_MAP[options.size];

  return (
    <div className="flex flex-col h-full justify-between bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Live Preview
        </h3>
        {dataUrl ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready to scan</span>
          </div>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">
            Awaiting input
          </span>
        )}
      </div>

      {/* Main Preview Canvas Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8 min-h-[300px]">
        {dataUrl ? (
          <div className="relative group flex flex-col items-center">
            {/* The QR Container with explicit high contrast quiet zone */}
            <div
              style={{
                backgroundColor: options.bgColor,
                width: pixelSize,
                height: pixelSize,
              }}
              className="relative rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/60 p-2 sm:p-3 flex items-center justify-center overflow-hidden transition-all duration-300"
            >
              {/* Scanline Sweep Animation on Generation */}
              <div
                key={dataUrl}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-qr-scan z-10 opacity-70"
              />

              {/* Pixel-perfect QR display */}
              <Image
                src={dataUrl}
                alt={`Scannable QR code for: ${rawContent.slice(0, 30)}`}
                width={pixelSize}
                height={pixelSize}
                unoptimized
                className="w-full h-full object-contain select-none"
              />
            </div>

            {/* Quick spec tag */}
            <p className="mt-3 text-[11px] font-mono text-slate-400">
              {pixelSize}×{pixelSize}px • Level {options.errorCorrectionLevel}
            </p>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xs transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Your QR code will appear here
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
              Enter content and generate your code.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons Area */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Primary Action: Download PNG */}
          <button
            type="button"
            onClick={onDownloadPNG}
            disabled={!dataUrl || isGenerating}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          {/* Download SVG */}
          <button
            type="button"
            onClick={onDownloadSVG}
            disabled={!dataUrl || isGenerating}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-500" />
            <span>Download SVG</span>
          </button>
        </div>

        {/* Secondary Utility Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            {/* Copy Content */}
            <button
              type="button"
              onClick={onCopyContent}
              disabled={!dataUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Copy original input content to clipboard"
            >
              {hasCopiedContent ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
              <span>{hasCopiedContent ? 'Copied' : 'Copy Content'}</span>
            </button>

            {/* Copy Image Blob */}
            <button
              type="button"
              onClick={onCopyImage}
              disabled={!dataUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Copy PNG image directly to clipboard"
            >
              {hasCopiedImage ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
              <span>{hasCopiedImage ? 'Image Copied' : 'Copy Image'}</span>
            </button>
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            disabled={!dataUrl && !rawContent}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-medium transition-colors"
            title="Reset generator"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
