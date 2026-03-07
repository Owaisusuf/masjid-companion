import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { namazSteps } from "@/data/namaz-guide";

const NamazGuidePage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-3 h-14">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BookOpen className="w-5 h-5 text-primary shrink-0" />
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-bold text-foreground">Namaz Guide</h1>
            <span className="font-urdu text-sm text-muted-foreground">نماز کا طریقہ</span>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground font-body">
            Learn the meaning of what is recited in Namaz
          </p>
          <p className="font-urdu text-sm text-accent mt-1" dir="rtl">
            نماز میں پڑھی جانے والی دعاؤں کا اردو ترجمہ
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {namazSteps.map((step, index) => (
            <div
              key={step.id}
              className="glass-card overflow-hidden"
            >
              {/* Title bar */}
              <div className="bg-primary/10 border-b border-primary/20 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold font-body shrink-0">
                    {index + 1}
                  </span>
                  <p className="font-body text-sm sm:text-base font-semibold text-foreground">{step.title}</p>
                </div>
                <p className="font-urdu text-sm text-accent shrink-0" dir="rtl">{step.titleUrdu}</p>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-8 space-y-5">
                {/* Note */}
                {step.note && (
                  <p className="font-urdu text-xs text-muted-foreground text-right leading-loose" dir="rtl">
                    ({step.note})
                  </p>
                )}

                {/* Arabic text */}
                <div className="bg-accent/5 rounded-xl p-5 sm:p-8">
                  <p
                    className="font-quran text-2xl sm:text-3xl md:text-4xl text-foreground text-center"
                    dir="rtl"
                    style={{ lineHeight: "3.2" }}
                  >
                    {step.arabic}
                  </p>
                </div>

                {/* Urdu translation */}
                <div className="border-t border-border/30 pt-4">
                  <p
                    className="font-urdu text-base sm:text-lg text-muted-foreground text-right"
                    dir="rtl"
                    style={{ lineHeight: "2.6" }}
                  >
                    {step.urduTranslation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <div className="text-center mt-8 mb-12">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-body text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </main>
  );
};

export default NamazGuidePage;
