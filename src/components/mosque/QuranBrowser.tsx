import { useState, useEffect, useCallback } from "react";
import { BookOpen, ChevronRight, ArrowLeft, Loader2, Search, Languages, BookMarked } from "lucide-react";
import { juzSurahMap } from "@/data/juz-surah-map";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface AyahData {
  number: number;
  numberInSurah: number;
  text: string;
  surah?: { number: number };
}

const ALQURAN_API = "https://api.alquran.cloud/v1";

const ENGLISH_EDITIONS = [
  { key: "en.ahmedali", label: "Ahmed Ali" },
  { key: "en.sahih", label: "Saheeh International" },
  { key: "en.yusufali", label: "Abdullah Yusuf Ali" },
  { key: "en.pickthall", label: "Pickthall" },
];



const QuranBrowser = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [arabicVerses, setArabicVerses] = useState<AyahData[]>([]);
  const [englishVerses, setEnglishVerses] = useState<AyahData[]>([]);
  const [urduVerses, setUrduVerses] = useState<AyahData[]>([]);
  const [loading, setLoading] = useState(false);
  const [surahsLoading, setSurahsLoading] = useState(true);
  const [browseMode, setBrowseMode] = useState<"surah" | "juz">("surah");
  const [search, setSearch] = useState("");
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState(ENGLISH_EDITIONS[0].key);
  // Track the current content source for re-fetching on translation change
  const [currentSource, setCurrentSource] = useState<{ id: number; type: "surah" | "juz" } | null>(null);

  useEffect(() => {
    fetch(`${ALQURAN_API}/surah`)
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

  const fetchVerses = useCallback(async (chapterOrJuz: number, type: "surah" | "juz", engEdition: string) => {
    const path = type === "surah" ? `surah/${chapterOrJuz}` : `juz/${chapterOrJuz}`;
    const [arabicRes, englishRes, urduRes] = await Promise.all([
      fetch(`${ALQURAN_API}/${path}/quran-uthmani`),
      fetch(`${ALQURAN_API}/${path}/${engEdition}`),
      fetch(`${ALQURAN_API}/${path}/ur.jalandhry`),
    ]);
    const [arabicData, englishData, urduData] = await Promise.all([
      arabicRes.json(),
      englishRes.json(),
      urduRes.json(),
    ]);
    return {
      arabic: arabicData.data?.ayahs || [],
      english: englishData.data?.ayahs || [],
      urdu: urduData.data?.ayahs || [],
    };
  }, []);

  const loadSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setSelectedJuz(null);
    setCurrentSource({ id: surah.number, type: "surah" });
    setLoading(true);
    try {
      const { arabic, english, urdu } = await fetchVerses(surah.number, "surah", selectedEnglish);
      setArabicVerses(arabic);
      setEnglishVerses(english);
      setUrduVerses(urdu);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadJuz = async (juzNumber: number) => {
    setSelectedJuz(juzNumber);
    setSelectedSurah(null);
    setCurrentSource({ id: juzNumber, type: "juz" });
    setLoading(true);
    try {
      const { arabic, english, urdu } = await fetchVerses(juzNumber, "juz", selectedEnglish);
      setArabicVerses(arabic);
      setEnglishVerses(english);
      setUrduVerses(urdu);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Re-fetch when English translation is changed while reading
  useEffect(() => {
    if (!currentSource) return;
    let cancelled = false;
    const refetch = async () => {
      setLoading(true);
      try {
        const { arabic, english, urdu } = await fetchVerses(currentSource.id, currentSource.type, selectedEnglish);
        if (!cancelled) {
          setArabicVerses(arabic);
          setEnglishVerses(english);
          setUrduVerses(urdu);
        }
      } catch (e) {
        console.error(e);
      }
      if (!cancelled) setLoading(false);
    };
    refetch();
    return () => { cancelled = true; };
  }, [selectedEnglish, currentSource, fetchVerses]);

  const goBack = () => {
    setSelectedSurah(null);
    setSelectedJuz(null);
    setCurrentSource(null);
    setArabicVerses([]);
    setEnglishVerses([]);
    setUrduVerses([]);
  };

  const isReading = selectedSurah || selectedJuz;

  return (
    <section id="quran" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Holy Quran</h2>
        <span className="font-urdu text-sm text-muted-foreground">القرآن الکریم</span>
      </div>

      {!isReading ? (
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 text-[10px] text-muted-foreground/60">
            <BookMarked className="w-3 h-3" />
            <span>Powered by Al Quran Cloud API</span>
          </div>

          {/* Browse mode toggle */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex rounded-lg bg-secondary p-0.5">
              <button
                onClick={() => setBrowseMode("surah")}
                className={`px-4 py-2 text-xs rounded-md font-body font-medium transition-colors ${
                  browseMode === "surah" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Surah — سورة
              </button>
              <button
                onClick={() => setBrowseMode("juz")}
                className={`px-4 py-2 text-xs rounded-md font-body font-medium transition-colors ${
                  browseMode === "juz" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Parah — پارہ
              </button>
            </div>
          </div>

          {browseMode === "surah" ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search surah by name or number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
              </div>

              {surahsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {filteredSurahs.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => loadSurah(s)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-primary/5 border border-border/50 hover:border-primary/30 transition-all duration-200 text-left group"
                    >
                      <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold font-body shrink-0">
                        {s.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-foreground truncate">{s.englishName}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {s.englishNameTranslation} • {s.numberOfAyahs} Ayahs
                        </p>
                      </div>
                      <span className="font-arabic text-base sm:text-lg text-accent shrink-0">{s.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 hidden sm:block" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
              {juzSurahMap.map((j) => (
                <button
                  key={j.number}
                  onClick={() => loadJuz(j.number)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-accent/10 border border-border/50 hover:border-accent/30 transition-all duration-200 text-left group"
                >
                  <span className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold font-body shrink-0">
                    {j.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">{j.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {j.surahs.slice(0, 2).join(", ")}{j.surahs.length > 2 ? ` +${j.surahs.length - 2} more` : ""}
                    </p>
                  </div>
                  <span className="font-arabic text-base text-accent shrink-0">{j.nameArabic}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0 hidden sm:block" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-center flex-1">
              {selectedSurah && (
                <>
                  <h3 className="font-heading text-base font-bold text-foreground">{selectedSurah.englishName}</h3>
                  <p className="font-arabic text-xl text-accent">{selectedSurah.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} Ayahs • {selectedSurah.revelationType}
                  </p>
                </>
              )}
              {selectedJuz && (
                <>
                  <h3 className="font-heading text-base font-bold text-foreground">Parah {selectedJuz}</h3>
                  <p className="font-urdu text-base text-accent" dir="rtl">پارہ {selectedJuz}</p>
                </>
              )}
            </div>
          </div>

          {/* English translation selector */}
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={selectedEnglish}
              onChange={(e) => setSelectedEnglish(e.target.value)}
              className="text-xs bg-secondary border border-border rounded-lg px-2 py-1.5 text-foreground font-body focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {ENGLISH_EDITIONS.map((ed) => (
                <option key={ed.key} value={ed.key}>{ed.label}</option>
              ))}
            </select>
          </div>

          {/* Bismillah */}
          {selectedSurah && selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
            <p className="font-quran text-2xl text-center text-accent mb-5 py-3 bg-accent/5 rounded-xl" dir="rtl">
              بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
            </p>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground font-body">Loading Quran data...</p>
            </div>
          ) : (
            <div className="space-y-5 max-h-[600px] overflow-y-auto pr-1">
              {arabicVerses.map((ayah, i) => {
                const engText = englishVerses[i]?.text;
                const urduText = urduVerses[i]?.text;
                return (
                  <div key={`${ayah.number}`} className="p-4 sm:p-5 rounded-xl bg-secondary/40 border border-border/50">
                    {/* Verse number */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">
                        {ayah.numberInSurah}
                      </span>
                    </div>
                    {/* Arabic */}
                    <p className="font-quran text-xl sm:text-2xl leading-[2.6] text-foreground text-right mb-4" dir="rtl">
                      {ayah.text}
                    </p>
                    {/* English */}
                    {engText && (
                      <p className="text-sm text-muted-foreground leading-[1.9] mb-4 font-body">
                        <span className="text-primary/70 font-semibold text-[10px] mr-1.5 uppercase tracking-wide">EN</span> {engText}
                      </p>
                    )}
                    {/* Urdu */}
                    {urduText && (
                      <p className="font-urdu text-sm text-muted-foreground leading-[2.4]" dir="rtl">
                        <span className="text-accent/70 font-semibold text-[10px] ml-1.5">اردو</span> {urduText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground/50 text-center font-body">
              Arabic: Quran Uthmani • English: {ENGLISH_EDITIONS.find(e => e.key === selectedEnglish)?.label} • Urdu: Fateh Muhammad Jalandhry
            </p>
            <p className="text-[10px] text-muted-foreground/40 text-center font-body mt-1">
              Source: api.alquran.cloud
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuranBrowser;
