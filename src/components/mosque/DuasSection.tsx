import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { duaCategories, duasCollection } from "@/data/duas";

const DuasSection = () => {
  const [activeCategory, setActiveCategory] = useState("morning-evening");
  const [expandedDua, setExpandedDua] = useState<number | null>(null);

  const filteredDuas = duasCollection.filter((d) => d.category === activeCategory);

  return (
    <section id="duas" className="px-4 max-w-4xl mx-auto">
      <div className="section-heading">
        <Heart className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">Authentic Duas</h2>
        <span className="font-urdu text-base text-muted-foreground whitespace-nowrap">مسنون دعائیں</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {duaCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setExpandedDua(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-medium transition-all duration-200 border ${
              activeCategory === cat.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/40 text-muted-foreground border-border/30 hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat.label}
            <span className="font-urdu text-[10px] ml-1.5">{cat.urdu}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredDuas.map((dua) => (
          <div key={dua.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-secondary/30 transition-colors"
            >
              <div>
                <p className="font-heading text-xs font-semibold text-foreground">{dua.title}</p>
                <p className="font-urdu text-xs text-muted-foreground">{dua.titleUrdu}</p>
              </div>
              {expandedDua === dua.id ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              )}
            </button>

            {expandedDua === dua.id && (
              <div className="px-3 pb-3 space-y-3 border-t border-border/30 pt-3">
                <p className="font-arabic text-lg sm:text-xl leading-[2] text-foreground text-center" dir="rtl">
                  {dua.arabic}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed italic text-center">
                  "{dua.english}"
                </p>
                <p className="font-urdu text-sm text-muted-foreground text-center" dir="rtl">
                  {dua.urdu}
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/60 border border-border/50 text-[10px] text-primary font-medium">
                    📖 {dua.reference}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default DuasSection;
