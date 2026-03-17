import { useState, useEffect } from "react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useHijriAdjustment } from "@/hooks/useHijriAdjustment";
import { Clock, Moon, Sun, CloudSun, Sunset, Star, Calendar, Landmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MASJID_TIMEZONE } from "@/lib/localDate";
import {
  fetchPrayerConfig,
  subscribeToPrayerConfig,
  getActivePrayerTimesFromConfig,
  getDefaultAutoTimes,
  type PrayerConfig,
} from "@/lib/prayerStore";

const prayerNames = [
  { key: "Fajr", label: "Fajr", urdu: "فجر", Icon: Moon },
  { key: "Dhuhr", label: "Zuhr", urdu: "ظہر", Icon: Sun },
  { key: "Asr", label: "Asr", urdu: "عصر", Icon: CloudSun },
  { key: "Maghrib", label: "Maghrib", urdu: "مغرب", Icon: Sunset },
  { key: "Isha", label: "Isha", urdu: "عشاء", Icon: Star },
];

function parseTimeToMinutes(time12: string): number {
  if (!time12 || typeof time12 !== "string") return -1;
  // Normalize: handle "5:40AM" (no space) and "5:40 AM" (with space)
  const normalized = time12.trim().replace(/(\d)(AM|PM)/i, "$1 $2");
  const parts = normalized.split(" ");
  if (parts.length < 2) return -1;
  const [time, period] = parts;
  const timeParts = time.split(":").map(Number);
  if (timeParts.length < 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) return -1;
  let [h, m] = timeParts;
  if (period?.toUpperCase() === "PM" && h !== 12) h += 12;
  if (period?.toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/** Get current minutes in the masjid's timezone (IST) */
function getNowMinutesMasjid(): number {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MASJID_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  let h = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10);
  if (h === 24) h = 0; // Some browsers return 24 for midnight
  const m = parseInt(parts.find(p => p.type === "minute")?.value || "0", 10);
  return h * 60 + m;
}

function getNextPrayer(prayers: Record<string, string>, isJummah: boolean): string | null {
  const nowMinutes = getNowMinutesMasjid();

  const order: string[] = isJummah
    ? ["Fajr", "Jummah", "Asr", "Maghrib", "Isha"]
    : ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  for (const key of order) {
    const time = prayers[key];
    if (!time) continue;
    const mins = parseTimeToMinutes(time);
    if (mins < 0) continue;
    if (mins > nowMinutes) return key;
  }
  return "Fajr";
}

function getTimeUntil(time12: string): string {
  const targetMinutes = parseTimeToMinutes(time12);
  if (targetMinutes < 0) return "";
  const nowMinutes = getNowMinutesMasjid();
  let diff = targetMinutes - nowMinutes;
  if (diff <= 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function isJummahToday(): boolean {
  return new Date().getDay() === 5;
}

const JUMMAH_TIME = "1:30 PM";

const PrayerTimesCard = () => {
  const { adjustment } = useHijriAdjustment();
  const { data, isLoading } = usePrayerTimes(adjustment);
  const [masjidTimes, setMasjidTimes] = useState(getDefaultAutoTimes());
  const [nextPrayer, setNextPrayer] = useState<string | null>(() => {
    const times = getDefaultAutoTimes();
    const allTimes: Record<string, string> = { ...times };
    if (isJummahToday()) allTimes["Jummah"] = JUMMAH_TIME;
    return getNextPrayer(allTimes, isJummahToday());
  });

  useEffect(() => {
    fetchPrayerConfig().then((config) => {
      const times = getActivePrayerTimesFromConfig(config);
      setMasjidTimes(times);
      const allTimes: Record<string, string> = { ...times };
      if (isJummahToday()) allTimes["Jummah"] = JUMMAH_TIME;
      setNextPrayer(getNextPrayer(allTimes, isJummahToday()));
    });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPrayerConfig((config) => {
      const times = getActivePrayerTimesFromConfig(config);
      setMasjidTimes(times);
      const allTimes: Record<string, string> = { ...times };
      if (isJummahToday()) allTimes["Jummah"] = JUMMAH_TIME;
      setNextPrayer(getNextPrayer(allTimes, isJummahToday()));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const allTimes: Record<string, string> = { ...masjidTimes };
      if (isJummahToday()) allTimes["Jummah"] = JUMMAH_TIME;
      setNextPrayer(getNextPrayer(allTimes, isJummahToday()));
    }, 30000);
    return () => clearInterval(timer);
  }, [masjidTimes]);

  const showJummah = isJummahToday();
  const jummahIsNext = nextPrayer === "Jummah";

  return (
    <section id="prayers" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Clock className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Prayer Times</h2>
        <span className="font-urdu text-sm text-muted-foreground">اوقاتِ نماز</span>
      </div>

      {data?.gregorian && data?.hijri ? (
        <div className="glass-card p-3 sm:p-4 mb-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span className="font-heading font-semibold text-foreground">
              {data.gregorian.weekday}, {data.gregorian.day} {data.gregorian.month} {data.gregorian.year}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="font-heading font-semibold text-primary">
              {data.hijri.day} {data.hijri.month} {data.hijri.year} AH
            </span>
            <span className="font-arabic text-accent text-sm">— {data.hijri.monthAr}</span>
          </div>
        </div>
      ) : isLoading ? (
        <div className="glass-card p-4 mb-3">
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
      ) : null}

      {/* Jummah banner - only shown on Friday, highlighted when next */}
      {showJummah && (
        <div className={`glass-card p-3 mb-3 flex items-center justify-center gap-3 transition-all ${
          jummahIsNext ? "glow-primary ring-1 ring-primary/30 bg-primary/10 border-primary/30" : ""
        }`}>
          <Landmark className={`w-5 h-5 shrink-0 ${jummahIsNext ? "text-primary" : "text-accent"}`} />
          <div className="text-center">
            <p className="font-heading text-sm font-bold text-foreground">
              Jummah Mubarak — <span className="font-urdu text-accent">جمعہ مبارک</span>
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Jummah Prayer: <span className={`font-semibold ${jummahIsNext ? "text-primary" : "text-foreground"}`}>{JUMMAH_TIME}</span>
              {jummahIsNext && (
                <span className="text-primary font-medium ml-2 animate-pulse-glow">
                  Next • {getTimeUntil(JUMMAH_TIME)}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Prayer grid - always 5 columns, no Jummah card */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-5">
        {prayerNames.map((p) => {
          // On Friday, skip highlighting Dhuhr if Jummah is next
          const isNext = nextPrayer === p.key && !(showJummah && jummahIsNext && p.key === "Dhuhr");
          const IconComp = p.Icon;
          const time = masjidTimes[p.key as keyof typeof masjidTimes];
          const timeUntil = isNext && time ? getTimeUntil(time) : "";

          return (
            <div
              key={p.key}
              className={`glass-card p-3 sm:p-4 text-center transition-all duration-300 ${
                isNext ? "prayer-highlight glow-primary ring-1 ring-primary/30 scale-[1.02]" : "hover:shadow-md"
              } ${p.key === "Isha" ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <IconComp
                className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 ${isNext ? "text-primary" : "text-accent"}`}
              />
              <p className="font-urdu text-[10px] sm:text-xs text-muted-foreground mb-0.5" dir="rtl">
                {p.urdu}
              </p>
              <p className="font-heading font-semibold text-foreground text-xs mb-1">{p.label}</p>
              <p className={`font-body font-bold text-base sm:text-lg ${isNext ? "text-primary" : "text-foreground"}`}>
                {time || "—"}
              </p>
              {isNext && timeUntil && (
                <p className="text-[10px] text-primary font-body font-medium mt-1 animate-pulse-glow">
                  Next • {timeUntil}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-[10px] text-muted-foreground/50 mt-3 font-body">
        جامع مسجد شریف بَرزَلّہ سرینگر — Masjid Jama'at Schedule
      </p>
    </section>
  );
};

export default PrayerTimesCard;
