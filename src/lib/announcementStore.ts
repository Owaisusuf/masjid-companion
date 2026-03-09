import eventImage from "@/assets/event-deeni-ijtema.jpg";
import { getMasjidISODate } from "@/lib/localDate";
import { emitSameTabStorageEvents, safeGetItem, safeRemoveItem, safeSetItem } from "@/lib/safeStorage";
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

const DEFAULT_ANNOUNCEMENT: Announcement = {
  id: "deeni-ijtema-2026",
  title: "Deeni Ijtema — دینی اجتماع",
  titleUrdu: "بروز اتوار بعد نماز عصر تا مغرب — جامع مسجد اولڈ برزلہ",
  description: "Sunday, 8th March 2026 — After Asr Prayer at Jamia Masjid Old Barzallah",
  imageUrl: eventImage,
  startDate: "2026-03-06",
  endDate: "2026-03-09",
  active: true,
};

/**
 * Persist announcements to storage.
 * If payload is too large (base64 images), strips imageUrl fields and retries.
 */
function persistAnnouncements(value: Announcement[]): boolean {
  try {
    const json = JSON.stringify(value);
    const ok = safeSetItem(STORAGE_KEY, json);
    if (ok) return true;

    // Likely quota exceeded — strip base64 images (data: URLs) and retry
    const stripped = value.map((a) => ({
      ...a,
      imageUrl: a.imageUrl.startsWith("data:") ? "" : a.imageUrl,
    }));
    const json2 = JSON.stringify(stripped);
    const ok2 = safeSetItem(STORAGE_KEY, json2);
    if (ok2) {
      console.warn("[announcements] Images stripped due to storage quota.");
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function loadAnnouncements(): Announcement[] {
  let raw: string | null = null;

  try {
    raw = safeGetItem(STORAGE_KEY);
  } catch {
    return [];
  }

  // Key exists in storage (even if value is "[]") → use it as source of truth.
  // This prevents deleted announcements from being re-seeded.
  if (raw !== null) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }

    if (!Array.isArray(parsed)) return [];

    const announcements = parsed as Announcement[];

    // Auto-cleanup expired announcements
    const today = getMasjidISODate();
    const cleaned = announcements.filter((a) => !a?.endDate || a.endDate >= today);
    if (cleaned.length !== announcements.length) {
      persistAnnouncements(cleaned);
      emitSameTabStorageEvents(CHANGE_EVENT);
      broadcastSync("announcements");
      return cleaned;
    }

    return announcements;
  }

  // No key at all → first visit, seed defaults
  const seeded = [DEFAULT_ANNOUNCEMENT];
  const ok = persistAnnouncements(seeded);
  if (!ok) return [];
  return seeded;
}

export function saveAnnouncements(announcements: Announcement[]): void {
  const ok = persistAnnouncements(announcements);

  if (!ok) {
    // Last resort: save empty array so defaults don't re-seed
    try {
      safeSetItem(STORAGE_KEY, "[]");
    } catch {
      // truly blocked
    }
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
