import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { getTodayRamadan, isRamadan } from "@/data/ramadan-2026";
import { MapPin, ExternalLink } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const mapUrl = "https://www.google.com/maps?q=34.0522129,74.7997336";

const Header = () => {
  const { data } = usePrayerTimes();
  const todayRamadan = getTodayRamadan();
  const ramadanActive = isRamadan();

  return (
    <header className="relative min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden islamic-pattern">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
      
      {/* Decorative corner ornaments */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-accent/20 rounded-tl-xl" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-accent/20 rounded-tr-xl" />
      <div className="absolute bottom-16 left-6 w-16 h-16 border-b-2 border-l-2 border-accent/20 rounded-bl-xl" />
      <div className="absolute bottom-16 right-6 w-16 h-16 border-b-2 border-r-2 border-accent/20 rounded-br-xl" />

      <div className="relative z-10 text-center px-4 py-10 max-w-2xl mx-auto">
        {/* Bismillah */}
        <p className="font-quran text-2xl sm:text-3xl md:text-4xl text-accent mb-4 leading-relaxed" dir="rtl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>

        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-1 text-foreground tracking-tight">
          Jamia Masjid Shareef
        </h1>
        <p className="font-urdu text-xl sm:text-2xl text-accent mb-3" dir="rtl">
          جامع مسجد شریف
        </p>
        
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm mb-5"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Old Barzulla, Srinagar, Kashmir</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {data?.hijri && (
            <div className="glass-card inline-flex items-center gap-2 px-4 py-2">
              <span className="font-arabic text-base text-accent">{data.hijri.monthAr}</span>
              <span className="text-foreground font-heading font-semibold text-sm">
                {data.hijri.day} {data.hijri.month} {data.hijri.year} AH
              </span>
            </div>
          )}

          {ramadanActive && todayRamadan && (
            <div className="glass-card glow-accent inline-flex items-center gap-2 px-4 py-2">
              <span className="text-accent font-heading font-semibold text-sm">
                ☪ Ramadan Mubarak — Day {todayRamadan.day}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
