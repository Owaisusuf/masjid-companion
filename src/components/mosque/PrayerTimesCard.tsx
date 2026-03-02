import { useState, useEffect } from "react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const prayerNames: { key: string; label: string; urdu: string; icon: string }[] = [
  { key: "Fajr", label: "Fajr", urdu: "فجر", icon: "🌙" },
  { key: "Sunrise", label: "Sunrise", urdu: "طلوع", icon: "🌅" },
  { key: "Dhuhr", label: "Dhuhr", urdu: "ظہر", icon: "☀️" },
  { key: "Asr", label: "Asr", urdu: "عصر", icon: "🌤" },
  { key: "Maghrib", label: "Maghrib", urdu: "مغرب", icon: "🌇" },
  { key: "Isha", label: "Isha", urdu: "عشاء", icon: "🌃" },
];

function parseTimeToMinutes(time12: string): number {
  const [time, period] = time12.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function getNextPrayer(prayers: Record<string, string>): string | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  for (const key of order) {
    if (prayers[key] && parseTimeToMinutes(prayers[key]) > nowMinutes) return key;
  }
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

const PrayerTimesCard = () => {
  const { data, isLoading, isError } = usePrayerTimes();
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.prayers) return;
    const update = () => setNextPrayer(getNextPrayer(data.prayers as unknown as Record<string, string>));
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [data]);

  return (
    <section id="prayers" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Clock className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Prayer Times</h2>
        <span className="font-urdu text-sm text-muted-foreground">اوقاتِ نماز</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {prayerNames.map((p) => {
          const isNext = nextPrayer === p.key;
          return (
            <div
              key={p.key}
              className={`glass-card p-4 text-center transition-all duration-300 ${
                isNext ? "prayer-highlight glow-primary ring-1 ring-primary/30 scale-[1.02]" : "hover:shadow-md"
              }`}
            >
              <div className="text-2xl mb-1">{p.icon}</div>
              <p className="font-urdu text-xs text-muted-foreground mb-0.5" dir="rtl">{p.urdu}</p>
              <p className="font-heading font-semibold text-foreground text-xs mb-1.5">{p.label}</p>
              {isLoading ? (
                <Skeleton className="h-7 w-16 mx-auto" />
              ) : isError ? (
                <p className="text-destructive text-[10px]">Error</p>
              ) : (
                <>
                  <p className={`font-body font-bold text-lg ${isNext ? "text-primary" : "text-foreground"}`}>
                    {data?.prayers[p.key as keyof typeof data.prayers]}
                  </p>
                  {isNext && data?.prayers && (
                    <p className="text-[10px] text-primary font-body font-medium mt-1 animate-pulse-glow">
                      Next • {getTimeUntil(data.prayers[p.key as keyof typeof data.prayers])}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PrayerTimesCard;