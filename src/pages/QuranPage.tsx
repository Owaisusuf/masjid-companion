import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import QuranBrowser from "@/components/mosque/QuranBrowser";

const QuranPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-heading text-base sm:text-lg font-bold text-foreground truncate">Holy Quran</h1>
          <span className="font-urdu text-sm text-muted-foreground hidden sm:inline">القرآن الکریم</span>
        </div>
      </div>

      <div className="py-6 sm:py-8">
        <QuranBrowser />
      </div>
    </main>
  );
};

export default QuranPage;
