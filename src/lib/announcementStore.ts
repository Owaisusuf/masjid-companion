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

function persistAnnouncements(value: Announcement[]): boolean {
  try {
    return safeSetItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function loadAnnouncements(): Announcement[] {
  let parsed: unknown = null;

  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (raw !== null) parsed = JSON.parse(raw);
  } catch {
    // If parsing/storage is blocked, don't auto-seed defaults (prevents reappearing after delete).
    return [];
  }

  // If storage exists and is an array (even empty), treat it as the source of truth.
  // This prevents deleted announcements from being re-seeded automatically.
  let announcements: Announcement[];
  if (Array.isArray(parsed)) {
    announcements = parsed as Announcement[];
  } else {
    // Seed defaults only if we can actually write (Safari private mode can read but cannot write).
    const seeded = [DEFAULT_ANNOUNCEMENT];
    const ok = persistAnnouncements(seeded);
    if (!ok) return [];
    announcements = seeded;
  }

  // Auto-cleanup expired announcements (runs even if popup isn't opened)
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

export function saveAnnouncements(announcements: Announcement[]): void {
  const ok = persistAnnouncements(announcements);

  // If write fails (e.g., storage blocked), removing prevents default re-seed on next load.
  if (!ok) {
    safeRemoveItem(STORAGE_KEY);
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
