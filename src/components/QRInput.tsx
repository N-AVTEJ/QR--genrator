'use client';

import React, { useState } from 'react';
import { QRType, WifiConfig, EmailConfig, PhoneConfig } from '@/types/qr';
import { isValidUrl } from '@/lib/qr-utils';
import { AlertCircle, Eye, EyeOff, Lock, Globe, Mail, Phone, Wifi } from 'lucide-react';

interface QRInputProps {
  type: QRType;
  // URL or Plain Text
  textContent: string;
  setTextContent: (val: string) => void;
  // Wi-Fi
  wifiConfig: WifiConfig;
  setWifiConfig: React.Dispatch<React.SetStateAction<WifiConfig>>;
  // Email
  emailConfig: EmailConfig;
  setEmailConfig: React.Dispatch<React.SetStateAction<EmailConfig>>;
  // Phone
  phoneConfig: PhoneConfig;
  setPhoneConfig: React.Dispatch<React.SetStateAction<PhoneConfig>>;
  // Validation feedback
  touched: boolean;
  setTouched: (touched: boolean) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
}

export function QRInput({
  type,
  textContent,
  setTextContent,
  wifiConfig,
  setWifiConfig,
  emailConfig,
  setEmailConfig,
  phoneConfig,
  setPhoneConfig,
  touched,
  setTouched,
  inputRef,
}: QRInputProps) {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  // URL validation check
  const isUrlValid = type === 'url' ? isValidUrl(textContent) : true;
  const isTextEmpty = textContent.trim().length === 0;

  return (
    <div className="space-y-4">
      {/* URL or Plain Text Mode */}
      {(type === 'url' || type === 'text') && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="qr-main-input"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              {type === 'url' ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Target URL</span>
                </>
              ) : (
                <span>Content to encode</span>
              )}
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {textContent.length} character{textContent.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="relative">
            {type === 'url' ? (
              <input
                id="qr-main-input"
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="url"
                value={textContent}
                onChange={(e) => {
                  setTextContent(e.target.value);
                  if (!touched) setTouched(true);
                }}
                onBlur={() => setTouched(true)}
                placeholder="https://example.com"
                className={`w-full px-3.5 py-3 rounded-xl text-sm bg-white dark:bg-slate-900 border transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                  touched && (isTextEmpty || !isUrlValid)
                    ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100'
                }`}
              />
            ) : (
              <textarea
                id="qr-main-input"
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                rows={4}
                value={textContent}
                onChange={(e) => {
                  setTextContent(e.target.value);
                  if (!touched) setTouched(true);
                }}
                onBlur={() => setTouched(true)}
                placeholder="Paste a URL or enter your text..."
                className={`w-full px-3.5 py-3 rounded-xl text-sm bg-white dark:bg-slate-900 border transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 resize-none ${
                  touched && isTextEmpty
                    ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100'
                }`}
              />
            )}
          </div>

          {/* Validation feedback */}
          {touched && isTextEmpty && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Enter something to generate a QR code.</span>
            </div>
          )}

          {touched && !isTextEmpty && type === 'url' && !isUrlValid && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Please enter a valid URL (e.g., https://yourdomain.com).</span>
            </div>
          )}
        </div>
      )}

      {/* Wi-Fi Configuration Mode */}
      {type === 'wifi' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Network Name (SSID)
            </label>
            <div className="relative">
              <input
                type="text"
                value={wifiConfig.ssid}
                onChange={(e) => {
                  setWifiConfig((prev) => ({ ...prev, ssid: e.target.value }));
                  if (!touched) setTouched(true);
                }}
                placeholder="Office-Guest-5G"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
              />
              <Wifi className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {wifiConfig.encryption !== 'nopass' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Wi-Fi Password
              </label>
              <div className="relative">
                <input
                  type={showWifiPassword ? 'text' : 'password'}
                  value={wifiConfig.password}
                  onChange={(e) => setWifiConfig((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Network password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showWifiPassword ? 'Hide password' : 'Show password'}
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Security Encryption
              </label>
              <select
                value={wifiConfig.encryption}
                onChange={(e) =>
                  setWifiConfig((prev) => ({
                    ...prev,
                    encryption: e.target.value as 'WPA' | 'WEP' | 'nopass',
                  }))
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:border-blue-500"
              >
                <option value="WPA">WPA/WPA2/WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="wifi-hidden"
                checked={wifiConfig.hidden}
                onChange={(e) => setWifiConfig((prev) => ({ ...prev, hidden: e.target.checked }))}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="wifi-hidden" className="text-xs text-slate-600 dark:text-slate-400">
                Hidden SSID
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Email Mode */}
      {type === 'email' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Recipient Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={emailConfig.email}
                onChange={(e) => {
                  setEmailConfig((prev) => ({ ...prev, email: e.target.value }));
                  if (!touched) setTouched(true);
                }}
                placeholder="contact@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Subject Line (Optional)
            </label>
            <input
              type="text"
              value={emailConfig.subject}
              onChange={(e) => setEmailConfig((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Inquiry about services"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Prefilled Message (Optional)
            </label>
            <textarea
              rows={3}
              value={emailConfig.body}
              onChange={(e) => setEmailConfig((prev) => ({ ...prev, body: e.target.value }))}
              placeholder="Hi there, I wanted to reach out regarding..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>
        </div>
      )}

      {/* Phone Mode */}
      {type === 'phone' && (
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phoneConfig.phone}
              onChange={(e) => {
                setPhoneConfig({ phone: e.target.value });
                if (!touched) setTouched(true);
              }}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            Include country code (e.g., +1 for US/Canada) for international compatibility.
          </p>
        </div>
      )}
    </div>
  );
}
