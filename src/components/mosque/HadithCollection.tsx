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
      <div className="section-heading">
        <BookOpen className="w-5 h-5 text-accent shrink-0" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">Hadith Collection</h2>
        <span className="font-urdu text-base text-muted-foreground whitespace-nowrap">کتبِ احادیث</span>
      </div>

      {!selectedBook ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {hadithBooks.map((book) => (
            <button
              key={book.key}
              onClick={() => selectBook(book)}
              className="glass-card p-3 sm:p-4 text-left hover:glow-accent transition-all duration-300 group"
            >
              <div className="text-2xl mb-2">{book.icon}</div>
              <p className="font-heading text-xs sm:text-sm font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                {book.name}
              </p>
              <p className="font-urdu text-sm text-muted-foreground mt-0.5" dir="rtl">{book.nameUrdu}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1 font-heading">{book.hadiths.toLocaleString()} احادیث</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-card p-3 sm:p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <button
              onClick={() => { setSelectedBook(null); setHadiths([]); }}
              className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-xs font-heading"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> واپس
            </button>
            <div className="text-center flex-1">
              <h3 className="font-heading text-sm font-bold text-foreground">{selectedBook.name}</h3>
              <p className="font-urdu text-base text-accent" dir="rtl">{selectedBook.nameUrdu}</p>
            </div>
            <div className="flex gap-1.5">
              <input
                type="number"
                placeholder="حدیث نمبر"
                value={searchNum}
                onChange={(e) => setSearchNum(e.target.value)}
                className="w-20 px-2 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-xs font-heading placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60"
              />
              <button
                onClick={searchHadith}
                className="px-2 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {hadiths.map((h) => (
              <div key={h.id || h.number} className="p-3 rounded-xl bg-secondary/30 border border-border/20">
                <div className="flex items-start gap-2">
                  <span className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent text-[10px] font-bold shrink-0 mt-1 font-heading">
                    {h.number}
                  </span>
                  <p className="font-arabic text-base sm:text-lg leading-[2] text-foreground text-right flex-1" dir="rtl">
                    {h.arab}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}

            {!loading && hasMore && hadiths.length > 0 && (
              <button
                onClick={loadMore}
                className="w-full py-2.5 rounded-xl bg-secondary/50 border border-border/30 text-xs text-primary font-heading font-medium hover:bg-secondary/80 transition-colors"
              >
                مزید احادیث لوڈ کریں — Load More
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HadithCollection;
