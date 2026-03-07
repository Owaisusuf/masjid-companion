import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NamazGuide = () => {
  const navigate = useNavigate();

  return (
    <section id="namaz-guide" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Namaz Guide</h2>
        <span className="font-urdu text-sm text-muted-foreground">نماز کا طریقہ</span>
      </div>

      <div className="glass-card p-5 sm:p-6 text-center">
        <p className="text-sm text-muted-foreground font-body mb-1">
          Learn the complete recitations of Namaz with Urdu translation
        </p>
        <p className="font-urdu text-sm text-accent mb-5" dir="rtl">
          نماز میں پڑھی جانے والی دعاؤں کا اردو ترجمہ
        </p>
        <button
          onClick={() => navigate("/namaz-guide")}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Open Namaz Guide →
        </button>
      </div>
    </section>
  );
};

export default NamazGuide;
