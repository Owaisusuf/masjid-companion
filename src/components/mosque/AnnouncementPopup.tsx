import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getActiveAnnouncements, type Announcement } from "@/lib/announcementStore";

const AnnouncementPopup = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const active = getActiveAnnouncements();
      if (!active.length) { 
        setAnnouncement(null); 
        setVisible(false); 
        return; 
      }
      // Auto-cleanup expired announcements
      const all = JSON.parse(localStorage.getItem("masjid-announcements") || "[]");
      const today = new Date().toISOString().slice(0, 10);
      const cleaned = all.filter((a: any) => a.endDate >= today);
      if (cleaned.length < all.length) {
        localStorage.setItem("masjid-announcements", JSON.stringify(cleaned));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("masjid-announcements-changed"));
      }
      // Show first active
      setAnnouncement(active[0]);
      setTimeout(() => setVisible(true), 500);
    };

    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  const dismiss = () => {
    if (!announcement) return;
    setVisible(false);
    setTimeout(() => setAnnouncement(null), 300);
  };

  if (!announcement) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={dismiss}
      />

      {/* Popup */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image */}
          {announcement.imageUrl && (
            <div className="w-full max-h-[60vh] overflow-hidden">
              <img
                src={announcement.imageUrl}
                alt={announcement.title || "Event"}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Content - only show if there's text */}
          {(announcement.title || announcement.titleUrdu || announcement.description) && (
            <div className="p-4 sm:p-5">
              {announcement.title && (
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">{announcement.title}</h3>
              )}
              {announcement.titleUrdu && (
                <p className="font-urdu text-base text-accent mb-2" dir="rtl">{announcement.titleUrdu}</p>
              )}
              {announcement.description && (
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{announcement.description}</p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
            <button
              onClick={dismiss}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementPopup;
