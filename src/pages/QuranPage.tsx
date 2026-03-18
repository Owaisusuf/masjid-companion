import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Columns } from "lucide-react";
import QuranBrowser from "@/components/mosque/QuranBrowser";
import Quran15Line from "@/components/mosque/Quran15Line";

const QuranPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"reader" | "15line">("reader");

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-heading text-base sm:text-lg font-bold text-foreground truncate">Holy Quran</h1>
          <span className="font-urdu text-sm text-muted-foreground hidden sm:inline">القرآن الکریم</span>

          {/* Mode toggle */}
          <div className="ml-auto flex rounded-lg bg-secondary p-0.5">
            <button
              onClick={() => setMode("reader")}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md font-body font-medium transition-colors ${
                mode === "reader" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">With Translation</span>
              <span className="sm:hidden">Trans.</span>
            </button>
            <button
              onClick={() => setMode("15line")}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md font-body font-medium transition-colors ${
                mode === "15line" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Columns className="w-3 h-3" />
              <span className="hidden sm:inline">15 Line Quran</span>
              <span className="sm:hidden">15 Line</span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8">
        {mode === "reader" ? <QuranBrowser /> : <Quran15Line />}
      </div>
    </main>
  );
};

export default QuranPage;
