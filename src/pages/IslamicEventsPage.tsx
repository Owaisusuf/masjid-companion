import { useState } from "react";
import { ArrowLeft, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { islamicEvents, IslamicEvent } from "@/data/islamic-events";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useHijriAdjustment } from "@/hooks/useHijriAdjustment";

const HIJRI_MONTHS: Record<string, number> = {
  muharram: 1, safar: 2, "rabi al-awwal": 3, "rabi' al-awwal": 3, "rabi al-thani": 4,
  "jumada al-ula": 5, "jumada al-awwal": 5,
  "jumada al-thani": 6, rajab: 7, shaban: 8, "sha'ban": 8, ramadan: 9,
  shawwal: 10, "dhul qadah": 11, "dhu al-qi'dah": 11,
  "dhul hijjah": 12, "dhu al-hijjah": 12,
};

function getHijriMonthNumber(monthName: string): number {
  const lower = monthName.toLowerCase().replace(/[ʿʾ''`]/g, "'");
  for (const [key, val] of Object.entries(HIJRI_MONTHS)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return 0;
}

const months = [
  { name: "Muharram", nameUrdu: "محرم", number: 1 },
  { name: "Safar", nameUrdu: "صفر", number: 2 },
  { name: "Rabi al-Awwal", nameUrdu: "ربیع الاول", number: 3 },
  { name: "Rabi al-Thani", nameUrdu: "ربیع الثانی", number: 4 },
  { name: "Jumada al-Ula", nameUrdu: "جمادی الاولیٰ", number: 5 },
  { name: "Jumada al-Thani", nameUrdu: "جمادی الثانی", number: 6 },
  { name: "Rajab", nameUrdu: "رجب", number: 7 },
  { name: "Shaban", nameUrdu: "شعبان", number: 8 },
  { name: "Ramadan", nameUrdu: "رمضان", number: 9 },
  { name: "Shawwal", nameUrdu: "شوال", number: 10 },
  { name: "Dhul Qadah", nameUrdu: "ذوالقعدہ", number: 11 },
  { name: "Dhul Hijjah", nameUrdu: "ذوالحجہ", number: 12 },
];

const IslamicEventsPage = () => {
  const navigate = useNavigate();
  const { adjustment } = useHijriAdjustment();
  const { data } = usePrayerTimes(adjustment);

  const hijriDay = data?.hijri ? parseInt(data.hijri.day) : 0;
  const hijriMonth = data?.hijri ? getHijriMonthNumber(data.hijri.month) : 0;

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-3 h-14">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-primary/10 text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Calendar className="w-5 h-5 text-primary shrink-0" />
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-bold text-foreground">Islamic History</h1>
            <span className="font-urdu text-sm text-muted-foreground">اسلامی تاریخ</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {months.map((month) => {
          const events = islamicEvents.filter(e => e.monthNumber === month.number);
          if (events.length === 0) return null;
          const isCurrentMonth = hijriMonth === month.number;

          return (
            <div key={month.number} className={`glass-card p-5 sm:p-6 ${isCurrentMonth ? "ring-2 ring-primary/40" : ""}`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  {isCurrentMonth && <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-body">CURRENT</span>}
                  <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">{month.name}</h2>
                </div>
                <span className="font-urdu text-sm text-accent">{month.nameUrdu}</span>
              </div>
              <div className="space-y-2">
                {events.map((event, i) => (
                  <EventCard
                    key={i}
                    event={event}
                    isToday={isCurrentMonth && event.day === hijriDay}
                    isCurrentMonth={isCurrentMonth}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div className="text-center pb-12">
          <button onClick={() => navigate("/")} className="px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-body text-sm font-medium hover:bg-primary/20 transition-colors">
            ← Back to Home
          </button>
        </div>
      </div>
    </main>
  );
};

const EventCard = ({ event, isToday, isCurrentMonth }: { event: IslamicEvent; isToday?: boolean; isCurrentMonth?: boolean }) => {
  const [expanded, setExpanded] = useState(!!isToday);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={`w-full p-4 sm:p-5 rounded-xl border transition-all text-left ${
        isToday
          ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20"
          : isCurrentMonth
          ? "bg-secondary/50 border-border/50 hover:bg-secondary/70"
          : "bg-secondary/40 border-border/50 hover:bg-secondary/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-body ${
            isToday ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}>
            {event.day ?? "—"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {isToday && <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-body">TODAY</span>}
              <p className="font-body text-sm font-semibold text-foreground">{event.title}</p>
            </div>
            <p className="font-urdu text-sm text-accent mt-0.5" dir="rtl">{event.titleUrdu}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/30 ml-12">
          <p className="text-xs text-muted-foreground leading-relaxed font-body">{event.description}</p>
          {event.source && (
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-secondary border border-border text-[10px] text-primary font-medium font-body">
              📖 {event.source}
            </span>
          )}
        </div>
      )}
    </button>
  );
};

export default IslamicEventsPage;
