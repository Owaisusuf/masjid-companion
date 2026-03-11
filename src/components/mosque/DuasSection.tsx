import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { duaCategories, duasCollection } from "@/data/duas";

const DuasSection = () => {
  const [activeCategory, setActiveCategory] = useState("morning-evening");
  const [expandedDua, setExpandedDua] = useState<number | null>(null);

  const filteredDuas = duasCollection.filter((d) => d.category === activeCategory);

  return (
    <section id="duas" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Heart className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Authentic Duas</h2>
        <span className="font-urdu text-sm text-muted-foreground">مسنون دعائیں</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {duaCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setExpandedDua(null); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-body font-medium transition-all duration-200 border ${
              activeCategory === cat.key
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredDuas.map((dua) => (
          <div key={dua.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
            >
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{dua.title}</p>
                <p className="font-urdu text-xs text-muted-foreground mt-0.5">{dua.titleUrdu}</p>
              </div>
              {expandedDua === dua.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>

            {expandedDua === dua.id && (
              <div className="px-4 pb-5 space-y-5 border-t border-border pt-5">
                {/* Arabic */}
                <p
                  className="font-arabic text-xl sm:text-2xl text-foreground text-center whitespace-pre-line"
                  dir="rtl"
                  style={{ lineHeight: "2.8", letterSpacing: "0.5px" }}
                >
                  {dua.arabic}
                </p>

                {/* English */}
                <p className="text-muted-foreground text-sm leading-relaxed italic text-center max-w-lg mx-auto">
                  "{dua.english}"
                </p>

                {/* Urdu */}
                <p
                  className="font-urdu text-base text-foreground/80 text-center"
                  dir="rtl"
                  style={{ lineHeight: "2.8", wordSpacing: "2px" }}
                >
                  {dua.urdu}
                </p>

                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-primary font-medium">
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
