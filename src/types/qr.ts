export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRSize = 'small' | 'medium' | 'large';

export type QRMargin = 'small' | 'medium' | 'large';

export interface CustomizationOptions {
  size: QRSize;
  fgColor: string;
  bgColor: string;
  margin: QRMargin;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface WifiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface EmailConfig {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneConfig {
  phone: string;
}

export interface HistoryItem {
  id: string;
  type: QRType;
  rawContent: string;
  displayTitle: string;
  timestamp: number;
  dataUrl: string;
  options: CustomizationOptions;
}

export interface ContrastCheckResult {
  ratio: number;
  isReadable: boolean;
  warning?: string;
}
