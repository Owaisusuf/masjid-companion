import { useState } from "react";
import { BookOpen, ArrowLeft, Loader2, Search, BookMarked } from "lucide-react";

interface HadithBook {
  key: string;
  apiKey: string;
  name: string;
  nameUrdu: string;
  hadiths: number;
  color: string;
}

interface HadithItem {
  id: number;
  header: string;
  hadith_english: string;
  book: string;
  refno: string;
}

const hadithBooks: HadithBook[] = [
  { key: "bukhari", apiKey: "bukhari", name: "Sahih al-Bukhari", nameUrdu: "صحیح بخاری", hadiths: 7563, color: "bg-emerald-600" },
  { key: "muslim", apiKey: "muslim", name: "Sahih Muslim", nameUrdu: "صحیح مسلم", hadiths: 3032, color: "bg-red-600" },
  { key: "tirmidhi", apiKey: "tirmidhi", name: "Jami at-Tirmidhi", nameUrdu: "جامع ترمذی", hadiths: 3956, color: "bg-blue-600" },
  { key: "abudawud", apiKey: "abudawud", name: "Sunan Abu Dawud", nameUrdu: "سنن ابو داود", hadiths: 5274, color: "bg-orange-600" },
  { key: "nasai", apiKey: "nasai", name: "Sunan an-Nasa'i", nameUrdu: "سنن نسائی", hadiths: 5758, color: "bg-gray-700" },
  { key: "ibnmajah", apiKey: "ibnmajah", name: "Sunan Ibn Majah", nameUrdu: "سنن ابن ماجہ", hadiths: 4341, color: "bg-amber-600" },
];

const HadithCollection = () => {
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchNum, setSearchNum] = useState("");
  const [error, setError] = useState("");

  const PER_PAGE = 10;

  const loadHadiths = async (book: HadithBook, pageNum: number, append = false) => {
    setLoading(true);
    setError("");
    try {
      const start = (pageNum - 1) * PER_PAGE + 1;
      const fetches = [];
      for (let i = start; i < start + PER_PAGE; i++) {
        fetches.push(
          fetch(`https://hadithapi.pages.dev/api/${book.apiKey}/${i}`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        );
      }
      const results = await Promise.all(fetches);
      const items: HadithItem[] = results
        .filter(Boolean)
        .map((h: any) => ({
          id: h.hadithnumber || h.id,
          header: h.header || "",
          hadith_english: h.hadith_english || h.text || "",
          book: h.book || "",
          refno: h.refno || h.reference || "",
        }));

      if (append) {
        setHadiths(prev => [...prev, ...items]);
      } else {
        setHadiths(items);
      }
      setHasMore(items.length === PER_PAGE);
    } catch {
      setError("Failed to load hadiths. Please try again.");
    }
    setLoading(false);
  };

  const selectBook = (book: HadithBook) => {
    setSelectedBook(book);
    setPage(1);
    setHadiths([]);
    setSearchNum("");
    setError("");
    loadHadiths(book, 1);
  };

  const loadMore = () => {
    if (!selectedBook) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadHadiths(selectedBook, nextPage, true);
  };

  const searchHadith = async () => {
    if (!selectedBook || !searchNum) return;
    const num = parseInt(searchNum);
    if (isNaN(num) || num < 1) {
      setError("Please enter a valid hadith number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://hadithapi.pages.dev/api/${selectedBook.apiKey}/${num}`);
      if (!res.ok) throw new Error("Not found");
      const h = await res.json();
      setHadiths([{
        id: h.hadithnumber || num,
        header: h.header || "",
        hadith_english: h.hadith_english || h.text || "",
        book: h.book || "",
        refno: h.refno || "",
      }]);
      setHasMore(false);
    } catch {
      setError("Hadith not found. Try a different number.");
    }
    setLoading(false);
  };

  return (
    <section id="hadith-collection" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Hadith Collection</h2>
        <span className="font-urdu text-sm text-muted-foreground">کتبِ احادیث</span>
      </div>

      {!selectedBook ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {hadithBooks.map((book) => (
            <button
              key={book.key}
              onClick={() => selectBook(book)}
              className="glass-card p-5 text-left hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={`w-10 h-12 ${book.color} rounded-sm mb-3 flex items-center justify-center shadow-sm`}>
                <BookMarked className="w-5 h-5 text-white" />
              </div>
              <p className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                {book.name}
              </p>
              <p className="font-urdu text-sm text-muted-foreground mt-1" dir="rtl">{book.nameUrdu}</p>
              <p className="text-[11px] text-muted-foreground/70 mt-2 font-body">{book.hadiths.toLocaleString()} hadiths</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-card p-4 sm:p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <button
              onClick={() => { setSelectedBook(null); setHadiths([]); setError(""); }}
              className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-center flex-1 min-w-0">
              <h3 className="font-heading text-base font-bold text-foreground truncate">{selectedBook.name}</h3>
              <p className="font-urdu text-sm text-accent" dir="rtl">{selectedBook.nameUrdu}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Hadith #"
                value={searchNum}
                onChange={(e) => setSearchNum(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchHadith()}
                className="w-20 sm:w-24 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={searchHadith}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs hover:opacity-90 transition-opacity"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="text-center text-destructive text-sm py-3 mb-3 bg-destructive/5 rounded-lg">
              {error}
            </div>
          )}

          {/* Hadith list */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {hadiths.map((h) => (
              <div key={h.id} className="p-4 sm:p-5 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">
                    {h.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    {h.header && (
                      <p className="text-xs text-muted-foreground font-body mb-1 italic">{h.header}</p>
                    )}
                    {h.book && (
                      <p className="text-[10px] text-muted-foreground/60 font-body">{h.book} {h.refno && `• ${h.refno}`}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground font-body">
                  {h.hadith_english}
                </p>
              </div>
            ))}

            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {!loading && hadiths.length === 0 && !error && (
              <p className="text-center text-muted-foreground text-sm py-8">No hadiths loaded yet.</p>
            )}

            {!loading && hasMore && hadiths.length > 0 && (
              <button
                onClick={loadMore}
                className="w-full py-3 rounded-xl bg-secondary border border-border text-sm text-primary font-body font-medium hover:bg-primary/5 transition-colors"
              >
                Load More Hadiths — مزید احادیث
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HadithCollection;
