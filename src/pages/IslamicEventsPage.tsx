import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { islamicEvents, IslamicEvent, getEventsForDay } from "@/data/islamic-events";
import { getTodayRamadan, isRamadan } from "@/data/ramadan-2026";

const IslamicEventsPage = () => {
  const navigate = useNavigate();
  const ramadanActive = isRamadan();
  const todayRamadan = getTodayRamadan();
  const currentDay = todayRamadan?.day || 17;

  // Group events by month
  const months = [
    { name: "Muharram", nameUrdu: "محرم", number: 1 },
    { name: "Safar", nameUrdu: "صفر", number: 2 },
    { name: "Rabi al-Awwal", nameUrdu: "ربیع الاول", number: 3 },
    { name: "Jumada al-Ula", nameUrdu: "جمادی الاولیٰ", number: 5 },
    { name: "Jumada al-Thani", nameUrdu: "جمادی الثانی", number: 6 },
    { name: "Rajab", nameUrdu: "رجب", number: 7 },
    { name: "Shaban", nameUrdu: "شعبان", number: 8 },
    { name: "Ramadan", nameUrdu: "رمضان", number: 9 },
    { name: "Shawwal", nameUrdu: "شوال", number: 10 },
    { name: "Dhul Qadah", nameUrdu: "ذوالقعدہ", number: 11 },
    { name: "Dhul Hijjah", nameUrdu: "ذوالحجہ", number: 12 },
  ];

  const todayEvents = ramadanActive ? getEventsForDay(currentDay, 9) : [];

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-3 h-14">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Calendar className="w-5 h-5 text-primary shrink-0" />
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-bold text-foreground">Islamic History</h1>
            <span className="font-urdu text-sm text-muted-foreground">اسلامی تاریخ</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Today's highlight */}
        {todayEvents.length > 0 && (
          <div className="glass-card glow-primary p-5 sm:p-6">
            <p className="text-xs text-primary font-body font-semibold uppercase tracking-wider mb-4">
              📌 Today — {currentDay} Ramadan 1447 AH
            </p>
            {todayEvents.map((event, i) => (
              <EventCard key={i} event={event} highlight />
            ))}
          </div>
        )}

        {/* Events by month */}
        {months.map((month) => {
          const events = islamicEvents.filter(e => e.monthNumber === month.number);
          if (events.length === 0) return null;

          return (
            <div key={month.number} className="glass-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">{month.name}</h2>
                <span className="font-urdu text-sm text-accent">{month.nameUrdu}</span>
              </div>
              <div className="space-y-3">
                {events.map((event, i) => (
                  <EventCard
                    key={i}
                    event={event}
                    highlight={ramadanActive && event.monthNumber === 9 && event.day === currentDay}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Back */}
        <div className="text-center pb-12">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-body text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </main>
  );
};

const EventCard = ({ event, highlight }: { event: IslamicEvent; highlight?: boolean }) => (
  <div className={`p-4 sm:p-5 rounded-xl border transition-colors ${
    highlight
      ? "bg-primary/5 border-primary/30"
      : "bg-secondary/40 border-border/50 hover:bg-secondary/60"
  }`}>
    <div className="flex items-start gap-3">
      <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-body ${
        highlight ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
      }`}>
        {event.day ?? "—"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold text-foreground">{event.title}</p>
        <p className="font-urdu text-sm text-accent mt-0.5" dir="rtl">{event.titleUrdu}</p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-body">{event.description}</p>
        {event.source && (
          <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-secondary border border-border text-[10px] text-primary font-medium font-body">
            📖 {event.source}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default IslamicEventsPage;
