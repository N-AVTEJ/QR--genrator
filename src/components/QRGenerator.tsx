'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QRType,
  CustomizationOptions,
  WifiConfig,
  EmailConfig,
  PhoneConfig,
  HistoryItem,
} from '@/types/qr';
import {
  DEFAULT_CUSTOMIZATION,
  generateQRDataURL,
  generateQRSVG,
  formatWifiPayload,
  formatEmailPayload,
  formatPhonePayload,
  normalizeUrl,
} from '@/lib/qr-utils';
import { saveHistoryItem } from '@/lib/storage';
import { useToast } from '@/context/ToastContext';
import { QRTypeSelector } from './QRTypeSelector';
import { QRInput } from './QRInput';
import { QRCustomizer } from './QRCustomizer';
import { QRPreview } from './QRPreview';
import { Sparkles, Loader2 } from 'lucide-react';

interface QRGeneratorProps {
  onHistoryChange?: () => void;
  generatorRef?: React.RefObject<HTMLDivElement | null>;
}

export function QRGenerator({ onHistoryChange, generatorRef }: QRGeneratorProps) {
  const toast = useToast();

  // Mode & Inputs
  const [currentType, setCurrentType] = useState<QRType>('url');
  const [textContent, setTextContent] = useState<string>('https://');
  const [wifiConfig, setWifiConfig] = useState<WifiConfig>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    email: '',
    subject: '',
    body: '',
  });
  const [phoneConfig, setPhoneConfig] = useState<PhoneConfig>({
    phone: '',
  });

  // Customization Options
  const [options, setOptions] = useState<CustomizationOptions>(DEFAULT_CUSTOMIZATION);

  // Generation state & Preview results
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [rawPayload, setRawPayload] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

  // Copy status
  const [hasCopiedContent, setHasCopiedContent] = useState<boolean>(false);
  const [hasCopiedImage, setHasCopiedImage] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Compute raw payload depending on selected QR type
  const computePayload = useCallback((): { payload: string; displayTitle: string } => {
    switch (currentType) {
      case 'url': {
        const normalized = normalizeUrl(textContent);
        return { payload: normalized, displayTitle: normalized };
      }
      case 'text':
        return { payload: textContent.trim(), displayTitle: textContent.trim().slice(0, 32) };
      case 'wifi': {
        const payload = formatWifiPayload(wifiConfig);
        return { payload, displayTitle: `Wi-Fi: ${wifiConfig.ssid || 'Network'}` };
      }
      case 'email': {
        const payload = formatEmailPayload(emailConfig);
        return { payload, displayTitle: `Email: ${emailConfig.email || 'Message'}` };
      }
      case 'phone': {
        const payload = formatPhonePayload(phoneConfig);
        return { payload, displayTitle: `Phone: ${phoneConfig.phone || 'Contact'}` };
      }
      default:
        return { payload: '', displayTitle: '' };
    }
  }, [currentType, textContent, wifiConfig, emailConfig, phoneConfig]);

  // Generate QR handler
  const handleGenerate = async (addToHistory = true) => {
    setTouched(true);
    const { payload, displayTitle } = computePayload();

    if (!payload || payload.trim().length === 0) {
      toast.error('Enter something to generate a QR code.');
      return;
    }

    try {
      setIsGenerating(true);
      const url = await generateQRDataURL(payload, options);
      const svg = await generateQRSVG(payload, options);

      setDataUrl(url);
      setSvgString(svg);
      setRawPayload(payload);

      if (addToHistory) {
        const historyItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 11),
          type: currentType,
          rawContent: payload,
          displayTitle: displayTitle || 'QR Code',
          timestamp: Date.now(),
          dataUrl: url,
          options,
        };
        saveHistoryItem(historyItem);
        onHistoryChange?.();
      }

      toast.success('QR code generated successfully!');
    } catch (err) {
      console.error('[QR Studio] Generation failed:', err);
      toast.error('Failed to generate QR code. Please check your input.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-generate if options change while code is already active
  useEffect(() => {
    if (dataUrl && rawPayload) {
      generateQRDataURL(rawPayload, options).then(setDataUrl).catch(console.error);
      generateQRSVG(rawPayload, options).then(setSvgString).catch(console.error);
    }
  }, [options, dataUrl, rawPayload]);

  // When type changes, adjust default input gracefully
  const handleSelectType = (newType: QRType) => {
    setCurrentType(newType);
    setTouched(false);
    if (newType === 'url' && !textContent) {
      setTextContent('https://');
    }
  };

  // Download high-resolution PNG (1024x1024 for crisp print & digital usage)
  const handleDownloadPNG = async () => {
    if (!rawPayload) return;
    try {
      const highResDataUrl = await generateQRDataURL(rawPayload, options, 1024);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `qr-studio-${timestamp}.png`;

      const link = document.createElement('a');
      link.href = highResDataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('QR code downloaded.');
    } catch {
      toast.error('Failed to download PNG.');
    }
  };

  // Download vector SVG
  const handleDownloadSVG = async () => {
    if (!rawPayload) return;
    try {
      const svg = await generateQRSVG(rawPayload, options);
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `qr-studio-${timestamp}.svg`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('SVG code downloaded.');
    } catch {
      toast.error('Failed to download SVG.');
    }
  };

  // Copy raw content
  const handleCopyContent = async () => {
    if (!rawPayload) return;
    try {
      await navigator.clipboard.writeText(rawPayload);
      setHasCopiedContent(true);
      toast.info('Copied to clipboard.');
      setTimeout(() => setHasCopiedContent(false), 2000);
    } catch {
      toast.error('Clipboard access not permitted.');
    }
  };

  // Copy PNG image directly as blob
  const handleCopyImage = async () => {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      setHasCopiedImage(true);
      toast.success('Image copied to clipboard!');
      setTimeout(() => setHasCopiedImage(false), 2000);
    } catch {
      // Fallback for browsers without ClipboardItem write permission
      handleCopyContent();
    }
  };

  // Reset generator
  const handleReset = () => {
    setTextContent(currentType === 'url' ? 'https://' : '');
    setWifiConfig({ ssid: '', password: '', encryption: 'WPA', hidden: false });
    setEmailConfig({ email: '', subject: '', body: '' });
    setPhoneConfig({ phone: '' });
    setDataUrl(null);
    setSvgString(null);
    setRawPayload('');
    setTouched(false);
    toast.info('Generator reset.');
  };

  return (
    <div
      id="generator"
      ref={generatorRef}
      className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-200/80 via-slate-100/50 to-slate-200/80 dark:from-slate-800/80 dark:via-slate-900/50 dark:to-slate-800/80 shadow-2xl">
        <div className="bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* LEFT COLUMN: Input & Customization */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Create your QR
                    </h2>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Enter anything you want to share.
                  </p>
                </div>

                {/* QR Type Selector */}
                <QRTypeSelector
                  currentType={currentType}
                  onSelectType={handleSelectType}
                />

                {/* Dynamic Input based on Type */}
                <QRInput
                  type={currentType}
                  textContent={textContent}
                  setTextContent={setTextContent}
                  wifiConfig={wifiConfig}
                  setWifiConfig={setWifiConfig}
                  emailConfig={emailConfig}
                  setEmailConfig={setEmailConfig}
                  phoneConfig={phoneConfig}
                  setPhoneConfig={setPhoneConfig}
                  touched={touched}
                  setTouched={setTouched}
                  inputRef={inputRef}
                />

                {/* Customizer */}
                <QRCustomizer
                  options={options}
                  onChangeOptions={setOptions}
                />
              </div>

              {/* Generate Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerate(true)}
                  disabled={isGenerating}
                  className="group relative w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
                  )}
                  <span>{isGenerating ? 'Generating QR Code...' : 'Generate QR'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Preview Panel */}
            <div className="lg:col-span-5 flex flex-col">
              <QRPreview
                dataUrl={dataUrl}
                svgString={svgString}
                rawContent={rawPayload || textContent}
                isGenerating={isGenerating}
                options={options}
                onDownloadPNG={handleDownloadPNG}
                onDownloadSVG={handleDownloadSVG}
                onCopyContent={handleCopyContent}
                onCopyImage={handleCopyImage}
                onReset={handleReset}
                hasCopiedContent={hasCopiedContent}
                hasCopiedImage={hasCopiedImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
