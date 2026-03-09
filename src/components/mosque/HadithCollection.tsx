import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { BookOpen, ArrowLeft, Loader2, Search, Copy, Share2, ChevronRight, Bookmark, BookMarked } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";

/* ─── Types ─── */
interface HadithItem {
  hadithNumber: number;
  englishNarrator: string;
  hadithEnglish: string;
  hadithArabic: string;
  hadithUrdu: string;
  bookNumber: string;
  reference: string;
  inBookReference: string;
}

interface BookEntry {
  number: number | string;
  name: string;
  nameArabic: string;
  hadithFrom: number;
  hadithTo: number;
  count: number;
}

/* ─── Collections (6 major books only) ─── */
const COLLECTIONS = [
  { key: "bukhari", name: "Sahih al-Bukhari", nameUrdu: "صحیح بخاری", arabic: "صحيح البخاري", hadiths: 7563, intro: "Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari (d. 256 AH/870 AD). His collection is recognized by the overwhelming majority of the Muslim world to be the most authentic collection of reports of the Sunnah of the Prophet Muhammad (ﷺ)." },
  { key: "muslim", name: "Sahih Muslim", nameUrdu: "صحیح مسلم", arabic: "صحيح مسلم", hadiths: 3032, intro: "Sahih Muslim is a collection of hadith compiled by Imam Muslim ibn al-Hajjaj al-Naysaburi (d. 261 AH/875 AD). His collection is considered to be one of the most authentic collections of the Sunnah of the Prophet (ﷺ)." },
  { key: "abudawud", name: "Sunan Abu Dawud", nameUrdu: "سنن ابو داؤد", arabic: "سنن أبي داود", hadiths: 5274, intro: "Sunan Abi Dawud is a collection of hadith compiled by Imam Abu Dawud Sulayman ibn al-Ash'ath as-Sijistani (d. 275 AH/889 AD). It is widely considered to be among the six canonical collections of hadith." },
  { key: "tirmidhi", name: "Jami at-Tirmidhi", nameUrdu: "جامع ترمذی", arabic: "جامع الترمذي", hadiths: 3956, intro: "Jami` at-Tirmidhi is a collection of hadith compiled by Imam Abu `Isa Muhammad at-Tirmidhi (d. 279 AH/892 AD). His collection is unanimously considered to be one of the six canonical collections of hadith." },
  { key: "nasai", name: "Sunan an-Nasa'i", nameUrdu: "سنن نسائی", arabic: "سنن النسائي", hadiths: 5758, intro: "Sunan an-Nasa'i is a collection of hadith compiled by Imam Ahmad an-Nasa'i (d. 303 AH/915 AD). His collection is unanimously considered to be one of the six canonical collections of hadith." },
  { key: "ibnmajah", name: "Sunan Ibn Majah", nameUrdu: "سنن ابن ماجہ", arabic: "سنن ابن ماجه", hadiths: 4341, intro: "Sunan Ibn Majah is a collection of hadith compiled by Imam Muhammad bin Yazid Ibn Majah al-Qazvini (d. 273 AH/887 AD). It is widely considered to be the sixth of the six canonical collections of hadith." },
];

type CollectionType = typeof COLLECTIONS[0];

const API_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";
const PAGE_SIZE = 20;

type View = "home" | "books" | "hadiths";

const HadithCollection = () => {
  const [view, setView] = useState<View>("home");
  const [selectedCollection, setSelectedCollection] = useState<CollectionType | null>(null);
  const [books, setBooks] = useState<BookEntry[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookEntry | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [allEngData, setAllEngData] = useState<any[]>([]);
  const [allArbData, setAllArbData] = useState<any[]>([]);
  const [allUrdData, setAllUrdData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hadith-bookmarks-v2");
      if (saved) setBookmarks(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);

  const saveBookmarks = (next: Set<string>) => {
    localStorage.setItem("hadith-bookmarks-v2", JSON.stringify([...next]));
  };

  const getBookmarkKey = (col: string, num: number) => `${col}:${num}`;

  const toggleBookmark = (h: HadithItem) => {
    if (!selectedCollection) return;
    const key = getBookmarkKey(selectedCollection.key, h.hadithNumber);
    setBookmarks(prev => {
      const next = new Set(prev);
      const wasBookmarked = next.has(key);
      if (wasBookmarked) next.delete(key); else next.add(key);
      saveBookmarks(next);
      toast({ title: wasBookmarked ? "Bookmark removed" : "Bookmarked!", description: `${selectedCollection.name} #${h.hadithNumber}` });
      return next;
    });
  };

  const isBookmarked = (h: HadithItem) => {
    if (!selectedCollection) return false;
    return bookmarks.has(getBookmarkKey(selectedCollection.key, h.hadithNumber));
  };

  const parseHadithText = (text: string) => {
    let narrator = "";
    let body = text || "";
    const match = body.match(/^(Narrated\s+[^:]+):\s*/i);
    if (match) {
      narrator = match[1];
      body = body.slice(match[0].length);
    }
    return { narrator, body };
  };

  const loadCollection = useCallback(async (col: CollectionType) => {
    setLoading(true);
    setError("");
    try {
      const [engRes, arbRes, urdRes] = await Promise.all([
        fetch(`${API_BASE}/editions/eng-${col.key}.min.json`),
        fetch(`${API_BASE}/editions/ara-${col.key}.min.json`),
        fetch(`${API_BASE}/editions/urd-${col.key}.min.json`).catch(() => null),
      ]);

      let engItems: any[] = [];
      let arbItems: any[] = [];
      let urdItems: any[] = [];

      if (engRes.ok) {
        const json = await engRes.json();
        engItems = json?.hadiths || [];
      }
      if (arbRes.ok) {
        const json = await arbRes.json();
        arbItems = json?.hadiths || [];
      }
      if (urdRes && urdRes.ok) {
        const json = await urdRes.json();
        urdItems = json?.hadiths || [];
      }

      if (engItems.length === 0) {
        setError("No data available for this collection.");
        setLoading(false);
        return;
      }

      setAllEngData(engItems);
      setAllArbData(arbItems);
      setAllUrdData(urdItems);

      // Build book sections from data
      const bookMap = new Map<string, { indices: number[]; min: number; max: number }>();
      engItems.forEach((h: any, idx: number) => {
        const bNum = String(h.reference?.book || h.bookNumber || "1");
        if (!bookMap.has(bNum)) bookMap.set(bNum, { indices: [], min: Infinity, max: -Infinity });
        const entry = bookMap.get(bNum)!;
        const hNum = h.hadithnumber || (idx + 1);
        entry.indices.push(idx);
        entry.min = Math.min(entry.min, hNum);
        entry.max = Math.max(entry.max, hNum);
      });

      const sortedKeys = Array.from(bookMap.keys()).sort((a, b) => Number(a) - Number(b));
      let bookSections: BookEntry[];

      if (sortedKeys.length > 1 && sortedKeys.length <= 120) {
        bookSections = sortedKeys.map(key => {
          const e = bookMap.get(key)!;
          return {
            number: Number(key),
            name: `Book ${key}`,
            nameArabic: `كتاب ${key}`,
            hadithFrom: e.min,
            hadithTo: e.max,
            count: e.indices.length,
          };
        });
      } else {
        bookSections = [];
        for (let i = 0; i < engItems.length; i += 50) {
          const end = Math.min(i + 50, engItems.length);
          const firstNum = engItems[i]?.hadithnumber || (i + 1);
          const lastNum = engItems[end - 1]?.hadithnumber || end;
          bookSections.push({
            number: bookSections.length + 1,
            name: `Hadiths ${firstNum} – ${lastNum}`,
            nameArabic: "",
            hadithFrom: firstNum,
            hadithTo: lastNum,
            count: end - i,
          });
        }
      }

      setBooks(bookSections);
      setView("books");
    } catch {
      setError("Failed to load collection. Please check your internet connection.");
    }
    setLoading(false);
  }, []);

  const selectCollection = (col: CollectionType) => {
    setSelectedCollection(col);
    setSearchQuery("");
    setError("");
    setPage(0);
    loadCollection(col);
  };

  const selectBook = useCallback((book: BookEntry) => {
    setSelectedBook(book);
    setPage(0);
    const items: HadithItem[] = [];

    for (let i = 0; i < allEngData.length; i++) {
      const eng = allEngData[i];
      const hNum = eng?.hadithnumber || (i + 1);
      if (hNum >= book.hadithFrom && hNum <= book.hadithTo) {
        const arb = allArbData[i];
        const urd = allUrdData[i];
        const { narrator, body } = parseHadithText(eng?.text || "");
        items.push({
          hadithNumber: hNum,
          englishNarrator: narrator,
          hadithEnglish: body,
          hadithArabic: arb?.text || "",
          hadithUrdu: urd?.text || "",
          bookNumber: String(book.number),
          reference: `${selectedCollection?.name} ${hNum}`,
          inBookReference: `Book ${book.number}, Hadith ${hNum - book.hadithFrom + 1}`,
        });
      }
    }
    setHadiths(items);
    setView("hadiths");
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allEngData, allArbData, allUrdData, selectedCollection]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() || allEngData.length === 0) return;
    setError("");

    const num = parseInt(searchQuery);
    if (!isNaN(num)) {
      const eng = allEngData.find((h: any) => (h.hadithnumber || 0) === num);
      if (eng) {
        const idx = allEngData.indexOf(eng);
        const arb = allArbData[idx];
        const urd = allUrdData[idx];
        const { narrator, body } = parseHadithText(eng.text || "");
        setHadiths([{
          hadithNumber: num, englishNarrator: narrator, hadithEnglish: body,
          hadithArabic: arb?.text || "", hadithUrdu: urd?.text || "",
          bookNumber: "", reference: `${selectedCollection?.name} ${num}`, inBookReference: "",
        }]);
        setSelectedBook({ number: 0, name: `Hadith #${num}`, nameArabic: "", hadithFrom: num, hadithTo: num, count: 1 });
        setView("hadiths");
        setPage(0);
        return;
      }
    }

    const q = searchQuery.toLowerCase();
    const results: HadithItem[] = [];
    for (let i = 0; i < allEngData.length && results.length < 50; i++) {
      const eng = allEngData[i];
      if (eng?.text?.toLowerCase().includes(q)) {
        const arb = allArbData[i];
        const urd = allUrdData[i];
        const { narrator, body } = parseHadithText(eng.text || "");
        results.push({
          hadithNumber: eng.hadithnumber || (i + 1), englishNarrator: narrator, hadithEnglish: body,
          hadithArabic: arb?.text || "", hadithUrdu: urd?.text || "",
          bookNumber: "", reference: `${selectedCollection?.name} ${eng.hadithnumber || (i + 1)}`, inBookReference: "",
        });
      }
    }
    if (!results.length) { setError(`No results for "${searchQuery}"`); return; }
    setHadiths(results);
    setSelectedBook({ number: 0, name: `Search: "${searchQuery}" (${results.length})`, nameArabic: "", hadithFrom: 0, hadithTo: 0, count: results.length });
    setView("hadiths");
    setPage(0);
  }, [searchQuery, allEngData, allArbData, allUrdData, selectedCollection]);

  const copyHadith = (h: HadithItem) => {
    const parts = [];
    if (h.englishNarrator) parts.push(`${h.englishNarrator}:`);
    parts.push(h.hadithEnglish);
    if (h.hadithArabic) parts.push(`\n${h.hadithArabic}`);
    if (h.hadithUrdu) parts.push(`\n${h.hadithUrdu}`);
    parts.push(`\n— ${h.reference}`);
    navigator.clipboard.writeText(parts.join("\n"));
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
    if (view === "hadiths") {
      setView("books");
      setHadiths([]);
      setSelectedBook(null);
      setPage(0);
    } else if (view === "books") {
      setView("home");
      setSelectedCollection(null);
      setBooks([]);
      setAllEngData([]);
      setAllArbData([]);
      setAllUrdData([]);
    }
    setError("");
    setSearchQuery("");
  };

  const pagedHadiths = useMemo(
    () => hadiths.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [hadiths, page]
  );
  const totalPages = Math.ceil(hadiths.length / PAGE_SIZE);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════ */
  return (
    <section ref={topRef} id="hadith-collection" className="px-3 sm:px-4 max-w-4xl mx-auto">

      {/* ═══ HOME: Book Selection ═══ */}
      {view === "home" && (
        <div className="glass-card overflow-hidden">
          {/* Header banner */}
          <div className="gradient-primary px-4 py-5 sm:px-6 sm:py-7 text-center">
            <BookOpen className="w-8 h-8 text-primary-foreground/80 mx-auto mb-2" />
            <h2 className="text-primary-foreground font-heading text-lg sm:text-xl font-bold">
              Hadith Collection
            </h2>
            <p className="font-urdu text-primary-foreground/70 text-base mt-1" dir="rtl">
              مجموعۂ احادیث نبویہ ﷺ
            </p>
            <p className="text-primary-foreground/60 text-xs sm:text-sm font-body mt-2">
              Arabic • English • Urdu Translations
            </p>
          </div>

          {/* Collection grid */}
          <div className="p-4 sm:p-6">
            <p className="text-center text-xs sm:text-sm text-muted-foreground font-body mb-5">
              Select a Hadith book to start reading
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {COLLECTIONS.map((col) => (
                <button
                  key={col.key}
                  onClick={() => selectCollection(col)}
                  className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all text-left"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {col.name}
                    </p>
                    <p className="font-urdu text-sm text-muted-foreground mt-0.5" dir="rtl">
                      {col.nameUrdu}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground/70 font-body mt-1">
                      {col.hadiths.toLocaleString()} hadith
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary mt-1 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-body">Loading hadith data...</p>
          <p className="text-xs text-muted-foreground/60 font-body">This may take a moment for large collections</p>
        </div>
      )}

      {/* ═══ BOOKS VIEW ═══ */}
      {view === "books" && !loading && selectedCollection && (
        <div className="glass-card overflow-hidden">
          {/* Collection header */}
          <div className="gradient-primary px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <button
                onClick={goBack}
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base sm:text-lg font-bold text-primary-foreground truncate">
                  {selectedCollection.name}
                </h3>
                <p className="font-urdu text-sm text-primary-foreground/70 mt-0.5" dir="rtl">
                  {selectedCollection.nameUrdu}
                </p>
              </div>
              <span className="font-arabic text-lg sm:text-xl text-primary-foreground/50" dir="rtl">
                {selectedCollection.arabic}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 bg-secondary/30 border-b border-border">
            <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
              {selectedCollection.intro}
            </p>
          </div>

          {/* Search */}
          <div className="px-4 py-3 sm:px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  type="text"
                  placeholder="Search by hadith number or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-body font-medium shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          {error && (
            <div className="text-center text-destructive text-xs py-3 bg-destructive/5 border-b border-border font-body">
              {error}
            </div>
          )}

          {/* Books list */}
          <div className="divide-y divide-border/30 max-h-[65vh] overflow-y-auto">
            {books.map((b) => (
              <button
                key={String(b.number)}
                onClick={() => selectBook(b)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-secondary/40 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">
                    {b.number}
                  </span>
                  <div className="min-w-0">
                    <p className="font-body text-sm sm:text-base text-foreground font-medium group-hover:text-primary transition-colors truncate">
                      {b.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-body mt-0.5">
                      {b.count} hadith • #{b.hadithFrom} – #{b.hadithTo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {b.nameArabic && (
                    <span className="font-arabic text-sm text-foreground/40 hidden sm:block" dir="rtl">
                      {b.nameArabic}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-secondary/20 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground/60 font-body">
              {books.length} books • {selectedCollection.hadiths.toLocaleString()} total hadith
            </p>
          </div>
        </div>
      )}

      {/* ═══ HADITHS VIEW ═══ */}
      {view === "hadiths" && !loading && (
        <div className="space-y-4">
          {/* Header card */}
          <div className="glass-card overflow-hidden">
            {/* Breadcrumb */}
            <div className="gradient-primary px-4 py-3 sm:px-6 flex items-center gap-2 text-xs text-primary-foreground/80 font-body flex-wrap">
              <button onClick={() => { setView("home"); setSelectedCollection(null); setBooks([]); setAllEngData([]); setAllArbData([]); setAllUrdData([]); setError(""); setSearchQuery(""); setPage(0); }} className="hover:text-primary-foreground transition-colors whitespace-nowrap">
                Collections
              </button>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <button onClick={goBack} className="hover:text-primary-foreground transition-colors truncate max-w-[120px] sm:max-w-none">
                {selectedCollection?.name}
              </button>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-primary-foreground font-medium truncate">
                {selectedBook?.name}
              </span>
            </div>

            {/* Chapter header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-secondary/30 flex items-center gap-3">
              <button
                onClick={goBack}
                className="p-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-primary" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-sm sm:text-base font-bold text-foreground truncate">
                  {selectedBook?.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-body mt-0.5">
                  {selectedCollection?.name} • {hadiths.length} hadith
                </p>
              </div>
            </div>
          </div>

          {/* Hadith cards */}
          {pagedHadiths.map((h) => (
            <div key={h.hadithNumber} className="glass-card overflow-hidden">
              {/* Hadith number header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-primary/5 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-bold font-body shrink-0">
                    {h.hadithNumber}
                  </span>
                  <span className="text-xs text-muted-foreground font-body">{h.reference}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleBookmark(h)}
                    className={`p-2 rounded-lg hover:bg-secondary transition-colors ${isBookmarked(h) ? "text-accent" : "text-muted-foreground/40"}`}
                    title="Bookmark"
                  >
                    <Bookmark className="w-4 h-4" fill={isBookmarked(h) ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => copyHadith(h)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground/40 hover:text-primary transition-colors" title="Copy">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => shareHadith(h)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground/40 hover:text-primary transition-colors" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic text */}
              {h.hadithArabic && (
                <div className="px-4 sm:px-6 py-5 sm:py-6 bg-primary/[0.03] border-b border-border/20">
                  <p
                    className="font-arabic text-lg sm:text-xl text-foreground/90 text-right"
                    dir="rtl"
                    style={{ lineHeight: "2.6" }}
                  >
                    {h.hadithArabic}
                  </p>
                </div>
              )}

              {/* English translation */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border/20">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-body font-semibold mb-2">
                  English Translation
                </p>
                {h.englishNarrator && (
                  <p className="text-sm sm:text-base font-body font-semibold text-primary mb-2" style={{ lineHeight: "1.8" }}>
                    {h.englishNarrator}:
                  </p>
                )}
                <p className="text-sm sm:text-base text-foreground/85 font-body" style={{ lineHeight: "2" }}>
                  {h.hadithEnglish}
                </p>
              </div>

              {/* Urdu translation */}
              {h.hadithUrdu && (
                <div className="px-4 sm:px-6 py-5 sm:py-6 bg-accent/[0.04]">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-body font-semibold mb-3 text-right">
                    اردو ترجمہ
                  </p>
                  <p
                    className="font-urdu text-base sm:text-lg text-foreground/85 text-right"
                    dir="rtl"
                    style={{ lineHeight: "3", wordSpacing: "2px" }}
                  >
                    {h.hadithUrdu}
                  </p>
                </div>
              )}

              {/* Reference footer */}
              {h.inBookReference && (
                <div className="px-4 sm:px-6 py-2.5 bg-secondary/20 border-t border-border/20">
                  <p className="text-[10px] sm:text-xs text-muted-foreground/60 font-body">
                    <span className="font-medium text-foreground/50">In-book ref:</span> {h.inBookReference}
                  </p>
                </div>
              )}
            </div>
          ))}

          {hadiths.length === 0 && !error && (
            <div className="glass-card p-10 text-center">
              <p className="text-muted-foreground text-sm font-body">No hadiths found.</p>
            </div>
          )}

          {error && (
            <div className="glass-card p-6 text-center">
              <p className="text-destructive text-sm font-body">{error}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="glass-card flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <button
                onClick={() => { setPage(Math.max(0, page - 1)); scrollToTop(); }}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-body text-foreground disabled:opacity-30 hover:bg-secondary/50 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-xs sm:text-sm text-muted-foreground font-body">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => { setPage(Math.min(totalPages - 1, page + 1)); scrollToTop(); }}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-body text-foreground disabled:opacity-30 hover:bg-secondary/50 transition-colors"
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
