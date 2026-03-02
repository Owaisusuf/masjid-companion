export interface RamadanDay {
  day: number;
  date: string; // YYYY-MM-DD
  dayName: string;
  dayNameUrdu: string;
  sehri: string;
  iftar: string;
}

export const ramadanSchedule: RamadanDay[] = [
  { day: 1,  date: "2026-02-19", dayName: "Thursday",  dayNameUrdu: "جمعرات", sehri: "05:49 AM", iftar: "06:21 PM" },
  { day: 2,  date: "2026-02-20", dayName: "Friday",    dayNameUrdu: "جمعہ",   sehri: "05:48 AM", iftar: "06:22 PM" },
  { day: 3,  date: "2026-02-21", dayName: "Saturday",  dayNameUrdu: "سنیچر",  sehri: "05:47 AM", iftar: "06:23 PM" },
  { day: 4,  date: "2026-02-22", dayName: "Sunday",    dayNameUrdu: "اتوار",  sehri: "05:46 AM", iftar: "06:24 PM" },
  { day: 5,  date: "2026-02-23", dayName: "Monday",    dayNameUrdu: "پیر",    sehri: "05:45 AM", iftar: "06:24 PM" },
  { day: 6,  date: "2026-02-24", dayName: "Tuesday",   dayNameUrdu: "منگل",   sehri: "05:44 AM", iftar: "06:25 PM" },
  { day: 7,  date: "2026-02-25", dayName: "Wednesday", dayNameUrdu: "بدھ",    sehri: "05:42 AM", iftar: "06:26 PM" },
  { day: 8,  date: "2026-02-26", dayName: "Thursday",  dayNameUrdu: "جمعرات", sehri: "05:41 AM", iftar: "06:27 PM" },
  { day: 9,  date: "2026-02-27", dayName: "Friday",    dayNameUrdu: "جمعہ",   sehri: "05:40 AM", iftar: "06:28 PM" },
  { day: 10, date: "2026-02-28", dayName: "Saturday",  dayNameUrdu: "سنیچر",  sehri: "05:39 AM", iftar: "06:29 PM" },
  { day: 11, date: "2026-03-01", dayName: "Sunday",    dayNameUrdu: "اتوار",  sehri: "05:38 AM", iftar: "06:30 PM" },
  { day: 12, date: "2026-03-02", dayName: "Monday",    dayNameUrdu: "پیر",    sehri: "05:38 AM", iftar: "06:30 PM" },
  { day: 13, date: "2026-03-03", dayName: "Tuesday",   dayNameUrdu: "منگل",   sehri: "05:37 AM", iftar: "06:31 PM" },
  { day: 14, date: "2026-03-04", dayName: "Wednesday", dayNameUrdu: "بدھ",    sehri: "05:36 AM", iftar: "06:32 PM" },
  { day: 15, date: "2026-03-05", dayName: "Thursday",  dayNameUrdu: "جمعرات", sehri: "05:34 AM", iftar: "06:32 PM" },
  { day: 16, date: "2026-03-06", dayName: "Friday",    dayNameUrdu: "جمعہ",   sehri: "05:33 AM", iftar: "06:33 PM" },
  { day: 17, date: "2026-03-07", dayName: "Saturday",  dayNameUrdu: "سنیچر",  sehri: "05:31 AM", iftar: "06:34 PM" },
  { day: 18, date: "2026-03-08", dayName: "Sunday",    dayNameUrdu: "اتوار",  sehri: "05:30 AM", iftar: "06:34 PM" },
  { day: 19, date: "2026-03-09", dayName: "Monday",    dayNameUrdu: "پیر",    sehri: "05:28 AM", iftar: "06:35 PM" },
  { day: 20, date: "2026-03-10", dayName: "Tuesday",   dayNameUrdu: "منگل",   sehri: "05:27 AM", iftar: "06:36 PM" },
  { day: 21, date: "2026-03-11", dayName: "Wednesday", dayNameUrdu: "بدھ",    sehri: "05:26 AM", iftar: "06:37 PM" },
  { day: 22, date: "2026-03-12", dayName: "Thursday",  dayNameUrdu: "جمعرات", sehri: "05:25 AM", iftar: "06:38 PM" },
  { day: 23, date: "2026-03-13", dayName: "Friday",    dayNameUrdu: "جمعہ",   sehri: "05:24 AM", iftar: "06:38 PM" },
  { day: 24, date: "2026-03-14", dayName: "Saturday",  dayNameUrdu: "سنیچر",  sehri: "05:23 AM", iftar: "06:39 PM" },
  { day: 25, date: "2026-03-15", dayName: "Sunday",    dayNameUrdu: "اتوار",  sehri: "05:20 AM", iftar: "06:40 PM" },
  { day: 26, date: "2026-03-16", dayName: "Monday",    dayNameUrdu: "پیر",    sehri: "05:19 AM", iftar: "06:41 PM" },
  { day: 27, date: "2026-03-17", dayName: "Tuesday",   dayNameUrdu: "منگل",   sehri: "05:18 AM", iftar: "06:42 PM" },
  { day: 28, date: "2026-03-18", dayName: "Wednesday", dayNameUrdu: "بدھ",    sehri: "05:15 AM", iftar: "06:43 PM" },
  { day: 29, date: "2026-03-19", dayName: "Thursday",  dayNameUrdu: "جمعرات", sehri: "05:15 AM", iftar: "06:43 PM" },
  { day: 30, date: "2026-03-20", dayName: "Friday",    dayNameUrdu: "جمعہ",   sehri: "05:14 AM", iftar: "06:44 PM" },
];

export function getTodayRamadan(): RamadanDay | null {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  return ramadanSchedule.find((d) => d.date === todayStr) || null;
}

export function isRamadan(): boolean {
  const today = new Date();
  const start = new Date("2026-02-19");
  const end = new Date("2026-03-20");
  return today >= start && today <= end;
}
