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

interface Juz {
  number: number;
  juzStartInfo: string;
  juzStartSurahNumber: number;
}

// Juz/Parah info with starting surah:ayah
const juzData: Juz[] = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  juzStartInfo: "",
  juzStartSurahNumber: 1,
}));

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
      setJuzAyahs({
        arabic: arabicRes.data.ayahs,
        english: englishRes.data.ayahs,
        urdu: urduRes.data.ayahs,
      });
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
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Holy Quran</h2>
        <span className="font-arabic text-lg text-muted-foreground">القرآن الکریم</span>
      </div>

      {!isReading ? (
        <div className="glass-card p-4 sm:p-6">
          {/* Browse mode toggle */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex rounded-lg bg-secondary/60 p-1">
              <button
                onClick={() => setBrowseMode("surah")}
                className={`px-4 py-2 text-sm rounded-md font-heading font-medium transition-colors ${
                  browseMode === "surah" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                By Surah
              </button>
              <button
                onClick={() => setBrowseMode("juz")}
                className={`px-4 py-2 text-sm rounded-md font-heading font-medium transition-colors ${
                  browseMode === "juz" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                By Parah / Juz
              </button>
            </div>
          </div>

          {browseMode === "surah" ? (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search surah by name or number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground text-sm font-heading placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              {surahsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredSurahs.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => loadSurah(s)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/80 border border-border/30 hover:border-primary/40 transition-all duration-200 text-left group"
                    >
                      <span className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-xs font-bold font-heading shrink-0">
                        {s.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-semibold text-foreground truncate">{s.englishName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {s.englishNameTranslation} • {s.numberOfAyahs} ayahs • {s.revelationType === "Meccan" ? "مکی" : "مدنی"}
                        </p>
                      </div>
                      <span className="font-arabic text-lg text-accent shrink-0">{s.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-h-[500px] overflow-y-auto pr-1">
              {juzData.map((j) => (
                <button
                  key={j.number}
                  onClick={() => loadJuz(j.number)}
                  className="p-4 rounded-xl bg-secondary/40 hover:bg-secondary/80 border border-border/30 hover:border-accent/40 transition-all duration-200 text-center group"
                >
                  <p className="font-heading text-2xl font-bold text-accent group-hover:scale-110 transition-transform">
                    {j.number}
                  </p>
                  <p className="text-xs text-muted-foreground font-heading mt-1">Parah {j.number}</p>
                  <p className="font-arabic text-sm text-muted-foreground">پارہ</p>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-heading"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-center">
              {selectedSurah && (
                <>
                  <h3 className="font-heading text-lg font-bold text-foreground">{selectedSurah.englishName}</h3>
                  <p className="font-arabic text-xl text-accent">{selectedSurah.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} Ayahs</p>
                </>
              )}
              {selectedJuz && (
                <>
                  <h3 className="font-heading text-lg font-bold text-foreground">Parah {selectedJuz}</h3>
                  <p className="font-arabic text-xl text-accent">پارہ {selectedJuz}</p>
                </>
              )}
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

          {/* Bismillah for Surah (except Al-Fatiha and At-Tawbah) */}
          {selectedSurah && selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
            <p className="font-arabic text-2xl text-center text-accent mb-6" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {(selectedSurah ? ayahs : juzAyahs?.arabic || []).map((ayah, i) => {
                const engText = selectedSurah ? englishAyahs[i]?.text : juzAyahs?.english[i]?.text;
                const urduText = selectedSurah ? urduAyahs[i]?.text : juzAyahs?.urdu[i]?.text;
                return (
                  <div key={ayah.number} className="p-4 rounded-xl bg-secondary/30 border border-border/20">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-2">
                        {ayah.numberInSurah}
                      </span>
                      <p className="font-quran text-xl sm:text-2xl leading-[2.4] text-foreground text-right flex-1" dir="rtl">
                        {ayah.text}
                      </p>
                    </div>
                    {(showTranslation === "english" || showTranslation === "both") && engText && (
                      <p className="text-sm text-muted-foreground leading-relaxed pl-10 mb-2">{engText}</p>
                    )}
                    {(showTranslation === "urdu" || showTranslation === "both") && urduText && (
                      <p className="font-urdu text-base text-muted-foreground leading-[2.2] pl-10" dir="rtl">{urduText}</p>
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
