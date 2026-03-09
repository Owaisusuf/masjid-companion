import { useQuery } from "@tanstack/react-query";
import { getLocalISODate } from "@/lib/localDate";
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

async function fetchPrayerTimes(hijriDateAdjustment: number) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  // NOTE: `hijriDateAdjustment` affects Hijri date only; it does NOT shift prayer timings.
  const url =
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}` +
    `?latitude=${LAT}&longitude=${LNG}&method=1&school=0&hijriDateAdjustment=${hijriDateAdjustment}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch prayer times");

  const data = await res.json();
  const t = data.data.timings;
  const h = data.data.date.hijri;
  const g = data.data.date.gregorian;

  return {
    prayers: {
      Fajr: formatTo12Hour(t.Fajr),
      Sunrise: formatTo12Hour(t.Sunrise),
      Dhuhr: formatTo12Hour(t.Dhuhr),
      Asr: formatTo12Hour(t.Asr),
      Maghrib: formatTo12Hour(t.Maghrib),
      Isha: formatTo12Hour(t.Isha),
    } as PrayerTimesData,
    hijri: {
      day: h.day,
      month: h.month.en,
      monthAr: h.month.ar,
      year: h.year,
    } as HijriDate,
    gregorian: {
      day: g.day,
      month: g.month.en,
      year: g.year,
      weekday: g.weekday.en,
    } as GregorianDate,
  };
}

export function usePrayerTimes(hijriDateAdjustment: number = DEFAULT_HIJRI_ADJUSTMENT_INDIA) {
  const todayLocal = getLocalISODate();

  return useQuery({
    queryKey: ["prayerTimes", todayLocal, hijriDateAdjustment],
    queryFn: () => fetchPrayerTimes(hijriDateAdjustment),
    staleTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 30,
    refetchIntervalInBackground: true,
    retry: 2,
  });
}

