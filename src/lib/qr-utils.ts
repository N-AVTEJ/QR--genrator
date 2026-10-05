import QRCode from 'qrcode';
import { CustomizationOptions, WifiConfig, EmailConfig, PhoneConfig, ContrastCheckResult } from '@/types/qr';

export const MARGIN_MAP: Record<CustomizationOptions['margin'], number> = {
  small: 1,
  medium: 2,
  large: 4,
};

export const SIZE_DISPLAY_MAP: Record<CustomizationOptions['size'], number> = {
  small: 200,
  medium: 280,
  large: 360,
};

export const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
  size: 'medium',
  fgColor: '#090D16',
  bgColor: '#FFFFFF',
  margin: 'medium',
  errorCorrectionLevel: 'M',
};

/**
 * Validates whether a string is a standard URL.
 */
export function isValidUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`);
    return url.hostname.includes('.');
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL if user omitted the protocol.
 */
export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Formats Wi-Fi credentials into standard MeCard/ZXing format.
 */
export function formatWifiPayload(config: WifiConfig): string {
  const escape = (v: string) => v.replace(/([\\;,:"])/g, '\\$1');
  const t = config.encryption === 'nopass' ? 'nopass' : config.encryption;
  const s = escape(config.ssid);
  const p = config.encryption === 'nopass' ? '' : escape(config.password);
  const h = config.hidden ? 'H:true;' : '';
  return `WIFI:T:${t};S:${s};P:${p};${h};`;
}

/**
 * Formats email data into mailto URI.
 */
export function formatEmailPayload(config: EmailConfig): string {
  const params = new URLSearchParams();
  if (config.subject) params.set('subject', config.subject);
  if (config.body) params.set('body', config.body);
  const query = params.toString();
  return `mailto:${config.email}${query ? `?${query}` : ''}`;
}

/**
 * Formats phone number into tel URI.
 */
export function formatPhonePayload(config: PhoneConfig): string {
  const cleaned = config.phone.trim().replace(/\s+/g, '');
  return `tel:${cleaned}`;
}

/**
 * Calculates luminance for WCAG contrast ratio check.
 */
function getLuminance(hex: string): number {
  const sanitized = hex.replace('#', '');
  if (sanitized.length !== 6) return 0;
  const r = parseInt(sanitized.substring(0, 2), 16) / 255;
  const g = parseInt(sanitized.substring(2, 4), 16) / 255;
  const b = parseInt(sanitized.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Checks contrast ratio between foreground and background.
 */
export function checkContrast(fgHex: string, bgHex: string): ContrastCheckResult {
  try {
    const l1 = getLuminance(fgHex);
    const l2 = getLuminance(bgHex);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    if (ratio < 2.5) {
      return {
        ratio: Math.round(ratio * 10) / 10,
        isReadable: false,
        warning: 'Warning: Very low contrast. Many cameras may fail to read this QR code.',
      };
    }

    if (ratio < 4.0) {
      return {
        ratio: Math.round(ratio * 10) / 10,
        isReadable: true,
        warning: 'Sub-optimal contrast. Higher contrast is recommended for quick scanning.',
      };
    }

    return {
      ratio: Math.round(ratio * 10) / 10,
      isReadable: true,
    };
  } catch {
    return { ratio: 21, isReadable: true };
  }
}

/**
 * Generates a PNG Data URL using qrcode.
 */
export async function generateQRDataURL(
  text: string,
  options: CustomizationOptions,
  width?: number
): Promise<string> {
  const margin = MARGIN_MAP[options.margin];
  const targetWidth = width || SIZE_DISPLAY_MAP[options.size];

  return QRCode.toDataURL(text, {
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin,
    width: targetWidth,
    color: {
      dark: options.fgColor,
      light: options.bgColor,
    },
  });
}

/**
 * Generates an SVG string using qrcode.
 */
export async function generateQRSVG(
  text: string,
  options: CustomizationOptions
): Promise<string> {
  const margin = MARGIN_MAP[options.margin];
  const targetWidth = SIZE_DISPLAY_MAP[options.size];

  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin,
    width: targetWidth,
    color: {
      dark: options.fgColor,
      light: options.bgColor,
    },
  });
}

/**
 * Formats relative timestamp for history cards.
 */
export function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
