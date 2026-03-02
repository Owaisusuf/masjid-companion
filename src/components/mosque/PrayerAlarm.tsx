import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, BellOff, X, Volume2 } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";

function parseTimeTo24(time12: string): { h: number; m: number } {
  const [time, period] = time12.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return { h, m };
}

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_LABELS: Record<string, string> = {
  Fajr: "Fajr — فجر",
  Dhuhr: "Dhuhr — ظہر",
  Asr: "Asr — عصر",
  Maghrib: "Maghrib — مغرب",
  Isha: "Isha — عشاء",
};

const PrayerAlarm = () => {
  const [enabled, setEnabled] = useState(false);
  const [alertPrayer, setAlertPrayer] = useState<string | null>(null);
  const [notifiedToday, setNotifiedToday] = useState<Set<string>>(new Set());
  const { data } = usePrayerTimes();
  const audioRef = useRef<AudioContext | null>(null);

  const playAdhanTone = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;

      // Play a melodic tone sequence resembling adhan call
      const notes = [440, 494, 523, 587, 523, 494, 440];
      const noteDuration = 0.4;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + i * noteDuration);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * noteDuration + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + (i + 1) * noteDuration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * noteDuration);
        osc.stop(ctx.currentTime + (i + 1) * noteDuration);
      });
    } catch {
      // Audio not supported
    }
  }, []);

  const dismissAlert = useCallback(() => {
    setAlertPrayer(null);
    if (audioRef.current) {
      audioRef.current.close();
      audioRef.current = null;
    }
  }, []);

  const toggleAlarm = useCallback(async () => {
    if (enabled) {
      setEnabled(false);
      return;
    }
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setEnabled(true);
      }
    } else {
      setEnabled(true);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !data?.prayers) return;

    const check = () => {
      const now = new Date();
      const nowH = now.getHours();
      const nowM = now.getMinutes();
      const prayers = data.prayers as unknown as Record<string, string>;

      for (const key of PRAYER_KEYS) {
        if (!prayers[key] || notifiedToday.has(key)) continue;
        const { h, m } = parseTimeTo24(prayers[key]);
        if (nowH === h && nowM === m) {
          setAlertPrayer(key);
          setNotifiedToday(prev => new Set(prev).add(key));
          playAdhanTone();

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`🕌 ${PRAYER_LABELS[key] || key}`, {
              body: `It's time for ${key} prayer`,
              icon: "/favicon.png",
            });
          }
        }
      }
    };

    const interval = setInterval(check, 30000);
    check();
    return () => clearInterval(interval);
  }, [enabled, data, notifiedToday, playAdhanTone]);

  // Reset notified set at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setNotifiedToday(new Set());
      }
    };
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating alarm toggle */}
      <button
        onClick={toggleAlarm}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          enabled
            ? "bg-primary text-primary-foreground shadow-primary/30"
            : "bg-card text-muted-foreground border border-border hover:border-primary/30"
        }`}
        title={enabled ? "Disable prayer alarm" : "Enable prayer alarm"}
      >
        {enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
      </button>

      {/* Alert modal */}
      {alertPrayer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Volume2 className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <h3 className="font-heading text-xl font-bold text-foreground mb-1">
              {PRAYER_LABELS[alertPrayer] || alertPrayer}
            </h3>
            <p className="text-muted-foreground text-sm font-body mb-2">
              It's time for prayer
            </p>
            <p className="font-arabic text-accent text-lg mb-5" dir="rtl">
              حَيَّ عَلَى الصَّلَاة
            </p>

            <button
              onClick={dismissAlert}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <X className="w-4 h-4" /> Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PrayerAlarm;
