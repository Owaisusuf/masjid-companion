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
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">📿</span>
        <h2 className="font-heading text-2xl font-bold text-foreground">Digital Tasbih</h2>
        <span className="font-arabic text-lg text-muted-foreground">تسبیح</span>
      </div>

      <div className="glass-card p-6 sm:p-8">
        {/* Dhikr selector */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {dhikrOptions.map((d, i) => (
            <button
              key={d.label}
              onClick={() => selectDhikr(i)}
              className={`px-3 py-2 rounded-xl text-xs font-heading font-medium transition-all duration-200 border ${
                selectedDhikr === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/40 text-muted-foreground border-border/30 hover:border-primary/40"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Arabic text */}
        <div className="text-center mb-6">
          <p className="font-arabic text-3xl sm:text-4xl text-accent mb-2">{dhikr.arabic}</p>
          <p className="text-sm text-muted-foreground font-heading">{dhikr.label}</p>
        </div>

        {/* Counter circle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleTap}
            className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center select-none active:scale-95 transition-transform"
            aria-label="Tap to count"
          >
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={completed ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="relative z-10 text-center bg-secondary/40 w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center border border-border/50">
              <p className={`font-heading text-5xl sm:text-6xl font-bold ${completed ? "text-accent" : "text-foreground"}`}>
                {count}
              </p>
              <p className="text-xs text-muted-foreground font-heading mt-1">/ {dhikr.target}</p>
            </div>
          </button>
        </div>

        {completed && (
          <p className="text-center text-accent font-heading font-semibold text-sm mb-4 animate-pulse-glow">
            ✨ Target completed! MashaAllah ✨
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/30 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <span className="text-xs text-muted-foreground font-heading">
            Total: {totalCount}
          </span>
        </div>
      </div>
    </section>
  );
};

export default TasbihCounter;
