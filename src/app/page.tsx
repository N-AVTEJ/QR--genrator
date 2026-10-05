'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { QRGenerator } from '@/components/QRGenerator';
import { History } from '@/components/History';
import { FeatureSection } from '@/components/FeatureSection';
import { HowItWorks } from '@/components/HowItWorks';
import { PrivacySection } from '@/components/PrivacySection';
import { Footer } from '@/components/Footer';
import { getHistory } from '@/lib/storage';
import { HistoryItem } from '@/types/qr';

export default function Home() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const generatorRef = useRef<HTMLDivElement | null>(null);

  const loadHistory = useCallback(() => {
    const items = getHistory();
    setHistoryItems(items);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleFocusGenerator = () => {
    const el = document.getElementById('qr-main-input');
    if (el) {
      el.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar onFocusInput={handleFocusGenerator} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Banner */}
        <Hero />

        {/* Interactive QR Generator Studio Workspace */}
        <QRGenerator
          generatorRef={generatorRef}
          onHistoryChange={loadHistory}
        />

        {/* History Section */}
        <History
          items={historyItems}
          onRefreshHistory={loadHistory}
        />

        {/* Landing Page Features */}
        <FeatureSection />

        {/* How It Works Walkthrough */}
        <HowItWorks />

        {/* Privacy Trust Section */}
        <PrivacySection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
