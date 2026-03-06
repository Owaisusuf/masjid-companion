const STORAGE_KEY = "masjid-prayer-config";

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
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  let asrTime = "4:45 PM";
  if (month > 3 || (month === 3 && day >= 15)) {
    asrTime = "4:50 PM";
  }
  return { ...defaultTimes, Asr: asrTime };
}

export function loadPrayerConfig(): PrayerConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { mode: "auto", times: getDefaultAutoTimes() };
}

export function savePrayerConfig(config: PrayerConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function getActivePrayerTimes(): PrayerConfig["times"] {
  const config = loadPrayerConfig();
  if (config.mode === "manual") return config.times;
  return getDefaultAutoTimes();
}
