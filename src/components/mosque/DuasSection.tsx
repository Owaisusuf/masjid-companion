import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { duaCategories, duasCollection } from "@/data/duas";

const DuasSection = () => {
  const [activeCategory, setActiveCategory] = useState("morning-evening");
  const [expandedDua, setExpandedDua] = useState<number | null>(null);

  const filteredDuas = duasCollection.filter((d) => d.category === activeCategory);

  return (
    <section id="duas" className="px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Authentic Duas</h2>
        <span className="font-arabic text-lg text-muted-foreground">مسنون دعائیں</span>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {duaCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setExpandedDua(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-heading font-medium transition-all duration-200 border ${
              activeCategory === cat.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/40 text-muted-foreground border-border/30 hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat.label}
            <span className="font-urdu text-xs ml-2">{cat.urdu}</span>
          </button>
        ))}
      </div>

      {/* Duas list */}
      <div className="space-y-3">
        {filteredDuas.map((dua) => (
          <div key={dua.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
            >
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">{dua.title}</p>
                <p className="font-urdu text-sm text-muted-foreground leading-[2]">{dua.titleUrdu}</p>
              </div>
              {expandedDua === dua.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>

            {expandedDua === dua.id && (
              <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
                <p className="font-arabic text-xl sm:text-2xl leading-[2] text-foreground text-center" dir="rtl">
                  {dua.arabic}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed italic text-center">
                  "{dua.english}"
                </p>
                <p className="font-urdu text-base text-muted-foreground leading-[2.2] text-center" dir="rtl">
                  {dua.urdu}
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50 text-xs text-primary font-medium">
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
