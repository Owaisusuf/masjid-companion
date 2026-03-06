import { useState, useCallback } from "react";
import { BookOpen, ArrowLeft, Loader2, Search, ChevronRight } from "lucide-react";

interface HadithBook {
  key: string;
  name: string;
  nameArabic: string;
  description: string;
  hadiths: number;
  books: number;
}

interface BookSection {
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
  {
    key: "bukhari",
    name: "Sahih al-Bukhari",
    nameArabic: "صحيح البخاري",
    description: "Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari (d. 256 AH/870 CE). His collection is recognized by the overwhelming majority of the Muslim world to be the most authentic collection of reports of the Sunnah of the Prophet Muhammad (ﷺ).",
    hadiths: 7563,
    books: 97,
  },
  {
    key: "muslim",
    name: "Sahih Muslim",
    nameArabic: "صحيح مسلم",
    description: "Sahih Muslim is a collection of hadith compiled by Imam Muslim ibn al-Hajjaj al-Naysaburi (d. 261 AH/875 CE). His collection is considered to be one of the most authentic collections of the Sunnah of the Prophet (ﷺ).",
    hadiths: 3032,
    books: 56,
  },
  {
    key: "tirmidhi",
    name: "Jami` at-Tirmidhi",
    nameArabic: "جامع الترمذي",
    description: "Jami` at-Tirmidhi is a collection of hadith compiled by Imam Abu `Isa Muhammad at-Tirmidhi (d. 279 AH/892 CE). It contains roughly 3956 hadith and is one of the six major hadith collections.",
    hadiths: 3956,
    books: 49,
  },
  {
    key: "abudawud",
    name: "Sunan Abu Dawud",
    nameArabic: "سنن أبي داود",
    description: "Sunan Abu Dawud is a collection of hadith compiled by Imam Abu Dawud Sulayman ibn al-Ash'ath as-Sijistani (d. 275 AH/889 CE). It is one of the six major hadith collections.",
    hadiths: 5274,
    books: 43,
  },
  {
    key: "nasai",
    name: "Sunan an-Nasa'i",
    nameArabic: "سنن النسائي",
    description: "Sunan an-Nasa'i is a collection of hadith compiled by Imam Ahmad an-Nasa'i (d. 303 AH/915 CE). It is one of the six canonical hadith collections.",
    hadiths: 5758,
    books: 51,
  },
  {
    key: "ibnmajah",
    name: "Sunan Ibn Majah",
    nameArabic: "سنن ابن ماجه",
    description: "Sunan Ibn Majah is a collection of hadith compiled by Imam Muhammad bin Yazid Ibn Majah al-Qazvini (d. 273 AH/887 CE). It is one of the six major hadith collections.",
    hadiths: 4341,
    books: 37,
  },
];

type View = "books" | "sections" | "hadiths";

const HadithCollection = () => {
  const [view, setView] = useState<View>("books");
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [sections, setSections] = useState<BookSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<BookSection | null>(null);
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

      // Build book sections from reference.book field
      const bookMap: Record<string, { min: number; max: number; count: number }> = {};
      engItems.forEach((h: any) => {
        const ref = String(h.reference?.book || h.bookNumber || "1");
        if (!bookMap[ref]) {
          bookMap[ref] = { min: h.hadithnumber || 1, max: h.hadithnumber || 1, count: 1 };
        } else {
          const num = h.hadithnumber || 1;
          if (num < bookMap[ref].min) bookMap[ref].min = num;
          if (num > bookMap[ref].max) bookMap[ref].max = num;
          bookMap[ref].count++;
        }
      });

      // Create chapters of 50 hadiths each for clean navigation
      const totalHadiths = engItems.length;
      const chapterSize = 50;
      const chapSections: BookSection[] = [];
      for (let i = 0; i < totalHadiths; i += chapterSize) {
        const from = i + 1;
        const to = Math.min(i + chapterSize, totalHadiths);
        chapSections.push({
          number: chapSections.length + 1,
          name: `Hadiths ${from} – ${to}`,
          nameArabic: `أحاديث ${from} – ${to}`,
          hadithFrom: from,
          hadithTo: to,
        });
      }

      setSections(chapSections);
      setView("sections");
    } catch {
      setError("Failed to load. Please check your connection and try again.");
    }
    setLoading(false);
  }, []);

  const selectBook = (book: HadithBook) => {
    setSelectedBook(book);
    setSearchNum("");
    setError("");
    loadBook(book);
  };

  const selectSection = (section: BookSection) => {
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

  const resetToBooks = () => {
    setView("books");
    setSelectedBook(null);
    setSelectedSection(null);
    setSections([]);
    setAllData([]);
    setArabicData([]);
    setHadiths([]);
    setError("");
  };

  return (
    <section id="hadith-collection" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Hadith Collection</h2>
        <span className="font-urdu text-sm text-muted-foreground">مجموعۂ احادیث</span>
      </div>

      {/* Breadcrumb - sunnah.com style */}
      {view !== "books" && (
        <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground mb-4 flex-wrap">
          <button onClick={resetToBooks} className="hover:text-primary transition-colors font-medium">
            Home
          </button>
          {selectedBook && (
            <>
              <span className="text-muted-foreground/40">»</span>
              <button
                onClick={() => { if (view === "hadiths") goBack(); }}
                className={`hover:text-primary transition-colors ${view === "sections" ? "text-foreground font-semibold" : ""}`}
              >
                {selectedBook.name}
              </button>
            </>
          )}
          {selectedSection && view === "hadiths" && (
            <>
              <span className="text-muted-foreground/40">»</span>
              <span className="text-foreground font-semibold">{selectedSection.name}</span>
            </>
          )}
        </div>
      )}

      {/* Books Grid - sunnah.com style cards */}
      {view === "books" && (
        <div className="space-y-4">
          {hadithBooks.map((book) => (
            <button
              key={book.key}
              onClick={() => selectBook(book)}
              className="w-full glass-card p-5 sm:p-6 text-left hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                    {book.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body line-clamp-2 mb-2">{book.description}</p>
                  <p className="text-[11px] text-muted-foreground/60 font-body">
                    {book.hadiths.toLocaleString()} hadiths • {book.books} books
                  </p>
                </div>
                <p className="font-arabic text-xl sm:text-2xl text-accent shrink-0 mt-1" dir="rtl">
                  {book.nameArabic}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-body">Loading hadith data...</p>
        </div>
      )}

      {/* Sections/Chapters - sunnah.com table style */}
      {view === "sections" && !loading && selectedBook && (
        <div className="glass-card overflow-hidden">
          {/* Book header */}
          <div className="p-5 sm:p-6 border-b border-border bg-primary/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{selectedBook.name}</h3>
              <p className="font-arabic text-xl text-accent" dir="rtl">{selectedBook.nameArabic}</p>
            </div>
            <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4">{selectedBook.description}</p>

            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="number"
                  placeholder="Search by hadith #..."
                  value={searchNum}
                  onChange={(e) => setSearchNum(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchHadith()}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <button onClick={searchHadith} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Search className="w-4 h-4" />
              </button>
              <button onClick={goBack} className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors text-xs font-body">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="text-center text-destructive text-sm py-3 bg-destructive/5 border-b border-border">{error}</div>
          )}

          {/* Sections list - sunnah.com numbered rows */}
          <div className="divide-y divide-border/40 max-h-[450px] overflow-y-auto">
            {sections.map((s) => (
              <button
                key={s.number}
                onClick={() => selectSection(s)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-secondary/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">
                    {s.number}
                  </span>
                  <p className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {s.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <p className="font-arabic text-sm text-muted-foreground hidden sm:block" dir="rtl">{s.nameArabic}</p>
                  <span className="text-xs text-muted-foreground/60 font-body whitespace-nowrap">
                    {s.hadithFrom} to {s.hadithTo}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hadiths View - sunnah.com style with Arabic right, English left */}
      {view === "hadiths" && !loading && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border bg-primary/5 flex items-center justify-between gap-3">
            <button onClick={goBack} className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium shrink-0">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-right">
              <p className="font-heading text-sm font-bold text-foreground">{selectedBook?.name}</p>
              <p className="text-xs text-muted-foreground font-body">{selectedSection?.name}</p>
            </div>
          </div>

          <div className="divide-y divide-border/30 max-h-[600px] overflow-y-auto">
            {hadiths.map((h) => (
              <div key={h.id} className="p-4 sm:p-6">
                {/* Hadith number badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-body">
                    Hadith {h.id}
                  </span>
                  <span className="text-[11px] text-muted-foreground/50 font-body">{selectedBook?.name}</span>
                </div>

                {/* Arabic text - right aligned, green-tinted background like sunnah.com */}
                {h.textArabic && (
                  <div className="p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/10 mb-4">
                    <p className="font-arabic text-base sm:text-lg leading-[2.6] text-foreground text-right" dir="rtl">
                      {h.textArabic}
                    </p>
                  </div>
                )}

                {/* English translation */}
                {h.text && (
                  <div className="pl-0 sm:pl-2">
                    <p className="text-sm leading-relaxed text-foreground/80 font-body">
                      {h.text}
                    </p>
                  </div>
                )}

                {!h.text && !h.textArabic && (
                  <p className="text-muted-foreground italic text-sm">Translation not available</p>
                )}
              </div>
            ))}

            {hadiths.length === 0 && !error && (
              <p className="text-center text-muted-foreground text-sm py-10 font-body">No hadiths found.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HadithCollection;
