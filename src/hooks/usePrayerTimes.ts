import { useQuery } from "@tanstack/react-query";

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

function formatTo12Hour(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

async function fetchPrayerTimes() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${LAT}&longitude=${LNG}&method=1&school=1`
  );

  if (!res.ok) throw new Error("Failed to fetch prayer times");
  const data = await res.json();
  const t = data.data.timings;
  const h = data.data.date.hijri;

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
  };
}

export function usePrayerTimes() {
  return useQuery({
    queryKey: ["prayerTimes"],
    queryFn: fetchPrayerTimes,
    staleTime: 1000 * 60 * 60 * 6,
    retry: 2,
  });
}
