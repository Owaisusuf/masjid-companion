import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, ArrowLeft, Loader2, Search } from "lucide-react";

interface HadithBook {
  key: string;
  name: string;
  nameAr: string;
  hadiths: number;
}

interface HadithItem {
  number: number;
  arab: string;
  id: string;
}

const hadithBooks: HadithBook[] = [
  { key: "bukhari", name: "Sahih al-Bukhari", nameAr: "صحیح بخاری", hadiths: 7563 },
  { key: "muslim", name: "Sahih Muslim", nameAr: "صحیح مسلم", hadiths: 3033 },
  { key: "tirmidhi", name: "Jami at-Tirmidhi", nameAr: "جامع ترمذی", hadiths: 3956 },
  { key: "abudawud", name: "Sunan Abu Dawud", nameAr: "سنن ابو داود", hadiths: 5274 },
  { key: "nasai", name: "Sunan an-Nasa'i", nameAr: "سنن نسائی", hadiths: 5758 },
  { key: "ibnmajah", name: "Sunan Ibn Majah", nameAr: "سنن ابن ماجہ", hadiths: 4341 },
];

const HadithCollection = () => {
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchNum, setSearchNum] = useState("");

  const loadHadiths = async (book: HadithBook, pageNum: number, append = false) => {
    setLoading(true);
    try {
      const range = `${(pageNum - 1) * 20 + 1}-${pageNum * 20}`;
      const res = await fetch(`https://api.hadith.gading.dev/books/${book.key}?range=${range}`);
      const data = await res.json();
      if (data.data?.hadiths) {
        const items = data.data.hadiths.map((h: any) => ({
          number: h.number,
          arab: h.arab,
          id: h.id,
        }));
        setHadiths(append ? (prev) => [...prev, ...items] : items);
        setHasMore(items.length === 20);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const selectBook = (book: HadithBook) => {
    setSelectedBook(book);
    setPage(1);
    setHadiths([]);
    setSearchNum("");
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
    try {
      const num = parseInt(searchNum);
      const res = await fetch(`https://api.hadith.gading.dev/books/${selectedBook.key}?range=${num}-${num}`);
      const data = await res.json();
      if (data.data?.hadiths) {
        setHadiths(data.data.hadiths.map((h: any) => ({ number: h.number, arab: h.arab, id: h.id })));
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <section id="hadith-collection" className="px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Hadith Collection</h2>
        <span className="font-arabic text-lg text-muted-foreground">کتبِ احادیث</span>
      </div>

      {!selectedBook ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hadithBooks.map((book) => (
            <button
              key={book.key}
              onClick={() => selectBook(book)}
              className="glass-card p-5 text-left hover:glow-accent transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors">
                    {book.name}
                  </p>
                  <p className="font-arabic text-lg text-muted-foreground">{book.nameAr}</p>
                  <p className="text-xs text-muted-foreground mt-1">{book.hadiths.toLocaleString()} hadiths</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <button
              onClick={() => { setSelectedBook(null); setHadiths([]); }}
              className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-heading"
            >
              <ArrowLeft className="w-4 h-4" /> All Books
            </button>
            <div className="text-center">
              <h3 className="font-heading text-base font-bold text-foreground">{selectedBook.name}</h3>
              <p className="font-arabic text-lg text-accent">{selectedBook.nameAr}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Hadith #"
                value={searchNum}
                onChange={(e) => setSearchNum(e.target.value)}
                className="w-24 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm font-heading placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60"
              />
              <button
                onClick={searchHadith}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-heading"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {hadiths.map((h) => (
              <div key={h.id || h.number} className="p-4 rounded-xl bg-secondary/30 border border-border/20">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-1">
                    {h.number}
                  </span>
                  <p className="font-arabic text-lg sm:text-xl leading-[2] text-foreground text-right flex-1" dir="rtl">
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
                className="w-full py-3 rounded-xl bg-secondary/50 border border-border/30 text-sm text-primary font-heading font-medium hover:bg-secondary/80 transition-colors"
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
