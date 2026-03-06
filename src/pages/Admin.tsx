import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Save, ArrowLeft, Settings, Clock } from "lucide-react";
import { loadPrayerConfig, savePrayerConfig, getDefaultAutoTimes, type PrayerConfig } from "@/lib/prayerStore";
import { toast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "jamia@masjid";

const prayerLabels = [
  { key: "Fajr", label: "Fajr", urdu: "فجر" },
  { key: "Dhuhr", label: "Zuhr", urdu: "ظہر" },
  { key: "Asr", label: "Asr", urdu: "عصر" },
  { key: "Maghrib", label: "Maghrib", urdu: "مغرب" },
  { key: "Isha", label: "Isha", urdu: "عشاء" },
] as const;

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [config, setConfig] = useState<PrayerConfig>(loadPrayerConfig());
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem("admin-auth");
    if (session === "true") setAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin-auth", "true");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const handleModeChange = (mode: "auto" | "manual") => {
    const newConfig: PrayerConfig = {
      mode,
      times: mode === "auto" ? getDefaultAutoTimes() : config.times,
    };
    setConfig(newConfig);
  };

  const handleTimeChange = (key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      times: { ...prev.times, [key]: value },
    }));
  };

  const handleSave = () => {
    savePrayerConfig(config);
    toast({ title: "Prayer times saved", description: "Changes will reflect on the website immediately." });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Admin Panel</h1>
            <p className="text-muted-foreground text-sm font-body mb-6">Enter password to access</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
              </div>
              {passwordError && (
                <p className="text-destructive text-xs font-body">{passwordError}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            </form>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-xs text-muted-foreground hover:text-primary transition-colors font-body"
            >
              ← Back to website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Prayer Times Mode
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleModeChange("auto")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                config.mode === "auto"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="font-heading font-bold text-sm text-foreground mb-1">Automatic</p>
              <p className="text-xs text-muted-foreground font-body">
                Times update automatically based on preset schedule
              </p>
            </button>
            <button
              onClick={() => handleModeChange("manual")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                config.mode === "manual"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="font-heading font-bold text-sm text-foreground mb-1">Manual</p>
              <p className="text-xs text-muted-foreground font-body">
                Set custom prayer times manually
              </p>
            </button>
          </div>
        </div>

        {/* Prayer Times Editor */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">
            {config.mode === "auto" ? "Current Automatic Times" : "Edit Prayer Times"}
          </h2>
          <div className="space-y-3">
            {prayerLabels.map((p) => (
              <div key={p.key} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-foreground">{p.label}</p>
                  <p className="font-urdu text-xs text-muted-foreground" dir="rtl">{p.urdu}</p>
                </div>
                <input
                  type="text"
                  value={config.times[p.key as keyof PrayerConfig["times"]]}
                  onChange={(e) => handleTimeChange(p.key, e.target.value)}
                  disabled={config.mode === "auto"}
                  className="w-32 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body text-center focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            ))}
          </div>
          {config.mode === "auto" && (
            <p className="text-xs text-muted-foreground font-body mt-3">
              ℹ️ Asr automatically changes from 4:45 PM to 4:50 PM on March 15th
            </p>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Prayer Times
        </button>
      </div>
    </div>
  );
};

export default Admin;
