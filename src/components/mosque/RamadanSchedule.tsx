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
    <section id="ramadan" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Moon className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Ramadan Schedule</h2>
        <span className="font-urdu text-sm text-muted-foreground">رمضان المبارک</span>
      </div>

      {todayRamadan && (
        <div className="glass-card glow-accent p-5 sm:p-6 mb-4">
          <div className="text-center mb-4">
            <p className="font-urdu text-sm text-accent mb-2" dir="rtl">{countdownLabel}</p>
            <p className="font-heading text-4xl font-bold text-foreground animate-pulse-glow">
              {countdown}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-secondary border border-border">
              <p className="font-urdu text-xs text-muted-foreground mb-1" dir="rtl">سحری</p>
              <p className="text-2xl font-bold text-foreground font-heading">{todayRamadan.sehri}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary border border-border">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Utensils className="w-3.5 h-3.5 text-accent" />
                <p className="font-urdu text-xs text-muted-foreground" dir="rtl">افطار</p>
              </div>
              <p className="text-2xl font-bold text-accent font-heading">{todayRamadan.iftar}</p>
            </div>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-3 font-urdu" dir="rtl">
            دن {todayRamadan.day} — {todayRamadan.dayNameUrdu}
          </p>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card border-b border-border">
              <tr>
                <th className="px-3 py-3 text-left font-body font-semibold text-muted-foreground text-xs w-12">Day</th>
                <th className="px-3 py-3 text-left font-body font-semibold text-muted-foreground text-xs">Date</th>
                <th className="px-3 py-3 text-left font-body font-semibold text-muted-foreground text-xs">Day</th>
                <th className="px-3 py-3 text-center font-urdu font-semibold text-muted-foreground text-xs hidden sm:table-cell" dir="rtl">دن</th>
                <th className="px-3 py-3 text-center font-body font-semibold text-muted-foreground text-xs">Sehri</th>
                <th className="px-3 py-3 text-center font-body font-semibold text-muted-foreground text-xs">Iftar</th>
              </tr>
            </thead>
            <tbody>
              {ramadanSchedule.map((d) => {
                const isToday = todayRamadan?.day === d.day;
                return (
                  <tr
                    key={d.day}
                    className={`border-b border-border/30 transition-colors ${
                      isToday ? "ramadan-today font-semibold" : "hover:bg-secondary/50"
                    }`}
                  >
                    <td className="px-3 py-2.5 font-body text-sm">{d.day}</td>
                    <td className="px-3 py-2.5 text-sm">
                      {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-3 py-2.5 font-body text-sm">{d.dayName}</td>
                    <td className="px-3 py-2.5 font-urdu text-center hidden sm:table-cell text-sm" dir="rtl">{d.dayNameUrdu}</td>
                    <td className="px-3 py-2.5 text-center font-body text-sm">{d.sehri}</td>
                    <td className={`px-3 py-2.5 text-center font-body text-sm ${isToday ? "text-accent font-bold" : ""}`}>
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