import { useState, useCallback } from "react";
import { BookOpen, ArrowLeft, Loader2, Search, BookMarked, ChevronRight } from "lucide-react";

interface HadithBook {
  key: string;
  name: string;
  nameArabic: string;
  hadiths: number;
  color: string;
}

interface HadithSection {
  number: number;
  name: string;
  nameArabic: string;
  hadithFrom: number;
  hadithTo: number;
}

interface HadithItem {
  id: number;
  text: string;
  textArabic?: string;
}

const hadithBooks: HadithBook[] = [
  { key: "bukhari", name: "Sahih al-Bukhari", nameArabic: "صحيح البخاري", hadiths: 7563, color: "bg-emerald-700" },
  { key: "muslim", name: "Sahih Muslim", nameArabic: "صحيح مسلم", hadiths: 3032, color: "bg-red-700" },
  { key: "tirmidhi", name: "Jami at-Tirmidhi", nameArabic: "جامع الترمذي", hadiths: 3956, color: "bg-blue-700" },
  { key: "abudawud", name: "Sunan Abu Dawud", nameArabic: "سنن أبي داود", hadiths: 5274, color: "bg-orange-700" },
  { key: "nasai", name: "Sunan an-Nasa'i", nameArabic: "سنن النسائي", hadiths: 5758, color: "bg-gray-700" },
  { key: "ibnmajah", name: "Sunan Ibn Majah", nameArabic: "سنن ابن ماجه", hadiths: 4341, color: "bg-amber-700" },
];

type View = "books" | "sections" | "hadiths";

const HadithCollection = () => {
  const [view, setView] = useState<View>("books");
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [sections, setSections] = useState<HadithSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<HadithSection | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [arabicData, setArabicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchNum, setSearchNum] = useState("");

  const loadBook = useCallback(async (book: HadithBook) => {
    setLoading(true);
    setError("");
    try {
      const [engRes, arbRes] = await Promise.all([
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${book.key}.min.json`),
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${book.key}.min.json`),
      ]);

      let engItems: any[] = [];
      let arbItems: any[] = [];
      let sectionMap: Record<string, { name: string; min: number; max: number }> = {};

      if (engRes.ok) {
        const json = await engRes.json();
        engItems = json?.hadiths || [];
      }
      if (arbRes.ok) {
        const json = await arbRes.json();
        arbItems = json?.hadiths || [];
      }

      setAllData(engItems);
      setArabicData(arbItems);

      // Build sections from metadata
      engItems.forEach((h: any) => {
        const ref = h.reference?.book || h.bookNumber || "1";
        const refStr = String(ref);
        if (!sectionMap[refStr]) {
          sectionMap[refStr] = {
            name: h.grades?.[0]?.grade || `Book ${refStr}`,
            min: h.hadithnumber || 1,
            max: h.hadithnumber || 1,
          };
        } else {
          const num = h.hadithnumber || 1;
          if (num < sectionMap[refStr].min) sectionMap[refStr].min = num;
          if (num > sectionMap[refStr].max) sectionMap[refStr].max = num;
        }
      });

      // Create numbered sections (chapters)
      const totalHadiths = engItems.length;
      const chapterSize = 50;
      const chapSections: HadithSection[] = [];
      for (let i = 0; i < totalHadiths; i += chapterSize) {
        const from = i + 1;
        const to = Math.min(i + chapterSize, totalHadiths);
        chapSections.push({
          number: chapSections.length + 1,
          name: `Hadiths ${from} to ${to}`,
          nameArabic: `أحاديث ${from} إلى ${to}`,
          hadithFrom: from,
          hadithTo: to,
        });
      }

      setSections(chapSections);
      setView("sections");
    } catch {
      setError("Failed to load. Please try again.");
    }
    setLoading(false);
  }, []);

  const selectBook = (book: HadithBook) => {
    setSelectedBook(book);
    setSearchNum("");
    setError("");
    loadBook(book);
  };

  const selectSection = (section: HadithSection) => {
    setSelectedSection(section);
    const items: HadithItem[] = [];
    for (let i = section.hadithFrom - 1; i < section.hadithTo && i < allData.length; i++) {
      const eng = allData[i];
      const arb = arabicData[i];
      items.push({
        id: eng?.hadithnumber || i + 1,
        text: eng?.text || "",
        textArabic: arb?.text || "",
      });
    }
    setHadiths(items);
    setView("hadiths");
  };

  const searchHadith = () => {
    if (!searchNum) return;
    const num = parseInt(searchNum);
    if (isNaN(num) || num < 1 || num > allData.length) {
      setError("Hadith not found. Try a valid number.");
      return;
    }
    const eng = allData[num - 1];
    const arb = arabicData[num - 1];
    if (!eng) {
      setError("Hadith not found.");
      return;
    }
    setHadiths([{ id: eng.hadithnumber || num, text: eng.text || "", textArabic: arb?.text || "" }]);
    setSelectedSection({ number: 0, name: `Hadith #${num}`, nameArabic: "", hadithFrom: num, hadithTo: num });
    setView("hadiths");
    setError("");
  };

  const goBack = () => {
    if (view === "hadiths") {
      setView("sections");
      setHadiths([]);
      setSelectedSection(null);
    } else if (view === "sections") {
      setView("books");
      setSelectedBook(null);
      setSections([]);
      setAllData([]);
      setArabicData([]);
    }
    setError("");
  };

  return (
    <section id="hadith-collection" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Hadith Collection</h2>
      </div>

      {/* Breadcrumb */}
      {view !== "books" && (
        <div className="flex items-center gap-1 text-xs font-body text-muted-foreground mb-4 flex-wrap">
          <button onClick={() => { setView("books"); setSelectedBook(null); setSections([]); setAllData([]); setArabicData([]); }} className="hover:text-primary transition-colors">
            Home
          </button>
          {selectedBook && (
            <>
              <ChevronRight className="w-3 h-3" />
              <button onClick={() => { if (view === "hadiths") goBack(); }} className="hover:text-primary transition-colors">
                {selectedBook.name}
              </button>
            </>
          )}
          {selectedSection && view === "hadiths" && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">{selectedSection.name}</span>
            </>
          )}
        </div>
      )}

      {/* Books Grid */}
      {view === "books" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hadithBooks.map((book) => (
            <button
              key={book.key}
              onClick={() => selectBook(book)}
              className="glass-card p-5 text-left hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className={`w-10 h-12 ${book.color} rounded-sm mb-3 flex items-center justify-center shadow-sm`}>
                    <BookMarked className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {book.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1 font-body">{book.hadiths.toLocaleString()} hadiths</p>
                </div>
                <p className="font-arabic text-base text-accent mt-1" dir="rtl">{book.nameArabic}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      )}

      {/* Sections/Chapters List */}
      {view === "sections" && !loading && selectedBook && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border bg-secondary/30">
            <div className="flex items-center justify-between gap-3">
              <button onClick={goBack} className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Hadith #"
                  value={searchNum}
                  onChange={(e) => setSearchNum(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchHadith()}
                  className="w-24 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button onClick={searchHadith} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs hover:opacity-90 transition-opacity">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-center mt-3">
              <h3 className="font-heading text-lg font-bold text-foreground">{selectedBook.name}</h3>
              <p className="font-arabic text-base text-accent" dir="rtl">{selectedBook.nameArabic}</p>
            </div>
          </div>

          {error && (
            <div className="text-center text-destructive text-sm py-3 bg-destructive/5">{error}</div>
          )}

          <div className="divide-y divide-border/40 max-h-[500px] overflow-y-auto">
            {sections.map((s) => (
              <button
                key={s.number}
                onClick={() => selectSection(s)}
                className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-secondary/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">
                    {s.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {s.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="font-arabic text-sm text-muted-foreground" dir="rtl">{s.nameArabic}</p>
                  <span className="text-xs text-muted-foreground/60 font-body">{s.hadithFrom} to {s.hadithTo}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hadiths View */}
      {view === "hadiths" && !loading && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <button onClick={goBack} className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <p className="font-heading text-sm font-bold text-foreground">{selectedSection?.name}</p>
          </div>

          <div className="divide-y divide-border/30 max-h-[600px] overflow-y-auto">
            {hadiths.map((h) => (
              <div key={h.id} className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">
                    {h.id}
                  </span>
                  <p className="text-[11px] text-muted-foreground/60 font-body">
                    {selectedBook?.name} — Hadith #{h.id}
                  </p>
                </div>

                {/* Arabic text */}
                {h.textArabic && (
                  <div className="p-4 rounded-xl bg-secondary/60 border border-border/40 mb-4">
                    <p className="font-arabic text-base leading-[2.4] text-foreground text-right" dir="rtl">
                      {h.textArabic}
                    </p>
                  </div>
                )}

                {/* English translation */}
                <p className="text-sm leading-relaxed text-foreground/80 font-body">
                  {h.text || <span className="text-muted-foreground italic">Translation not available</span>}
                </p>
              </div>
            ))}

            {hadiths.length === 0 && !error && (
              <p className="text-center text-muted-foreground text-sm py-8">No hadiths found.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HadithCollection;
