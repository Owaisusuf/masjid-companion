import Navigation from "@/components/mosque/Navigation";
import Header from "@/components/mosque/Header";
import PrayerTimesCard from "@/components/mosque/PrayerTimesCard";
import RamadanSchedule from "@/components/mosque/RamadanSchedule";
import QuranBrowser from "@/components/mosque/QuranBrowser";
import QiblaFinder from "@/components/mosque/QiblaFinder";
import DuasSection from "@/components/mosque/DuasSection";
import DailyHadith from "@/components/mosque/DailyHadith";
import Footer from "@/components/mosque/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Header />
      <div className="space-y-16 py-12">
        <PrayerTimesCard />
        <RamadanSchedule />
        <QuranBrowser />
        <QiblaFinder />
        <DuasSection />
        <DailyHadith />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
