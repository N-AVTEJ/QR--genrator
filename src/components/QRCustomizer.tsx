'use client';

import React, { useState } from 'react';
import { CustomizationOptions, QRSize, QRMargin, ErrorCorrectionLevel } from '@/types/qr';
import { checkContrast } from '@/lib/qr-utils';
import { ChevronDown, Sliders, AlertTriangle } from 'lucide-react';

interface QRCustomizerProps {
  options: CustomizationOptions;
  onChangeOptions: (newOptions: CustomizationOptions) => void;
}

const FG_PRESETS = [
  { label: 'Deep Black', color: '#090D16' },
  { label: 'Electric Blue', color: '#2563EB' },
  { label: 'Royal Violet', color: '#7C3AED' },
  { label: 'Slate Gray', color: '#334155' },
  { label: 'Forest Green', color: '#047857' },
];

const BG_PRESETS = [
  { label: 'Crisp White', color: '#FFFFFF' },
  { label: 'Cool Pearl', color: '#F8FAFC' },
  { label: 'Soft Ivory', color: '#FFFBEB' },
  { label: 'Sky Tint', color: '#EFF6FF' },
];

export function QRCustomizer({ options, onChangeOptions }: QRCustomizerProps) {
  const [isOpen, setIsOpen] = useState(true);

  const update = (partial: Partial<CustomizationOptions>) => {
    onChangeOptions({ ...options, ...partial });
  };

  const contrast = checkContrast(options.fgColor, options.bgColor);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden transition-all">
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Customize QR Appearance
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Colors, Quiet Zone & Resolution
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4 text-xs">
          {/* Contrast Warning Banner if readability is compromised */}
          {!contrast.isReadable || contrast.warning ? (
            <div
              role="alert"
              className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                !contrast.isReadable
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">
                  Contrast ratio: {contrast.ratio}:1
                </span>
                <p className="mt-0.5 text-[11px] opacity-90">
                  {contrast.warning}
                </p>
              </div>
            </div>
          ) : null}

          {/* Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foreground */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={options.fgColor}
                  onChange={(e) => update({ fgColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                  aria-label="Custom foreground color"
                />
                <input
                  type="text"
                  value={options.fgColor.toUpperCase()}
                  onChange={(e) => update({ fgColor: e.target.value })}
                  className="w-20 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-center uppercase"
                  maxLength={7}
                />
                {/* Preset swatches */}
                <div className="flex items-center gap-1">
                  {FG_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      title={p.label}
                      onClick={() => update({ fgColor: p.color })}
                      style={{ backgroundColor: p.color }}
                      className={`w-5 h-5 rounded-md border transition-transform ${
                        options.fgColor.toLowerCase() === p.color.toLowerCase()
                          ? 'ring-2 ring-blue-500 scale-110'
                          : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Background */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={options.bgColor}
                  onChange={(e) => update({ bgColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                  aria-label="Custom background color"
                />
                <input
                  type="text"
                  value={options.bgColor.toUpperCase()}
                  onChange={(e) => update({ bgColor: e.target.value })}
                  className="w-20 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-center uppercase"
                  maxLength={7}
                />
                {/* Preset swatches */}
                <div className="flex items-center gap-1">
                  {BG_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      title={p.label}
                      onClick={() => update({ bgColor: p.color })}
                      style={{ backgroundColor: p.color }}
                      className={`w-5 h-5 rounded-md border transition-transform ${
                        options.bgColor.toLowerCase() === p.color.toLowerCase()
                          ? 'ring-2 ring-blue-500 scale-110'
                          : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Size & Margin Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            {/* Size */}
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Display Size
              </span>
              <div className="grid grid-cols-3 gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg">
                {(['small', 'medium', 'large'] as QRSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => update({ size })}
                    className={`py-1 text-center font-medium capitalize rounded transition-colors ${
                      options.size === size
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Margin (Quiet Zone) */}
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Quiet Zone (Margin)
              </span>
              <div className="grid grid-cols-3 gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg">
                {(['small', 'medium', 'large'] as QRMargin[]).map((margin) => (
                  <button
                    key={margin}
                    type="button"
                    onClick={() => update({ margin })}
                    className={`py-1 text-center font-medium capitalize rounded transition-colors ${
                      options.margin === margin
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {margin}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Correction Level */}
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Error Correction
              </span>
              <div className="grid grid-cols-4 gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg">
                {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    title={`Level ${level}: ${
                      level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'
                    } recovery`}
                    onClick={() => update({ errorCorrectionLevel: level })}
                    className={`py-1 text-center font-mono font-medium rounded transition-colors ${
                      options.errorCorrectionLevel === level
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
