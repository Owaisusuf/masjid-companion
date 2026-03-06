import { useState, useEffect, useRef, useCallback } from "react";
import { Compass, Navigation, Loader2, RotateCw } from "lucide-react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQibla(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const lat1 = toRad(lat);
  const lat2 = toRad(KAABA_LAT);
  const dLng = toRad(KAABA_LNG - lng);
  const x = Math.sin(dLng) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let bearing = toDeg(Math.atan2(x, y));
  return (bearing + 360) % 360;
}

function getDirectionLabel(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

const QiblaFinder = () => {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCompass, setHasCompass] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const findQibla = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    setError("");
    setQiblaAngle(null);

    // Clear previous watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setQiblaAngle(Math.round(calculateQibla(lat, lng) * 10) / 10);
        setLoading(false);
      },
      (err) => {
        console.warn("Geolocation error, using Srinagar default:", err.message);
        const lat = 34.0522129;
        const lng = 74.7997336;
        setUserLat(lat);
        setUserLng(lng);
        setQiblaAngle(Math.round(calculateQibla(lat, lng) * 10) / 10);
        setLoading(false);
        setError("Location access denied. Showing direction from Srinagar.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      // Use webkitCompassHeading on iOS, fall back to alpha
      const heading = (e as any).webkitCompassHeading ?? e.alpha;
      if (heading !== null && heading !== undefined) {
        setHasCompass(true);
        // webkitCompassHeading is already compass heading (0=N), alpha needs inversion
        setCompassHeading((e as any).webkitCompassHeading != null ? heading : (360 - heading) % 360);
      }
    };

    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        try {
          const perm = await (DeviceOrientationEvent as any).requestPermission();
          if (perm === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          }
        } catch {
          // permission denied
        }
      } else {
        window.addEventListener("deviceorientation", handler, true);
      }
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      requestPermission();
      return () => window.removeEventListener("deviceorientation", handler, true);
    }
  }, []);

  const needleRotation = qiblaAngle !== null ? (hasCompass ? qiblaAngle - compassHeading : qiblaAngle) : 0;

  return (
    <section id="qibla" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Compass className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Qibla Direction</h2>
        <span className="font-urdu text-sm text-muted-foreground">قبلہ کی سمت</span>
      </div>

      <div className="glass-card p-6 sm:p-8 text-center glow-primary">
        {qiblaAngle === null && !loading ? (
          <div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
              <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-4 font-body">
              Find the direction of the Holy Kaaba from your location
            </p>
            <button
              onClick={findQibla}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Navigation className="w-4 h-4" />
              Find Qibla
            </button>
            {error && <p className="text-destructive text-xs mt-3">{error}</p>}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-body">Detecting your location...</p>
          </div>
        ) : (
          <div>
            {/* Compass visual */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-border bg-secondary/50" />
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-primary">N</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-muted-foreground">S</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-muted-foreground">E</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-muted-foreground">W</span>
              <div
                className="absolute inset-4 flex items-center justify-center transition-transform duration-500 ease-out"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="w-1 h-1/2 relative">
                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[40px] border-l-transparent border-r-transparent border-b-primary drop-shadow-md" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[30px] border-l-transparent border-r-transparent border-t-muted-foreground/15" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-accent shadow-lg" />
            </div>

            <p className="font-heading text-3xl font-bold text-primary mb-0.5">{qiblaAngle}°</p>
            <p className="text-muted-foreground text-sm font-body mb-1">
              {getDirectionLabel(qiblaAngle!)} from North
            </p>
            <p className="font-arabic text-accent text-lg mb-1">🕋 اَلْکَعْبَۃُ الْمُشَرَّفَۃ</p>

            {userLat !== null && userLng !== null && (
              <p className="text-[10px] text-muted-foreground/60 font-body mb-2">
                From: {userLat.toFixed(4)}°N, {userLng.toFixed(4)}°E
              </p>
            )}

            {hasCompass && <p className="text-[10px] text-primary/70 font-body mb-2">● Live compass active</p>}
            {error && <p className="text-amber-600 text-xs mb-2 font-body">{error}</p>}

            <button
              onClick={findQibla}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-accent transition-colors font-body font-medium mt-1"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Recalculate
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QiblaFinder;
