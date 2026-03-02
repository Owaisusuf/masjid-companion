import { getDailyHadith } from "@/data/hadith";
import { BookOpen } from "lucide-react";

const DailyHadith = () => {
  const hadith = getDailyHadith();

  return (
    <section id="hadith" className="px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Hadith of the Day</h2>
        <span className="font-arabic text-lg text-muted-foreground">حدیثِ نبوی ﷺ</span>
      </div>

      <div className="glass-card p-8 text-center glow-primary">
        <p className="font-arabic text-2xl leading-relaxed text-foreground mb-6" dir="rtl">
          {hadith.arabic}
        </p>
        <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-2xl mx-auto italic">
          "{hadith.english}"
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/50">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm text-primary font-medium">{hadith.reference}</span>
        </div>
      </div>
    </section>
  );
};

export default DailyHadith;
