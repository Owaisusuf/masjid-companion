import { useState, useCallback, useEffect } from "react";
import { BookOpen, ArrowLeft, Loader2, Search, Copy, Share2, BookMarked, ChevronRight, Heart, Bookmark, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* ─── Types matching sunnah.com data model ─── */
interface Collection {
  name: string;
  hasBooks: boolean;
  hasChapters: boolean;
  collection: { name: string; arabicTitle: string; shortIntro: string; totalHadith: number; totalAvailableHadith: number }[];
}

interface BookInfo {
  bookNumber: string;
  book: { name: string; arabicName?: string };
  hadithStartNumber: number;
  hadithEndNumber: number;
  numberOfHadith: number;
}

interface ChapterInfo {
  chapterNumber: string;
  chapterEnglish: string;
  chapterArabic: string;
  chapterUrdu?: string;
}

interface HadithItem {
  hadithNumber: number;
  englishNarrator: string;
  hadithEnglish: string;
  hadithArabic: string;
  hadithUrdu?: string;
  bookNumber: string;
  chapterId?: string;
  reference: string;
  inBookReference: string;
  grades?: { name: string; grade: string }[];
}

/* ─── Collection definitions matching sunnah.com exactly ─── */
const PRIMARY_COLLECTIONS = [
  { key: "bukhari", name: "Sahih al-Bukhari", arabic: "صحيح البخاري", hadiths: 7563, intro: "Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari (d. 256 AH/870 AD). His collection is recognized by the overwhelming majority of the Muslim world to be the most authentic collection of reports of the Sunnah of the Prophet Muhammad (ﷺ). It contains over 7500 hadith (with repetitions) in 97 books." },
  { key: "muslim", name: "Sahih Muslim", arabic: "صحيح مسلم", hadiths: 3032, intro: "Sahih Muslim is a collection of hadith compiled by Imam Muslim ibn al-Hajjaj al-Naysaburi (d. 261 AH/875 AD). His collection is considered to be one of the most authentic collections of the Sunnah of the Prophet (ﷺ), and it contains roughly 7500 hadith (with repetitions) in 57 books." },
  { key: "nasai", name: "Sunan an-Nasa'i", arabic: "سنن النسائي", hadiths: 5758, intro: "Sunan an-Nasa'i is a collection of hadith compiled by Imam Ahmad an-Nasa'i (d. 303 AH/915 AD). His collection is unanimously considered to be one of the six canonical collections of hadith (Kutub as-Sittah) of the Sunnah of the Prophet (ﷺ)." },
  { key: "abudawud", name: "Sunan Abi Dawud", arabic: "سنن أبي داود", hadiths: 5274, intro: "Sunan Abi Dawud is a collection of hadith compiled by Imam Abu Dawud Sulayman ibn al-Ash'ath as-Sijistani (d. 275 AH/889 AD). It is widely considered to be among the six canonical collections of hadith (Kutub as-Sittah)." },
  { key: "tirmidhi", name: "Jami` at-Tirmidhi", arabic: "جامع الترمذي", hadiths: 3956, intro: "Jami` at-Tirmidhi is a collection of hadith compiled by Imam Abu `Isa Muhammad at-Tirmidhi (d. 279 AH/892 AD). His collection is unanimously considered to be one of the six canonical collections of hadith (Kutub as-Sittah)." },
  { key: "ibnmajah", name: "Sunan Ibn Majah", arabic: "سنن ابن ماجه", hadiths: 4341, intro: "Sunan Ibn Majah is a collection of hadith compiled by Imam Muhammad bin Yazid Ibn Majah al-Qazvini (d. 273 AH/887 AD). It is widely considered to be the sixth of the six canonical collections of hadith (Kutub as-Sittah)." },
];

const SECONDARY_COLLECTIONS = [
  { key: "nawawi", name: "40 Hadith Nawawi", arabic: "الأربعون النووية", hadiths: 42, intro: "An-Nawawi's Forty Hadith are forty-two hadith collected by Imam Yahya ibn Sharaf an-Nawawi." },
  { key: "qudsi", name: "40 Hadith Qudsi", arabic: "الأحاديث القدسية", hadiths: 40, intro: "Hadith Qudsi are from amongst the ahadith that narrate words of Allah that were not revealed as part of the Qur'an." },
  { key: "malik", name: "Muwatta Malik", arabic: "موطأ مالك", hadiths: 1832, intro: "Muwatta Imam Malik is the earliest written collection of hadith comprising the subjects of Islamic law, compiled by Imam Malik ibn Anas (d. 179 AH/795 AD)." },
  { key: "dehlawi", name: "40 Hadith Shah Waliullah", arabic: "أربعون حديث دهلوي", hadiths: 40, intro: "Forty Hadith compiled by Shah Waliullah Dehlawi, a renowned Islamic scholar from the Indian subcontinent." },
];

const API_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

type View = "home" | "books" | "hadiths";

const HadithCollection = () => {
  const [view, setView] = useState<View>("home");
  const [selectedCollection, setSelectedCollection] = useState<typeof PRIMARY_COLLECTIONS[0] | null>(null);
  const [books, setBooks] = useState<{ number: number | string; name: string; nameArabic: string; hadithFrom: number; hadithTo: number; count: number }[]>([]);
  const [selectedBook, setSelectedBook] = useState<typeof books[0] | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [allEngData, setAllEngData] = useState<any[]>([]);
  const [allArbData, setAllArbData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hadith-bookmarks");
      if (saved) setBookmarks(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);

  const toggleBookmark = (id: number) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("hadith-bookmarks", JSON.stringify([...next]));
      toast({ title: next.has(id) ? "Bookmarked" : "Removed", description: `Hadith #${id}` });
      return next;
    });
  };

  const loadCollection = useCallback(async (col: typeof PRIMARY_COLLECTIONS[0]) => {
    setLoading(true);
    setError("");
    try {
      const [engRes, arbRes] = await Promise.all([
        fetch(`${API_BASE}/editions/eng-${col.key}.min.json`),
        fetch(`${API_BASE}/editions/ara-${col.key}.min.json`),
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

      setAllEngData(engItems);
      setAllArbData(arbItems);

      // Build book sections from reference.book
      const bookMap = new Map<string, { items: number[]; min: number; max: number }>();
      engItems.forEach((h: any) => {
        const bNum = String(h.reference?.book || h.bookNumber || "1");
        if (!bookMap.has(bNum)) bookMap.set(bNum, { items: [], min: Infinity, max: -Infinity });
        const entry = bookMap.get(bNum)!;
        const hNum = h.hadithnumber || 1;
        entry.items.push(hNum);
        entry.min = Math.min(entry.min, hNum);
        entry.max = Math.max(entry.max, hNum);
      });

      const sortedKeys = Array.from(bookMap.keys()).sort((a, b) => Number(a) - Number(b));
      const bookSections = sortedKeys.length > 1 && sortedKeys.length <= 120
        ? sortedKeys.map(key => {
            const e = bookMap.get(key)!;
            return { number: Number(key), name: `Book ${key}`, nameArabic: `كتاب ${key}`, hadithFrom: e.min, hadithTo: e.max, count: e.items.length };
          })
        : (() => {
            const result: typeof books = [];
            for (let i = 0; i < engItems.length; i += 50) {
              result.push({ number: result.length + 1, name: `Hadiths ${i + 1} – ${Math.min(i + 50, engItems.length)}`, nameArabic: "", hadithFrom: i + 1, hadithTo: Math.min(i + 50, engItems.length), count: Math.min(50, engItems.length - i) });
            }
            return result;
          })();

      setBooks(bookSections);
      setView("books");
    } catch {
      setError("Failed to load collection. Check your connection.");
    }
    setLoading(false);
  }, []);

  const selectCollection = (col: typeof PRIMARY_COLLECTIONS[0]) => {
    setSelectedCollection(col);
    setSearchQuery("");
    setError("");
    setShowInfo(false);
    setPage(0);
    loadCollection(col);
  };

  const selectBook = (book: typeof books[0]) => {
    setSelectedBook(book);
    setPage(0);
    const items: HadithItem[] = [];
    for (let i = 0; i < allEngData.length; i++) {
      const eng = allEngData[i];
      const hNum = eng?.hadithnumber || (i + 1);
      if (hNum >= book.hadithFrom && hNum <= book.hadithTo) {
        const arb = allArbData[i];
        let narrator = "";
        let text = eng?.text || "";
        const match = text.match(/^(Narrated\s+[^:]+):\s*/i);
        if (match) { narrator = match[1]; text = text.slice(match[0].length); }
        items.push({
          hadithNumber: hNum,
          englishNarrator: narrator,
          hadithEnglish: text,
          hadithArabic: arb?.text || "",
          bookNumber: String(book.number),
          reference: `${selectedCollection?.name} ${hNum}`,
          inBookReference: `Book ${book.number}, Hadith ${hNum - book.hadithFrom + 1}`,
        });
      }
    }
    setHadiths(items);
    setView("hadiths");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const num = parseInt(searchQuery);
    if (!isNaN(num)) {
      const eng = allEngData.find((h: any) => (h.hadithnumber || 0) === num);
      if (eng) {
        const idx = allEngData.indexOf(eng);
        const arb = allArbData[idx];
        let narrator = "";
        let text = eng.text || "";
        const match = text.match(/^(Narrated\s+[^:]+):\s*/i);
        if (match) { narrator = match[1]; text = text.slice(match[0].length); }
        setHadiths([{ hadithNumber: num, englishNarrator: narrator, hadithEnglish: text, hadithArabic: arb?.text || "", bookNumber: "", reference: `${selectedCollection?.name} ${num}`, inBookReference: "" }]);
        setSelectedBook({ number: 0, name: `Hadith #${num}`, nameArabic: "", hadithFrom: num, hadithTo: num, count: 1 });
        setView("hadiths");
        setPage(0);
        return;
      }
    }
    // Text search
    const q = searchQuery.toLowerCase();
    const results: HadithItem[] = [];
    for (let i = 0; i < allEngData.length && results.length < 50; i++) {
      const eng = allEngData[i];
      if (eng?.text?.toLowerCase().includes(q)) {
        const arb = allArbData[i];
        let narrator = "";
        let text = eng.text || "";
        const match = text.match(/^(Narrated\s+[^:]+):\s*/i);
        if (match) { narrator = match[1]; text = text.slice(match[0].length); }
        results.push({ hadithNumber: eng.hadithnumber || (i + 1), englishNarrator: narrator, hadithEnglish: text, hadithArabic: arb?.text || "", bookNumber: "", reference: `${selectedCollection?.name} ${eng.hadithnumber || (i + 1)}`, inBookReference: "" });
      }
    }
    if (!results.length) { setError(`No results for "${searchQuery}"`); return; }
    setHadiths(results);
    setSelectedBook({ number: 0, name: `Search: "${searchQuery}" (${results.length})`, nameArabic: "", hadithFrom: 0, hadithTo: 0, count: results.length });
    setView("hadiths");
    setPage(0);
    setError("");
  };

  const copyHadith = (h: HadithItem) => {
    const text = `${h.englishNarrator ? h.englishNarrator + ": " : ""}${h.hadithEnglish}\n\n— ${h.reference}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Hadith copied to clipboard" });
  };

  const shareHadith = (h: HadithItem) => {
    const text = `${h.englishNarrator ? h.englishNarrator + ": " : ""}${h.hadithEnglish}\n\n— ${h.reference}`;
    if (navigator.share) {
      navigator.share({ title: h.reference, text });
    } else {
      copyHadith(h);
    }
  };

  const goBack = () => {
    if (view === "hadiths") { setView("books"); setHadiths([]); setSelectedBook(null); setPage(0); }
    else if (view === "books") { setView("home"); setSelectedCollection(null); setBooks([]); setAllEngData([]); setAllArbData([]); }
    setError("");
  };

  const resetHome = () => {
    setView("home"); setSelectedCollection(null); setSelectedBook(null);
    setBooks([]); setHadiths([]); setAllEngData([]); setAllArbData([]);
    setError(""); setSearchQuery(""); setPage(0);
  };

  // Pagination
  const pagedHadiths = hadiths.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(hadiths.length / PAGE_SIZE);

  return (
    <section id="hadith-collection" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Hadith Collection</h2>
        <span className="font-urdu text-sm text-muted-foreground">مجموعۂ احادیث</span>
      </div>

      {/* ═══ HOME ═══ */}
      {view === "home" && (
        <div className="glass-card overflow-hidden">
          {/* Green top bar - sunnah.com */}
          <div className="bg-[hsl(var(--primary))] px-4 py-3 sm:px-6 sm:py-4 text-center">
            <p className="text-primary-foreground text-xs sm:text-sm font-body">
              The Hadith of the Prophet Muhammad (صلى الله عليه و سلم) at your fingertips
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {/* Search across all */}
            <div className="mb-6">
              <p className="text-center text-xs text-muted-foreground font-body mb-3">
                Search by keyword or hadith number after selecting a collection
              </p>
            </div>

            {/* Primary Collections */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <h3 className="text-xs font-heading font-bold text-primary tracking-wider uppercase whitespace-nowrap">Primary Collections</h3>
              <span className="font-arabic text-sm text-accent whitespace-nowrap">الكتب الستة</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {PRIMARY_COLLECTIONS.map((col) => (
                <button
                  key={col.key}
                  onClick={() => selectCollection(col)}
                  className="flex items-center justify-between py-3 border-b border-border/40 hover:bg-secondary/30 transition-colors px-2 rounded group text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-primary font-medium group-hover:text-accent transition-colors truncate">{col.name}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{col.hadiths.toLocaleString()} hadith</p>
                  </div>
                  <span className="font-arabic text-base text-foreground/60 shrink-0 ml-3" dir="rtl">{col.arabic}</span>
                </button>
              ))}
            </div>

            {/* Secondary Collections */}
            <div className="flex items-center gap-3 mb-4 mt-8">
              <div className="h-px flex-1 bg-border" />
              <h3 className="text-xs font-heading font-bold text-primary tracking-wider uppercase whitespace-nowrap">Other Collections</h3>
              <span className="font-arabic text-sm text-accent whitespace-nowrap">مجموعات أخرى</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {SECONDARY_COLLECTIONS.map((col) => (
                <button
                  key={col.key}
                  onClick={() => selectCollection(col)}
                  className="flex items-center justify-between py-3 border-b border-border/40 hover:bg-secondary/30 transition-colors px-2 rounded group text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-primary font-medium group-hover:text-accent transition-colors truncate">{col.name}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{col.hadiths.toLocaleString()} hadith</p>
                  </div>
                  <span className="font-arabic text-base text-foreground/60 shrink-0 ml-3" dir="rtl">{col.arabic}</span>
                </button>
              ))}
            </div>

            <p className="text-center text-muted-foreground/50 text-[10px] font-body mt-6">
              Languages: English • Arabic &nbsp;|&nbsp; Source: hadith-api
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

      {/* ═══ BOOKS VIEW ═══ */}
      {view === "books" && !loading && selectedCollection && (
        <div className="glass-card overflow-hidden">
          {/* Breadcrumb */}
          <div className="bg-[hsl(var(--primary))] px-4 py-2 flex items-center gap-1.5 text-xs text-primary-foreground/80 font-body">
            <button onClick={resetHome} className="hover:text-primary-foreground transition-colors">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary-foreground font-medium truncate">{selectedCollection.name}</span>
          </div>

          {/* Collection info */}
          <div className="p-4 sm:p-5 bg-secondary/30 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-2">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{selectedCollection.name}</h3>
              <p className="font-arabic text-xl text-foreground/60" dir="rtl">{selectedCollection.arabic}</p>
            </div>
            <p className={`text-xs text-muted-foreground font-body leading-relaxed ${showInfo ? "" : "line-clamp-2"}`}>
              {selectedCollection.intro}
            </p>
            <button onClick={() => setShowInfo(!showInfo)} className="text-primary text-xs font-body mt-1 hover:underline">
              {showInfo ? "Show less" : "More information..."}
            </button>

            {/* Search */}
            <div className="flex items-center gap-2 mt-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                <input
                  type="text"
                  placeholder="Search by number or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <button onClick={handleSearch} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-xs font-body font-medium">
                Search
              </button>
            </div>
          </div>

          {error && <div className="text-center text-destructive text-xs py-3 bg-destructive/5 border-b border-border">{error}</div>}

          {/* Books list */}
          <div className="divide-y divide-border/30 max-h-[500px] overflow-y-auto">
            {books.map((b) => (
              <button
                key={b.number}
                onClick={() => selectBook(b)}
                className="w-full flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-secondary/30 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 font-body">
                    {b.number}
                  </span>
                  <div className="min-w-0">
                    <p className="font-body text-sm text-primary font-medium group-hover:text-accent transition-colors truncate">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{b.count} hadith</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {b.nameArabic && <span className="font-arabic text-sm text-foreground/50 hidden sm:block" dir="rtl">{b.nameArabic}</span>}
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ HADITHS VIEW - Sunnah.com exact layout ═══ */}
      {view === "hadiths" && !loading && (
        <div className="glass-card overflow-hidden">
          {/* Breadcrumb */}
          <div className="bg-[hsl(var(--primary))] px-4 py-2 flex items-center gap-1.5 text-xs text-primary-foreground/80 font-body flex-wrap">
            <button onClick={resetHome} className="hover:text-primary-foreground transition-colors">Home</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={goBack} className="hover:text-primary-foreground transition-colors truncate max-w-[120px] sm:max-w-none">{selectedCollection?.name}</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary-foreground font-medium truncate">{selectedBook?.name}</span>
          </div>

          {/* Chapter header */}
          <div className="p-4 sm:p-5 bg-secondary/30 border-b border-border flex items-center gap-3">
            <button onClick={goBack} className="text-primary hover:text-accent transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-base sm:text-lg font-bold text-foreground truncate">{selectedBook?.name}</h3>
              <p className="text-[10px] text-muted-foreground font-body">{selectedCollection?.name} • {hadiths.length} hadith</p>
            </div>
          </div>

          {/* Hadith cards - sunnah.com layout */}
          <div className="divide-y divide-border/30">
            {pagedHadiths.map((h) => (
              <div key={h.hadithNumber} className="relative">
                {/* Hadith number badge */}
                <div className="flex items-center gap-3 px-4 sm:px-5 pt-4 pb-1.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold font-body shrink-0">
                    {h.hadithNumber}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-body">{h.reference}</span>
                </div>

                {/* English text */}
                <div className="px-4 sm:px-5 py-2 sm:py-3">
                  {h.englishNarrator && (
                    <p className="text-sm font-body font-semibold text-primary mb-1.5">{h.englishNarrator}:</p>
                  )}
                  <p className="text-sm leading-relaxed text-foreground/85 font-body">{h.hadithEnglish}</p>
                </div>

                {/* Arabic text - green tint like sunnah.com */}
                {h.hadithArabic && (
                  <div className="px-4 sm:px-5 py-3 sm:py-4 bg-primary/[0.04]">
                    <p className="font-arabic text-base sm:text-lg leading-[2.2] text-foreground/90 text-right" dir="rtl">
                      {h.hadithArabic}
                    </p>
                  </div>
                )}

                {/* Reference footer */}
                <div className="px-4 sm:px-5 py-2.5 bg-secondary/20 border-t border-border/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[10px] text-muted-foreground font-body space-y-0.5">
                    <p><span className="font-medium text-foreground/70">Reference</span> : <span className="text-primary">{h.reference}</span></p>
                    {h.inBookReference && <p><span className="font-medium text-foreground/70">In-book reference</span> : {h.inBookReference}</p>}
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground/40">
                    <button onClick={() => toggleBookmark(h.hadithNumber)} className={`hover:text-accent transition-colors ${bookmarks.has(h.hadithNumber) ? "text-accent" : ""}`} title="Bookmark">
                      <Bookmark className="w-3.5 h-3.5" fill={bookmarks.has(h.hadithNumber) ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => copyHadith(h)} className="hover:text-primary transition-colors" title="Copy">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => shareHadith(h)} className="hover:text-primary transition-colors" title="Share">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/20 border-t border-border">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-body text-foreground disabled:opacity-30 hover:bg-secondary/50 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-[10px] text-muted-foreground font-body">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-body text-foreground disabled:opacity-30 hover:bg-secondary/50 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default HadithCollection;
