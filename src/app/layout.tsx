import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QR Studio — Turn anything into a scannable QR code',
  description:
    'Create, customize, and download high-quality QR codes instantly. 100% private, free, and client-side.',
  keywords: [
    'QR Code Generator',
    'Custom QR Code',
    'Fast QR Generator',
    'Free QR Code',
    'High Resolution QR',
    'SVG QR Code',
  ],
  authors: [{ name: 'QR Studio' }],
  openGraph: {
    title: 'QR Studio — Turn anything into a scannable QR code',
    description:
      'Generate clean, high-quality QR codes from URLs, text, contact information, and more — instantly.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-[#090d14] text-[#090d16] dark:text-[#f1f5f9] selection:bg-blue-500 selection:text-white transition-colors duration-200">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
