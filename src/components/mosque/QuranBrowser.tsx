import { useState, useEffect, useCallback } from "react";
import { BookOpen, ChevronRight, ArrowLeft, Loader2, Search, Languages, BookMarked } from "lucide-react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Verse {
  chapter: number;
  verse: number;
  text: string;
}

const QURAN_API = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1";

const EDITIONS = {
  arabic: { key: "ara-quranuthmanihaf", label: "عربی", author: "Uthmani Hafs" },
  english: [
    { key: "eng-mustafakhattaba", label: "Mustafa Khattab (The Clear Quran)" },
    { key: "eng-abdullahyusufal", label: "Abdullah Yusuf Ali" },
    { key: "eng-mohammedmarmadu", label: "Pickthall" },
    { key: "eng-muftitaqiusmani", label: "Mufti Taqi Usmani" },
  ],
  urdu: [
    { key: "alquran:ur.jalandhry", label: "Fateh Muhammad Jalandhry", api: "alquran" },
  ],
};

// alquran.cloud API for surah metadata and Urdu (fawazahmed0 CDN has size limits on urdu editions)
const ALQURAN_API = "https://api.alquran.cloud/v1";

const juzData = Array.from({ length: 30 }, (_, i) => ({ number: i + 1 }));

const QuranBrowser = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [arabicVerses, setArabicVerses] = useState<Verse[]>([]);
  const [englishVerses, setEnglishVerses] = useState<Verse[]>([]);
  const [urduVerses, setUrduVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [surahsLoading, setSurahsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<"all" | "arabic" | "english" | "urdu">("all");
  const [browseMode, setBrowseMode] = useState<"surah" | "juz">("surah");
  const [search, setSearch] = useState("");
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState(EDITIONS.english[0].key);

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

  const fetchEdition = useCallback(async (edition: string, chapterOrJuz: number, type: "surah" | "juz"): Promise<Verse[]> => {
    try {
      // Use fawazahmed0 API for Arabic and English
      const url = `${QURAN_API}/editions/${edition}/${chapterOrJuz}.min.json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("CDN failed");
      const data = await res.json();
      return data.chapter || [];
    } catch {
      // Fallback to alquran.cloud
      try {
        const path = type === "surah" ? `surah/${chapterOrJuz}` : `juz/${chapterOrJuz}`;
        const identifier = edition === "ara-quranuthmanihaf" ? "quran-uthmani" : "en.sahih";
        const res = await fetch(`${ALQURAN_API}/${path}/${identifier}`);
        const data = await res.json();
        return data.data.ayahs.map((a: any) => ({
          chapter: a.surah?.number || chapterOrJuz,
          verse: a.numberInSurah,
          text: a.text,
        }));
      } catch {
        return [];
      }
    }
  }, []);

  const fetchUrdu = useCallback(async (chapterOrJuz: number, type: "surah" | "juz"): Promise<Verse[]> => {
    try {
      const path = type === "surah" ? `surah/${chapterOrJuz}` : `juz/${chapterOrJuz}`;
      const res = await fetch(`${ALQURAN_API}/${path}/ur.jalandhry`);
      const data = await res.json();
      return data.data.ayahs.map((a: any) => ({
        chapter: a.surah?.number || chapterOrJuz,
        verse: a.numberInSurah,
        text: a.text,
      }));
    } catch {
      return [];
    }
  }, []);

  const loadSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setSelectedJuz(null);
    setLoading(true);
    try {
      const [arabic, english, urdu] = await Promise.all([
        fetchEdition(EDITIONS.arabic.key, surah.number, "surah"),
        fetchEdition(selectedEnglish, surah.number, "surah"),
        fetchUrdu(surah.number, "surah"),
      ]);
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
    setLoading(true);
    try {
      const [arabic, english, urdu] = await Promise.all([
        fetchEdition(EDITIONS.arabic.key, juzNumber, "juz"),
        fetchEdition(selectedEnglish, juzNumber, "juz"),
        fetchUrdu(juzNumber, "juz"),
      ]);
      setArabicVerses(arabic);
      setEnglishVerses(english);
      setUrduVerses(urdu);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const goBack = () => {
    setSelectedSurah(null);
    setSelectedJuz(null);
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
          {/* API source badge */}
          <div className="flex items-center gap-2 mb-4 text-[10px] text-muted-foreground/60">
            <BookMarked className="w-3 h-3" />
            <span>Powered by fawazahmed0/quran-api & Al Quran Cloud</span>
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
                        <p className="text-xs text-muted-foreground truncate">
                          {s.englishNameTranslation} • {s.numberOfAyahs} Ayahs • {s.revelationType === "Meccan" ? "Meccan" : "Medinan"}
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
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-2 max-h-[420px] overflow-y-auto pr-1">
              {juzData.map((j) => (
                <button
                  key={j.number}
                  onClick={() => loadJuz(j.number)}
                  className="p-3 rounded-xl bg-secondary/50 hover:bg-accent/10 border border-border/50 hover:border-accent/30 transition-all duration-200 text-center group"
                >
                  <p className="font-heading text-xl font-bold text-accent group-hover:scale-110 transition-transform">
                    {j.number}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-body">Parah</p>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-4 sm:p-6">
          {/* Header controls */}
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

          {/* Display mode & translation selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
              {(["all", "arabic", "english", "urdu"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setDisplayMode(t)}
                  className={`px-2.5 py-1.5 text-[11px] rounded-md font-body font-medium transition-colors ${
                    displayMode === t ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "arabic" ? "عربی" : t === "all" ? "All" : t === "english" ? "EN" : "اردو"}
                </button>
              ))}
            </div>

            {(displayMode === "english" || displayMode === "all") && (
              <div className="flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={selectedEnglish}
                  onChange={(e) => setSelectedEnglish(e.target.value)}
                  className="text-xs bg-secondary border border-border rounded-lg px-2 py-1.5 text-foreground font-body focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {EDITIONS.english.map((ed) => (
                    <option key={ed.key} value={ed.key}>{ed.label}</option>
                  ))}
                </select>
              </div>
            )}
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
              <p className="text-xs text-muted-foreground font-body">Loading from Quran API...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {arabicVerses.map((ayah, i) => {
                const engText = englishVerses[i]?.text;
                const urduText = urduVerses[i]?.text;
                return (
                  <div key={`${ayah.chapter}-${ayah.verse}`} className="p-4 rounded-xl bg-secondary/40 border border-border/50">
                    {/* Arabic text */}
                    {(displayMode === "arabic" || displayMode === "all") && (
                      <div className="flex items-start gap-3 mb-2">
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-2 font-body">
                          {ayah.verse}
                        </span>
                        <p className="font-quran text-xl sm:text-2xl leading-[2.4] text-foreground text-right flex-1" dir="rtl">
                          {ayah.text}
                        </p>
                      </div>
                    )}
                    {/* English translation */}
                    {(displayMode === "english" || displayMode === "all") && engText && (
                      <p className="text-sm text-muted-foreground leading-relaxed pl-10 mb-1.5">
                        {ayah.verse}. {engText}
                      </p>
                    )}
                    {/* Urdu translation */}
                    {(displayMode === "urdu" || displayMode === "all") && urduText && (
                      <p className="font-urdu text-sm text-muted-foreground pl-10" dir="rtl">
                        {urduText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Edition info footer */}
          <div className="mt-4 pt-3 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground/50 text-center font-body">
              Arabic: Quran Uthmani Hafs (qurancomplex.gov.sa) • English: {EDITIONS.english.find(e => e.key === selectedEnglish)?.label} • Urdu: Fateh Muhammad Jalandhry
            </p>
            <p className="text-[10px] text-muted-foreground/40 text-center font-body mt-1">
              Source: fawazahmed0/quran-api & api.alquran.cloud
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuranBrowser;
