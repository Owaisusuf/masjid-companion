import { getMasjidISODate } from "@/lib/localDate";
import { compactStoredAnnouncements } from "@/lib/announcementStore";
import { emitSameTabStorageEvents, safeGetItem, safeSetItem } from "@/lib/safeStorage";
import { broadcastSync } from "@/lib/syncBus";

const STORAGE_KEY = "masjid-prayer-config";
const CHANGE_EVENT = "masjid-prayer-config-changed";

export interface PrayerConfig {
  mode: "auto" | "manual";
  times: {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
}

const defaultTimes: PrayerConfig["times"] = {
  Fajr: "5:55 AM",
  Dhuhr: "1:15 PM",
  Asr: "4:45 PM",
  Maghrib: "6:43 PM",
  Isha: "8:10 PM",
};

export function getDefaultAutoTimes(): PrayerConfig["times"] {
  // Use masjid timezone to avoid off-by-one day issues for users outside India.
  const iso = getMasjidISODate();
  const [, mm, dd] = iso.split("-").map(Number);
  const month = mm;
  const day = dd;

  let asrTime = "4:45 PM";
  if (month > 3 || (month === 3 && day >= 15)) {
    asrTime = "4:50 PM";
  }
  return { ...defaultTimes, Asr: asrTime };
}

export function loadPrayerConfig(): PrayerConfig {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { mode: "auto", times: { ...defaultTimes } };
}

export function savePrayerConfig(config: PrayerConfig) {
  try {
    safeSetItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
  emitSameTabStorageEvents(CHANGE_EVENT);
  broadcastSync("prayer");
}

export function getActivePrayerTimes(): PrayerConfig["times"] {
  const config = loadPrayerConfig();
  if (config.mode === "manual") return config.times;
  return getDefaultAutoTimes();
}
