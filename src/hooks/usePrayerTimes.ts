import { useQuery } from "@tanstack/react-query";
import { getMasjidISODate, MASJID_TIMEZONE } from "@/lib/localDate";
import { DEFAULT_HIJRI_ADJUSTMENT_INDIA } from "@/lib/hijriAdjustmentStore";

const LAT = 34.0522129;
const LNG = 74.7997336;

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface HijriDate {
  day: string;
  month: string;
  monthAr: string;
  year: string;
}

export interface GregorianDate {
  day: string;
  month: string;
  year: string;
  weekday: string;
}

function formatTo12Hour(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function getHijriFromIntl(date: Date): HijriDate | null {
  try {
    // Force masjid timezone so the Hijri day doesn't drift for users outside India.
    const en = new Intl.DateTimeFormat("en-u-ca-islamic", {
      timeZone: MASJID_TIMEZONE,
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).formatToParts(date);

    const ar = new Intl.DateTimeFormat("ar-u-ca-islamic", {
      timeZone: MASJID_TIMEZONE,
      month: "long",
    }).formatToParts(date);

    const day = en.find((p) => p.type === "day")?.value;
    const month = en.find((p) => p.type === "month")?.value;
    const year = en.find((p) => p.type === "year")?.value;
    const monthAr = ar.find((p) => p.type === "month")?.value;

    if (!day || !month || !year || !monthAr) return null;
    return { day, month, monthAr, year };
  } catch {
    return null;
  }
}

function parseMasjidDateParts() {
  const iso = getMasjidISODate(); // YYYY-MM-DD in Asia/Kolkata
  const [yyyy, mm, dd] = iso.split("-");
  return { yyyy, mm, dd, iso };
}

async function fetchPrayerTimes(hijriDayOffset: number) {
  const { yyyy, mm, dd } = parseMasjidDateParts();

  // Prayer timings are computed for the masjid location; Hijri is computed locally (Intl) so we can reliably apply offset.
  const url =
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}` +
    `?latitude=${LAT}&longitude=${LNG}&method=1&school=0`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch prayer times");

  const data = await res.json();
  const t = data.data.timings;
  const g = data.data.date.gregorian;

  // Apply Hijri offset by shifting the Gregorian day, then formatting in Islamic calendar.
  const base = new Date();
  const shifted = new Date(base);
  shifted.setDate(base.getDate() + hijriDayOffset);
  const hijri = getHijriFromIntl(shifted) ?? {
    // Fallback to API if Intl calendar isn't supported.
    day: data.data.date.hijri.day,
    month: data.data.date.hijri.month.en,
    monthAr: data.data.date.hijri.month.ar,
    year: data.data.date.hijri.year,
  };

  return {
    prayers: {
      Fajr: formatTo12Hour(t.Fajr),
      Sunrise: formatTo12Hour(t.Sunrise),
      Dhuhr: formatTo12Hour(t.Dhuhr),
      Asr: formatTo12Hour(t.Asr),
      Maghrib: formatTo12Hour(t.Maghrib),
      Isha: formatTo12Hour(t.Isha),
    } as PrayerTimesData,
    hijri,
    gregorian: {
      day: g.day,
      month: g.month.en,
      year: g.year,
      weekday: g.weekday.en,
    } as GregorianDate,
  };
}

export function usePrayerTimes(hijriDayOffset: number = DEFAULT_HIJRI_ADJUSTMENT_INDIA) {
  const todayMasjid = getMasjidISODate();

  return useQuery({
    queryKey: ["prayerTimes", todayMasjid, hijriDayOffset],
    queryFn: () => fetchPrayerTimes(hijriDayOffset),
    staleTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 30,
    refetchIntervalInBackground: true,
    retry: 2,
  });
}

