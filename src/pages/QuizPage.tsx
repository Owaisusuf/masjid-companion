import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, CheckCircle2, XCircle, ChevronRight, RotateCcw, Flame, Award } from "lucide-react";
import { quizCategories, quizQuestions, type QuizCategory, type Difficulty, type QuizQuestion, type QuizCategoryInfo } from "@/data/quiz-data";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";

interface UserProgress {
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  bestStreak: number;
  categoryScores: Record<string, { answered: number; correct: number }>;
}

const defaultProgress: UserProgress = {
  totalAnswered: 0,
  totalCorrect: 0,
  streak: 0,
  bestStreak: 0,
  categoryScores: {},
};

const getProgress = (): UserProgress => {
  try {
    const saved = safeGetItem("islamic-quiz-progress-v2");
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  } catch { return defaultProgress; }
};
const saveProgress = (p: UserProgress) => safeSetItem("islamic-quiz-progress-v2", JSON.stringify(p));

type Screen = "home" | "difficulty" | "quiz" | "result";

const QUESTIONS_PER_QUIZ = 10;

const QuizPage = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCategory, setSelectedCategory] = useState<QuizCategoryInfo | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("beginner");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [progress, setProgress] = useState<UserProgress>(getProgress);

  const startQuiz = (cat: QuizCategoryInfo, diff: Difficulty) => {
    setSelectedCategory(cat);
    setSelectedDifficulty(diff);
    let filtered = quizQuestions.filter(q => q.category === cat.id && q.difficulty === diff);
    if (filtered.length === 0) filtered = quizQuestions.filter(q => q.category === cat.id);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_QUIZ);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionCorrect(0);
    setSessionTotal(0);
    setScreen("quiz");
  };

  const selectAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const q = questions[currentIndex];
    const isCorrect = idx === q.correctIndex;
    const np = { ...progress };
    np.totalAnswered++;
    if (isCorrect) { np.totalCorrect++; np.streak++; if (np.streak > np.bestStreak) np.bestStreak = np.streak; setSessionCorrect(s => s + 1); }
    else np.streak = 0;
    const ck = q.category;
    if (!np.categoryScores[ck]) np.categoryScores[ck] = { answered: 0, correct: 0 };
    np.categoryScores[ck].answered++;
    if (isCorrect) np.categoryScores[ck].correct++;
    setSessionTotal(s => s + 1);
    setProgress(np);
    saveProgress(np);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) { setCurrentIndex(i => i + 1); setSelectedAnswer(null); setShowExplanation(false); }
    else setScreen("result");
  };

  const currentQ = questions[currentIndex];
  const scorePercent = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  const badges = useMemo(() => [
    { name: "Sunnah Learner", icon: "🤲", earned: (progress.categoryScores["daily-sunnah"]?.correct || 0) >= 5 },
    { name: "Seerah Expert", icon: "🕌", earned: (progress.categoryScores["seerah"]?.correct || 0) >= 5 },
    { name: "Hadith Master", icon: "📜", earned: (progress.categoryScores["hadith"]?.correct || 0) >= 5 },
    { name: "Quran Explorer", icon: "📖", earned: (progress.categoryScores["quran"]?.correct || 0) >= 5 },
    { name: "Streak Champion", icon: "🔥", earned: progress.bestStreak >= 10 },
  ], [progress]);

  const goBack = () => {
    if (screen === "quiz" || screen === "result") setScreen("difficulty");
    else if (screen === "difficulty") setScreen("home");
    else navigate(-1);
  };

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={goBack} className="p-2 rounded-lg hover:bg-secondary transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-base sm:text-lg font-bold text-foreground truncate">
              {screen === "home" ? "Islamic Quiz" : screen === "difficulty" ? selectedCategory?.title : screen === "quiz" ? `Question ${currentIndex + 1}/${questions.length}` : "Results"}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10">
              <Flame className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-bold text-accent font-body">{progress.streak}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary font-body">{progress.totalCorrect}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">

        {/* ══════ HOME ══════ */}
        {screen === "home" && (
          <div className="space-y-4">
            {/* Bismillah */}
            <div className="glass-card p-5 text-center">
              <p className="font-arabic text-xl sm:text-2xl text-primary" style={{ lineHeight: "2" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Test your Islamic knowledge</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="glass-card p-3 text-center">
                <p className="text-xl font-bold text-primary font-body">{progress.totalCorrect}</p>
                <p className="text-[10px] text-muted-foreground font-body">Correct</p>
              </div>
              <div className="glass-card p-3 text-center">
                <p className="text-xl font-bold text-accent font-body">{progress.bestStreak}</p>
                <p className="text-[10px] text-muted-foreground font-body">Best Streak</p>
              </div>
              <div className="glass-card p-3 text-center">
                <p className="text-xl font-bold text-foreground font-body">{progress.totalAnswered}</p>
                <p className="text-[10px] text-muted-foreground font-body">Answered</p>
              </div>
            </div>

            {/* Badges */}
            {badges.some(b => b.earned) && (
              <div className="flex flex-wrap gap-1.5">
                {badges.filter(b => b.earned).map(b => (
                  <span key={b.name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-xs font-body font-medium text-accent">
                    {b.icon} {b.name}
                  </span>
                ))}
              </div>
            )}

            {/* Categories grid */}
            <div>
              <h2 className="font-heading text-base font-bold text-foreground mb-3">Choose a Category</h2>
              <div className="grid grid-cols-2 gap-2">
                {quizCategories.map(cat => {
                  const score = progress.categoryScores[cat.id];
                  const totalQ = quizQuestions.filter(q => q.category === cat.id).length;
                  return (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat); setScreen("difficulty"); }}
                      className="group p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all text-left">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${cat.color}`}>{cat.icon}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary ml-auto transition-colors shrink-0" />
                      </div>
                      <p className="font-body text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{cat.title}</p>
                      <p className="font-urdu text-[10px] text-muted-foreground leading-relaxed">{cat.titleUrdu}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-muted-foreground/60 font-body">{totalQ} Qs</span>
                        {score && <span className="text-[10px] text-primary font-body">{score.correct}/{score.answered}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════ DIFFICULTY SELECT ══════ */}
        {screen === "difficulty" && selectedCategory && (
          <div className="space-y-4">
            <div className="glass-card p-5 text-center">
              <span className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center text-2xl mx-auto mb-2 ${selectedCategory.color}`}>{selectedCategory.icon}</span>
              <h2 className="font-heading text-lg font-bold text-foreground">{selectedCategory.title}</h2>
              <p className="font-urdu text-sm text-muted-foreground" dir="rtl">{selectedCategory.titleUrdu}</p>
            </div>

            <div className="space-y-2">
              {(["beginner", "intermediate", "advanced"] as Difficulty[]).map(diff => {
                const count = quizQuestions.filter(q => q.category === selectedCategory.id && q.difficulty === diff).length;
                const emoji = diff === "beginner" ? "🌱" : diff === "intermediate" ? "🌿" : "🌳";
                const bg = diff === "beginner" ? "bg-green-500/10" : diff === "intermediate" ? "bg-amber-500/10" : "bg-red-500/10";
                return (
                  <button key={diff} onClick={() => startQuiz(selectedCategory, diff)}
                    className="w-full glass-card p-3.5 flex items-center gap-3 hover:border-primary/40 hover:shadow-md transition-all text-left group">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${bg}`}>{emoji}</span>
                    <div className="flex-1">
                      <p className="font-body text-sm font-semibold text-foreground capitalize group-hover:text-primary transition-colors">{diff}</p>
                      <p className="text-[10px] text-muted-foreground font-body">{count} questions</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════ QUIZ ══════ */}
        {screen === "quiz" && currentQ && (
          <div className="space-y-4">
            {/* Progress */}
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>

            {/* Question card */}
            <div className="glass-card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-body ${
                  currentQ.difficulty === "beginner" ? "bg-green-500/10 text-green-600" :
                  currentQ.difficulty === "intermediate" ? "bg-amber-500/10 text-amber-600" :
                  "bg-red-500/10 text-red-500"
                }`}>{currentQ.difficulty}</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-foreground" style={{ lineHeight: "1.6" }}>{currentQ.question}</h3>
              <p className="font-urdu text-sm text-muted-foreground mt-1" dir="rtl" style={{ lineHeight: "2.2" }}>{currentQ.questionUrdu}</p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const showResult = selectedAnswer !== null;

                let cls = "border-border hover:border-primary/40 bg-card";
                if (showResult && isCorrect) cls = "border-green-500 bg-green-500/5";
                else if (showResult && isSelected && !isCorrect) cls = "border-red-500 bg-red-500/5";

                return (
                  <button key={idx} onClick={() => selectAnswer(idx)} disabled={selectedAnswer !== null}
                    className={`w-full p-3.5 rounded-xl border-2 ${cls} flex items-center gap-3 text-left transition-all ${!showResult ? "hover:shadow-md active:scale-[0.98]" : ""}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-body shrink-0 ${
                      showResult && isCorrect ? "bg-green-500 text-white" :
                      showResult && isSelected ? "bg-red-500 text-white" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {showResult && isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       showResult && isSelected ? <XCircle className="w-3.5 h-3.5" /> :
                       String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-body text-sm text-foreground">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="glass-card p-4 border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-1.5">
                  {selectedAnswer === currentQ.correctIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-body text-sm font-bold ${selectedAnswer === currentQ.correctIndex ? "text-green-600" : "text-red-500"}`}>
                    {selectedAnswer === currentQ.correctIndex ? "Correct! ✨" : "Incorrect"}
                  </span>
                </div>
                <p className="font-body text-sm text-foreground/85 mb-1.5" style={{ lineHeight: "1.7" }}>{currentQ.explanation}</p>
                <p className="font-urdu text-sm text-muted-foreground" dir="rtl" style={{ lineHeight: "2.2" }}>{currentQ.explanationUrdu}</p>
                <p className="text-[10px] text-primary font-body mt-2">📖 {currentQ.reference}</p>

                <button onClick={nextQuestion} className="mt-3 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-body font-medium text-sm hover:bg-primary/90 transition-colors active:scale-[0.98]">
                  {currentIndex < questions.length - 1 ? "Next Question →" : "View Results"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════ RESULT ══════ */}
        {screen === "result" && (
          <div className="space-y-4">
            <div className="glass-card p-6 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 ${
                scorePercent >= 80 ? "bg-green-500/10" : scorePercent >= 50 ? "bg-amber-500/10" : "bg-red-500/10"
              }`}>
                {scorePercent >= 80 ? "🏆" : scorePercent >= 50 ? "👍" : "💪"}
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-0.5">
                {scorePercent >= 80 ? "Excellent!" : scorePercent >= 50 ? "Good Job!" : "Keep Learning!"}
              </h2>
              <p className="font-urdu text-sm text-muted-foreground" dir="rtl">
                {scorePercent >= 80 ? "بہترین!" : scorePercent >= 50 ? "شاباش!" : "سیکھتے رہیں!"}
              </p>

              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary font-body">{sessionCorrect}</p>
                  <p className="text-[10px] text-muted-foreground font-body">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground font-body">{sessionTotal}</p>
                  <p className="text-[10px] text-muted-foreground font-body">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent font-body">{scorePercent}%</p>
                  <p className="text-[10px] text-muted-foreground font-body">Score</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 text-center border-l-4 border-accent">
              <p className="font-arabic text-sm text-foreground/90 mb-1" dir="rtl" style={{ lineHeight: "2.4" }}>
                مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ
              </p>
              <p className="text-xs text-muted-foreground font-body italic">"Whoever takes a path seeking knowledge, Allah will ease a path to Paradise."</p>
              <p className="text-[10px] text-primary font-body mt-1">📖 Sahih Muslim 2699</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { if (selectedCategory) startQuiz(selectedCategory, selectedDifficulty); }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-body font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button onClick={() => setScreen("home")}
                className="flex-1 py-2.5 rounded-xl border-2 border-border bg-card text-foreground font-body font-medium text-sm hover:bg-secondary transition-colors active:scale-[0.98]">
                All Categories
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default QuizPage;
