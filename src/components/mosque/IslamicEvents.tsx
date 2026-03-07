import { Calendar, BookOpen } from "lucide-react";
import { getEventsForDay, getEventsForMonth, IslamicEvent } from "@/data/islamic-events";
import { getTodayRamadan, isRamadan } from "@/data/ramadan-2026";

const IslamicEvents = () => {
  // Current Islamic month context — during Ramadan 2026
  const ramadanActive = isRamadan();
  const todayRamadan = getTodayRamadan();

  // Get today's events and all month events
  const currentIslamicMonth = 9; // Ramadan
  const currentDay = todayRamadan?.day || 17; // fallback to 17

  const todayEvents = getEventsForDay(currentDay, currentIslamicMonth);
  const monthEvents = getEventsForMonth(currentIslamicMonth);

  if (!ramadanActive && monthEvents.length === 0) return null;

  return (
    <section id="islamic-events" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Calendar className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Islamic History</h2>
        <span className="font-urdu text-sm text-muted-foreground">اسلامی تاریخ</span>
      </div>

      {/* Today's events highlight */}
      {todayEvents.length > 0 && (
        <div className="glass-card glow-primary p-4 sm:p-6 mb-4">
          <p className="text-xs text-primary font-body font-semibold uppercase tracking-wider mb-3">
            📌 Today — {currentDay} Ramadan 1447 AH
          </p>
          {todayEvents.map((event, i) => (
            <EventCard key={i} event={event} highlight />
          ))}
        </div>
      )}

      {/* All month events */}
      <div className="glass-card p-4 sm:p-6">
        <p className="text-xs text-muted-foreground font-body font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
          Important Events of Ramadan
        </p>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {monthEvents.map((event, i) => (
            <EventCard key={i} event={event} highlight={event.day === currentDay} />
          ))}
        </div>
      </div>
    </section>
  );
};

const EventCard = ({ event, highlight }: { event: IslamicEvent; highlight?: boolean }) => (
  <div className={`p-3 sm:p-4 rounded-xl border transition-colors ${
    highlight 
      ? "bg-primary/5 border-primary/30" 
      : "bg-secondary/40 border-border/50 hover:bg-secondary/60"
  }`}>
    <div className="flex items-start gap-3">
      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-body ${
        highlight ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
      }`}>
        {event.day}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold text-foreground">{event.title}</p>
        <p className="font-urdu text-sm text-accent" dir="rtl">{event.titleUrdu}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-body">{event.description}</p>
        <p className="text-[10px] text-primary/60 mt-1 font-body italic">📖 {event.source}</p>
      </div>
    </div>
  </div>
);

export default IslamicEvents;
