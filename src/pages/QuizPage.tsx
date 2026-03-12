import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Star, CheckCircle2, XCircle, ChevronRight, RotateCcw, Flame, Award } from "lucide-react";
import { quizCategories, quizQuestions, type QuizCategory, type Difficulty, type QuizQuestion, type QuizCategoryInfo } from "@/data/quiz-data";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";

interface UserProgress {
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  bestStreak: number;
  categoryScores: Record<string, { answered: number; correct: number }>;
  completedQuizzes: string[];
}

const defaultProgress: UserProgress = {
  totalAnswered: 0,
  totalCorrect: 0,
  streak: 0,
  bestStreak: 0,
  categoryScores: {},
  completedQuizzes: [],
};

const getProgress = (): UserProgress => {
  try {
    const saved = safeGetItem("islamic-quiz-progress-v1");
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  } catch { return defaultProgress; }
};

const saveProgress = (p: UserProgress) => {
  safeSetItem("islamic-quiz-progress-v1", JSON.stringify(p));
};

type Screen = "home" | "category" | "quiz" | "result";

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
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
    const t = setTimeout(() => setAnimateIn(false), 500);
    return () => clearTimeout(t);
  }, [currentIndex, screen]);

  const startQuiz = (cat: QuizCategoryInfo, diff: Difficulty) => {
    const filtered = quizQuestions.filter(q => q.category === cat.id && q.difficulty === diff);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    if (shuffled.length === 0) {
      const allCat = quizQuestions.filter(q => q.category === cat.id);
      const fallback = [...allCat].sort(() => Math.random() - 0.5).slice(0, 10);
      setQuestions(fallback);
    } else {
      setQuestions(shuffled);
    }
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

    const newProgress = { ...progress };
    newProgress.totalAnswered++;
    if (isCorrect) {
      newProgress.totalCorrect++;
      newProgress.streak++;
      if (newProgress.streak > newProgress.bestStreak) newProgress.bestStreak = newProgress.streak;
      setSessionCorrect(prev => prev + 1);
    } else {
      newProgress.streak = 0;
    }

    const catKey = q.category;
    if (!newProgress.categoryScores[catKey]) newProgress.categoryScores[catKey] = { answered: 0, correct: 0 };
    newProgress.categoryScores[catKey].answered++;
    if (isCorrect) newProgress.categoryScores[catKey].correct++;

    setSessionTotal(prev => prev + 1);
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setScreen("result");
    }
  };

  const currentQ = questions[currentIndex];
  const scorePercent = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  const badges = useMemo(() => {
    const b: { name: string; icon: string; earned: boolean }[] = [
      { name: "Sunnah Learner", icon: "🤲", earned: (progress.categoryScores["daily-sunnah"]?.correct || 0) >= 5 },
      { name: "Seerah Expert", icon: "🕌", earned: (progress.categoryScores["seerah"]?.correct || 0) >= 5 },
      { name: "Hadith Master", icon: "📜", earned: (progress.categoryScores["hadith"]?.correct || 0) >= 5 },
      { name: "Quran Explorer", icon: "📖", earned: (progress.categoryScores["quran"]?.correct || 0) >= 5 },
      { name: "Streak Champion", icon: "🔥", earned: progress.bestStreak >= 10 },
    ];
    return b;
  }, [progress]);

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={() => {
            if (screen === "quiz" || screen === "result") setScreen("category");
            else if (screen === "category") setScreen("home");
            else navigate("/");
          }} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-lg font-bold text-foreground truncate">
              {screen === "home" ? "Islamic Quiz" : screen === "category" ? selectedCategory?.title : screen === "quiz" ? `Q ${currentIndex + 1}/${questions.length}` : "Results"}
            </h1>
            {screen === "home" && <p className="font-urdu text-xs text-muted-foreground" dir="rtl">اسلامی کوئز</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-accent font-body">{progress.streak}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary font-body">{progress.totalCorrect}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ══════ HOME SCREEN ══════ */}
        {screen === "home" && (
          <div className="space-y-6">
            {/* Bismillah */}
            <div className="glass-card p-6 text-center">
              <p className="font-arabic text-2xl text-primary mb-2" style={{ lineHeight: "2" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="text-sm text-muted-foreground font-body">In the name of Allah, the Most Gracious, the Most Merciful</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-primary font-body">{progress.totalCorrect}</p>
                <p className="text-[10px] text-muted-foreground font-body mt-1">Correct</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-accent font-body">{progress.bestStreak}</p>
                <p className="text-[10px] text-muted-foreground font-body mt-1">Best Streak</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground font-body">{progress.totalAnswered}</p>
                <p className="text-[10px] text-muted-foreground font-body mt-1">Answered</p>
              </div>
            </div>

            {/* Badges */}
            {badges.some(b => b.earned) && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-accent" />
                  <h3 className="font-heading text-sm font-bold text-foreground">Achievements</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {badges.filter(b => b.earned).map(b => (
                    <span key={b.name} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-xs font-body font-medium text-accent">
                      {b.icon} {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Choose a Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizCategories.map(cat => {
                  const score = progress.categoryScores[cat.id];
                  return (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat); setScreen("category"); }}
                      className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all text-left">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${cat.color}`}>
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cat.title}</p>
                        <p className="font-urdu text-[11px] text-muted-foreground" dir="rtl">{cat.titleUrdu}</p>
                        <p className="text-[10px] text-muted-foreground/70 font-body mt-1">{cat.description}</p>
                        {score && (
                          <p className="text-[10px] text-primary font-body mt-1">{score.correct}/{score.answered} correct</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary mt-1 shrink-0 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════ CATEGORY / DIFFICULTY SELECT ══════ */}
        {screen === "category" && selectedCategory && (
          <div className="space-y-6">
            <div className="glass-card p-6 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 ${selectedCategory.color}`}>
                {selectedCategory.icon}
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">{selectedCategory.title}</h2>
              <p className="font-urdu text-sm text-muted-foreground mt-1" dir="rtl">{selectedCategory.titleUrdu}</p>
              <p className="text-xs text-muted-foreground/70 font-body mt-2">{selectedCategory.description}</p>
            </div>

            <div>
              <h3 className="font-heading text-base font-bold text-foreground mb-3">Select Difficulty</h3>
              <div className="space-y-3">
                {(["beginner", "intermediate", "advanced"] as Difficulty[]).map(diff => {
                  const count = quizQuestions.filter(q => q.category === selectedCategory.id && q.difficulty === diff).length;
                  return (
                    <button key={diff} onClick={() => { setSelectedDifficulty(diff); startQuiz(selectedCategory, diff); }}
                      className="w-full glass-card p-4 flex items-center justify-between hover:border-primary/40 hover:shadow-md transition-all text-left group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                          diff === "beginner" ? "bg-green-500/10" : diff === "intermediate" ? "bg-amber-500/10" : "bg-red-500/10"
                        }`}>
                          {diff === "beginner" ? "🌱" : diff === "intermediate" ? "🌿" : "🌳"}
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold text-foreground capitalize group-hover:text-primary transition-colors">{diff}</p>
                          <p className="text-[10px] text-muted-foreground font-body">{count} questions available</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════ QUIZ SCREEN ══════ */}
        {screen === "quiz" && currentQ && (
          <div className={`space-y-5 transition-opacity duration-300 ${animateIn ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`} style={{ transition: "all 0.3s ease" }}>
            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>

            {/* Question */}
            <div className="glass-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-body ${
                  currentQ.difficulty === "beginner" ? "bg-green-500/10 text-green-600" :
                  currentQ.difficulty === "intermediate" ? "bg-amber-500/10 text-amber-600" :
                  "bg-red-500/10 text-red-500"
                }`}>{currentQ.difficulty}</span>
                <span className="text-[10px] text-muted-foreground/60 font-body">{selectedCategory?.title}</span>
              </div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-foreground mb-2" style={{ lineHeight: "1.6" }}>{currentQ.question}</h3>
              <p className="font-urdu text-sm text-muted-foreground" dir="rtl" style={{ lineHeight: "2.2" }}>{currentQ.questionUrdu}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const showResult = selectedAnswer !== null;

                let borderClass = "border-border hover:border-primary/40";
                let bgClass = "bg-card";
                if (showResult && isCorrect) {
                  borderClass = "border-green-500";
                  bgClass = "bg-green-500/5";
                } else if (showResult && isSelected && !isCorrect) {
                  borderClass = "border-red-500";
                  bgClass = "bg-red-500/5";
                }

                return (
                  <button key={idx} onClick={() => selectAnswer(idx)} disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl border-2 ${borderClass} ${bgClass} flex items-center gap-3 text-left transition-all ${selectedAnswer === null ? "hover:shadow-md" : ""}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-body shrink-0 ${
                      showResult && isCorrect ? "bg-green-500 text-white" :
                      showResult && isSelected ? "bg-red-500 text-white" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {showResult && isCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                       showResult && isSelected ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-body text-sm text-foreground">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="glass-card p-5 border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === currentQ.correctIndex ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-body text-sm font-bold ${selectedAnswer === currentQ.correctIndex ? "text-green-600" : "text-red-500"}`}>
                    {selectedAnswer === currentQ.correctIndex ? "Correct! ✨" : "Incorrect"}
                  </span>
                </div>
                <p className="font-body text-sm text-foreground/85 mb-2" style={{ lineHeight: "1.8" }}>{currentQ.explanation}</p>
                <p className="font-urdu text-sm text-muted-foreground" dir="rtl" style={{ lineHeight: "2.2" }}>{currentQ.explanationUrdu}</p>
                <p className="text-[10px] text-primary font-body mt-3">📖 {currentQ.reference}</p>

                <button onClick={nextQuestion} className="mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium text-sm hover:bg-primary/90 transition-colors">
                  {currentIndex < questions.length - 1 ? "Next Question →" : "View Results"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════ RESULT SCREEN ══════ */}
        {screen === "result" && (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 ${
                scorePercent >= 80 ? "bg-green-500/10" : scorePercent >= 50 ? "bg-amber-500/10" : "bg-red-500/10"
              }`}>
                {scorePercent >= 80 ? "🏆" : scorePercent >= 50 ? "👍" : "💪"}
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
                {scorePercent >= 80 ? "Excellent!" : scorePercent >= 50 ? "Good Job!" : "Keep Learning!"}
              </h2>
              <p className="font-urdu text-sm text-muted-foreground" dir="rtl">
                {scorePercent >= 80 ? "بہترین!" : scorePercent >= 50 ? "شاباش!" : "سیکھتے رہیں!"}
              </p>

              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary font-body">{sessionCorrect}</p>
                  <p className="text-xs text-muted-foreground font-body">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground font-body">{sessionTotal}</p>
                  <p className="text-xs text-muted-foreground font-body">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent font-body">{scorePercent}%</p>
                  <p className="text-xs text-muted-foreground font-body">Score</p>
                </div>
              </div>
            </div>

            {/* Motivational hadith */}
            <div className="glass-card p-5 text-center border-l-4 border-accent">
              <p className="font-arabic text-base text-foreground/90 mb-2" dir="rtl" style={{ lineHeight: "2.4" }}>
                مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ
              </p>
              <p className="text-xs text-muted-foreground font-body italic">"Whoever takes a path seeking knowledge, Allah will make easy for him a path to Paradise."</p>
              <p className="text-[10px] text-primary font-body mt-1">📖 Sahih Muslim 2699</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { if (selectedCategory) startQuiz(selectedCategory, selectedDifficulty); }}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button onClick={() => setScreen("home")}
                className="flex-1 py-3 rounded-xl border-2 border-border bg-card text-foreground font-body font-medium text-sm hover:bg-secondary transition-colors">
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
