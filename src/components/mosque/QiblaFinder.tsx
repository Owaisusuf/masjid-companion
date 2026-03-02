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
      setError("Geolocation is not supported by your browser");
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
        // Use masjid coordinates as fallback
        const angle = calculateQibla(34.0522129, 74.7997336);
        setQiblaAngle(Math.round(angle * 10) / 10);
        setLoading(false);
      }
    );
  };

  return (
    <section id="qibla" className="px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Qibla Direction</h2>
        <span className="font-arabic text-lg text-muted-foreground">سمتِ قبلہ</span>
      </div>

      <div className="glass-card p-6 sm:p-8 text-center glow-primary">
        {qiblaAngle === null ? (
          <div>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/60 border-2 border-border/50 flex items-center justify-center">
              <Compass className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Find the direction of the Kaaba from your current location. Allow location access for accurate results.
            </p>
            <button
              onClick={findQibla}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              {loading ? "Finding..." : "Find Qibla Direction"}
            </button>
            {error && <p className="text-destructive text-xs mt-3">{error}</p>}
          </div>
        ) : (
          <div>
            {/* Compass */}
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 mx-auto mb-6">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-border/60 bg-secondary/30" />
              {/* Cardinal directions */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-heading font-bold text-muted-foreground">N</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-heading font-bold text-muted-foreground">S</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-heading font-bold text-muted-foreground">E</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-heading font-bold text-muted-foreground">W</span>
              {/* Qibla needle */}
              <div
                className="absolute inset-4 flex items-center justify-center"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                <div className="w-1 h-1/2 relative">
                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[40px] border-l-transparent border-r-transparent border-b-primary" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[30px] border-l-transparent border-r-transparent border-t-muted-foreground/30" />
                </div>
              </div>
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-accent" />
            </div>

            <p className="font-heading text-3xl font-bold text-primary mb-1">{qiblaAngle}°</p>
            <p className="text-muted-foreground text-sm mb-1">from North</p>
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
