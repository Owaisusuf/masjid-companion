import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, BookMarked, Brain } from "lucide-react";
import Navigation from "@/components/mosque/Navigation";
import Header from "@/components/mosque/Header";
import AnnouncementPopup from "@/components/mosque/AnnouncementPopup";
import PrayerTimesCard from "@/components/mosque/PrayerTimesCard";
import RamadanSchedule from "@/components/mosque/RamadanSchedule";
import QiblaFinder from "@/components/mosque/QiblaFinder";
import DuasSection from "@/components/mosque/DuasSection";
import NamesOfAllah from "@/components/mosque/NamesOfAllah";
import TasbihCounter from "@/components/mosque/TasbihCounter";
import DailyHadith from "@/components/mosque/DailyHadith";
import Footer from "@/components/mosque/Footer";
import PrayerAlarm from "@/components/mosque/PrayerAlarm";
import IslamicEvents from "@/components/mosque/IslamicEvents";
import NamazGuide from "@/components/mosque/NamazGuide";

const SectionDivider = () => (
  <div className="flex items-center justify-center py-3">
    <div className="arch-divider" />
  </div>
);

const SectionButton = ({ title, titleUrdu, description, icon: Icon, to }: { title: string; titleUrdu: string; description: string; icon: typeof BookOpen; to: string }) => {
  const navigate = useNavigate();
  return (
    <section className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <Icon className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
        <span className="font-urdu text-sm text-muted-foreground">{titleUrdu}</span>
      </div>
      <button
        onClick={() => navigate(to)}
        className="w-full glass-card p-5 sm:p-6 flex items-center justify-between group hover:border-primary/40 hover:shadow-lg transition-all text-left border-2 border-transparent hover:bg-primary/5"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">{title}</p>
            <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="hidden sm:inline-block px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium group-hover:bg-primary/90 transition-colors">
            Open
          </span>
          <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </section>
  );
};

const Index = () => {
  return (
    <main className="min-h-screen bg-background islamic-pattern">
      <Navigation />
      <Header />
      <div className="space-y-6 sm:space-y-7 py-6 sm:py-8">
        <PrayerTimesCard />
        <SectionDivider />
        <RamadanSchedule />
        <SectionDivider />
        <IslamicEvents />
        <SectionDivider />
        <DailyHadith />
        <SectionDivider />
        <NamazGuide />
        <SectionDivider />
        <SectionButton
          title="Holy Quran"
          titleUrdu="القرآن الکریم"
          description="Read the Holy Quran with Arabic text, English and Urdu translations. Browse by Surah or Parah."
          icon={BookOpen}
          to="/quran"
        />
        <SectionDivider />
        <SectionButton
          title="Hadith Collection"
          titleUrdu="مجموعۂ احادیث"
          description="Browse authentic hadith collections including Sahih al-Bukhari, Sahih Muslim, and more with translations."
          icon={BookMarked}
          to="/hadith-collection"
        />
        <SectionDivider />
        <SectionButton
          title="Islamic Quiz"
          titleUrdu="اسلامی کوئز"
          description="Test your Islamic knowledge with quizzes on Qur'an, Hadith, Seerah, and more. Track your progress and earn badges."
          icon={Brain}
          to="/islamic-quiz"
        />
        <SectionDivider />
        <QiblaFinder />
        <SectionDivider />
        <DuasSection />
        <SectionDivider />
        <NamesOfAllah />
        <SectionDivider />
        <TasbihCounter />
      </div>
      <Footer />
      <PrayerAlarm />
      <AnnouncementPopup />
    </main>
  );
};

export default Index;
