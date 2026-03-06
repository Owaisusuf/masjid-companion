import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import mosqueLogo from "@/assets/mosque-logo.png";

const navItems = [
  { label: "نماز", en: "Prayer", href: "#prayers" },
  { label: "رمضان", en: "Ramadan", href: "#ramadan" },
  { label: "قرآن", en: "Quran", href: "#quran" },
  { label: "احادیث", en: "Hadith", href: "#hadith-collection" },
  { label: "قبلہ", en: "Qibla", href: "#qibla" },
  { label: "دعائیں", en: "Duas", href: "#duas" },
  { label: "اسماء", en: "Names", href: "#names" },
  { label: "تسبیح", en: "Tasbih", href: "#tasbih" },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <a href="#" className="flex items-center gap-2">
          <img src={mosqueLogo} alt="Jamia Masjid Shareef" className="w-8 h-8 object-contain" />
          <span className="font-heading font-bold text-primary text-sm sm:text-base">
            Jamia Masjid
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 font-body font-medium transition-all rounded-lg"
            >
              {item.en}
            </button>
          ))}
          <button
            onClick={() => navigate("/admin")}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 font-body font-medium transition-all rounded-lg flex items-center gap-1"
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
        <div className="md:hidden bg-card border-b border-border px-4 pb-3">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="w-full flex items-center justify-between py-3 border-b border-border/50 text-left"
            >
              <span className="font-body text-sm text-foreground font-medium">{item.en}</span>
              <span className="font-urdu text-xs text-muted-foreground">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => { setOpen(false); navigate("/admin"); }}
            className="w-full flex items-center justify-between py-3 border-b border-border/50 text-left"
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
