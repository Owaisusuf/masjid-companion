import { useState, useEffect, useCallback, useRef } from "react";
import { Compass, Navigation, Loader2, RotateCw } from "lucide-react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const FALLBACK_LAT = 34.0669;
const FALLBACK_LNG = 74.8006;

const normalizeAngle = (value: number) => ((value % 360) + 360) % 360;

function calculateQibla(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const lat1 = toRad(lat);
  const lat2 = toRad(KAABA_LAT);
  const dLng = toRad(KAABA_LNG - lng);

  const x = Math.sin(dLng) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return normalizeAngle(toDeg(Math.atan2(x, y)));
}

function getDirectionLabel(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(normalizeAngle(deg) / 22.5) % 16];
}

function getScreenAngle(): number {
  const screenAngle = window.screen?.orientation?.angle;
  if (typeof screenAngle === "number") return screenAngle;

  const orientation = (window as Window & { orientation?: number }).orientation;
  return typeof orientation === "number" ? orientation : 0;
}

function extractHeading(event: DeviceOrientationEvent): number | null {
  const webkitHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
  if (typeof webkitHeading === "number" && Number.isFinite(webkitHeading)) {
    return normalizeAngle(webkitHeading);
  }

  if (typeof event.alpha === "number" && (event.absolute || event.type === "deviceorientationabsolute")) {
    return normalizeAngle(360 - (event.alpha + getScreenAngle()));
  }

  return null;
}

const QiblaFinder = () => {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [compassError, setCompassError] = useState("");
  const [hasCompass, setHasCompass] = useState(false);
  const listenersAttachedRef = useRef(false);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const nextHeading = extractHeading(event);
    if (nextHeading === null) return;

    setHasCompass(true);
    setCompassHeading((prev) => {
      const delta = ((nextHeading - prev + 540) % 360) - 180;
      return normalizeAngle(prev + delta * 0.28);
    });
  }, []);

  const detachListeners = useCallback(() => {
    if (!listenersAttachedRef.current) return;
    window.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener, true);
    window.removeEventListener("deviceorientation", handleOrientation as EventListener, true);
    listenersAttachedRef.current = false;
  }, [handleOrientation]);

  const setupCompass = useCallback(async () => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setHasCompass(false);
      setCompassError("Compass sensor is not available on this device.");
      return;
    }

    setCompassError("");

    const OrientationEvent = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof OrientationEvent.requestPermission === "function") {
      try {
        const permission = await OrientationEvent.requestPermission();
        if (permission !== "granted") {
          setHasCompass(false);
          setCompassError("Compass permission denied. Enable Motion & Orientation access.");
          return;
        }
      } catch {
        setHasCompass(false);
        setCompassError("Allow Motion & Orientation permission, then tap Recalculate.");
        return;
      }
    }

    if (!listenersAttachedRef.current) {
      window.addEventListener("deviceorientationabsolute", handleOrientation as EventListener, true);
      window.addEventListener("deviceorientation", handleOrientation as EventListener, true);
      listenersAttachedRef.current = true;
    }
  }, [handleOrientation]);

  const findQibla = useCallback(async () => {
    setLoading(true);
    setLocationError("");
    setQiblaAngle(null);

    await setupCompass();

    if (!navigator.geolocation) {
      setUserLat(FALLBACK_LAT);
      setUserLng(FALLBACK_LNG);
      setQiblaAngle(Math.round(calculateQibla(FALLBACK_LAT, FALLBACK_LNG) * 10) / 10);
      setLocationError("Geolocation is not supported. Using saved mosque location.");
      setLoading(false);
      return;
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
      () => {
        setUserLat(FALLBACK_LAT);
        setUserLng(FALLBACK_LNG);
        setQiblaAngle(Math.round(calculateQibla(FALLBACK_LAT, FALLBACK_LNG) * 10) / 10);
        setLocationError("Unable to get your location. Using saved mosque location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  }, [setupCompass]);

  useEffect(() => {
    return () => detachListeners();
  }, [detachListeners]);

  const qiblaNeedleRotation = qiblaAngle !== null ? (hasCompass ? qiblaAngle - compassHeading : qiblaAngle) : 0;
  const northNeedleRotation = hasCompass ? -compassHeading : 0;

  return (
    <section id="qibla" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Compass className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Qibla Direction</h2>
        <span className="font-urdu text-sm text-muted-foreground">قبلہ کی سمت</span>
      </div>

      <div className="glass-card p-6 sm:p-8 text-center glow-primary bg-gradient-to-b from-primary/20 via-secondary/70 to-secondary">
        {qiblaAngle === null && !loading ? (
          <div>
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-background/90 border-2 border-border flex items-center justify-center">
              <Compass className="w-12 h-12 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-4 font-body">Find accurate Qibla direction with live compass calibration</p>
            <button
              onClick={findQibla}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Navigation className="w-4 h-4" />
              Find Qibla
            </button>
            {locationError && <p className="text-destructive text-xs mt-3">{locationError}</p>}
            {compassError && <p className="text-destructive text-xs mt-2">{compassError}</p>}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-body">Detecting your location and compass...</p>
          </div>
        ) : (
          <div>
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full bg-background border-4 border-background shadow-xl" />
              <div className="absolute inset-3 rounded-full border border-border/60" />

              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-primary">N</span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-body font-bold text-muted-foreground">S</span>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-muted-foreground">E</span>
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-body font-bold text-muted-foreground">W</span>

              <div
                className="absolute inset-10 transition-transform duration-200 ease-linear"
                style={{ transform: `rotate(${northNeedleRotation}deg)` }}
              >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0 h-0 border-l-[11px] border-r-[11px] border-b-[48px] border-l-transparent border-r-transparent border-b-primary" />
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-0 h-0 border-l-[11px] border-r-[11px] border-t-[48px] border-l-transparent border-r-transparent border-t-accent" />
                <span className="absolute left-1/2 top-11 -translate-x-1/2 text-[10px] font-bold text-primary-foreground">N</span>
                <span className="absolute left-1/2 bottom-11 -translate-x-1/2 text-[10px] font-bold text-accent-foreground">S</span>
              </div>

              <div
                className="absolute inset-6 transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${qiblaNeedleRotation}deg)` }}
              >
                <div className="absolute left-1/2 top-1 -translate-x-1/2 text-lg" aria-label="Kaaba marker">
                  🕋
                </div>
                <div className="absolute left-1/2 top-8 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[18px] border-l-transparent border-r-transparent border-b-primary" />
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent border-2 border-accent shadow-md" />
            </div>

            <p className="font-heading text-3xl font-bold text-primary mb-0.5">{Math.round(qiblaAngle!)}° {getDirectionLabel(qiblaAngle!)}</p>
            <p className="text-muted-foreground text-sm font-body mb-1">Qibla bearing from True North</p>
            <p className="font-arabic text-accent text-lg mb-1">🕋 اَلْکَعْبَۃُ الْمُشَرَّفَۃ</p>

            {userLat !== null && userLng !== null && (
              <p className="text-[10px] text-muted-foreground/70 font-body mb-1">From: {userLat.toFixed(4)}°N, {userLng.toFixed(4)}°E</p>
            )}

            {hasCompass ? (
              <p className="text-[10px] text-primary/80 font-body mb-2">● Live compass active</p>
            ) : (
              <p className="text-[10px] text-muted-foreground font-body mb-2">Compass sensor unavailable. Use the degree value and direction label.</p>
            )}

            {locationError && <p className="text-destructive text-xs mb-1 font-body">{locationError}</p>}
            {compassError && <p className="text-destructive text-xs mb-1 font-body">{compassError}</p>}

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
