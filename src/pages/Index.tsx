import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
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

const SectionLink = ({ title, titleUrdu, description, icon: Icon, to }: { title: string; titleUrdu: string; description: string; icon: typeof BookOpen; to: string }) => {
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
        className="glass-card w-full p-5 sm:p-6 flex items-center justify-between group hover:border-primary/30 transition-all text-left"
      >
        <div>
          <p className="font-body text-sm sm:text-base text-foreground/80 leading-relaxed">{description}</p>
        </div>
        <ChevronRight className="w-6 h-6 text-primary shrink-0 ml-4 group-hover:translate-x-1 transition-transform" />
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
        <SectionLink
          title="Holy Quran"
          titleUrdu="القرآن الکریم"
          description="Read the Holy Quran with Arabic text, English and Urdu translations. Browse by Surah or Parah."
          icon={BookOpen}
          to="/quran"
        />
        <SectionDivider />
        <SectionLink
          title="Hadith Collection"
          titleUrdu="مجموعۂ احادیث"
          description="Browse authentic hadith collections including Sahih al-Bukhari, Sahih Muslim, and more with English, Arabic & Urdu translations."
          icon={BookOpen}
          to="/hadith-collection"
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
