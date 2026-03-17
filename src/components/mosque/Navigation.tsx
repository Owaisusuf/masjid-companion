import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import mosqueLogo from "@/assets/mosque-logo.png";

const scrollNavItems = [
  { label: "نماز", en: "Prayer", href: "#prayers" },
  { label: "رمضان", en: "Ramadan", href: "#ramadan" },
  { label: "قبلہ", en: "Qibla", href: "#qibla" },
  { label: "دعائیں", en: "Duas", href: "#duas" },
  { label: "اسماء", en: "Names", href: "#names" },
  { label: "تسبیح", en: "Tasbih", href: "#tasbih" },
];

const pageNavItems = [
  { label: "قرآن", en: "Quran", to: "/quran" },
  { label: "احادیث", en: "Hadith", to: "/hadith-collection" },
  { label: "نماز گائیڈ", en: "Namaz Guide", to: "/namaz-guide" },
  { label: "کوئز", en: "Quiz", to: "/islamic-quiz" },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleScrollOrNav = (href: string) => {
    setOpen(false);
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageNav = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2">
          <img src={mosqueLogo} alt="Jamia Masjid Shareef" className="w-8 h-8 object-contain" />
          <span className="font-heading font-bold text-primary text-sm sm:text-base">
            Jamia Masjid
          </span>
        </a>

        <div className="hidden md:flex items-center gap-0.5">
          {scrollNavItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleScrollOrNav(item.href)}
              className="px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 font-body font-medium transition-all rounded-lg"
            >
              {item.en}
            </button>
          ))}
          {pageNavItems.map((item) => (
            <button
              key={item.to}
              onClick={() => handlePageNav(item.to)}
              className={`px-2.5 py-1.5 text-xs font-body font-medium transition-all rounded-lg ${
                location.pathname === item.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
            >
              {item.en}
            </button>
          ))}
          <button
            onClick={() => navigate("/admin")}
            className="px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 font-body font-medium transition-all rounded-lg flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            Admin
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-3 max-h-[70vh] overflow-y-auto">
          {scrollNavItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleScrollOrNav(item.href)}
              className="w-full flex items-center justify-between py-2.5 border-b border-border/50 text-left"
            >
              <span className="font-body text-sm text-foreground font-medium">{item.en}</span>
              <span className="font-urdu text-xs text-muted-foreground">{item.label}</span>
            </button>
          ))}
          {pageNavItems.map((item) => (
            <button
              key={item.to}
              onClick={() => handlePageNav(item.to)}
              className={`w-full flex items-center justify-between py-2.5 border-b border-border/50 text-left ${
                location.pathname === item.to ? "text-primary" : ""
              }`}
            >
              <span className="font-body text-sm text-foreground font-medium">{item.en}</span>
              <span className="font-urdu text-xs text-muted-foreground">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => { setOpen(false); navigate("/admin"); }}
            className="w-full flex items-center justify-between py-2.5 border-b border-border/50 text-left"
          >
            <span className="font-body text-sm text-foreground font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Admin
            </span>
            <span className="font-urdu text-xs text-muted-foreground">ایڈمن</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
