import Navigation from "@/components/mosque/Navigation";
import Header from "@/components/mosque/Header";
import AnnouncementPopup from "@/components/mosque/AnnouncementPopup";
import PrayerTimesCard from "@/components/mosque/PrayerTimesCard";
import RamadanSchedule from "@/components/mosque/RamadanSchedule";
import QuranBrowser from "@/components/mosque/QuranBrowser";
import HadithCollection from "@/components/mosque/HadithCollection";
import QiblaFinder from "@/components/mosque/QiblaFinder";
import DuasSection from "@/components/mosque/DuasSection";
import NamesOfAllah from "@/components/mosque/NamesOfAllah";
import TasbihCounter from "@/components/mosque/TasbihCounter";
import DailyHadith from "@/components/mosque/DailyHadith";
import Footer from "@/components/mosque/Footer";
import PrayerAlarm from "@/components/mosque/PrayerAlarm";

const SectionDivider = () => (
  <div className="flex items-center justify-center py-3">
    <div className="arch-divider" />
  </div>
);

const Index = () => {
  return (
    <main className="min-h-screen bg-background islamic-pattern">
      <Navigation />
      <Header />
      <div className="space-y-8 sm:space-y-10 py-8 sm:py-10">
        <PrayerTimesCard />
        <SectionDivider />
        <RamadanSchedule />
        <SectionDivider />
        <DailyHadith />
        <SectionDivider />
        <QuranBrowser />
        <SectionDivider />
        <HadithCollection />
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
