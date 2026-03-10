import { getMasjidISODate } from "@/lib/localDate";
import { supabase } from "@/integrations/supabase/client";

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

/** Fetch prayer config from the database */
export async function fetchPrayerConfig(): Promise<PrayerConfig> {
  try {
    const { data, error } = await supabase
      .from("prayer_config")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return { mode: "auto", times: { ...defaultTimes } };
    }

    return {
      mode: (data.mode as "auto" | "manual") || "auto",
      times: {
        Fajr: data.fajr,
        Dhuhr: data.dhuhr,
        Asr: data.asr,
        Maghrib: data.maghrib,
        Isha: data.isha,
      },
    };
  } catch {
    return { mode: "auto", times: { ...defaultTimes } };
  }
}

/** Save prayer config to the database */
export async function savePrayerConfig(config: PrayerConfig): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("prayer_config")
      .update({
        mode: config.mode,
        fajr: config.times.Fajr,
        dhuhr: config.times.Dhuhr,
        asr: config.times.Asr,
        maghrib: config.times.Maghrib,
        isha: config.times.Isha,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    return !error;
  } catch {
    return false;
  }
}

/** Subscribe to real-time prayer config changes */
export function subscribeToPrayerConfig(
  callback: (config: PrayerConfig) => void
): () => void {
  const channel = supabase
    .channel("prayer_config_changes")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "prayer_config" },
      (payload) => {
        const data = payload.new;
        callback({
          mode: (data.mode as "auto" | "manual") || "auto",
          times: {
            Fajr: data.fajr,
            Dhuhr: data.dhuhr,
            Asr: data.asr,
            Maghrib: data.maghrib,
            Isha: data.isha,
          },
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Get active prayer times based on config */
export function getActivePrayerTimesFromConfig(config: PrayerConfig): PrayerConfig["times"] {
  if (config.mode === "manual") return config.times;
  return getDefaultAutoTimes();
}
