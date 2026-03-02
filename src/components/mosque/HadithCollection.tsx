import { useState } from "react";
import { BookOpen, ChevronRight, ArrowLeft, Loader2, Search } from "lucide-react";

interface HadithBook {
  key: string;
  name: string;
  nameAr: string;
  nameUrdu: string;
  hadiths: number;
  icon: string;
}

interface HadithItem {
  number: number;
  arab: string;
  id: string;
}

const hadithBooks: HadithBook[] = [
  { key: "bukhari", name: "Sahih al-Bukhari", nameAr: "صحيح البخاري", nameUrdu: "صحیح بخاری", hadiths: 7563, icon: "📗" },
  { key: "muslim", name: "Sahih Muslim", nameAr: "صحيح مسلم", nameUrdu: "صحیح مسلم", hadiths: 3033, icon: "📕" },
  { key: "tirmidhi", name: "Jami at-Tirmidhi", nameAr: "جامع الترمذي", nameUrdu: "جامع ترمذی", hadiths: 3956, icon: "📘" },
  { key: "abudawud", name: "Sunan Abu Dawud", nameAr: "سنن أبي داود", nameUrdu: "سنن ابو داود", hadiths: 5274, icon: "📙" },
  { key: "nasai", name: "Sunan an-Nasa'i", nameAr: "سنن النسائي", nameUrdu: "سنن نسائی", hadiths: 5758, icon: "📓" },
  { key: "ibnmajah", name: "Sunan Ibn Majah", nameAr: "سنن ابن ماجه", nameUrdu: "سنن ابن ماجہ", hadiths: 4341, icon: "📔" },
];

const HadithCollection = () => {
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchNum, setSearchNum] = useState("");
  const [error, setError] = useState("");

  const loadHadiths = async (book: HadithBook, pageNum: number, append = false) => {
    setLoading(true);
    setError("");
    try {
      const range = `${(pageNum - 1) * 20 + 1}-${pageNum * 20}`;
      const res = await fetch(`https://api.hadith.gading.dev/books/${book.key}?range=${range}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data.data?.hadiths) {
        const items: HadithItem[] = data.data.hadiths.map((h: any) => ({
          number: h.number,
          arab: h.arab,
          id: h.id || `${book.key}-${h.number}`,
        }));
        if (append) {
          setHadiths((prev) => [...prev, ...items]);
        } else {
          setHadiths(items);
        }
        setHasMore(items.length === 20);
      }
    } catch (e) {
      console.error(e);
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
    setLoading(true);
    setError("");
    try {
      const num = parseInt(searchNum);
      if (isNaN(num) || num < 1) {
        setError("Please enter a valid hadith number");
        setLoading(false);
        return;
      }
      const res = await fetch(`https://api.hadith.gading.dev/books/${selectedBook.key}?range=${num}-${num}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      if (data.data?.hadiths) {
        setHadiths(data.data.hadiths.map((h: any) => ({ number: h.number, arab: h.arab, id: h.id || `${selectedBook.key}-${h.number}` })));
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {hadithBooks.map((book) => (
            <button
              key={book.key}
              onClick={() => selectBook(book)}
              className="glass-card p-4 sm:p-5 text-left hover:shadow-md hover:border-accent/40 transition-all duration-300 group"
            >
              <div className="text-3xl mb-2">{book.icon}</div>
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
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <button
              onClick={() => { setSelectedBook(null); setHadiths([]); setError(""); }}
              className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-sm font-body font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-center flex-1">
              <h3 className="font-heading text-base font-bold text-foreground">{selectedBook.name}</h3>
              <p className="font-urdu text-base text-accent" dir="rtl">{selectedBook.nameUrdu}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Hadith #"
                value={searchNum}
                onChange={(e) => setSearchNum(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchHadith()}
                className="w-24 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
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

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {hadiths.map((h) => (
              <div key={h.id || h.number} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-1 font-body">
                    {h.number}
                  </span>
                  <p className="font-arabic text-lg sm:text-xl leading-[2.2] text-foreground text-right flex-1" dir="rtl">
                    {h.arab}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
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