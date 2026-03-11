import { useState } from "react";
import { Star, Search } from "lucide-react";
import { allahNames } from "@/data/allah-names";

const NamesOfAllah = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = allahNames.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      n.english.toLowerCase().includes(search.toLowerCase()) ||
      n.arabic.includes(search)
  );

  const displayNames = expanded ? filtered : filtered.slice(0, 12);

  return (
    <section id="names" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Star className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">99 Names of Allah</h2>
        <span className="font-urdu text-sm text-muted-foreground">اسماء الحسنیٰ</span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search names..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setExpanded(true); }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5" dir="rtl">
        {displayNames.map((name) => (
          <div
            key={name.number}
            className="glass-card p-2 sm:p-3 hover:shadow-md hover:border-accent/30 transition-all duration-300 group text-center"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent/10 text-accent text-[9px] font-bold font-body mb-1">
              {name.number}
            </span>
            <p className="font-arabic text-lg sm:text-xl text-accent group-hover:scale-105 transition-transform leading-tight mb-1">
              {name.arabic}
            </p>
            <p className="font-body text-[10px] sm:text-xs font-semibold text-foreground leading-tight truncate">{name.transliteration}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight truncate">{name.english}</p>
            <p className="font-urdu text-[10px] sm:text-xs text-accent/80 leading-relaxed mt-0.5" dir="rtl">{name.urdu}</p>
          </div>
        ))}
      </div>

      {!search && filtered.length > 12 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-body font-medium hover:bg-primary/20 transition-colors"
          >
            {expanded ? "Show Less" : `Show All ${filtered.length} Names`}
          </button>
        </div>
      )}
    </section>
  );
};

export default NamesOfAllah;
