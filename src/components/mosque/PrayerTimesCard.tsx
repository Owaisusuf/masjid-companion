import { useState, useEffect } from "react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const prayerNames: { key: string; label: string; arabic: string }[] = [
  { key: "Fajr", label: "Fajr", arabic: "الفجر" },
  { key: "Sunrise", label: "Sunrise", arabic: "الشروق" },
  { key: "Dhuhr", label: "Dhuhr", arabic: "الظهر" },
  { key: "Asr", label: "Asr", arabic: "العصر" },
  { key: "Maghrib", label: "Maghrib", arabic: "المغرب" },
  { key: "Isha", label: "Isha", arabic: "العشاء" },
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
    if (prayers[key] && parseTimeToMinutes(prayers[key]) > nowMinutes) {
      return key;
    }
  }
  return "Fajr"; // After Isha, next is Fajr
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
    <section id="prayers" className="px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Prayer Times</h2>
        <span className="font-arabic text-lg text-muted-foreground">اوقات الصلاة</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayerNames.map((p) => {
          const isNext = nextPrayer === p.key;
          return (
            <div
              key={p.key}
              className={`glass-card p-4 text-center transition-all duration-300 ${
                isNext ? "prayer-highlight glow-primary ring-1 ring-primary/30" : "hover:glow-primary"
              }`}
            >
              <p className="font-arabic text-sm text-muted-foreground mb-1">{p.arabic}</p>
              <p className="font-heading font-semibold text-foreground text-sm mb-2">{p.label}</p>
              {isLoading ? (
                <Skeleton className="h-7 w-20 mx-auto" />
              ) : isError ? (
                <p className="text-destructive text-xs">Error</p>
              ) : (
                <>
                  <p className={`font-heading font-bold text-lg ${isNext ? "text-primary" : "text-primary"}`}>
                    {data?.prayers[p.key as keyof typeof data.prayers]}
                  </p>
                  {isNext && data?.prayers && (
                    <p className="text-[10px] text-primary/80 font-heading mt-1 animate-pulse-glow">
                      ▲ Next — in {getTimeUntil(data.prayers[p.key as keyof typeof data.prayers])}
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
