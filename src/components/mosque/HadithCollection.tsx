import { useState, useCallback, useRef } from "react";
import { BookOpen, ArrowLeft, Loader2, Search, Copy, Share2, ChevronRight, Bookmark, BookMarked } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 20;

interface Book {
  id: number;
  bookName: string;
  writerName: string;
  aboutWriter?: string;
  writerDeath?: string;
  bookSlug: string;
  hadiths_count: number;
  chapters_count: number;
}

interface Chapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu: string;
  chapterArabic: string;
  bookSlug: string;
}

interface HadithItem {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  hadithEnglish: string;
  hadithUrdu: string;
  hadithArabic: string;
  bookSlug: string;
  chapterId: string;
  status: string;
  headingEnglish?: string;
  headingUrdu?: string;
  headingArabic?: string;
  book?: { bookName: string };
  chapter?: { chapterEnglish: string; chapterUrdu: string; chapterArabic: string };
}

type View = "books" | "chapters" | "hadiths";

const fetchProxy = async (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  const { data, error } = await supabase.functions.invoke("hadith-proxy", {
    body: null,
    method: "GET",
    headers: {},
  });
  // Use fetch directly for GET with query params
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hadith-proxy?${query}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

const HadithCollection = () => {
  const [view, setView] = useState<View>("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booksLoaded, setBooksLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHadiths, setTotalHadiths] = useState(0);

  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const saved = safeGetItem("hadith-bookmarks-v3");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const topRef = useRef<HTMLDivElement>(null);

  const saveBookmarks = (next: Set<string>) => {
    safeSetItem("hadith-bookmarks-v3", JSON.stringify([...next]));
  };

  const toggleBookmark = (h: HadithItem) => {
    const key = `${h.bookSlug}:${h.hadithNumber}`;
    setBookmarks(prev => {
      const next = new Set(prev);
      const was = next.has(key);
      if (was) next.delete(key); else next.add(key);
      saveBookmarks(next);
      toast({ title: was ? "Bookmark removed" : "Bookmarked!", description: `Hadith #${h.hadithNumber}` });
      return next;
    });
  };

  const isBookmarked = (h: HadithItem) => bookmarks.has(`${h.bookSlug}:${h.hadithNumber}`);

  const loadBooks = useCallback(async () => {
    if (booksLoaded && books.length > 0) return;
    setLoading(true);
    setError("");
    try {
      const json = await fetchProxy({ endpoint: "books" });
      const data = json.books || json.data || json;
      if (Array.isArray(data)) {
        setBooks(data);
        setBooksLoaded(true);
      } else throw new Error("Unexpected response format");
    } catch (e: any) {
      setError(e.message || "Failed to load books");
    }
    setLoading(false);
  }, [booksLoaded, books.length]);

  const loadChapters = useCallback(async (book: Book) => {
    setLoading(true);
    setError("");
    setSelectedBook(book);
    try {
      const json = await fetchProxy({ endpoint: "chapters", bookSlug: book.bookSlug });
      const data = json.chapters || json.data || json;
      if (Array.isArray(data)) {
        setChapters(data);
        setView("chapters");
      } else throw new Error("Unexpected response format");
    } catch (e: any) {
      setError(e.message || "Failed to load chapters");
    }
    setLoading(false);
  }, []);

  const loadHadiths = useCallback(async (bookSlug: string, chapter?: Chapter, page = 1, search?: string) => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = {
        endpoint: "hadiths",
        bookSlug,
        paginate: String(PAGE_SIZE),
        page: String(page),
      };
      if (chapter) params.chapter = chapter.chapterNumber;
      if (search?.trim()) params.search = search.trim();

      const json = await fetchProxy(params);
      const hadithData = json.hadiths?.data || json.data || [];
      const lastPage = json.hadiths?.last_page || 1;
      const total = json.hadiths?.total || hadithData.length;

      setHadiths(hadithData);
      setTotalPages(lastPage);
      setTotalHadiths(total);
      setCurrentPage(page);
      setView("hadiths");
    } catch (e: any) {
      setError(e.message || "Failed to load hadiths");
    }
    setLoading(false);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const selectChapter = (ch: Chapter) => {
    setSelectedChapter(ch);
    setSearchQuery("");
    loadHadiths(ch.bookSlug, ch, 1);
  };

  const handleSearch = () => {
    if (!selectedBook || !searchQuery.trim()) return;
    setSelectedChapter(null);
    loadHadiths(selectedBook.bookSlug, undefined, 1, searchQuery);
  };

  const goBack = () => {
    if (view === "hadiths") {
      setView("chapters");
      setHadiths([]);
      setSelectedChapter(null);
      setSearchQuery("");
    } else if (view === "chapters") {
      setView("books");
      setChapters([]);
      setSelectedBook(null);
    }
    setError("");
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const copyHadith = (h: HadithItem) => {
    const parts = [];
    if (h.hadithArabic) parts.push(stripHtml(h.hadithArabic));
    if (h.englishNarrator) parts.push(`${stripHtml(h.englishNarrator)}:`);
    if (h.hadithEnglish) parts.push(stripHtml(h.hadithEnglish));
    if (h.hadithUrdu) parts.push(stripHtml(h.hadithUrdu));
    parts.push(`— ${h.book?.bookName || selectedBook?.bookName || ""} #${h.hadithNumber}`);
    navigator.clipboard.writeText(parts.join("\n\n"));
    toast({ title: "Copied!", description: "Hadith copied to clipboard" });
  };

  const shareHadith = (h: HadithItem) => {
    const text = `${stripHtml(h.hadithEnglish)}\n\n— ${h.book?.bookName || selectedBook?.bookName || ""} #${h.hadithNumber}`;
    if (navigator.share) {
      navigator.share({ title: `Hadith #${h.hadithNumber}`, text });
    } else {
      copyHadith(h);
    }
  };

  // Auto-load books on mount
  useState(() => { loadBooks(); });

  return (
    <section ref={topRef} id="hadith-collection" className="px-3 sm:px-4 max-w-4xl mx-auto">
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-body">Loading...</p>
        </div>
      )}

      {error && !loading && (
        <div className="glass-card p-6 text-center mb-4">
          <p className="text-destructive text-sm font-body mb-3">{error}</p>
          <button onClick={() => { setError(""); loadBooks(); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-body">Retry</button>
        </div>
      )}

      {/* BOOKS VIEW */}
      {view === "books" && !loading && (
        <div className="glass-card overflow-hidden">
          <div className="gradient-primary px-4 py-5 sm:px-6 sm:py-7 text-center">
            <BookOpen className="w-8 h-8 text-primary-foreground/80 mx-auto mb-2" />
            <h2 className="text-primary-foreground font-heading text-lg sm:text-xl font-bold">Hadith Collection</h2>
            <p className="font-urdu text-primary-foreground/70 text-base mt-1" dir="rtl">مجموعۂ احادیث نبویہ ﷺ</p>
            <p className="text-primary-foreground/60 text-xs sm:text-sm font-body mt-2">Arabic • English • Urdu Translations</p>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-center text-xs sm:text-sm text-muted-foreground font-body mb-5">Select a Hadith book to start reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {books.map((book) => (
                <button key={book.id} onClick={() => loadChapters(book)} className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all text-left">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">{book.bookName}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground/70 font-body mt-0.5">{book.writerName}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground/50 font-body mt-0.5">{Number(book.hadiths_count)?.toLocaleString()} hadiths • {book.chapters_count} chapters</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary mt-1 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CHAPTERS VIEW */}
      {view === "chapters" && !loading && selectedBook && (
        <div className="glass-card overflow-hidden">
          <div className="gradient-primary px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base sm:text-lg font-bold text-primary-foreground truncate">{selectedBook.bookName}</h3>
                <p className="text-xs text-primary-foreground/60 font-body mt-0.5">{selectedBook.writerName} • {chapters.length} chapters</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input type="text" placeholder="Search hadiths by keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <button onClick={handleSearch} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-body font-medium shrink-0">Search</button>
            </div>
          </div>
          <div className="divide-y divide-border/30 max-h-[65vh] overflow-y-auto">
            {chapters.map((ch) => (
              <button key={ch.id} onClick={() => selectChapter(ch)} className="w-full flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-secondary/40 transition-colors text-left group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">{ch.chapterNumber}</span>
                  <div className="min-w-0">
                    <p className="font-body text-sm sm:text-base text-foreground font-medium group-hover:text-primary transition-colors line-clamp-2">{ch.chapterEnglish}</p>
                    {ch.chapterUrdu && <p className="font-urdu text-xs text-muted-foreground mt-1 line-clamp-1" dir="rtl">{ch.chapterUrdu}</p>}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </div>
          <div className="px-4 py-3 bg-secondary/20 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground/60 font-body">{chapters.length} chapters</p>
          </div>
        </div>
      )}

      {/* HADITHS VIEW */}
      {view === "hadiths" && !loading && (
        <div className="space-y-4">
          <div className="glass-card overflow-hidden">
            <div className="gradient-primary px-4 py-3 sm:px-6 flex items-center gap-2 text-xs text-primary-foreground/80 font-body flex-wrap">
              <button onClick={() => { setView("books"); setSelectedBook(null); setChapters([]); setHadiths([]); setError(""); setSearchQuery(""); }} className="hover:text-primary-foreground transition-colors whitespace-nowrap">Books</button>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <button onClick={goBack} className="hover:text-primary-foreground transition-colors truncate max-w-[120px] sm:max-w-none">{selectedBook?.bookName}</button>
              {selectedChapter && (
                <>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  <span className="text-primary-foreground font-medium truncate">Ch. {selectedChapter.chapterNumber}</span>
                </>
              )}
            </div>
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-secondary/30 flex items-center gap-3">
              <button onClick={goBack} className="p-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4 text-primary" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-sm sm:text-base font-bold text-foreground truncate">{selectedChapter?.chapterEnglish || `Search: "${searchQuery}"`}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-body mt-0.5">{selectedBook?.bookName} • {totalHadiths} hadiths</p>
              </div>
            </div>
          </div>

          {hadiths.map((h) => (
            <div key={h.id} className="glass-card overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-primary/5 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-bold font-body shrink-0">{h.hadithNumber}</span>
                  <div>
                    <span className="text-xs text-muted-foreground font-body">{h.book?.bookName || selectedBook?.bookName}</span>
                    {h.status && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold font-body ${
                        h.status.toLowerCase() === "sahih" ? "bg-green-500/10 text-green-600" :
                        h.status.toLowerCase() === "hasan" ? "bg-amber-500/10 text-amber-600" :
                        "bg-red-500/10 text-red-500"
                      }`}>{h.status}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleBookmark(h)} className={`p-2 rounded-lg hover:bg-secondary transition-colors ${isBookmarked(h) ? "text-accent" : "text-muted-foreground/40"}`}>
                    <Bookmark className="w-4 h-4" fill={isBookmarked(h) ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => copyHadith(h)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground/40 hover:text-primary transition-colors"><Copy className="w-4 h-4" /></button>
                  <button onClick={() => shareHadith(h)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground/40 hover:text-primary transition-colors"><Share2 className="w-4 h-4" /></button>
                </div>
              </div>
              {h.hadithArabic && (
                <div className="px-4 sm:px-6 py-5 sm:py-6 bg-primary/[0.03] border-b border-border/20">
                  <p className="font-arabic text-lg sm:text-xl text-foreground/90 text-right" dir="rtl" style={{ lineHeight: "2.6" }}>{stripHtml(h.hadithArabic)}</p>
                </div>
              )}
              {h.hadithEnglish && (
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border/20">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-body font-semibold mb-2">English</p>
                  {h.englishNarrator && <p className="text-sm font-body font-semibold text-primary mb-2" style={{ lineHeight: "1.8" }}>{stripHtml(h.englishNarrator)}</p>}
                  <p className="text-sm sm:text-base text-foreground/85 font-body" style={{ lineHeight: "2" }}>{stripHtml(h.hadithEnglish)}</p>
                </div>
              )}
              {h.hadithUrdu && (
                <div className="px-4 sm:px-6 py-5 sm:py-6 bg-accent/[0.04]">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-body font-semibold mb-3 text-right">اردو ترجمہ</p>
                  <p className="font-urdu text-base sm:text-lg text-foreground/85 text-right" dir="rtl" style={{ lineHeight: "3", wordSpacing: "2px" }}>{stripHtml(h.hadithUrdu)}</p>
                </div>
              )}
            </div>
          ))}

          {hadiths.length === 0 && !error && (
            <div className="glass-card p-10 text-center">
              <p className="text-muted-foreground text-sm font-body">No hadiths found.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="glass-card flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <button onClick={() => loadHadiths(selectedBook!.bookSlug, selectedChapter || undefined, currentPage - 1, searchQuery || undefined)} disabled={currentPage <= 1} className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-body text-foreground disabled:opacity-30 hover:bg-secondary/50 transition-colors">← Previous</button>
              <span className="text-xs sm:text-sm text-muted-foreground font-body">Page {currentPage} of {totalPages}</span>
              <button onClick={() => loadHadiths(selectedBook!.bookSlug, selectedChapter || undefined, currentPage + 1, searchQuery || undefined)} disabled={currentPage >= totalPages} className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-body text-foreground disabled:opacity-30 hover:bg-secondary/50 transition-colors">Next →</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default HadithCollection;
