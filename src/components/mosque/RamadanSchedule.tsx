import { useState, useEffect } from "react";
import { ramadanSchedule, getTodayRamadan, isRamadan } from "@/data/ramadan-2026";
import { Utensils, Moon } from "lucide-react";

function parseTime(timeStr: string): Date {
  const now = new Date();
  const [time, period] = timeStr.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const RamadanSchedule = () => {
  const todayRamadan = getTodayRamadan();
  const ramadanActive = isRamadan();
  const [countdown, setCountdown] = useState("");
  const [countdownLabel, setCountdownLabel] = useState("");

  useEffect(() => {
    if (!todayRamadan) return;
    const timer = setInterval(() => {
      const now = new Date();
      const iftarTime = parseTime(todayRamadan.iftar);
      const sehriTime = parseTime(todayRamadan.sehri);
      if (now < sehriTime) {
        setCountdownLabel("سحری ختم ہونے میں");
        setCountdown(formatCountdown(sehriTime.getTime() - now.getTime()));
      } else if (now < iftarTime) {
        setCountdownLabel("افطار میں");
        setCountdown(formatCountdown(iftarTime.getTime() - now.getTime()));
      } else {
        setCountdownLabel("افطار کا وقت گزر گیا");
        setCountdown("الحمد لله");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [todayRamadan]);

  if (!ramadanActive) return null;

  return (
    <section id="ramadan" className="px-4 max-w-4xl mx-auto">
      <div className="section-heading">
        <Moon className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">Ramadan Schedule</h2>
        <span className="font-urdu text-base text-muted-foreground whitespace-nowrap">رمضان المبارک</span>
      </div>

      {todayRamadan && (
        <div className="glass-card glow-accent p-4 sm:p-5 mb-4">
          <div className="text-center mb-3">
            <p className="font-urdu text-sm text-accent mb-1" dir="rtl">{countdownLabel}</p>
            <p className="font-heading text-3xl font-bold text-foreground animate-pulse-glow">
              {countdown}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-xl bg-secondary/50 border border-border/50">
              <p className="font-urdu text-xs text-muted-foreground" dir="rtl">سحری</p>
              <p className="text-xl font-bold text-foreground font-heading">{todayRamadan.sehri}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="flex items-center justify-center gap-1">
                <Utensils className="w-3 h-3 text-accent" />
                <p className="font-urdu text-xs text-muted-foreground" dir="rtl">افطار</p>
              </div>
              <p className="text-xl font-bold text-accent font-heading">{todayRamadan.iftar}</p>
            </div>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-2 font-urdu" dir="rtl">
            دن {todayRamadan.day} — {todayRamadan.dayNameUrdu}
          </p>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card border-b border-border">
              <tr>
                <th className="px-2 sm:px-3 py-2 text-left font-heading font-semibold text-muted-foreground">دن</th>
                <th className="px-2 sm:px-3 py-2 text-left font-heading font-semibold text-muted-foreground">Date</th>
                <th className="px-2 sm:px-3 py-2 text-left font-heading font-semibold text-muted-foreground hidden sm:table-cell">ایام</th>
                <th className="px-2 sm:px-3 py-2 text-center font-heading font-semibold text-muted-foreground">سحری</th>
                <th className="px-2 sm:px-3 py-2 text-center font-heading font-semibold text-muted-foreground">افطار</th>
              </tr>
            </thead>
            <tbody>
              {ramadanSchedule.map((d) => {
                const isToday = todayRamadan?.day === d.day;
                return (
                  <tr
                    key={d.day}
                    className={`border-b border-border/30 transition-colors ${
                      isToday ? "ramadan-today font-semibold" : "hover:bg-secondary/30"
                    }`}
                  >
                    <td className="px-2 sm:px-3 py-2 font-heading">{d.day}</td>
                    <td className="px-2 sm:px-3 py-2 text-[11px]">
                      {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-2 sm:px-3 py-2 font-urdu text-right hidden sm:table-cell text-[11px]">{d.dayNameUrdu}</td>
                    <td className="px-2 sm:px-3 py-2 text-center font-heading">{d.sehri}</td>
                    <td className={`px-2 sm:px-3 py-2 text-center font-heading ${isToday ? "text-accent" : ""}`}>
                      {d.iftar}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RamadanSchedule;
