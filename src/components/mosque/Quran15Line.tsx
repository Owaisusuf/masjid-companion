import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, ChevronLeft, ArrowLeft, Loader2, Search, ZoomIn, ZoomOut } from "lucide-react";
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
  surah?: { number: number; name: string; englishName: string };
}

const ALQURAN_API = "https://api.alquran.cloud/v1";
const LINES_PER_PAGE = 15;

const Quran15Line = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [verses, setVerses] = useState<AyahData[]>([]);
  const [loading, setLoading] = useState(false);
  const [surahsLoading, setSurahsLoading] = useState(true);
  const [browseMode, setBrowseMode] = useState<"surah" | "juz">("surah");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(26);

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

  const loadSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setSelectedJuz(null);
    setCurrentPage(0);
    setLoading(true);
    try {
      const res = await fetch(`${ALQURAN_API}/surah/${surah.number}/quran-uthmani`);
      const data = await res.json();
      setVerses(data.data?.ayahs || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadJuz = async (juzNumber: number) => {
    setSelectedJuz(juzNumber);
    setSelectedSurah(null);
    setCurrentPage(0);
    setLoading(true);
    try {
      const res = await fetch(`${ALQURAN_API}/juz/${juzNumber}/quran-uthmani`);
      const data = await res.json();
      setVerses(data.data?.ayahs || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const goBack = () => {
    setSelectedSurah(null);
    setSelectedJuz(null);
    setVerses([]);
    setCurrentPage(0);
  };

  const isReading = selectedSurah || selectedJuz;
  const totalPages = Math.ceil(verses.length / LINES_PER_PAGE);
  const pagedVerses = verses.slice(currentPage * LINES_PER_PAGE, (currentPage + 1) * LINES_PER_PAGE);

  const goToPage = (p: number) => {
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, p)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find which juz the current surah belongs to
  const currentJuzNumber = selectedSurah
    ? juzSurahMap.find(j => j.surahs.includes(selectedSurah.englishName))?.number || 1
    : selectedJuz || 1;

  const showBismillah = selectedSurah && selectedSurah.number !== 1 && selectedSurah.number !== 9 && currentPage === 0;

  return (
    <section className="px-2 sm:px-4 max-w-4xl mx-auto">
      {/* Section heading - only when browsing */}
      {!isReading && (
        <div className="section-heading mb-5">
          <BookOpen className="w-5 h-5 text-primary shrink-0" />
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">15 Line Quran</h2>
          <span className="font-urdu text-sm text-muted-foreground">پندرہ سطری قرآن</span>
        </div>
      )}

      {!isReading ? (
        <div className="glass-card p-4 sm:p-6">
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
                      <span className="font-nastaleeq text-base sm:text-lg text-accent shrink-0">{s.name}</span>
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
                  <span className="font-nastaleeq text-base text-accent shrink-0">{j.nameArabic}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0 hidden sm:block" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Controls bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFontSize(f => Math.max(18, f - 2))}
                className="w-8 h-8 rounded-lg bg-secondary text-foreground flex items-center justify-center hover:bg-primary/10 transition-colors"
                title="Decrease font"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-muted-foreground font-body w-5 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize(f => Math.min(44, f + 2))}
                className="w-8 h-8 rounded-lg bg-secondary text-foreground flex items-center justify-center hover:bg-primary/10 transition-colors"
                title="Increase font"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-body">Loading Quran...</p>
            </div>
          ) : (
            <>
              {/* ========== QURAN PAGE — Printed style ========== */}
              <div className="quran-page-outer rounded-2xl p-[6px] sm:p-[10px]" style={{
                background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.12), hsl(var(--primary) / 0.15))",
              }}>
                <div className="quran-page-inner rounded-xl overflow-hidden" style={{
                  border: "3px solid hsl(var(--primary) / 0.25)",
                  background: "hsl(var(--card))",
                }}>
                  {/* ── Page Header ── */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b-2" style={{
                    borderColor: "hsl(var(--primary) / 0.2)",
                    background: "hsl(var(--primary) / 0.03)",
                  }}>
                    <span className="font-nastaleeq text-sm sm:text-base text-primary leading-relaxed" dir="rtl">
                      {selectedSurah?.name || `پارہ ${selectedJuz}`}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <span className="font-nastaleeq text-sm sm:text-base text-primary leading-relaxed" dir="rtl">
                      {selectedSurah ? selectedSurah.englishName : `Parah ${selectedJuz}`}
                    </span>
                  </div>

                  {/* ── Bismillah ── */}
                  {showBismillah && (
                    <div className="py-3 sm:py-4 text-center" style={{
                      borderBottom: "1px solid hsl(var(--primary) / 0.12)",
                      background: "hsl(var(--accent) / 0.03)",
                    }}>
                      <p
                        className="font-nastaleeq text-accent"
                        dir="rtl"
                        style={{ fontSize: fontSize + 6, lineHeight: 2.2 }}
                      >
                        بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                      </p>
                    </div>
                  )}

                  {/* ── Verses (15 lines) ── */}
                  <div className="px-4 sm:px-8 py-4 sm:py-6" dir="rtl">
                    {pagedVerses.map((ayah) => (
                      <div
                        key={ayah.number}
                        className="quran-line border-b last:border-b-0"
                        style={{
                          borderColor: "hsl(var(--border) / 0.3)",
                          paddingTop: "0.3em",
                          paddingBottom: "0.3em",
                        }}
                      >
                        <p
                          className="font-nastaleeq text-foreground text-right leading-[2.8] sm:leading-[3]"
                          style={{ fontSize, wordSpacing: "0.08em" }}
                        >
                          {ayah.text}
                          {/* Verse number marker */}
                          <span
                            className="inline-flex items-center justify-center rounded-full border mx-1 align-middle select-none"
                            style={{
                              width: fontSize * 0.85,
                              height: fontSize * 0.85,
                              borderColor: "hsl(var(--primary) / 0.3)",
                              background: "hsl(var(--primary) / 0.06)",
                              fontSize: fontSize * 0.38,
                              fontFamily: "Inter, sans-serif",
                              color: "hsl(var(--primary))",
                              lineHeight: 1,
                            }}
                            dir="ltr"
                          >
                            {ayah.numberInSurah}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* ── Page Footer ── */}
                  <div className="flex items-center justify-center px-4 py-2 border-t" style={{
                    borderColor: "hsl(var(--primary) / 0.15)",
                    background: "hsl(var(--primary) / 0.02)",
                  }}>
                    <span className="font-nastaleeq text-xs sm:text-sm text-muted-foreground" dir="rtl">
                      منزل {currentJuzNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 flex-wrap py-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-body font-medium disabled:opacity-30 hover:bg-primary/10 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                      let page: number;
                      if (totalPages <= 5) page = idx;
                      else if (currentPage < 3) page = idx;
                      else if (currentPage > totalPages - 4) page = totalPages - 5 + idx;
                      else page = currentPage - 2 + idx;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-8 h-8 rounded-lg text-xs font-body font-medium transition-colors ${
                            page === currentPage ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/10"
                          }`}
                        >
                          {page + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-body font-medium disabled:opacity-30 hover:bg-primary/10 transition-colors"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Quran15Line;
