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

const PrayerTimesCard = () => {
  const { data, isLoading, isError } = usePrayerTimes();

  return (
    <section className="px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Prayer Times</h2>
        <span className="font-arabic text-lg text-muted-foreground mr-2">أوقات الصلاة</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayerNames.map((p) => (
          <div
            key={p.key}
            className="glass-card p-4 text-center hover:glow-primary transition-all duration-300"
          >
            <p className="font-arabic text-sm text-muted-foreground mb-1">{p.arabic}</p>
            <p className="font-heading font-semibold text-foreground text-sm mb-2">{p.label}</p>
            {isLoading ? (
              <Skeleton className="h-7 w-20 mx-auto" />
            ) : isError ? (
              <p className="text-destructive text-xs">Error</p>
            ) : (
              <p className="text-primary font-heading font-bold text-lg">
                {data?.prayers[p.key as keyof typeof data.prayers]}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PrayerTimesCard;
