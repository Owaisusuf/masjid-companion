import { useState, useEffect, useRef } from "react";
import { Compass, Navigation, Loader2 } from "lucide-react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQibla(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const latRad = toRad(lat);
  const kaabaLatRad = toRad(KAABA_LAT);
  const dLng = toRad(KAABA_LNG - lng);
  const x = Math.sin(dLng);
  const y = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);
  let bearing = toDeg(Math.atan2(x, y));
  return (bearing + 360) % 360;
}

const QiblaFinder = () => {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCompass, setHasCompass] = useState(false);
  const compassRef = useRef<number>(0);

  const findQibla = () => {
    if (!navigator.geolocation) {
      setError("آپ کے براؤزر میں لوکیشن سپورٹ نہیں ہے");
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
        // Fallback to Srinagar coordinates
        const angle = calculateQibla(34.0522129, 74.7997336);
        setQiblaAngle(Math.round(angle * 10) / 10);
        setLoading(false);
      }
    );
  };

  // Device orientation for compass
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHasCompass(true);
        compassRef.current = e.alpha;
        setCompassHeading(e.alpha);
      }
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handler);
      return () => window.removeEventListener("deviceorientation", handler);
    }
  }, []);

  const needleRotation = qiblaAngle !== null
    ? (hasCompass ? qiblaAngle - compassHeading : qiblaAngle)
    : 0;

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
              Find the direction of the Holy Kaaba from your current location
            </p>
            <p className="text-muted-foreground text-sm mb-5 max-w-sm mx-auto font-urdu" dir="rtl">
              اپنے موجودہ مقام سے خانہ کعبہ کی سمت معلوم کریں
            </p>
            <button
              onClick={findQibla}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              {loading ? "تلاش ہو رہا ہے..." : "قبلہ کی سمت معلوم کریں"}
            </button>
            {error && <p className="text-destructive text-xs mt-3">{error}</p>}
          </div>
        ) : (
          <div>
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-border bg-secondary/50" />
              {/* Cardinal directions */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-muted-foreground">N</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-muted-foreground">S</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-muted-foreground">E</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-muted-foreground">W</span>
              {/* Needle */}
              <div
                className="absolute inset-4 flex items-center justify-center transition-transform duration-300"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="w-1 h-1/2 relative">
                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[36px] border-l-transparent border-r-transparent border-b-primary" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[28px] border-l-transparent border-r-transparent border-t-muted-foreground/20" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-accent shadow-md" />
            </div>

            <p className="font-heading text-3xl font-bold text-primary mb-1">{qiblaAngle}°</p>
            <p className="text-muted-foreground text-sm mb-1 font-body">from North (شمال سے)</p>
            <p className="text-muted-foreground text-xs mb-3 font-urdu" dir="rtl">
              قبلہ شریف کی سمت شمال سے {qiblaAngle} درجے ہے
            </p>
            <p className="font-arabic text-accent text-lg mb-3">🕋 الكعبة المشرفة</p>
            {hasCompass && (
              <p className="text-[10px] text-primary/70 font-body mb-2">Live compass active — سمت خود بخود اپ ڈیٹ ہو رہی ہے</p>
            )}
            <button
              onClick={findQibla}
              className="text-xs text-primary hover:text-accent transition-colors underline underline-offset-2"
            >
              دوبارہ معلوم کریں — Recalculate
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QiblaFinder;
