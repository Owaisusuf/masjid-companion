import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  Save,
  ArrowLeft,
  Settings,
  Clock,
  Megaphone,
  Plus,
  Trash2,
  Image,
  ToggleLeft,
  ToggleRight,
  Calendar,
  X,
} from "lucide-react";
import {
  loadPrayerConfig,
  savePrayerConfig,
  getDefaultAutoTimes,
  type PrayerConfig,
} from "@/lib/prayerStore";
import {
  loadAnnouncements,
  saveAnnouncements,
  getDefaultAnnouncement,
  type Announcement,
} from "@/lib/announcementStore";
import { loadHijriAdjustment, saveHijriAdjustment } from "@/lib/hijriAdjustmentStore";
import { getMasjidISODate } from "@/lib/localDate";
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

  // IMPORTANT: `config.times` always represents the MANUAL schedule.
  // Auto schedule is derived (getDefaultAutoTimes) and MUST NOT overwrite manual times.
  const [config, setConfig] = useState<PrayerConfig>(loadPrayerConfig());

  const [hijriAdjustment, setHijriAdjustment] = useState<number>(loadHijriAdjustment());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<"prayer" | "announcements">("prayer");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem("admin-auth");
    if (session === "true") setAuthenticated(true);
  }, []);

  // Keep prayer config synced across tabs + same-tab writes.
  useEffect(() => {
    const sync = () => setConfig(loadPrayerConfig());
    window.addEventListener("storage", sync);
    window.addEventListener("masjid-prayer-config-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("masjid-prayer-config-changed", sync);
    };
  }, []);

  useEffect(() => {
    const sync = () => setHijriAdjustment(loadHijriAdjustment());
    window.addEventListener("storage", sync);
    window.addEventListener("masjid-hijri-adjustment-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("masjid-hijri-adjustment-changed", sync);
    };
  }, []);

  useEffect(() => {
    if (authenticated) {
      setAnnouncements(loadAnnouncements());
    }
  }, [authenticated]);

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

  // Prayer handlers
  const handleModeChange = (mode: "auto" | "manual") => {
    setConfig((prev) => ({ ...prev, mode }));
  };

  const handleTimeChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, times: { ...prev.times, [key]: value } }));
  };

  const handleSavePrayer = () => {
    savePrayerConfig(config);
    toast({ title: "Saved", description: "Prayer settings updated." });
  };

  // Announcement handlers
  const addAnnouncement = () => {
    setAnnouncements((prev) => [...prev, getDefaultAnnouncement()]);
  };

  const updateAnnouncement = (id: string, field: keyof Announcement, value: string | boolean) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    saveAnnouncements(updated); // Persist deletion immediately
    toast({ title: "Deleted", description: "Announcement removed." });
  };

  const handleImageUpload = (id: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be under 5MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateAnnouncement(id, "imageUrl", result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAnnouncements = () => {
    saveAnnouncements(announcements);
    toast({
      title: "Saved",
      description: "Announcements updated. Active alerts will show on the website.",
    });
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
              </div>
              {passwordError && <p className="text-destructive text-xs font-body">{passwordError}</p>}
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

  const autoTimes = getDefaultAutoTimes();

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-secondary/50 rounded-xl p-1 border border-border">
          <button
            onClick={() => setActiveTab("prayer")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${
              activeTab === "prayer"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" /> Prayer Times
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${
              activeTab === "announcements"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Megaphone className="w-4 h-4" /> Announcements
          </button>
        </div>

        {/* ═══ PRAYER TIMES TAB ═══ */}
        {activeTab === "prayer" && (
          <>
            <div className="glass-card p-5 sm:p-6 mb-5">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Prayer Times Mode
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleModeChange("auto")}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    config.mode === "auto" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className="font-heading font-bold text-sm text-foreground mb-1">Automatic</p>
                  <p className="text-xs text-muted-foreground font-body">Times update automatically</p>
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
                  <p className="text-xs text-muted-foreground font-body">Set custom times</p>
                </button>
              </div>
            </div>

            <div className="glass-card p-5 sm:p-6 mb-5">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                {config.mode === "auto" ? "Current Automatic Times" : "Edit Manual Times"}
              </h2>
              <div className="space-y-3">
                {prayerLabels.map((p) => {
                  const value =
                    config.mode === "auto"
                      ? autoTimes[p.key as keyof PrayerConfig["times"]]
                      : config.times[p.key as keyof PrayerConfig["times"]];

                  return (
                    <div key={p.key} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-sm text-foreground">{p.label}</p>
                        <p className="font-urdu text-xs text-muted-foreground" dir="rtl">
                          {p.urdu}
                        </p>
                      </div>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleTimeChange(p.key, e.target.value)}
                        disabled={config.mode === "auto"}
                        className="w-28 sm:w-32 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body text-center focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  );
                })}
              </div>
              {config.mode === "auto" && (
                <p className="text-xs text-muted-foreground font-body mt-3">
                  ℹ️ Asr changes from 4:45 PM to 4:50 PM on March 15th (masjid timezone)
                </p>
              )}
            </div>

            <div className="glass-card p-5 sm:p-6 mb-5">
              <h2 className="font-heading text-lg font-bold text-foreground mb-2">Hijri Date Adjustment</h2>
              <p className="text-xs text-muted-foreground font-body mb-4">
                India/Kashmir default is <span className="font-semibold text-foreground">-1</span>. Change only if your local
                moon-sighting differs.
              </p>

              <div className="flex items-center gap-3">
                <label className="text-sm font-body text-foreground">Offset (days)</label>
                <select
                  value={hijriAdjustment}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setHijriAdjustment(v);
                    saveHijriAdjustment(v);
                    toast({ title: "Saved", description: `Hijri adjustment set to ${v}.` });
                  }}
                  className="h-10 px-3 rounded-lg bg-card border border-border text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {[-2, -1, 0, 1, 2].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSavePrayer}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Prayer Times
            </button>
          </>
        )}

        {/* ═══ ANNOUNCEMENTS TAB ═══ */}
        {activeTab === "announcements" && (
          <>
            <div className="glass-card p-5 sm:p-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" /> Manage Alerts
                </h2>
                <button
                  onClick={addAnnouncement}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>

              <p className="text-xs text-muted-foreground font-body mb-5">
                Create event alerts that automatically appear when visitors open the website. Set start & end dates so they auto-hide.
              </p>

              {announcements.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-body">No announcements yet</p>
                  <p className="text-xs font-body mt-1">Click "Add New" to create one</p>
                </div>
              )}

              <div className="space-y-5">
                {announcements.map((ann, idx) => (
                  <div key={ann.id} className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
                    {/* Header with toggle & delete */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-body font-medium text-muted-foreground">Alert #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateAnnouncement(ann.id, "active", !ann.active)}
                          className={`flex items-center gap-1 text-xs font-body font-medium transition-colors ${
                            ann.active ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {ann.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          {ann.active ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="text-destructive/60 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <input
                      type="text"
                      value={ann.title}
                      onChange={(e) => updateAnnouncement(ann.id, "title", e.target.value)}
                      placeholder="Event title (English)"
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />

                    {/* Urdu title */}
                    <input
                      type="text"
                      value={ann.titleUrdu}
                      onChange={(e) => updateAnnouncement(ann.id, "titleUrdu", e.target.value)}
                      placeholder="عنوان (اردو)"
                      dir="rtl"
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-urdu placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />

                    {/* Description */}
                    <textarea
                      value={ann.description}
                      onChange={(e) => updateAnnouncement(ann.id, "description", e.target.value)}
                      placeholder="Description / details"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                    />

                    {/* Image upload */}
                    <div>
                      <label className="text-xs font-body font-medium text-foreground/70 mb-1.5 flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5" /> Event Image
                      </label>
                      {ann.imageUrl && (
                        <div className="relative mb-2 rounded-lg overflow-hidden border border-border">
                          <img src={ann.imageUrl} alt="Preview" className="w-full max-h-48 object-contain bg-secondary/30" />
                          <button
                            onClick={() => updateAnnouncement(ann.id, "imageUrl", "")}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center hover:bg-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        ref={(el) => {
                          fileInputRefs.current[ann.id] = el;
                        }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(ann.id, file);
                        }}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRefs.current[ann.id]?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-body font-medium text-foreground hover:bg-secondary/70 transition-colors"
                      >
                        <Image className="w-3.5 h-3.5" /> {ann.imageUrl ? "Change Image" : "Upload Image"}
                      </button>
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-body font-medium text-foreground/70 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Start Date
                        </label>
                        <input
                          type="date"
                          value={ann.startDate}
                          onChange={(e) => updateAnnouncement(ann.id, "startDate", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body font-medium text-foreground/70 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> End Date
                        </label>
                        <input
                          type="date"
                          value={ann.endDate}
                          onChange={(e) => updateAnnouncement(ann.id, "endDate", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    {/* Status indicator (masjid timezone) */}
                    {(() => {
                      const today = getMasjidISODate();
                      const isLive = ann.active && ann.startDate <= today && ann.endDate >= today;
                      const isExpired = ann.endDate < today;
                      const isScheduled = ann.startDate > today;
                      return (
                        <p
                          className={`text-[10px] font-body font-medium ${
                            isLive
                              ? "text-primary"
                              : isExpired
                                ? "text-destructive"
                                : isScheduled
                                  ? "text-accent"
                                  : "text-muted-foreground"
                          }`}
                        >
                          {isLive
                            ? "● Currently live on website"
                            : isExpired
                              ? "● Expired"
                              : isScheduled
                                ? "● Scheduled"
                                : "● Inactive"}
                        </p>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveAnnouncements}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Announcements
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;

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
              {passwordError && <p className="text-destructive text-xs font-body">{passwordError}</p>}
              <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity">
                Login
              </button>
            </form>
            <button onClick={() => navigate("/")} className="mt-4 text-xs text-muted-foreground hover:text-primary transition-colors font-body">
              ← Back to website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-secondary/50 rounded-xl p-1 border border-border">
          <button
            onClick={() => setActiveTab("prayer")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${
              activeTab === "prayer" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" /> Prayer Times
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${
              activeTab === "announcements" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Megaphone className="w-4 h-4" /> Announcements
          </button>
        </div>

        {/* ═══ PRAYER TIMES TAB ═══ */}
        {activeTab === "prayer" && (
          <>
            <div className="glass-card p-5 sm:p-6 mb-5">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Prayer Times Mode
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleModeChange("auto")}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${config.mode === "auto" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                >
                  <p className="font-heading font-bold text-sm text-foreground mb-1">Automatic</p>
                  <p className="text-xs text-muted-foreground font-body">Times update automatically</p>
                </button>
                <button
                  onClick={() => handleModeChange("manual")}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${config.mode === "manual" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                >
                  <p className="font-heading font-bold text-sm text-foreground mb-1">Manual</p>
                  <p className="text-xs text-muted-foreground font-body">Set custom times</p>
                </button>
              </div>
            </div>

            <div className="glass-card p-5 sm:p-6 mb-5">
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
                      className="w-28 sm:w-32 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body text-center focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                ))}
              </div>
              {config.mode === "auto" && (
                <p className="text-xs text-muted-foreground font-body mt-3">ℹ️ Asr changes from 4:45 PM to 4:50 PM on March 15th</p>
              )}
            </div>

            <div className="glass-card p-5 sm:p-6 mb-5">
              <h2 className="font-heading text-lg font-bold text-foreground mb-2">Hijri Date Adjustment</h2>
              <p className="text-xs text-muted-foreground font-body mb-4">
                India/Kashmir default is <span className="font-semibold text-foreground">-1</span>. Change only if your local moon-sighting differs.
              </p>

              <div className="flex items-center gap-3">
                <label className="text-sm font-body text-foreground">Offset (days)</label>
                <select
                  value={hijriAdjustment}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setHijriAdjustment(v);
                    saveHijriAdjustment(v);
                    toast({ title: "Saved", description: `Hijri adjustment set to ${v}.` });
                  }}
                  className="h-10 px-3 rounded-lg bg-card border border-border text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {[-2, -1, 0, 1, 2].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={handleSavePrayer} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Prayer Times
            </button>
          </>
        )}

        {/* ═══ ANNOUNCEMENTS TAB ═══ */}
        {activeTab === "announcements" && (
          <>
            <div className="glass-card p-5 sm:p-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" /> Manage Alerts
                </h2>
                <button
                  onClick={addAnnouncement}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>

              <p className="text-xs text-muted-foreground font-body mb-5">
                Create event alerts that automatically appear when visitors open the website. Set start & end dates so they auto-hide.
              </p>

              {announcements.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-body">No announcements yet</p>
                  <p className="text-xs font-body mt-1">Click "Add New" to create one</p>
                </div>
              )}

              <div className="space-y-5">
                {announcements.map((ann, idx) => (
                  <div key={ann.id} className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
                    {/* Header with toggle & delete */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-body font-medium text-muted-foreground">Alert #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateAnnouncement(ann.id, "active", !ann.active)}
                          className={`flex items-center gap-1 text-xs font-body font-medium transition-colors ${ann.active ? "text-primary" : "text-muted-foreground"}`}
                        >
                          {ann.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          {ann.active ? "Active" : "Inactive"}
                        </button>
                        <button onClick={() => deleteAnnouncement(ann.id)} className="text-destructive/60 hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <input
                      type="text"
                      value={ann.title}
                      onChange={(e) => updateAnnouncement(ann.id, "title", e.target.value)}
                      placeholder="Event title (English)"
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />

                    {/* Urdu title */}
                    <input
                      type="text"
                      value={ann.titleUrdu}
                      onChange={(e) => updateAnnouncement(ann.id, "titleUrdu", e.target.value)}
                      placeholder="عنوان (اردو)"
                      dir="rtl"
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-urdu placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />

                    {/* Description */}
                    <textarea
                      value={ann.description}
                      onChange={(e) => updateAnnouncement(ann.id, "description", e.target.value)}
                      placeholder="Description / details"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                    />

                    {/* Image upload */}
                    <div>
                      <label className="text-xs font-body font-medium text-foreground/70 mb-1.5 flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5" /> Event Image
                      </label>
                      {ann.imageUrl && (
                        <div className="relative mb-2 rounded-lg overflow-hidden border border-border">
                          <img src={ann.imageUrl} alt="Preview" className="w-full max-h-48 object-contain bg-secondary/30" />
                          <button
                            onClick={() => updateAnnouncement(ann.id, "imageUrl", "")}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center hover:bg-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        ref={el => { fileInputRefs.current[ann.id] = el; }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(ann.id, file);
                        }}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRefs.current[ann.id]?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-body font-medium text-foreground hover:bg-secondary/70 transition-colors"
                      >
                        <Image className="w-3.5 h-3.5" /> {ann.imageUrl ? "Change Image" : "Upload Image"}
                      </button>
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-body font-medium text-foreground/70 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Start Date
                        </label>
                        <input
                          type="date"
                          value={ann.startDate}
                          onChange={(e) => updateAnnouncement(ann.id, "startDate", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body font-medium text-foreground/70 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> End Date
                        </label>
                        <input
                          type="date"
                          value={ann.endDate}
                          onChange={(e) => updateAnnouncement(ann.id, "endDate", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    {/* Status indicator */}
                    {(() => {
                      const today = new Date().toISOString().slice(0, 10);
                      const isLive = ann.active && ann.startDate <= today && ann.endDate >= today;
                      const isExpired = ann.endDate < today;
                      const isScheduled = ann.startDate > today;
                      return (
                        <p className={`text-[10px] font-body font-medium ${isLive ? "text-primary" : isExpired ? "text-destructive" : isScheduled ? "text-accent" : "text-muted-foreground"}`}>
                          {isLive ? "● Currently live on website" : isExpired ? "● Expired" : isScheduled ? "● Scheduled" : "● Inactive"}
                        </p>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveAnnouncements}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Announcements
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default Admin;
