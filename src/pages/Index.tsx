import Header from "@/components/mosque/Header";
import PrayerTimesCard from "@/components/mosque/PrayerTimesCard";
import RamadanSchedule from "@/components/mosque/RamadanSchedule";
import DailyHadith from "@/components/mosque/DailyHadith";
import Footer from "@/components/mosque/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="space-y-12 py-8">
        <PrayerTimesCard />
        <RamadanSchedule />
        <DailyHadith />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
