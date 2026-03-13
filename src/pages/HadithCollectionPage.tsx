import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import HadithCollection from "@/components/mosque/HadithCollection";

const HadithCollectionPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-heading text-base sm:text-lg font-bold text-foreground truncate">Hadith Collection</h1>
          <span className="font-urdu text-sm text-muted-foreground hidden sm:inline">مجموعۂ احادیث</span>
        </div>
      </div>

      <div className="py-4 sm:py-6">
        <HadithCollection onExit={() => navigate(-1)} />
      </div>
    </main>
  );
};

export default HadithCollectionPage;
