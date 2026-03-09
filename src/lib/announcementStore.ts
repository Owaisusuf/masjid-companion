import { getMasjidISODate } from "@/lib/localDate";
import {
  emitSameTabStorageEvents,
  getStorageBackend,
  safeGetItem,
  safeSetItem,
} from "@/lib/safeStorage";
import { broadcastSync } from "@/lib/syncBus";

export interface Announcement {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

const STORAGE_KEY = "masjid-announcements";
const CHANGE_EVENT = "masjid-announcements-changed";

function persistAnnouncements(value: Announcement[]): boolean {
  try {
    const json = JSON.stringify(value);
    const ok = safeSetItem(STORAGE_KEY, json);
    if (ok) return true;

    // Quota fallback: strip base64 payloads and retry with lightweight records.
    const stripped = value.map((a) => ({
      ...a,
      imageUrl: a.imageUrl.startsWith("data:") ? "" : a.imageUrl,
    }));

    return safeSetItem(STORAGE_KEY, JSON.stringify(stripped));
  } catch {
    return false;
  }
}

function normalizeAnnouncements(input: unknown): Announcement[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((a): a is Announcement => Boolean(a && typeof a === "object"))
    .map((a) => ({
      id: String(a.id ?? crypto.randomUUID?.() ?? Date.now()),
      title: String(a.title ?? ""),
      titleUrdu: String(a.titleUrdu ?? ""),
      description: String(a.description ?? ""),
      imageUrl: String(a.imageUrl ?? ""),
      startDate: String(a.startDate ?? getMasjidISODate()),
      endDate: String(a.endDate ?? getMasjidISODate()),
      active: Boolean(a.active),
    }));
}

export function loadAnnouncements(): Announcement[] {
  let raw: string | null = null;

  try {
    raw = safeGetItem(STORAGE_KEY);
  } catch {
    return [];
  }

  // No seed: avoid deleted events reappearing on refresh/devices with restricted storage.
  if (raw === null) {
    // Best effort initialization for persistent backends only.
    if (getStorageBackend() !== "memory") {
      safeSetItem(STORAGE_KEY, "[]");
    }
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    safeSetItem(STORAGE_KEY, "[]");
    return [];
  }

  const announcements = normalizeAnnouncements(parsed);

  // Auto-cleanup expired announcements
  const today = getMasjidISODate();
  const cleaned = announcements.filter((a) => !a?.endDate || a.endDate >= today);
  if (cleaned.length !== announcements.length) {
    persistAnnouncements(cleaned);
    emitSameTabStorageEvents(CHANGE_EVENT);
    broadcastSync("announcements");
    return cleaned;
  }

  return cleaned;
}

export function saveAnnouncements(announcements: Announcement[]): void {
  const ok = persistAnnouncements(announcements);

  if (!ok && getStorageBackend() !== "memory") {
    // Last resort to avoid stale old values when write fails.
    safeSetItem(STORAGE_KEY, "[]");
  }

  emitSameTabStorageEvents(CHANGE_EVENT);
  broadcastSync("announcements");
}

export function getActiveAnnouncements(): Announcement[] {
  const all = loadAnnouncements();
  const today = getMasjidISODate();
  return all.filter((a) => a.active && a.startDate <= today && a.endDate >= today);
}

export function getDefaultAnnouncement(): Announcement {
  return {
    id: crypto.randomUUID?.() || String(Date.now()),
    title: "",
    titleUrdu: "",
    description: "",
    imageUrl: "",
    startDate: getMasjidISODate(),
    endDate: getMasjidISODate(new Date(Date.now() + 7 * 86400000)),
    active: true,
  };
}

