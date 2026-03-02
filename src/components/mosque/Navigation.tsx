import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Prayer Times", href: "#prayers", urdu: "نماز" },
  { label: "Ramadan", href: "#ramadan", urdu: "رمضان" },
  { label: "Quran", href: "#quran", urdu: "قرآن" },
  { label: "Hadith", href: "#hadith-collection", urdu: "احادیث" },
  { label: "Qibla", href: "#qibla", urdu: "قبلہ" },
  { label: "Duas", href: "#duas", urdu: "دعائیں" },
  { label: "99 Names", href: "#names", urdu: "اسماء" },
  { label: "Tasbih", href: "#tasbih", urdu: "تسبیح" },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <a href="#" className="font-heading font-bold text-foreground text-sm">
          Jamia Masjid Shareef
        </a>

        {/* Desktop - scrollable */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground font-heading font-medium transition-colors rounded-lg hover:bg-secondary/50 whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border/40 px-4 pb-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="w-full flex items-center justify-between py-3 border-b border-border/20 text-left"
            >
              <span className="font-heading text-sm text-foreground">{item.label}</span>
              <span className="font-arabic text-sm text-muted-foreground">{item.urdu}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
