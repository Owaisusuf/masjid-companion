import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, ArrowLeft, Loader2, Search } from "lucide-react";

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

const juzData = Array.from({ length: 30 }, (_, i) => ({ number: i + 1 }));

const QuranBrowser = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [englishAyahs, setEnglishAyahs] = useState<Ayah[]>([]);
  const [urduAyahs, setUrduAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [surahsLoading, setSurahsLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState<"english" | "urdu" | "both">("both");
  const [browseMode, setBrowseMode] = useState<"surah" | "juz">("surah");
  const [search, setSearch] = useState("");
  const [juzAyahs, setJuzAyahs] = useState<{ arabic: Ayah[]; english: Ayah[]; urdu: Ayah[] } | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((d) => setSurahs(d.data))
      .catch(console.error)
      .finally(() => setSurahsLoading(false));
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      s.number.toString() === search
  );

  const loadSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setSelectedJuz(null);
    setJuzAyahs(null);
    setLoading(true);
    try {
      const [arabicRes, englishRes, urduRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`).then((r) => r.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.sahih`).then((r) => r.json()),
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

  const loadJuz = async (juzNumber: number) => {
    setSelectedJuz(juzNumber);
    setSelectedSurah(null);
    setLoading(true);
    try {
      const [arabicRes, englishRes, urduRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`).then((r) => r.json()),
        fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/en.sahih`).then((r) => r.json()),
        fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/ur.jalandhry`).then((r) => r.json()),
      ]);
      setJuzAyahs({ arabic: arabicRes.data.ayahs, english: englishRes.data.ayahs, urdu: urduRes.data.ayahs });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const goBack = () => {
    setSelectedSurah(null);
    setSelectedJuz(null);
    setAyahs([]);
    setJuzAyahs(null);
  };

  const isReading = selectedSurah || selectedJuz;

  return (
    <section id="quran" className="px-4 max-w-4xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">Holy Quran</h2>
        <span className="font-urdu text-base text-muted-foreground whitespace-nowrap">القرآن الکریم</span>
      </div>

      {!isReading ? (
        <div className="glass-card p-3 sm:p-5">
          {/* Browse mode toggle */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex rounded-lg bg-secondary/60 p-0.5">
              <button
                onClick={() => setBrowseMode("surah")}
                className={`px-3 py-1.5 text-xs rounded-md font-heading font-medium transition-colors ${
                  browseMode === "surah" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                سورة — Surah
              </button>
              <button
                onClick={() => setBrowseMode("juz")}
                className={`px-3 py-1.5 text-xs rounded-md font-heading font-medium transition-colors ${
                  browseMode === "juz" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                پارہ — Juz
              </button>
            </div>
          </div>

          {browseMode === "surah" ? (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search surah..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground text-xs font-heading placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              {surahsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[400px] overflow-y-auto pr-1">
                  {filteredSurahs.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => loadSurah(s)}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/40 hover:bg-secondary/80 border border-border/30 hover:border-primary/40 transition-all duration-200 text-left group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold font-heading shrink-0">
                        {s.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-xs font-semibold text-foreground truncate">{s.englishName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {s.englishNameTranslation} • {s.numberOfAyahs} آیات • {s.revelationType === "Meccan" ? "مکی" : "مدنی"}
                        </p>
                      </div>
                      <span className="font-arabic text-base text-accent shrink-0">{s.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-1.5 max-h-[400px] overflow-y-auto pr-1">
              {juzData.map((j) => (
                <button
                  key={j.number}
                  onClick={() => loadJuz(j.number)}
                  className="p-3 rounded-xl bg-secondary/40 hover:bg-secondary/80 border border-border/30 hover:border-accent/40 transition-all duration-200 text-center group"
                >
                  <p className="font-heading text-xl font-bold text-accent group-hover:scale-110 transition-transform">
                    {j.number}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-heading">پارہ</p>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-3 sm:p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-xs font-heading"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> واپس
            </button>
            <div className="text-center">
              {selectedSurah && (
                <>
                  <h3 className="font-heading text-sm font-bold text-foreground">{selectedSurah.englishName}</h3>
                  <p className="font-arabic text-lg text-accent">{selectedSurah.name}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} آیات</p>
                </>
              )}
              {selectedJuz && (
                <>
                  <h3 className="font-heading text-sm font-bold text-foreground">Parah {selectedJuz}</h3>
                  <p className="font-urdu text-base text-accent" dir="rtl">پارہ {selectedJuz}</p>
                </>
              )}
            </div>
            <div className="flex gap-0.5 rounded-lg bg-secondary/60 p-0.5">
              {(["both", "english", "urdu"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setShowTranslation(t)}
                  className={`px-2 py-1 text-[10px] rounded-md font-heading font-medium transition-colors ${
                    showTranslation === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "both" ? "Both" : t === "english" ? "English" : "اردو"}
                </button>
              ))}
            </div>
          </div>

          {selectedSurah && selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
            <p className="font-quran text-xl text-center text-accent mb-4" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {(selectedSurah ? ayahs : juzAyahs?.arabic || []).map((ayah, i) => {
                const engText = selectedSurah ? englishAyahs[i]?.text : juzAyahs?.english[i]?.text;
                const urduText = selectedSurah ? urduAyahs[i]?.text : juzAyahs?.urdu[i]?.text;
                return (
                  <div key={ayah.number} className="p-3 rounded-xl bg-secondary/30 border border-border/20">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[9px] font-bold shrink-0 mt-1.5 font-heading">
                        {ayah.numberInSurah}
                      </span>
                      <p className="font-quran text-lg sm:text-xl leading-[2.2] text-foreground text-right flex-1" dir="rtl">
                        {ayah.text}
                      </p>
                    </div>
                    {(showTranslation === "english" || showTranslation === "both") && engText && (
                      <p className="text-xs text-muted-foreground leading-relaxed pl-8 mb-1">{engText}</p>
                    )}
                    {(showTranslation === "urdu" || showTranslation === "both") && urduText && (
                      <p className="font-urdu text-sm text-muted-foreground pl-8" dir="rtl">{urduText}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default QuranBrowser;
