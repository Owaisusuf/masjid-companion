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

/**
 * Islamic month number → English name mapping.
 * Intl.DateTimeFormat with "islamic" calendar sometimes returns Gregorian month
 * names on certain browsers/locales. This explicit map prevents that.
 */
const ISLAMIC_MONTHS_EN: Record<number, string> = {
  1: "Muharram",
  2: "Safar",
  3: "Rabi al-Awwal",
  4: "Rabi al-Thani",
  5: "Jumada al-Ula",
  6: "Jumada al-Thani",
  7: "Rajab",
  8: "Shaban",
  9: "Ramadan",
  10: "Shawwal",
  11: "Dhul Qadah",
  12: "Dhul Hijjah",
};

const ISLAMIC_MONTHS_AR: Record<number, string> = {
  1: "مُحَرَّم",
  2: "صَفَر",
  3: "رَبيع الأوّل",
  4: "رَبيع الثاني",
  5: "جُمادى الأولى",
  6: "جُمادى الآخرة",
  7: "رَجَب",
  8: "شَعْبان",
  9: "رَمَضان",
  10: "شَوّال",
  11: "ذو القَعدة",
  12: "ذو الحِجّة",
};

function getHijriFromIntl(date: Date): HijriDate | null {
  try {
    // Use numeric parts to avoid locale-dependent month name issues
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      timeZone: MASJID_TIMEZONE,
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(date);

    const dayStr = parts.find((p) => p.type === "day")?.value;
    const monthStr = parts.find((p) => p.type === "month")?.value;
    const yearStr = parts.find((p) => p.type === "year")?.value;

    if (!dayStr || !monthStr || !yearStr) return null;

    const monthNum = parseInt(monthStr, 10);
    const monthEn = ISLAMIC_MONTHS_EN[monthNum] || monthStr;
    const monthAr = ISLAMIC_MONTHS_AR[monthNum] || "";

    return {
      day: dayStr,
      month: monthEn,
      monthAr,
      year: yearStr.replace(/\s*AH$/i, ""),
    };
  } catch {
    return null;
  }
}

function parseMasjidDateParts() {
  const iso = getMasjidISODate();
  const [yyyy, mm, dd] = iso.split("-");
  return { yyyy, mm, dd, iso };
}

async function fetchPrayerTimes(hijriDayOffset: number) {
  const { yyyy, mm, dd } = parseMasjidDateParts();

  const url =
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}` +
    `?latitude=${LAT}&longitude=${LNG}&method=1&school=0`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch prayer times");

  const data = await res.json();
  const t = data.data.timings;
  const g = data.data.date.gregorian;

  // Compute Hijri date locally with offset applied
  const baseISO = getMasjidISODate();
  const [y, m, d] = baseISO.split("-").map(Number);
  const base = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const shifted = new Date(base);
  shifted.setUTCDate(base.getUTCDate() + hijriDayOffset);

  const hijri = getHijriFromIntl(shifted) ?? {
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
