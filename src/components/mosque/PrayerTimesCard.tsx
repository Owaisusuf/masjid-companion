import { useState, useEffect } from "react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useHijriAdjustment } from "@/hooks/useHijriAdjustment";
import { Clock, Moon, Sun, CloudSun, Sunset, Star, Calendar, Landmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [time, period] = time12.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function getNextPrayer(prayers: Record<string, string>, isJummah: boolean): string | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Build ordered list; on Friday insert Jummah between Fajr and Asr
  const order: string[] = isJummah
    ? ["Fajr", "Jummah", "Asr", "Maghrib", "Isha"]
    : ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  for (const key of order) {
    const time = prayers[key];
    if (time && parseTimeToMinutes(time) > nowMinutes) return key;
  }
  // All prayers passed → next is Fajr (tomorrow)
  return "Fajr";
}

function getTimeUntil(time12: string): string {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let targetMinutes = parseTimeToMinutes(time12);
  if (targetMinutes <= nowMinutes) targetMinutes += 24 * 60;
  const diff = targetMinutes - nowMinutes;
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
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  // Fetch prayer config from database on mount
  useEffect(() => {
    fetchPrayerConfig().then((config) => {
      const times = getActivePrayerTimesFromConfig(config);
      setMasjidTimes(times);
      const allTimes: Record<string, string> = { ...times };
      if (isJummahToday()) allTimes["Jummah"] = JUMMAH_TIME;
      setNextPrayer(getNextPrayer(allTimes, isJummahToday()));
    });
  }, []);

  // Subscribe to real-time changes from database
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

  // Update next prayer countdown every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      const allTimes: Record<string, string> = { ...masjidTimes };
      if (isJummahToday()) allTimes["Jummah"] = JUMMAH_TIME;
      setNextPrayer(getNextPrayer(allTimes, isJummahToday()));
    }, 30000);
    return () => clearInterval(timer);
  }, [masjidTimes]);

  const showJummah = isJummahToday();

  return (
    <section id="prayers" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Clock className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Prayer Times</h2>
        <span className="font-urdu text-sm text-muted-foreground">اوقاتِ نماز</span>
      </div>

      {data?.gregorian && data?.hijri ? (
        <div className="glass-card p-3 sm:p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
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
        <div className="glass-card p-4 mb-4">
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
      ) : null}

      {showJummah && (
        <div className="glass-card glow-primary p-3 mb-3 flex items-center justify-center gap-3">
          <Landmark className="w-5 h-5 text-primary shrink-0" />
          <div className="text-center">
            <p className="font-heading text-sm font-bold text-foreground">
              Jummah Mubarak — <span className="font-urdu text-accent">جمعہ مبارک</span>
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Jummah Prayer: <span className="font-semibold text-primary">{JUMMAH_TIME}</span>
            </p>
          </div>
        </div>
      )}

      <div
        className={`grid grid-cols-2 gap-2 sm:gap-3 ${showJummah ? "sm:grid-cols-6" : "sm:grid-cols-5"}`}
      >
        {prayerNames.map((p) => {
          const isNext = nextPrayer === p.key;
          const IconComp = p.Icon;
          const time = masjidTimes[p.key as keyof typeof masjidTimes];
          return (
            <div
              key={p.key}
              className={`glass-card p-3 sm:p-4 text-center transition-all duration-300 ${
                isNext ? "prayer-highlight glow-primary ring-1 ring-primary/30 scale-[1.02]" : "hover:shadow-md"
              } ${p.key === "Isha" && !showJummah ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <IconComp
                className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 ${isNext ? "text-primary" : "text-accent"}`}
              />
              <p className="font-urdu text-[10px] sm:text-xs text-muted-foreground mb-0.5" dir="rtl">
                {p.urdu}
              </p>
              <p className="font-heading font-semibold text-foreground text-xs mb-1">{p.label}</p>
              <p className={`font-body font-bold text-base sm:text-lg ${isNext ? "text-primary" : "text-foreground"}`}>
                {time}
              </p>
              {isNext && (
                <p className="text-[10px] text-primary font-body font-medium mt-1 animate-pulse-glow">
                  Next • {getTimeUntil(time)}
                </p>
              )}
            </div>
          );
        })}

        {showJummah && (
          <div
            className={`glass-card p-3 sm:p-4 text-center transition-all duration-300 col-span-2 sm:col-span-1 ${
              nextPrayer === "Jummah"
                ? "prayer-highlight glow-primary ring-1 ring-primary/30 scale-[1.02]"
                : "hover:shadow-md border-primary/20"
            }`}
          >
            <Landmark
              className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 ${nextPrayer === "Jummah" ? "text-primary" : "text-accent"}`}
            />
            <p className="font-urdu text-[10px] sm:text-xs text-muted-foreground mb-0.5" dir="rtl">
              جمعہ
            </p>
            <p className="font-heading font-semibold text-foreground text-xs mb-1">Jummah</p>
            <p
              className={`font-body font-bold text-base sm:text-lg ${
                nextPrayer === "Jummah" ? "text-primary" : "text-foreground"
              }`}
            >
              {JUMMAH_TIME}
            </p>
            {nextPrayer === "Jummah" && (
              <p className="text-[10px] text-primary font-body font-medium mt-1 animate-pulse-glow">
                Next • {getTimeUntil(JUMMAH_TIME)}
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-muted-foreground/50 mt-3 font-body">
        جامع مسجد شریف بَرزَلّہ سرینگر — Masjid Jama'at Schedule
      </p>
    </section>
  );
};

export default PrayerTimesCard;
