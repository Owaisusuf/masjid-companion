import { useState, useEffect } from "react";
import { ramadanSchedule, getTodayRamadan, isRamadan } from "@/data/ramadan-2026";
import { Moon } from "lucide-react";

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

// Dates (khajoor) icon SVG
const DatesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="8" cy="14" rx="3" ry="5" />
    <ellipse cx="16" cy="14" rx="3" ry="5" />
    <path d="M8 9c0-3 2-5 4-7" />
    <path d="M16 9c0-3-2-5-4-7" />
    <path d="M12 2v4" />
  </svg>
);

const RamadanSchedule = () => {
  const todayRamadan = getTodayRamadan();
  const ramadanActive = isRamadan();
  const [countdown, setCountdown] = useState("");
  const [countdownLabel, setCountdownLabel] = useState("");
  const [displayEntry, setDisplayEntry] = useState(todayRamadan);

  useEffect(() => {
    if (!todayRamadan) return;
    const timer = setInterval(() => {
      const now = new Date();
      const iftarTime = parseTime(todayRamadan.iftar);
      const sehriTime = parseTime(todayRamadan.sehri);
      const THREE_MIN = 3 * 60 * 1000;

      if (now < sehriTime) {
        setCountdownLabel("سحری ختم ہونے میں");
        setCountdown(formatCountdown(sehriTime.getTime() - now.getTime()));
        setDisplayEntry(todayRamadan);
      } else if (now.getTime() < sehriTime.getTime() + THREE_MIN) {
        setCountdownLabel("سحری کا وقت ختم ہوا — افطار تک انتظار");
        const remaining = iftarTime.getTime() - now.getTime();
        setCountdown(formatCountdown(remaining > 0 ? remaining : 0));
        setDisplayEntry(todayRamadan);
      } else if (now < iftarTime) {
        setCountdownLabel("افطار میں");
        setCountdown(formatCountdown(iftarTime.getTime() - now.getTime()));
        setDisplayEntry(todayRamadan);
      } else if (now.getTime() < iftarTime.getTime() + THREE_MIN) {
        setCountdownLabel("افطار مبارک!");
        setCountdown("الحمد لله");
        setDisplayEntry(todayRamadan);
      } else {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
        const tomorrowEntry = ramadanSchedule.find(d => d.date === tomorrowDate);
        if (tomorrowEntry) {
          const [tTime, tPeriod] = tomorrowEntry.sehri.split(" ");
          let [tH, tM] = tTime.split(":").map(Number);
          if (tPeriod === "PM" && tH !== 12) tH += 12;
          if (tPeriod === "AM" && tH === 12) tH = 0;
          const nextSehri = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), tH, tM, 0);
          setCountdownLabel("اگلی سحری میں");
          setCountdown(formatCountdown(nextSehri.getTime() - now.getTime()));
          setDisplayEntry(tomorrowEntry);
        } else {
          setCountdownLabel("رمضان مبارک");
          setCountdown("الحمد لله");
          setDisplayEntry(todayRamadan);
        }
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

      {displayEntry && (
        <div className="glass-card glow-accent p-4 sm:p-6 mb-4">
          <div className="text-center mb-4">
            <p className="font-urdu text-sm text-accent mb-2" dir="rtl">{countdownLabel}</p>
            <p className="font-heading text-3xl sm:text-4xl font-bold text-foreground animate-pulse-glow">
              {countdown}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 rounded-xl bg-secondary border border-border">
              <p className="font-urdu text-xs text-muted-foreground mb-1" dir="rtl">سحری</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground font-heading">{displayEntry.sehri}</p>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-xl bg-secondary border border-border">
              <p className="font-urdu text-xs text-muted-foreground mb-1" dir="rtl">افطار</p>
              <p className="text-xl sm:text-2xl font-bold text-accent font-heading">{displayEntry.iftar}</p>
            </div>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-3 font-urdu" dir="rtl">
            دن {displayEntry.day} — {displayEntry.dayNameUrdu}
          </p>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card border-b border-border z-10">
              <tr>
                <th className="px-2 sm:px-3 py-3 text-left font-body font-semibold text-muted-foreground text-xs w-10">Day</th>
                <th className="px-2 sm:px-3 py-3 text-left font-body font-semibold text-muted-foreground text-xs">Date</th>
                <th className="px-2 sm:px-3 py-3 text-left font-body font-semibold text-muted-foreground text-xs">Day</th>
                <th className="px-2 sm:px-3 py-3 text-center font-urdu font-semibold text-muted-foreground text-xs hidden sm:table-cell" dir="rtl">دن</th>
                <th className="px-2 sm:px-3 py-3 text-center font-body font-semibold text-muted-foreground text-xs">Sehri</th>
                <th className="px-2 sm:px-3 py-3 text-center font-body font-semibold text-muted-foreground text-xs">Iftar</th>
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
                    <td className="px-2 sm:px-3 py-2.5 font-body text-xs sm:text-sm">{d.day}</td>
                    <td className="px-2 sm:px-3 py-2.5 text-xs sm:text-sm whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 font-body text-xs sm:text-sm">{d.dayName}</td>
                    <td className="px-2 sm:px-3 py-2.5 font-urdu text-center hidden sm:table-cell text-sm" dir="rtl">{d.dayNameUrdu}</td>
                    <td className="px-2 sm:px-3 py-2.5 text-center font-body text-xs sm:text-sm">{d.sehri}</td>
                    <td className={`px-2 sm:px-3 py-2.5 text-center font-body text-xs sm:text-sm ${isToday ? "text-accent font-bold" : ""}`}>
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
