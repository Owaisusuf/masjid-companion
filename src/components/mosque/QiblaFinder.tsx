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
    <section id="qibla" className="px-4 max-w-4xl mx-auto">
      <div className="section-heading">
        <Compass className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">Qibla Direction</h2>
        <span className="font-urdu text-base text-muted-foreground whitespace-nowrap">سمتِ قبلہ</span>
      </div>

      <div className="glass-card p-5 sm:p-6 text-center glow-primary">
        {qiblaAngle === null ? (
          <div>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/60 border-2 border-border/50 flex items-center justify-center">
              <Compass className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-xs mb-4 max-w-sm mx-auto">
              اپنے مقام سے کعبہ شریف کی سمت معلوم کریں
            </p>
            <button
              onClick={findQibla}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
              {loading ? "تلاش..." : "Find Qibla Direction"}
            </button>
            {error && <p className="text-destructive text-[10px] mt-2">{error}</p>}
          </div>
        ) : (
          <div>
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-border/60 bg-secondary/30" />
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[10px] font-heading font-bold text-muted-foreground">N</span>
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-heading font-bold text-muted-foreground">S</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-heading font-bold text-muted-foreground">E</span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-heading font-bold text-muted-foreground">W</span>
              <div
                className="absolute inset-3 flex items-center justify-center"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                <div className="w-1 h-1/2 relative">
                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[32px] border-l-transparent border-r-transparent border-b-primary" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[24px] border-l-transparent border-r-transparent border-t-muted-foreground/30" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-accent" />
            </div>

            <p className="font-heading text-2xl font-bold text-primary mb-0.5">{qiblaAngle}°</p>
            <p className="text-muted-foreground text-xs mb-1">from North</p>
            <p className="font-arabic text-accent text-base">🕋 الكعبة المشرفة</p>
            <button
              onClick={findQibla}
              className="mt-3 text-[10px] text-primary hover:text-accent transition-colors underline underline-offset-2"
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
