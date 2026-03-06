import eventImage from "@/assets/event-deeni-ijtema.jpg";

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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  // Seed default
  const defaults = [DEFAULT_ANNOUNCEMENT];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveAnnouncements(announcements: Announcement[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
  window.dispatchEvent(new Event("storage"));
}

export function getActiveAnnouncements(): Announcement[] {
  const all = loadAnnouncements();
  const today = new Date().toISOString().slice(0, 10);
  return all.filter(a => a.active && a.startDate <= today && a.endDate >= today);
}

export function getDefaultAnnouncement(): Announcement {
  return {
    id: crypto.randomUUID?.() || String(Date.now()),
    title: "",
    titleUrdu: "",
    description: "",
    imageUrl: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    active: true,
  };
}
