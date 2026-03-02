import { getDailyHadith } from "@/data/hadith";
import { BookOpen } from "lucide-react";

const DailyHadith = () => {
  const hadith = getDailyHadith();

  return (
    <section id="hadith" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Hadith of the Day</h2>
        <span className="font-urdu text-sm text-muted-foreground">حدیثِ نبوی ﷺ</span>
      </div>

      <div className="glass-card p-6 sm:p-8 text-center glow-primary">
        <p className="font-arabic text-xl sm:text-2xl leading-[2] text-foreground mb-5" dir="rtl">
          {hadith.arabic}
        </p>
        <div className="w-16 h-px bg-accent/30 mx-auto mb-5" />
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-xl mx-auto italic">
          "{hadith.english}"
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-primary font-medium font-body">{hadith.reference}</span>
        </div>
      </div>
    </section>
  );
};

export default DailyHadith;