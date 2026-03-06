import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { getTodayRamadan, isRamadan } from "@/data/ramadan-2026";
import { MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import kalimaImg from "@/assets/kalima-calligraphy.png";

const mapUrl = "https://www.google.com/maps?q=34.0522129,74.7997336";

const Header = () => {
  const { data } = usePrayerTimes();
  const todayRamadan = getTodayRamadan();
  const ramadanActive = isRamadan();

  return (
    <header className="relative min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-white/20 rounded-tl-3xl hidden sm:block" />
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-white/20 rounded-tr-3xl hidden sm:block" />

      <div className="relative z-10 text-center px-4 pt-6 sm:pt-8 pb-8 max-w-2xl mx-auto">
        {/* Kalima - TOP, large, centered */}
        <div className="mb-4">
          <img
            src={kalimaImg}
            alt="لا إله إلا الله محمد رسول الله"
            className="mx-auto h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-[0_0_24px_rgba(255,255,255,0.35)] brightness-110"
          />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-1 text-white tracking-tight">
          Jamia Masjid Shareef
        </h1>
        <p className="font-urdu text-xl sm:text-2xl text-amber-300 mb-3" dir="rtl">
          جامع مسجد شریف
        </p>

        <p className="text-white/60 text-xs font-body tracking-widest uppercase mb-4">
          Your Local Prayer Companion
        </p>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs sm:text-sm mb-4"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Old Barzulla, Near Eidgah, Srinagar, J&K 190005</span>
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-1">
          {data?.hijri && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="font-arabic text-sm text-amber-300">{data.hijri.monthAr}</span>
              <span className="text-white font-heading font-semibold text-xs">
                {data.hijri.day} {data.hijri.month} {data.hijri.year} AH
              </span>
            </div>
          )}

          {ramadanActive && todayRamadan && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30">
              <span className="text-amber-300 font-heading font-semibold text-xs">
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
