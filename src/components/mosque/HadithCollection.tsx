import { useState, useCallback } from "react";
import { BookOpen, ArrowLeft, Loader2, Search, ChevronRight, Share2, Copy, BookMarked } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  narrator?: string;
  reference?: string;
  inBookRef?: string;
}

// PRIMARY COLLECTIONS - matching sunnah.com exactly
const primaryCollections: HadithBook[] = [
  { key: "bukhari", name: "Sahih al-Bukhari", nameArabic: "صحيح البخاري", description: "Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari (d. 256 AH/870 CE). His collection is recognized by the overwhelming majority of the Muslim world to be the most authentic collection of reports of the Sunnah of the Prophet Muhammad (ﷺ). It contains over 7500 hadith (with repetitions) in 97 books.", hadiths: 7563, books: 97 },
  { key: "muslim", name: "Sahih Muslim", nameArabic: "صحيح مسلم", description: "Sahih Muslim is a collection of hadith compiled by Imam Muslim ibn al-Hajjaj al-Naysaburi (d. 261 AH/875 CE). His collection is considered to be one of the most authentic collections of the Sunnah of the Prophet (ﷺ).", hadiths: 3032, books: 56 },
  { key: "nasai", name: "Sunan an-Nasa'i", nameArabic: "سنن النسائي", description: "Sunan an-Nasa'i is a collection of hadith compiled by Imam Ahmad an-Nasa'i (d. 303 AH/915 CE). It is one of the six canonical hadith collections.", hadiths: 5758, books: 51 },
  { key: "abudawud", name: "Sunan Abu Dawud", nameArabic: "سنن أبي داود", description: "Sunan Abu Dawud is a collection of hadith compiled by Imam Abu Dawud Sulayman ibn al-Ash'ath as-Sijistani (d. 275 AH/889 CE).", hadiths: 5274, books: 43 },
  { key: "tirmidhi", name: "Jami` at-Tirmidhi", nameArabic: "جامع الترمذي", description: "Jami` at-Tirmidhi is a collection of hadith compiled by Imam Abu `Isa Muhammad at-Tirmidhi (d. 279 AH/892 CE). It contains roughly 3956 hadith.", hadiths: 3956, books: 49 },
  { key: "ibnmajah", name: "Sunan Ibn Majah", nameArabic: "سنن ابن ماجه", description: "Sunan Ibn Majah is a collection of hadith compiled by Imam Muhammad bin Yazid Ibn Majah al-Qazvini (d. 273 AH/887 CE).", hadiths: 4341, books: 37 },
];

// SELECTIONS - secondary collections
const secondaryCollections: HadithBook[] = [
  { key: "nawawi40", name: "An-Nawawi's 40 Hadith", nameArabic: "الأربعون النووية", description: "A collection of 40 hadith compiled by Imam Nawawi.", hadiths: 42, books: 1 },
  { key: "riyadussalihin", name: "Riyad as-Salihin", nameArabic: "رياض الصالحين", description: "A collection of hadith compiled by Imam Nawawi. It is widely regarded as one of the most important compilations.", hadiths: 1896, books: 20 },
];

type View = "home" | "sections" | "hadiths";

const HadithCollection = () => {
  const [view, setView] = useState<View>("home");
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [sections, setSections] = useState<BookSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<BookSection | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [arabicData, setArabicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreInfo, setShowMoreInfo] = useState(false);

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

      // Build real book sections from reference.book field
      const bookMap = new Map<string, { items: number[]; minH: number; maxH: number }>();
      engItems.forEach((h: any) => {
        const bookNum = String(h.reference?.book || h.bookNumber || "1");
        if (!bookMap.has(bookNum)) {
          bookMap.set(bookNum, { items: [], minH: h.hadithnumber || 1, maxH: h.hadithnumber || 1 });
        }
        const entry = bookMap.get(bookNum)!;
        entry.items.push(h.hadithnumber || 1);
        const num = h.hadithnumber || 1;
        if (num < entry.minH) entry.minH = num;
        if (num > entry.maxH) entry.maxH = num;
      });

      // Create sections based on actual book divisions
      const chapSections: BookSection[] = [];
      const sortedKeys = Array.from(bookMap.keys()).sort((a, b) => Number(a) - Number(b));
      
      if (sortedKeys.length > 1 && sortedKeys.length <= 120) {
        // Use actual book divisions
        sortedKeys.forEach((key) => {
          const entry = bookMap.get(key)!;
          chapSections.push({
            number: Number(key),
            name: `Book ${key}`,
            nameArabic: `كتاب ${key}`,
            hadithFrom: entry.minH,
            hadithTo: entry.maxH,
          });
        });
      } else {
        // Fallback: chunks of 50
        const totalHadiths = engItems.length;
        const chapterSize = 50;
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
    setSearchQuery("");
    setError("");
    setShowMoreInfo(false);
    loadBook(book);
  };

  const selectSection = (section: BookSection) => {
    setSelectedSection(section);
    const items: HadithItem[] = [];
    
    // Find hadiths that belong to this section
    for (let i = 0; i < allData.length; i++) {
      const eng = allData[i];
      const hNum = eng?.hadithnumber || (i + 1);
      if (hNum >= section.hadithFrom && hNum <= section.hadithTo) {
        const arb = arabicData[i];
        // Extract narrator from English text
        let narrator = "";
        let text = eng?.text || "";
        const narratorMatch = text.match(/^(Narrated\s+[^:]+):\s*/i);
        if (narratorMatch) {
          narrator = narratorMatch[1];
          text = text.substring(narratorMatch[0].length);
        }
        items.push({
          id: hNum,
          text,
          textArabic: arb?.text || "",
          narrator,
          reference: `${selectedBook?.name} ${hNum}`,
          inBookRef: `Book ${section.number}, Hadith ${hNum - section.hadithFrom + 1}`,
        });
      }
    }
    setHadiths(items);
    setView("hadiths");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const num = parseInt(searchQuery);
    if (!isNaN(num) && num >= 1 && num <= allData.length) {
      const eng = allData[num - 1];
      const arb = arabicData[num - 1];
      if (eng) {
        let narrator = "";
        let text = eng?.text || "";
        const narratorMatch = text.match(/^(Narrated\s+[^:]+):\s*/i);
        if (narratorMatch) {
          narrator = narratorMatch[1];
          text = text.substring(narratorMatch[0].length);
        }
        setHadiths([{
          id: eng.hadithnumber || num,
          text,
          textArabic: arb?.text || "",
          narrator,
          reference: `${selectedBook?.name} ${eng.hadithnumber || num}`,
          inBookRef: "",
        }]);
        setSelectedSection({ number: 0, name: `Search: Hadith #${num}`, nameArabic: "", hadithFrom: num, hadithTo: num });
        setView("hadiths");
        setError("");
        return;
      }
    }
    // Text search through hadiths
    const query = searchQuery.toLowerCase();
    const results: HadithItem[] = [];
    for (let i = 0; i < allData.length && results.length < 30; i++) {
      const eng = allData[i];
      if (eng?.text?.toLowerCase().includes(query)) {
        const arb = arabicData[i];
        let narrator = "";
        let text = eng.text || "";
        const narratorMatch = text.match(/^(Narrated\s+[^:]+):\s*/i);
        if (narratorMatch) {
          narrator = narratorMatch[1];
          text = text.substring(narratorMatch[0].length);
        }
        results.push({
          id: eng.hadithnumber || (i + 1),
          text,
          textArabic: arb?.text || "",
          narrator,
          reference: `${selectedBook?.name} ${eng.hadithnumber || (i + 1)}`,
          inBookRef: "",
        });
      }
    }
    if (results.length === 0) {
      setError(`No results found for "${searchQuery}"`);
      return;
    }
    setHadiths(results);
    setSelectedSection({ number: 0, name: `Search: "${searchQuery}" (${results.length} results)`, nameArabic: "", hadithFrom: 0, hadithTo: 0 });
    setView("hadiths");
    setError("");
  };

  const copyHadith = (h: HadithItem) => {
    const text = `${h.narrator ? h.narrator + ": " : ""}${h.text}\n\n— ${h.reference}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Hadith copied to clipboard" });
  };

  const goBack = () => {
    if (view === "hadiths") {
      setView("sections");
      setHadiths([]);
      setSelectedSection(null);
    } else if (view === "sections") {
      setView("home");
      setSelectedBook(null);
      setSections([]);
      setAllData([]);
      setArabicData([]);
    }
    setError("");
  };

  const resetToHome = () => {
    setView("home");
    setSelectedBook(null);
    setSelectedSection(null);
    setSections([]);
    setAllData([]);
    setArabicData([]);
    setHadiths([]);
    setError("");
    setSearchQuery("");
  };

  return (
    <section id="hadith-collection" className="px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Hadith Collection</h2>
        <span className="font-urdu text-sm text-muted-foreground">مجموعۂ احادیث</span>
      </div>

      {/* === HOME VIEW - Sunnah.com style === */}
      {view === "home" && (
        <div className="glass-card overflow-hidden">
          {/* Sunnah.com style header bar */}
          <div className="bg-[hsl(var(--primary))] px-5 py-4 text-center">
            <p className="text-primary-foreground/90 text-xs sm:text-sm font-body tracking-wide">
              The Hadith of the Prophet Muhammad (صلى الله عليه و سلم) at your fingertips
            </p>
          </div>

          {/* Primary Collections */}
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px flex-1 bg-primary/20" />
              <h3 className="text-xs sm:text-sm font-heading font-bold text-primary tracking-wider uppercase">
                Primary Collections
              </h3>
              <span className="font-arabic text-sm text-accent">المصادر الأصلية</span>
              <div className="h-px flex-1 bg-primary/20" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
              {primaryCollections.map((book) => (
                <button
                  key={book.key}
                  onClick={() => selectBook(book)}
                  className="flex items-center justify-between py-3 border-b border-border/40 hover:bg-secondary/30 transition-colors px-2 rounded group"
                >
                  <span className="font-body text-sm text-primary font-medium group-hover:text-accent transition-colors text-left">
                    {book.name}
                  </span>
                  <span className="font-arabic text-base text-foreground/70" dir="rtl">
                    {book.nameArabic}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Collections */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px flex-1 bg-primary/20" />
              <h3 className="text-xs sm:text-sm font-heading font-bold text-primary tracking-wider uppercase">
                Selections
              </h3>
              <span className="font-arabic text-sm text-accent">المصادر الثانوية</span>
              <div className="h-px flex-1 bg-primary/20" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
              {secondaryCollections.map((book) => (
                <button
                  key={book.key}
                  onClick={() => selectBook(book)}
                  className="flex items-center justify-between py-3 border-b border-border/40 hover:bg-secondary/30 transition-colors px-2 rounded group"
                >
                  <span className="font-body text-sm text-primary font-medium group-hover:text-accent transition-colors text-left">
                    {book.name}
                  </span>
                  <span className="font-arabic text-base text-foreground/70" dir="rtl">
                    {book.nameArabic}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-muted-foreground/60 text-xs font-body mt-5">
              Supported languages: English, Arabic
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-body">Loading hadith data...</p>
        </div>
      )}

      {/* === SECTIONS/BOOKS VIEW - Sunnah.com style === */}
      {view === "sections" && !loading && selectedBook && (
        <div className="glass-card overflow-hidden">
          {/* Breadcrumb */}
          <div className="bg-[hsl(var(--primary))] px-4 py-2.5 flex items-center gap-1.5 text-xs text-primary-foreground/80 font-body">
            <button onClick={resetToHome} className="hover:text-primary-foreground transition-colors">Home</button>
            <span>»</span>
            <span className="text-primary-foreground font-medium">{selectedBook.name}</span>
          </div>

          {/* Book header - matching sunnah.com beige background */}
          <div className="p-5 sm:p-6 bg-secondary/30 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">{selectedBook.name}</h3>
              <p className="font-arabic text-2xl text-foreground/70" dir="rtl">{selectedBook.nameArabic}</p>
            </div>
            <p className={`text-xs text-muted-foreground font-body leading-relaxed ${showMoreInfo ? "" : "line-clamp-2"}`}>
              {selectedBook.description}
            </p>
            <button
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="text-primary text-xs font-body mt-1 hover:underline"
            >
              {showMoreInfo ? "Less" : "More information ..."}
            </button>

            {/* Search bar */}
            <div className="flex items-center gap-2 mt-4">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search by hadith # or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <button onClick={handleSearch} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="text-center text-destructive text-sm py-3 bg-destructive/5 border-b border-border">{error}</div>
          )}

          {/* Books/Sections list - sunnah.com table rows */}
          <div className="divide-y divide-border/30 max-h-[500px] overflow-y-auto">
            {sections.map((s) => (
              <button
                key={s.number}
                onClick={() => selectSection(s)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-secondary/40 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">
                    {s.number}
                  </span>
                  <span className="font-body text-sm text-primary font-medium group-hover:text-accent transition-colors">
                    {s.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-muted-foreground">
                  <span className="font-arabic text-sm hidden sm:block" dir="rtl">{s.nameArabic}</span>
                  <span className="text-xs font-body tabular-nums">{s.hadithFrom}</span>
                  <span className="text-xs font-body">to</span>
                  <span className="text-xs font-body tabular-nums">{s.hadithTo}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === HADITHS VIEW - Sunnah.com exact layout === */}
      {view === "hadiths" && !loading && (
        <div className="glass-card overflow-hidden">
          {/* Breadcrumb bar */}
          <div className="bg-[hsl(var(--primary))] px-4 py-2.5 flex items-center gap-1.5 text-xs text-primary-foreground/80 font-body flex-wrap">
            <button onClick={resetToHome} className="hover:text-primary-foreground transition-colors">Home</button>
            <span>»</span>
            <button onClick={goBack} className="hover:text-primary-foreground transition-colors">{selectedBook?.name}</button>
            <span>»</span>
            <span className="text-primary-foreground font-medium">{selectedSection?.name}</span>
          </div>

          {/* Book/Chapter header */}
          <div className="p-4 sm:p-5 bg-secondary/30 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="text-primary hover:text-accent transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{selectedSection?.name}</h3>
                <p className="text-xs text-muted-foreground font-body">{selectedBook?.name}</p>
              </div>
            </div>
            {selectedSection?.nameArabic && (
              <p className="font-arabic text-xl text-foreground/70" dir="rtl">{selectedSection.nameArabic}</p>
            )}
          </div>

          {/* Hadiths list - sunnah.com style */}
          <div className="divide-y divide-border/40 max-h-[700px] overflow-y-auto">
            {hadiths.map((h) => (
              <div key={h.id} className="relative">
                {/* Chapter divider with number */}
                <div className="flex items-center gap-3 px-4 sm:px-6 pt-5 pb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold font-body shrink-0">
                    <BookMarked className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs text-muted-foreground font-body">Hadith {h.id}</span>
                </div>

                {/* Two-column layout: English left, Arabic right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* English - left side */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-r-0 md:border-r border-border/30">
                    {h.narrator && (
                      <p className="text-sm font-body font-semibold text-primary mb-2">{h.narrator}:</p>
                    )}
                    <p className="text-sm leading-relaxed text-foreground/85 font-body">
                      {h.text}
                    </p>
                  </div>

                  {/* Arabic - right side, slightly tinted background */}
                  {h.textArabic && (
                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-primary/[0.03]">
                      <p className="font-arabic text-base sm:text-lg leading-[2.4] text-foreground/90 text-right" dir="rtl">
                        {h.textArabic}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reference footer - sunnah.com style */}
                <div className="px-4 sm:px-6 py-3 bg-secondary/20 border-t border-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="text-[11px] text-muted-foreground font-body space-y-0.5">
                    <p><span className="font-medium text-foreground/70">Reference</span> : <span className="text-primary">{h.reference}</span></p>
                    {h.inBookRef && <p><span className="font-medium text-foreground/70">In-book reference</span> : {h.inBookRef}</p>}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground/50">
                    <button
                      onClick={() => copyHadith(h)}
                      className="hover:text-primary transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: h.reference, text: `${h.narrator ? h.narrator + ": " : ""}${h.text}\n\n— ${h.reference}` });
                        } else {
                          copyHadith(h);
                        }
                      }}
                      className="hover:text-primary transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
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
