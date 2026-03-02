import { useState } from "react";
import { Menu, X } from "lucide-react";

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

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-12">
        <a href="#" className="font-heading font-bold text-foreground text-xs sm:text-sm">
          Jamia Masjid Shareef
        </a>

        <div className="hidden md:flex items-center gap-0.5 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground font-heading font-medium transition-colors rounded-lg hover:bg-secondary/50 whitespace-nowrap"
            >
              {item.en}
            </button>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-1.5">
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border/40 px-4 pb-3">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="w-full flex items-center justify-between py-2.5 border-b border-border/20 text-left"
            >
              <span className="font-heading text-xs text-foreground">{item.en}</span>
              <span className="font-urdu text-xs text-muted-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
