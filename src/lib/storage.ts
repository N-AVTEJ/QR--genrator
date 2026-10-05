import { HistoryItem } from '@/types/qr';

const STORAGE_KEY = 'qr_studio_history_v1';
const MAX_HISTORY_ITEMS = 25;

/**
 * Checks if localStorage is available and writable.
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__qr_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves all saved QR history items.
 */
export function getHistory(): HistoryItem[] {
  if (!isStorageAvailable()) return [];
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.warn('[QR Studio] Failed to read history from localStorage:', error);
    return [];
  }
}

/**
 * Saves a new QR history item, ensuring most recent is first.
 */
export function saveHistoryItem(item: HistoryItem): HistoryItem[] {
  if (!isStorageAvailable()) return [];
  try {
    const current = getHistory();
    // Filter out duplicate if same raw content and type exists, to keep history clean and fresh
    const filtered = current.filter(
      (entry) => !(entry.rawContent === item.rawContent && entry.type === item.type)
    );
    const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('[QR Studio] Failed to save history item to localStorage:', error);
    return [];
  }
}

/**
 * Removes a single item by id.
 */
export function deleteHistoryItem(id: string): HistoryItem[] {
  if (!isStorageAvailable()) return [];
  try {
    const current = getHistory();
    const updated = current.filter((item) => item.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('[QR Studio] Failed to delete history item:', error);
    return [];
  }
}

/**
 * Clears all history items.
 */
export function clearAllHistory(): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('[QR Studio] Failed to clear history:', error);
    return false;
  }
}
