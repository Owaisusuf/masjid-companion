import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { islamicEvents, IslamicEvent } from "@/data/islamic-events";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useHijriAdjustment } from "@/hooks/useHijriAdjustment";

const HIJRI_MONTHS: Record<string, number> = {
  muharram: 1, safar: 2, "rabi al-awwal": 3, "rabi' al-awwal": 3, "rabi al-thani": 4, "rabi' al-thani": 4,
  "jumada al-ula": 5, "jumada al-awwal": 5, "jumādá al-ūlá": 5,
  "jumada al-thani": 6, "jumādá al-ākhirah": 6,
  rajab: 7, shaban: 8, "sha'ban": 8, ramadan: 9, "ramaḍān": 9,
  shawwal: 10, "dhul qadah": 11, "dhū al-qa'dah": 11, "dhu al-qi'dah": 11,
  "dhul hijjah": 12, "dhū al-ḥijjah": 12, "dhu al-hijjah": 12,
};

function getHijriMonthNumber(monthName: string): number {
  const lower = monthName.toLowerCase().replace(/[ʿʾ''`]/g, "'");
  for (const [key, val] of Object.entries(HIJRI_MONTHS)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return 0;
}

const IslamicEvents = () => {
  const navigate = useNavigate();
  const { adjustment } = useHijriAdjustment();
  const { data } = usePrayerTimes(adjustment);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const hijriDay = data?.hijri ? parseInt(data.hijri.day) : 0;
  const hijriMonth = data?.hijri ? getHijriMonthNumber(data.hijri.month) : 0;

  // Get events for current Hijri month
  const currentMonthEvents = islamicEvents.filter(e => e.monthNumber === hijriMonth);
  const todayEvents = currentMonthEvents.filter(e => e.day === hijriDay);
  const otherEvents = currentMonthEvents.filter(e => e.day !== hijriDay);

  const monthName = data?.hijri?.month || "";
  const monthNameAr = data?.hijri?.monthAr || "";

  return (
    <section id="islamic-events" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Calendar className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Islamic History</h2>
        <span className="font-urdu text-sm text-muted-foreground">اسلامی تاریخ</span>
      </div>

      <div className="glass-card p-5 sm:p-6 space-y-4">
        {/* Current Hijri month badge */}
        {hijriMonth > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-primary font-body font-semibold uppercase tracking-wider">
              📅 {hijriDay} {monthName} {data?.hijri?.year} AH
            </p>
            {monthNameAr && (
              <span className="font-urdu text-sm text-accent" dir="rtl">{monthNameAr}</span>
            )}
          </div>
        )}

        {/* Today's events highlighted */}
        {todayEvents.length > 0 && (
          <div className="space-y-2">
            {todayEvents.map((event, i) => (
              <button
                key={`today-${i}`}
                onClick={() => setExpandedEvent(expandedEvent === event.day ? null : event.day)}
                className="w-full p-4 rounded-xl bg-primary/10 border-2 border-primary/40 text-left transition-all hover:bg-primary/15"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-body">TODAY</span>
                  <span className="text-xs text-muted-foreground font-body">{event.day} {monthName}</span>
                </div>
                <p className="font-body text-sm font-semibold text-foreground">{event.title}</p>
                <p className="font-urdu text-sm text-accent mt-0.5" dir="rtl">{event.titleUrdu}</p>
                {expandedEvent === event.day && (
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">{event.description}</p>
                    {event.source && (
                      <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-secondary border border-border text-[10px] text-primary font-medium font-body">
                        📖 {event.source}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Other events this month */}
        {otherEvents.length > 0 && (
          <div className="space-y-2">
            {otherEvents.slice(0, 3).map((event, i) => (
              <EventItem key={`other-${i}`} event={event} />
            ))}
          </div>
        )}

        {currentMonthEvents.length === 0 && hijriMonth > 0 && (
          <p className="text-sm text-muted-foreground font-body text-center py-2">
            No major events recorded for this month.
          </p>
        )}

        <div className="text-center pt-2">
          <button
            onClick={() => navigate("/islamic-events")}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            View All Events →
          </button>
        </div>
      </div>
    </section>
  );
};

const EventItem = ({ event }: { event: IslamicEvent }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full p-3 rounded-xl bg-secondary/40 border border-border/50 text-left hover:bg-secondary/60 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 font-body">
            {event.day ?? "—"}
          </span>
          <div className="min-w-0">
            <p className="font-body text-xs font-semibold text-foreground truncate">{event.title}</p>
            <p className="font-urdu text-xs text-accent truncate" dir="rtl">{event.titleUrdu}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
      </div>
      {expanded && (
        <div className="mt-2 pt-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground font-body leading-relaxed">{event.description}</p>
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

export default IslamicEvents;
