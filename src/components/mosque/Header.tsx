import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { getTodayRamadan, isRamadan } from "@/data/ramadan-2026";
import { Moon, MapPin, ExternalLink } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const mapUrl = "https://www.google.com/maps?q=34.0522129,74.7997336";

const Header = () => {
  const { data } = usePrayerTimes();
  const todayRamadan = getTodayRamadan();
  const ramadanActive = isRamadan();

  return (
    <header className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

      <div className="relative z-10 text-center px-4 py-12 max-w-3xl mx-auto">
        {/* Bismillah in Arabic text */}
        <p className="font-quran text-3xl sm:text-4xl md:text-5xl text-accent mb-6 leading-relaxed" dir="rtl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-foreground">
          Jamia Masjid Shareef
        </h1>
        <p className="font-urdu text-2xl sm:text-3xl text-accent mb-3" dir="rtl">
          جامع مسجد شریف
        </p>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <MapPin className="w-4 h-4" />
          <p className="text-sm">Old Barzulla, Srinagar, Kashmir</p>
          <ExternalLink className="w-3 h-3" />
        </a>

        {data?.hijri && (
          <div className="glass-card inline-flex items-center gap-3 px-6 py-3 mb-4">
            <span className="font-arabic text-lg text-accent">{data.hijri.monthAr}</span>
            <span className="text-foreground font-heading font-semibold">
              {data.hijri.day} {data.hijri.month} {data.hijri.year} AH
            </span>
          </div>
        )}

        {ramadanActive && todayRamadan && (
          <div className="mt-4 glass-card glow-accent inline-block px-6 py-3">
            <p className="text-accent font-heading font-semibold text-lg">
              ☪ Ramadan Mubarak — Day {todayRamadan.day}
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
