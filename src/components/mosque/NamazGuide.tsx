import { BookOpen } from "lucide-react";
import { namazSteps } from "@/data/namaz-guide";

const NamazGuide = () => {
  return (
    <section id="namaz-guide" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Namaz Guide</h2>
        <span className="font-urdu text-sm text-muted-foreground">نماز کا طریقہ</span>
      </div>

      <div className="glass-card p-4 sm:p-6">
        <p className="text-center text-sm text-muted-foreground font-body mb-2">
          Learn the meaning of what is recited in Namaz
        </p>
        <p className="text-center font-urdu text-sm text-accent mb-6" dir="rtl">
          نماز میں پڑھی جانے والی دعاؤں کا اردو ترجمہ
        </p>

        <div className="space-y-4">
          {namazSteps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-xl border border-border/50 bg-secondary/30 overflow-hidden"
            >
              {/* Title bar */}
              <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold font-body shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{step.title}</p>
                  </div>
                </div>
                <p className="font-urdu text-sm text-accent shrink-0" dir="rtl">{step.titleUrdu}</p>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Note if exists */}
                {step.note && (
                  <p className="font-urdu text-xs text-muted-foreground text-right leading-[2]" dir="rtl">
                    ({step.note})
                  </p>
                )}

                {/* Arabic text - centered, large */}
                <div className="bg-accent/5 rounded-xl p-4 sm:p-6">
                  <p
                    className="font-quran text-xl sm:text-2xl md:text-3xl leading-[2.8] text-foreground text-center"
                    dir="rtl"
                  >
                    {step.arabic}
                  </p>
                </div>

                {/* Urdu translation - right aligned */}
                <div className="border-t border-border/30 pt-3">
                  <p className="font-urdu text-sm sm:text-base leading-[2.4] text-muted-foreground text-right" dir="rtl">
                    {step.urduTranslation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border/30 text-center">
          <p className="text-[10px] text-muted-foreground/50 font-body">
            Source: www.namazurdu.com • Based on Hanafi Fiqh
          </p>
        </div>
      </div>
    </section>
  );
};

export default NamazGuide;
