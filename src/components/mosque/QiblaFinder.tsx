import { useState } from "react";
import { Compass, Navigation, Loader2 } from "lucide-react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQibla(lat: number, lng: number): number {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
  const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;
  const dLng = kaabaLngRad - lngRad;
  const x = Math.sin(dLng);
  const y = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);
  let bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

const QiblaFinder = () => {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const findQibla = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const angle = calculateQibla(pos.coords.latitude, pos.coords.longitude);
        setQiblaAngle(Math.round(angle * 10) / 10);
        setLoading(false);
      },
      () => {
        const angle = calculateQibla(34.0522129, 74.7997336);
        setQiblaAngle(Math.round(angle * 10) / 10);
        setLoading(false);
      }
    );
  };

  return (
    <section id="qibla" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Compass className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Qibla Direction</h2>
        <span className="font-urdu text-sm text-muted-foreground">سمتِ قبلہ</span>
      </div>

      <div className="glass-card p-6 sm:p-8 text-center glow-primary">
        {qiblaAngle === null ? (
          <div>
            <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
              <Compass className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-2 font-body">
              Find the direction of Kaaba from your location
            </p>
            <p className="text-muted-foreground text-sm mb-5 max-w-sm mx-auto font-urdu" dir="rtl">
              اپنے مقام سے قبلہ کی سمت معلوم کریں
            </p>
            <button
              onClick={findQibla}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              {loading ? "Finding..." : "Find Qibla Direction"}
            </button>
            {error && <p className="text-destructive text-xs mt-3">{error}</p>}
          </div>
        ) : (
          <div>
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-border bg-secondary/50" />
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-muted-foreground">N</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-muted-foreground">S</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-muted-foreground">E</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-muted-foreground">W</span>
              <div
                className="absolute inset-4 flex items-center justify-center"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                <div className="w-1 h-1/2 relative">
                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[36px] border-l-transparent border-r-transparent border-b-primary" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[28px] border-l-transparent border-r-transparent border-t-muted-foreground/20" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-accent shadow-md" />
            </div>

            <p className="font-heading text-3xl font-bold text-primary mb-1">{qiblaAngle}°</p>
            <p className="text-muted-foreground text-sm mb-1 font-body">from North</p>
            <p className="text-muted-foreground text-xs mb-2 font-urdu" dir="rtl">شمال سے {qiblaAngle} درجے</p>
            <p className="font-arabic text-accent text-lg">🕋 الكعبة المشرفة</p>
            <button
              onClick={findQibla}
              className="mt-4 text-xs text-primary hover:text-accent transition-colors underline underline-offset-2"
            >
              Recalculate
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QiblaFinder;
