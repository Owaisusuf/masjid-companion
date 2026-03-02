import { getDailyHadith } from "@/data/hadith";
import { BookOpen } from "lucide-react";

const DailyHadith = () => {
  const hadith = getDailyHadith();

  return (
    <section id="hadith" className="px-4 max-w-4xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">Hadith of the Day</h2>
        <span className="font-urdu text-base text-muted-foreground whitespace-nowrap">حدیثِ نبوی ﷺ</span>
      </div>

      <div className="glass-card p-5 sm:p-7 text-center glow-primary">
        <p className="font-arabic text-xl sm:text-2xl leading-relaxed text-foreground mb-4" dir="rtl">
          {hadith.arabic}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-xl mx-auto italic">
          "{hadith.english}"
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50">
          <BookOpen className="w-3 h-3 text-primary" />
          <span className="text-xs text-primary font-medium">{hadith.reference}</span>
        </div>
      </div>
    </section>
  );
};

export default DailyHadith;
