import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
}

const QuranBrowser = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [englishAyahs, setEnglishAyahs] = useState<Ayah[]>([]);
  const [urduAyahs, setUrduAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [surahsLoading, setSurahsLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState<"english" | "urdu" | "both">("both");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((d) => setSurahs(d.data))
      .catch(console.error)
      .finally(() => setSurahsLoading(false));
  }, []);

  const loadSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setLoading(true);
    try {
      const [arabicRes, englishRes, urduRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`).then((r) => r.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.asad`).then((r) => r.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/ur.jalandhry`).then((r) => r.json()),
      ]);
      setAyahs(arabicRes.data.ayahs);
      setEnglishAyahs(englishRes.data.ayahs);
      setUrduAyahs(urduRes.data.ayahs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <section id="quran" className="px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Holy Quran</h2>
        <span className="font-arabic text-lg text-muted-foreground">القرآن الکریم</span>
      </div>

      {!selectedSurah ? (
        <div className="glass-card p-4 sm:p-6">
          <p className="text-muted-foreground text-sm mb-4">Select a Surah to read</p>
          {surahsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {surahs.map((s) => (
                <button
                  key={s.number}
                  onClick={() => loadSurah(s)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/80 border border-border/30 hover:border-primary/40 transition-all duration-200 text-left group"
                >
                  <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-xs font-bold font-heading shrink-0">
                    {s.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm font-semibold text-foreground truncate">{s.englishName}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.englishNameTranslation}</p>
                  </div>
                  <span className="font-arabic text-base text-accent shrink-0">{s.name}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <button
              onClick={() => { setSelectedSurah(null); setAyahs([]); }}
              className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> All Surahs
            </button>
            <div className="text-center">
              <h3 className="font-heading text-lg font-bold text-foreground">{selectedSurah.englishName}</h3>
              <p className="font-arabic text-xl text-accent">{selectedSurah.name}</p>
              <p className="text-xs text-muted-foreground">{selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} Ayahs</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-secondary/60 p-1">
              {(["both", "english", "urdu"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setShowTranslation(t)}
                  className={`px-3 py-1.5 text-xs rounded-md font-heading font-medium transition-colors ${
                    showTranslation === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "both" ? "Both" : t === "english" ? "English" : "اردو"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {ayahs.map((ayah, i) => (
                <div key={ayah.number} className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-1">
                      {ayah.numberInSurah}
                    </span>
                    <p className="font-arabic text-xl sm:text-2xl leading-[2.2] text-foreground text-right flex-1" dir="rtl">
                      {ayah.text}
                    </p>
                  </div>
                  {(showTranslation === "english" || showTranslation === "both") && englishAyahs[i] && (
                    <p className="text-sm text-muted-foreground leading-relaxed pl-10 mb-2">
                      {englishAyahs[i].text}
                    </p>
                  )}
                  {(showTranslation === "urdu" || showTranslation === "both") && urduAyahs[i] && (
                    <p className="font-arabic text-base text-muted-foreground leading-relaxed pl-10" dir="rtl">
                      {urduAyahs[i].text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default QuranBrowser;
