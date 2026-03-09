import eventImage from "@/assets/event-deeni-ijtema.jpg";
import { getLocalISODate } from "@/lib/localDate";

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

export function loadAnnouncements(): Announcement[] {
  let parsed: unknown = null;
  let storageOk = true;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) parsed = JSON.parse(raw);
  } catch {
    storageOk = false;
  }

  // If storage is blocked/unavailable, don't auto-seed defaults (prevents "reappearing" after delete).
  if (!storageOk) return [];

  // If storage exists and is an array (even empty), treat it as the source of truth.
  // This prevents deleted announcements from being re-seeded automatically.
  let announcements: Announcement[];
  if (Array.isArray(parsed)) {
    announcements = parsed as Announcement[];
  } else {
    announcements = [DEFAULT_ANNOUNCEMENT];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
    } catch {
      /* ignore */
    }
  }

  // Auto-cleanup expired announcements (runs even if popup isn't opened)
  const today = getLocalISODate();
  const cleaned = announcements.filter((a) => !a?.endDate || a.endDate >= today);
  if (cleaned.length !== announcements.length) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("masjid-announcements-changed"));
    } catch {
      /* ignore */
    }
    return cleaned;
  }

  return announcements;
}

export function saveAnnouncements(announcements: Announcement[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
  } catch {
    /* ignore */
  }
  // "storage" doesn't fire in the same tab on normal localStorage writes, so we dispatch our own.
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("masjid-announcements-changed"));
}

export function getActiveAnnouncements(): Announcement[] {
  const all = loadAnnouncements();
  const today = getLocalISODate();
  return all.filter((a) => a.active && a.startDate <= today && a.endDate >= today);
}

export function getDefaultAnnouncement(): Announcement {
  return {
    id: crypto.randomUUID?.() || String(Date.now()),
    title: "",
    titleUrdu: "",
    description: "",
    imageUrl: "",
    startDate: getLocalISODate(),
    endDate: getLocalISODate(new Date(Date.now() + 7 * 86400000)),
    active: true,
  };
}
