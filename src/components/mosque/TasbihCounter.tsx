import { useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";

const dhikrOptions = [
  { label: "SubhanAllah", arabic: "سُبْحَانَ اللّٰهِ", target: 33 },
  { label: "Alhamdulillah", arabic: "اَلْحَمْدُ لِلّٰهِ", target: 33 },
  { label: "Allahu Akbar", arabic: "اَللّٰهُ أَكْبَرُ", target: 34 },
  { label: "La ilaha illallah", arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ", target: 100 },
  { label: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللّٰهَ", target: 100 },
];

const TasbihCounter = () => {
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const dhikr = dhikrOptions[selectedDhikr];
  const progress = Math.min((count / dhikr.target) * 100, 100);
  const completed = count >= dhikr.target;

  const handleTap = useCallback(() => {
    setCount((c) => c + 1);
    setTotalCount((t) => t + 1);
  }, []);

  const handleReset = () => setCount(0);

  const selectDhikr = (index: number) => {
    setSelectedDhikr(index);
    setCount(0);
  };

  return (
    <section id="tasbih" className="px-4 max-w-4xl mx-auto">
      <div className="section-heading">
        <span className="text-lg shrink-0">📿</span>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">Digital Tasbih</h2>
        <span className="font-urdu text-base text-muted-foreground whitespace-nowrap">تسبیح</span>
      </div>

      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
          {dhikrOptions.map((d, i) => (
            <button
              key={d.label}
              onClick={() => selectDhikr(i)}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-heading font-medium transition-all duration-200 border ${
                selectedDhikr === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/40 text-muted-foreground border-border/30 hover:border-primary/40"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="text-center mb-4">
          <p className="font-arabic text-2xl sm:text-3xl text-accent mb-1">{dhikr.arabic}</p>
          <p className="text-xs text-muted-foreground font-heading">{dhikr.label}</p>
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={handleTap}
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center select-none active:scale-95 transition-transform"
            aria-label="Tap to count"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
              <circle
                cx="100" cy="100" r="90" fill="none"
                stroke={completed ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="relative z-10 text-center bg-secondary/40 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center border border-border/50">
              <p className={`font-heading text-4xl sm:text-5xl font-bold ${completed ? "text-accent" : "text-foreground"}`}>
                {count}
              </p>
              <p className="text-[10px] text-muted-foreground font-heading">/ {dhikr.target}</p>
            </div>
          </button>
        </div>

        {completed && (
          <p className="text-center text-accent font-heading font-semibold text-xs mb-3 animate-pulse-glow">
            ✨ ماشاءاللہ — Target completed! ✨
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/30 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <span className="text-[10px] text-muted-foreground font-heading">
            Total: {totalCount}
          </span>
        </div>
      </div>
    </section>
  );
};

export default TasbihCounter;
