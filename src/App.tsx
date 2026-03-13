import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { listenSync } from "@/lib/syncBus";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NamazGuidePage from "./pages/NamazGuidePage";
import IslamicEventsPage from "./pages/IslamicEventsPage";
import HadithCollectionPage from "./pages/HadithCollectionPage";
import QuranPage from "./pages/QuranPage";
import QuizPage from "./pages/QuizPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  useEffect(() => {
    return listenSync(() => window.location.reload());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/namaz-guide" element={<NamazGuidePage />} />
            <Route path="/islamic-events" element={<IslamicEventsPage />} />
            <Route path="/hadith-collection" element={<HadithCollectionPage />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/islamic-quiz" element={<QuizPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
