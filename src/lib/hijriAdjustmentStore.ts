import { getLocalISODate } from "@/lib/localDate";

const STORAGE_KEY = "masjid-hijri-adjustment";

// India (incl. Kashmir) often follows a moon-sighting calendar that can be 1 day behind computed calendars.
export const DEFAULT_HIJRI_ADJUSTMENT_INDIA = -1;

export type HijriAdjustment = -2 | -1 | 0 | 1 | 2;

export function clampHijriAdjustment(value: number): HijriAdjustment {
  if (value <= -2) return -2;
  if (value === -1) return -1;
  if (value === 0) return 0;
  if (value === 1) return 1;
  return 2;
}

export function loadHijriAdjustment(): HijriAdjustment {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return DEFAULT_HIJRI_ADJUSTMENT_INDIA;
    const n = Number(raw);
    if (!Number.isFinite(n)) return DEFAULT_HIJRI_ADJUSTMENT_INDIA;
    return clampHijriAdjustment(n);
  } catch {
    return DEFAULT_HIJRI_ADJUSTMENT_INDIA;
  }
}

export function saveHijriAdjustment(value: number): void {
  const adj = clampHijriAdjustment(value);
  try {
    localStorage.setItem(STORAGE_KEY, String(adj));
    // Keep a timestamp to help debugging/time travel if needed.
    localStorage.setItem(`${STORAGE_KEY}:updatedAt`, getLocalISODate());
  } catch {
    /* ignore */
  }
  // Ensure same-tab UI updates.
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("masjid-hijri-adjustment-changed"));
}
