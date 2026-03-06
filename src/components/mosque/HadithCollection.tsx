import { useState, useCallback } from "react";
import { BookOpen, ArrowLeft, Loader2, Search, BookMarked } from "lucide-react";

interface HadithBook {
  key: string;
  name: string;
  nameUrdu: string;
  hadiths: number;
  color: string;
}

interface HadithItem {
  id: number;
  text: string;
}

const hadithBooks: HadithBook[] = [
  { key: "bukhari", name: "Sahih al-Bukhari", nameUrdu: "صحیح بخاری", hadiths: 7563, color: "bg-emerald-600" },
  { key: "muslim", name: "Sahih Muslim", nameUrdu: "صحیح مسلم", hadiths: 3032, color: "bg-red-600" },
  { key: "tirmidhi", name: "Jami at-Tirmidhi", nameUrdu: "جامع ترمذی", hadiths: 3956, color: "bg-blue-600" },
  { key: "abudawud", name: "Sunan Abu Dawud", nameUrdu: "سنن ابو داود", hadiths: 5274, color: "bg-orange-600" },
  { key: "nasai", name: "Sunan an-Nasa'i", nameUrdu: "سنن نسائی", hadiths: 5758, color: "bg-gray-700" },
  { key: "ibnmajah", name: "Sunan Ibn Majah", nameUrdu: "سنن ابن ماجہ", hadiths: 4341, color: "bg-amber-600" },
];

const HadithCollection = () => {
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchNum, setSearchNum] = useState("");
  const [error, setError] = useState("");
  const [allData, setAllData] = useState<Record<number, string>>({});
  const [bookLoaded, setBookLoaded] = useState(false);

  const PER_PAGE = 10;

  const loadBook = useCallback(async (book: HadithBook) => {
    setLoading(true);
    setError("");
    setBookLoaded(false);
    try {
      const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${book.key}.min.json`);
      const dataMap: Record<number, string> = {};

      if (res.ok) {
        const json = await res.json();
        const items = json?.hadiths || [];
        items.forEach((h: { hadithnumber: number; text: string }, i: number) => {
          dataMap[h.hadithnumber || i + 1] = h.text || "";
        });
      }

      setAllData(dataMap);
      setBookLoaded(true);

      const pageItems: HadithItem[] = [];
      const maxNum = Object.keys(dataMap).length;
      for (let i = 1; i <= Math.min(PER_PAGE, maxNum); i++) {
        if (dataMap[i]) pageItems.push({ id: i, text: dataMap[i] });
      }
      setHadiths(pageItems);
      setHasMore(pageItems.length === PER_PAGE && PER_PAGE < maxNum);
    } catch {
      setError("Failed to load hadiths. Please try again.");
    }
    setLoading(false);
  }, []);

  const selectBook = (book: HadithBook) => {
    setSelectedBook(book);
    setPage(1);
    setHadiths([]);
    setSearchNum("");
    setError("");
    loadBook(book);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const start = (nextPage - 1) * PER_PAGE + 1;
    const maxNum = Object.keys(allData).length;
    const items: HadithItem[] = [];
    for (let i = start; i < start + PER_PAGE && i <= maxNum; i++) {
      if (allData[i]) items.push({ id: i, text: allData[i] });
    }
    setHadiths(prev => [...prev, ...items]);
    setHasMore(start + PER_PAGE <= maxNum);
  };

  const searchHadith = () => {
    if (!searchNum) return;
    const num = parseInt(searchNum);
    if (isNaN(num) || num < 1) {
      setError("Please enter a valid hadith number");
      return;
    }
    const text = allData[num];
    if (!text) {
      setError("Hadith not found. Try a different number.");
      return;
    }
    setHadiths([{ id: num, text }]);
    setHasMore(false);
    setError("");
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
            <button
              onClick={() => { setSelectedBook(null); setHadiths([]); setError(""); setBookLoaded(false); }}
              className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="text-center flex-1 min-w-0">
              <h3 className="font-heading text-base font-bold text-foreground truncate">{selectedBook.name}</h3>
              <p className="font-urdu text-sm text-accent" dir="rtl">{selectedBook.nameUrdu}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {bookLoaded && (
                <>
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
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="text-center text-destructive text-sm py-3 mb-3 bg-destructive/5 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {hadiths.map((h) => (
              <div key={h.id} className="p-4 sm:p-5 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0 font-body">
                    {h.id}
                  </span>
                  <p className="text-[11px] text-muted-foreground/60 font-body">
                    {selectedBook.name} • Hadith #{h.id}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-foreground font-body">
                  {h.text || <span className="text-muted-foreground italic">Translation not available</span>}
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
                Load More Hadiths
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HadithCollection;
