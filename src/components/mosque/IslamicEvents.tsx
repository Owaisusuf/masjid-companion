import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getEventsForDay } from "@/data/islamic-events";
import { getTodayRamadan, isRamadan } from "@/data/ramadan-2026";

const IslamicEvents = () => {
  const navigate = useNavigate();
  const ramadanActive = isRamadan();
  const todayRamadan = getTodayRamadan();
  const currentDay = todayRamadan?.day || 17;
  const todayEvents = getEventsForDay(currentDay, 9);

  return (
    <section id="islamic-events" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Calendar className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Islamic History</h2>
        <span className="font-urdu text-sm text-muted-foreground">اسلامی تاریخ</span>
      </div>

      <div className="glass-card p-5 sm:p-6">
        {/* Today's highlight */}
        {ramadanActive && todayEvents.length > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/30">
            <p className="text-xs text-primary font-body font-semibold uppercase tracking-wider mb-2">
              📌 Today — {currentDay} Ramadan
            </p>
            {todayEvents.map((event, i) => (
              <div key={i}>
                <p className="font-body text-sm font-semibold text-foreground">{event.title}</p>
                <p className="font-urdu text-sm text-accent" dir="rtl">{event.titleUrdu}</p>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground font-body mb-4 text-center">
          Explore important events from Islamic history throughout the year
        </p>
        <div className="text-center">
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

export default IslamicEvents;
