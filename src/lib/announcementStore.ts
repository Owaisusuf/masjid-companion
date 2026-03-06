export interface Announcement {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  imageUrl: string; // base64 or imported asset path
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  active: boolean;
}

const STORAGE_KEY = "masjid-announcements";

export function loadAnnouncements(): Announcement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
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
