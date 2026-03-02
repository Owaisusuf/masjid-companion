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
    <section id="tasbih" className="px-4 max-w-5xl mx-auto">
      <div className="section-heading">
        <span className="text-xl shrink-0">📿</span>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Digital Tasbih</h2>
        <span className="font-urdu text-sm text-muted-foreground">تسبیح</span>
      </div>

      <div className="glass-card p-5 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {dhikrOptions.map((d, i) => (
            <button
              key={d.label}
              onClick={() => selectDhikr(i)}
              className={`px-3 py-2 rounded-xl text-xs font-body font-medium transition-all duration-200 border ${
                selectedDhikr === i
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="text-center mb-5">
          <p className="font-arabic text-3xl sm:text-4xl text-accent mb-2">{dhikr.arabic}</p>
          <p className="text-sm text-muted-foreground font-body">{dhikr.label}</p>
        </div>

        <div className="flex justify-center mb-5">
          <button
            onClick={handleTap}
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center select-none active:scale-95 transition-transform"
            aria-label="Tap to count"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
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
            <div className="relative z-10 text-center bg-card w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center border border-border shadow-sm">
              <p className={`font-heading text-5xl sm:text-6xl font-bold ${completed ? "text-accent" : "text-foreground"}`}>
                {count}
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">/ {dhikr.target}</p>
            </div>
          </button>
        </div>

        {completed && (
          <p className="text-center text-accent font-heading font-semibold text-sm mb-4 animate-pulse-glow">
            ✨ ماشاءاللہ — Target completed! ✨
          </p>
        )}

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <span className="text-xs text-muted-foreground font-body">
            Total: {totalCount}
          </span>
        </div>
      </div>
    </section>
  );
};

export default TasbihCounter;