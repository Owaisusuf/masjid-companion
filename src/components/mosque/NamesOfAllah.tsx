import { useState } from "react";
import { Star, Search } from "lucide-react";
import { allahNames } from "@/data/allah-names";

const NamesOfAllah = () => {
  const [search, setSearch] = useState("");

  const filtered = allahNames.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      n.english.toLowerCase().includes(search.toLowerCase()) ||
      n.arabic.includes(search)
  );

  return (
    <section id="names" className="px-4 max-w-4xl mx-auto">
      <div className="section-heading">
        <Star className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">99 Names of Allah</h2>
        <span className="font-urdu text-base text-muted-foreground whitespace-nowrap">اسماء الحسنیٰ</span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search names..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground text-sm font-heading placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {filtered.map((name) => (
          <div
            key={name.number}
            className="glass-card p-3 hover:glow-accent transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-1">
              <span className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent text-[10px] font-bold font-heading">
                {name.number}
              </span>
              <p className="font-arabic text-xl text-accent group-hover:scale-105 transition-transform">
                {name.arabic}
              </p>
            </div>
            <p className="font-heading text-xs font-semibold text-foreground">{name.transliteration}</p>
            <p className="text-[10px] text-muted-foreground">{name.english}</p>
            <p className="font-urdu text-xs text-muted-foreground mt-0.5" dir="rtl">{name.urdu}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NamesOfAllah;
