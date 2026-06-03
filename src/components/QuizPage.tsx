/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RefreshCw, 
  Lock, 
  HelpCircle, 
  Flame, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Zap,
  Timer,
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { generateQuestionsForLevel, QuizQuestion } from '../quizGenerator';

// 21 Cases/Segments for Wheel of Fortune (Roue de la Chance)
const WHEEL_SEGMENTS = [
  { label: "💣", text: "Boamba 💣", points: -20, desc: "Aza tezitra! Nihemotra -20 pts ny isa azo.", color: '#e11d48' },
  { label: "10p", text: "Isa 10 ⭐", points: 10, desc: "Nahazo isa +10 fanampiny tamin'ny kodiarana!", color: '#10b981' },
  { label: "20p", text: "Isa 20 ⭐", points: 20, desc: "Nahazo isa +20 fanampiny tamin'ny kodiarana!", color: '#0d9488' },
  { label: "50p", text: "Isa 50 ⭐", points: 50, desc: "Araraoty! Fahombiazana tsara indrindra nahazoana +50 pts!", color: '#d97706' },
  { label: "🙏", text: "Vavaka 🙏", points: 15, desc: "Nahazo vavaka feno fahasoavana sy isa +15!", color: '#0284c7' },
  { label: "📖", text: "Baiboly 📖", points: 25, desc: "Tenin'Andriamanitra hampitombo fahendrena sy hahazoana +25 pts!", color: '#6d28d9' },
  { label: "❤️", text: "Fitiavana ❤️", points: 30, desc: "Fo feno fitiavana avy amin'ny Ray sy isa +30!", color: '#db2777' },

  { label: "💣", text: "Boamba 💣", points: -20, desc: "Aza tezitra! Nihemotra -20 pts ny isa azo.", color: '#e11d48' },
  { label: "10p", text: "Isa 10 ⭐", points: 10, desc: "Nahazo isa +10 fanampiny tamin'ny kodiarana!", color: '#10b981' },
  { label: "20p", text: "Isa 20 ⭐", points: 20, desc: "Nahazo isa +20 fanampiny tamin'ny kodiarana!", color: '#0d9488' },
  { label: "50p", text: "Isa 50 ⭐", points: 50, desc: "Araraoty! Fahombiazana tsara indrindra nahazoana +50 pts!", color: '#d97706' },
  { label: "🙏", text: "Vavaka 🙏", points: 15, desc: "Nahazo vavaka feno fahasoavana sy isa +15!", color: '#0284c7' },
  { label: "📖", text: "Baiboly 📖", points: 25, desc: "Tenin'Andriamanitra hampitombo fahendrena sy hahazoana +25 pts!", color: '#6d28d9' },
  { label: "❤️", text: "Fitiavana ❤️", points: 30, desc: "Fo feno fitiavana avy amin'ny Ray sy isa +30!", color: '#db2777' },

  { label: "💣", text: "Boamba 💣", points: -20, desc: "Aza tezitra! Nihemotra -20 pts ny isa azo.", color: '#e11d48' },
  { label: "10p", text: "Isa 10 ⭐", points: 10, desc: "Nahazo isa +10 fanampiny tamin'ny kodiarana!", color: '#10b981' },
  { label: "20p", text: "Isa 20 ⭐", points: 20, desc: "Nahazo isa +20 fanampiny tamin'ny kodiarana!", color: '#0d9488' },
  { label: "50p", text: "Isa 50 ⭐", points: 50, desc: "Araraoty! Fahombiazana tsara indrindra nahazoana +50 pts!", color: '#d97706' },
  { label: "🙏", text: "Vavaka 🙏", points: 15, desc: "Nahazo vavaka feno fahasoavana sy isa +15!", color: '#0284c7' },
  { label: "📖", text: "Baiboly 📖", points: 25, desc: "Tenin'Andriamanitra hampitombo fahendrena sy hahazoana +25 pts!", color: '#6d28d9' },
  { label: "❤️", text: "Fitiavana ❤️", points: 30, desc: "Fo feno fitiavana avy amin'ny Ray sy isa +30!", color: '#db2777' }
];

interface QuizPageProps {
  isElderlyMode: boolean;
  loggedInMember: any;
  userScore: number;
  onAddPoints: (points: number) => void;
}

export default function QuizPage({ isElderlyMode, loggedInMember, userScore, onAddPoints }: QuizPageProps) {
  // Game Tab states: 'quiz' (Fifaninanana Baiboly) and 'bonus' (Kodiarana Lahatra)
  const [activePlayTab, setActivePlayTab] = useState<'quiz' | 'bonus'>('quiz');

  // difficulty / levels state
  const [difficulty, setDifficulty] = useState<'Facile' | 'Moyen' | 'Difficile'>('Facile');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Unlocked level progress saved
  const [unlockedProgress, setUnlockedProgress] = useState<Record<'Facile' | 'Moyen' | 'Difficile', number>>(() => {
    const saved = localStorage.getItem('mifandray_quiz_progress_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { 'Facile': 1, 'Moyen': 1, 'Difficile': 1 };
  });

  useEffect(() => {
    localStorage.setItem('mifandray_quiz_progress_v4', JSON.stringify(unlockedProgress));
  }, [unlockedProgress]);

  // Quiz game mechanics states
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [firstQuestionId, setFirstQuestionId] = useState<string | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [levelPassed, setLevelPassed] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);
  const [levelTab, setLevelTab] = useState<'early' | 'late'>('early');

  // Quiz timer states (30 seconds count down limit per question)
  const [quizTimer, setQuizTimer] = useState<number>(30);
  const [timeExpiredLock, setTimeExpiredLock] = useState<boolean>(false);

  // Wheel bonus states
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinOutcome, setSpinOutcome] = useState<any | null>(null);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  
  // States representing remaining spins and active cooldown countdown trigger
  const [spinsRemainingBonus, setSpinsRemainingBonus] = useState<number>(5);
  const [bonusCooldownMs, setBonusCooldownMs] = useState<number>(0); // remaining miliseconds

  // Use interval to update cooldown ticker and spins remaining
  useEffect(() => {
    if (!loggedInMember) return;
    
    const checkCooldown = () => {
      const storedWindowStart = localStorage.getItem(`mifandray_spin_window_start_${loggedInMember.id}`);
      const storedSpinsRemaining = localStorage.getItem(`mifandray_spins_remaining_${loggedInMember.id}`);
      
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000; // 900,000 ms

      if (storedWindowStart) {
        const windowStart = parseInt(storedWindowStart, 10);
        const elapsed = now - windowStart;
        
        if (elapsed >= fifteenMinutes) {
          // Cooldown period expired! Reset back to 5 free spins.
          setSpinsRemainingBonus(5);
          setBonusCooldownMs(0);
          localStorage.removeItem(`mifandray_spin_window_start_${loggedInMember.id}`);
          localStorage.setItem(`mifandray_spins_remaining_${loggedInMember.id}`, "5");
        } else {
          const remaining = storedSpinsRemaining ? parseInt(storedSpinsRemaining, 10) : 5;
          setSpinsRemainingBonus(remaining);
          if (remaining <= 0) {
            setBonusCooldownMs(fifteenMinutes - elapsed);
          } else {
            setBonusCooldownMs(0);
          }
        }
      } else {
        setSpinsRemainingBonus(5);
        setBonusCooldownMs(0);
      }
    };

    checkCooldown();
    const subInterval = setInterval(checkCooldown, 1000);
    return () => clearInterval(subInterval);
  }, [loggedInMember, isSpinning]);

  // Quiz 30s timer logic
  useEffect(() => {
    // Timer only ticks if active in a level and no answer has been submitted or completed
    if (selectedLevel === null || hasSubmitted || levelPassed || levelFailed || activePlayTab !== 'quiz') {
      return;
    }

    const timerInterval = setInterval(() => {
      setQuizTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          // Auto lock the current question to limit external documentation access
          setTimeExpiredLock(true);
          setHasSubmitted(true);
          // Set selection as wrong or unchanged
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [selectedLevel, currentQuestionIdx, hasSubmitted, levelPassed, levelFailed, activePlayTab]);

  // Reset clock on moving to another question
  useEffect(() => {
    setQuizTimer(30);
    setTimeExpiredLock(false);
  }, [currentQuestionIdx, selectedLevel]);

  // Game functions
  const startLevel = (lvl: number) => {
    const baseQuestions = generateQuestionsForLevel(difficulty, lvl);
    const shuffled = shuffleQuestionsList(baseQuestions, null);
    
    setActiveQuestions(shuffled);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setWrongAnswersCount(0);
    setFirstQuestionId(shuffled[0].id);
    setSessionScore(0);
    setLevelPassed(false);
    setLevelFailed(false);
    setSelectedLevel(lvl);
    setQuizTimer(30);
    setTimeExpiredLock(false);
  };

  const shuffleQuestionsList = (questions: QuizQuestion[], previousFirstId: string | null): QuizQuestion[] => {
    let shuffled = [...questions];
    let safetyCounter = 0;
    
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }
      safetyCounter++;
    } while (previousFirstId && shuffled[0].id === previousFirstId && safetyCounter < 100);

    return shuffled;
  };

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted || timeExpiredLock) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (hasSubmitted || timeExpiredLock) return;
    if (selectedOption === null) return;
    
    setHasSubmitted(true);
    const activeQuestion = activeQuestions[currentQuestionIdx];
    
    if (selectedOption === activeQuestion.answerIndex) {
      // Correct answer - gives +1 point directly to top balance!
      setSessionScore(prev => prev + 1);
      onAddPoints(1);
    } else {
      setWrongAnswersCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const activeQuestion = activeQuestions[currentQuestionIdx];
    
    // Check if correct (either timely or expired)
    const isCorrect = !timeExpiredLock && selectedOption === activeQuestion.answerIndex;

    if (!isCorrect) {
      // DYNAMIC FAIL RULE: Send user back to Question 1 with a different question layout
      const baseQuestions = generateQuestionsForLevel(difficulty, selectedLevel!);
      const reshuffled = shuffleQuestionsList(baseQuestions, firstQuestionId);
      
      setActiveQuestions(reshuffled);
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setHasSubmitted(false);
      setFirstQuestionId(reshuffled[0].id);
      setSessionScore(0);
      setQuizTimer(30);
      setTimeExpiredLock(false);
      
      alert(`⚠️ DISO NY VALINY na TAPITRA NY FOTOANA!\nKatsaho indray: Haverina any amin'ny Fanontaniana Voalohany ianao (fa ovana ny filaharany).`);
      return;
    }

    setSelectedOption(null);
    setHasSubmitted(false);
    setTimeExpiredLock(false);
    setQuizTimer(30);

    if (currentQuestionIdx + 1 < activeQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setLevelPassed(true);
      // Unlock next stage
      const currentUnlocked = unlockedProgress[difficulty];
      if (selectedLevel === currentUnlocked && currentUnlocked < 50) {
        setUnlockedProgress(prev => ({
          ...prev,
          [difficulty]: currentUnlocked + 1
        }));
      }
    }
  };

  // Turn Wheel mechanism
  const handleSpinWheel = () => {
    if (!loggedInMember || isSpinning || (spinsRemainingBonus <= 0 && bonusCooldownMs > 0)) return;

    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;

    let storedWindowStart = localStorage.getItem(`mifandray_spin_window_start_${loggedInMember.id}`);
    let storedSpinsRemaining = localStorage.getItem(`mifandray_spins_remaining_${loggedInMember.id}`);

    let windowStart = storedWindowStart ? parseInt(storedWindowStart, 10) : now;
    let spinsLeft = storedSpinsRemaining ? parseInt(storedSpinsRemaining, 10) : 5;

    // Reset window if 15 mins passed
    if (storedWindowStart && now - windowStart >= fifteenMinutes) {
      windowStart = now;
      spinsLeft = 5;
    }

    if (spinsLeft <= 0) {
      return;
    }

    // Start a new window if first spin of the batch
    if (!storedWindowStart || (storedWindowStart && now - parseInt(storedWindowStart, 10) >= fifteenMinutes)) {
      windowStart = now;
      localStorage.setItem(`mifandray_spin_window_start_${loggedInMember.id}`, windowStart.toString());
    }

    const nextSpinsLeft = spinsLeft - 1;
    localStorage.setItem(`mifandray_spins_remaining_${loggedInMember.id}`, nextSpinsLeft.toString());
    setSpinsRemainingBonus(nextSpinsLeft);

    // Reset current outcome view
    setSpinOutcome(null);
    setShowCongrats(false);
    setIsSpinning(true);

    // Pick a random segment index (0 to 20)
    const targetIdx = Math.floor(Math.random() * 21);
    const segmentAngle = 360 / 21;
    
    // Calculate final spin target so chosen element lands on top pointer boundary
    const extraRotations = 8 * 360; // 8 full spins
    const segmentOffset = (21 - targetIdx) * segmentAngle;
    
    const targetDegrees = wheelRotation + extraRotations + segmentOffset - (wheelRotation % 360);
    setWheelRotation(targetDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      const chosenSeg = WHEEL_SEGMENTS[targetIdx];
      setSpinOutcome(chosenSeg);
      setShowCongrats(true);

      // Update score callback
      onAddPoints(chosenSeg.points);
    }, 4000);
  };

  // Timer formatted view helper
  const formatTimeLeftBonus = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Colors mapping for difficulty levels
  const diffColors = {
    Facile: {
      bg: 'bg-emerald-600',
      text: 'text-emerald-600',
      border: 'border-emerald-700',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/20',
      gradient: 'from-emerald-500 to-teal-600'
    },
    Moyen: {
      bg: 'bg-violet-600',
      text: 'text-violet-600',
      border: 'border-violet-700',
      lightBg: 'bg-violet-50 dark:bg-violet-955/20',
      gradient: 'from-violet-500 to-indigo-600'
    },
    Difficile: {
      bg: 'bg-amber-500',
      text: 'text-amber-500',
      border: 'border-amber-600',
      lightBg: 'bg-amber-50 dark:bg-amber-950/20',
      gradient: 'from-amber-400 to-orange-500'
    }
  };

  return (
    <div className="space-y-4 font-sans animate-fadeIn">
      
      {/* 1. OVERLAPPING 3D TAB SELECTOR MAIN HEADER */}
      <div className="relative flex items-center justify-center w-full px-1 py-1.5">
        <div className="flex w-full max-w-sm items-center justify-center -space-x-3.5 isolate">
          
          {/* LEFT QUIZ BUTTON */}
          <button
            type="button"
            onClick={() => {
              setActivePlayTab('quiz');
            }}
            className={`w-1/2 py-2.5 px-3 rounded-2xl text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 border ${
              activePlayTab === 'quiz'
                ? 'z-20 scale-[1.03] bg-gradient-to-r from-violet-600 to-indigo-650 text-white border-violet-500 shadow-[0_5px_0_0_#4f46e5,_0_8px_16px_rgba(99,102,241,0.25)]'
                : 'z-10 scale-[0.97] opacity-80 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_0_#cbd5e1,_0_4px_8px_rgba(0,0,0,0.08)] translate-y-[2px]'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span>Quiz</span>
          </button>

          {/* RIGHT BONUS BUTTON */}
          <button
            type="button"
            onClick={() => {
              setActivePlayTab('bonus');
              // reset level to avoid overlap
              setSelectedLevel(null);
            }}
            className={`w-1/2 py-2.5 px-3 rounded-2xl text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 border ${
              activePlayTab === 'bonus'
                ? 'z-20 scale-[1.03] bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-[0_5px_0_0_#b45309,_0_8px_16px_rgba(245,158,11,0.25)]'
                : 'z-10 scale-[0.97] opacity-80 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_0_#cbd5e1,_0_4px_8px_rgba(0,0,0,0.08)] translate-y-[2px]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-500" />
            <span>Bonus</span>
          </button>

        </div>
      </div>

      {activePlayTab === 'quiz' ? (
        /* ======================== TAB A: QUIZ REGION ======================== */
        <div className="space-y-4">
          
          {selectedLevel === null ? (
            /* Level select grids */
            <div className="space-y-4">
              {/* Top intro */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-2 shadow-xs">
                <div>
                  <span className="text-[9.5px] font-black uppercase text-violet-650 dark:text-violet-400 tracking-wider flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-violet-500" />
                    <span>Misy refy 30 segondra isaky ny fanontaniana</span>
                  </span>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mt-1">
                    🎲 Kilalao Fitadiavana Ambaratonga (Level 50)
                  </h3>
                  <p className="text-[11.5px] text-slate-400 leading-normal">
                    Fandaharan'adihady ara-Baiboly. Raha tapitra ny 30s na diso ny valiny, dia miverina fanontaniana voalohany. Mila mahazo 10/10 mba ho afaka ambaratonga!
                  </p>
                </div>
              </div>

              {/* Difficulty tabs */}
              <div className="grid grid-cols-3 gap-2">
                {(['Facile', 'Moyen', 'Difficile'] as const).map((cat) => {
                  const isActive = difficulty === cat;
                  const col = diffColors[cat];
                  const unlockedNum = unlockedProgress[cat];
                  
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setDifficulty(cat)}
                      className={`relative rounded-xl p-2 px-1 text-center border transition-all cursor-pointer select-none flex flex-col justify-between items-center text-left ${
                        isActive
                          ? `bg-gradient-to-br ${col.gradient} text-white ${col.border} translate-y-[1px] shadow-none`
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-150 dark:border-slate-850 shadow-xs hover:bg-slate-50'
                      }`}
                      style={{ minHeight: '90px' }}
                    >
                      <span className="text-[8.5px] font-black uppercase tracking-wider block">
                        {cat === 'Facile' ? 'Mora' : cat === 'Moyen' ? 'Salasala' : 'Sarotra'}
                      </span>
                      
                      <div className="my-1 flex flex-col items-center">
                        <span className="text-xs font-black font-mono leading-none">
                          {cat}
                        </span>
                        <span className="text-[9px] opacity-80 mt-1 font-bold">
                          Lv. {unlockedNum}/50
                        </span>
                      </div>

                      <div className="w-full bg-black/10 dark:bg-white/10 h-1 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${isActive ? 'bg-white' : col.bg}`}
                          style={{ width: `${(unlockedNum / 50) * 100}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Levels container box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Misafidiana Ambaratonga:
                  </span>

                  <div className="flex gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setLevelTab('early')}
                      className={`px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all ${
                        levelTab === 'early'
                          ? 'bg-violet-605 text-white'
                          : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Lv. 1 - 25
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevelTab('late')}
                      className={`px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all ${
                        levelTab === 'late'
                          ? 'bg-violet-605 text-white'
                          : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Lv. 26 - 50
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2.5 py-1">
                  {Array.from({ length: 25 }, (_, idx) => {
                    const currentStageNum = levelTab === 'early' ? idx + 1 : idx + 26;
                    const activeProgressLimit = unlockedProgress[difficulty];
                    const isUnlocked = currentStageNum <= activeProgressLimit;
                    const isCompleted = currentStageNum < activeProgressLimit;
                    
                    let btnStyle = "";
                    if (!isUnlocked) {
                      btnStyle = "bg-slate-50 dark:bg-slate-950 border-slate-150 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40 shadow-none";
                    } else if (isCompleted) {
                      btnStyle = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400 text-emerald-700 dark:text-emerald-300 hover:brightness-105 shadow-[0_3px_0_0_#10b981] active:translate-y-[2px] active:shadow-none";
                    } else {
                      btnStyle = `bg-white dark:bg-slate-850 border-violet-400 dark:border-violet-850 text-violet-605 dark:text-violet-300 hover:brightness-110 shadow-[0_3px_0_0_#8b5cf6] active:translate-y-[2px] active:shadow-none`;
                    }

                    return (
                      <button
                        key={currentStageNum}
                        disabled={!isUnlocked}
                        onClick={() => startLevel(currentStageNum)}
                        className={`h-11 rounded-xl border text-center font-mono font-black text-xs flex flex-col items-center justify-center relative cursor-pointer select-none transition-all ${btnStyle}`}
                      >
                        {isUnlocked ? (
                          <>
                            <span className="text-[8px] opacity-60 leading-none">Lv</span>
                            <span className="text-sm font-black leading-none mt-0.5">{currentStageNum}</span>
                            {isCompleted && (
                              <span className="absolute -top-1 -right-1 text-[7px] bg-emerald-500 text-white w-3 h-3 rounded-full flex items-center justify-center font-sans font-black shadow-xs">
                                ✓
                              </span>
                            )}
                          </>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-750" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Active Solving Screen */
            <div className="space-y-4">
              
              {/* Back control */}
              <button
                type="button"
                onClick={() => setSelectedLevel(null)}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-450 hover:text-slate-800 font-black bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded-xl cursor-pointer active:scale-95 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Hiverina amin'ny lisitra</span>
              </button>

              {levelPassed ? (
                /* Clear screen */
                <div className="bg-white dark:bg-slate-900 border-2 border-emerald-450 p-6 rounded-3xl text-center shadow-lg space-y-4 animate-scaleIn">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-500 text-2xl font-black shrink-0 border border-emerald-300">
                    ✓
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-black text-emerald-650 dark:text-emerald-400">
                      Tafita soa aman-tsara!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Nahavita ny fanontaniana 10 tao amin'ny sokajy <strong>{difficulty} - Level {selectedLevel}</strong> ianao.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 inline-block font-mono font-black text-xs">
                    <span className="text-slate-400 block uppercase text-[10px] tracking-wide mb-1">Valiny marina:</span>
                    <span className="text-emerald-500 text-2xl">10 / 10</span>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 max-w-xs mx-auto">
                    {selectedLevel < 50 ? (
                      <button
                        type="button"
                        onClick={() => startLevel(selectedLevel + 1)}
                        className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl text-xs flex justify-center items-center gap-1 cursor-pointer active:scale-[0.98] transition-all"
                      >
                        <span>Ambaratonga manaraka (Lv. {selectedLevel + 1})</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-amber-500">🏆 Efa vitanao avokoa ny sehatra rehetra!</span>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => setSelectedLevel(null)}
                      className="py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold rounded-xl text-xs"
                    >
                      Hiverina hifidy ambaratonga
                    </button>
                  </div>
                </div>
              ) : (
                /* Solves in progress layout */
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
                  
                  {/* Top game details with countdown timer indicator */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                    <div className="flex flex-col">
                      <span className={`text-[9px] font-black uppercase ${diffColors[difficulty].text}`}>
                        STG: {difficulty === 'Facile' ? 'Mora' : difficulty === 'Moyen' ? 'Salasala' : 'Sarotra'} • Level {selectedLevel}
                      </span>
                      <span className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                        Fanontaniana {currentQuestionIdx + 1} / 10
                      </span>
                    </div>

                    {/* COUNTDOWN TIMER RING */}
                    <div className={`p-1 px-2 rounded-lg border flex items-center gap-1 font-mono text-[11px] font-black ${
                      quizTimer <= 10 
                        ? 'bg-rose-50 border-rose-250 text-rose-600 animate-pulse dark:bg-rose-950/20 dark:border-rose-900' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900'
                    }`}>
                      <Timer className="w-3.5 h-3.5 shrink-0" />
                      <span>00:{quizTimer.toString().padStart(2, '0')} s</span>
                    </div>
                  </div>

                  {/* Visual progress state strip */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(currentQuestionIdx / 10) * 100}%` }}
                    />
                  </div>

                  {/* Question Prompt */}
                  <div className="py-1">
                    <h3 className={`font-black text-slate-800 dark:text-slate-155 leading-snug ${isElderlyMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
                      "{activeQuestions[currentQuestionIdx]?.question}"
                    </h3>
                  </div>

                  {/* Option Lists */}
                  <div className="grid grid-cols-1 gap-2">
                    {activeQuestions[currentQuestionIdx]?.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrectChoice = activeQuestions[currentQuestionIdx].answerIndex === idx;
                      const isWrongChoiceSelected = isSelected && !isCorrectChoice;

                      let opStyle = "";
                      if (!hasSubmitted && !timeExpiredLock) {
                        opStyle = isSelected
                          ? "bg-violet-50 dark:bg-violet-950/25 border-violet-500 text-violet-750 dark:text-violet-300 shadow-[0_2px_0_0_#8b5cf6]"
                          : "bg-slate-50 hover:bg-slate-100/60 dark:bg-slate-950 dark:hover:bg-slate-900 border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-350 active:translate-y-[1px]";
                      } else {
                        // Answer is submitted or time expired
                        if (isCorrectChoice) {
                          opStyle = "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-805 dark:text-emerald-300 font-bold";
                        } else if (isSelected) {
                          opStyle = "bg-rose-50 dark:bg-rose-955/35 border-rose-500 text-rose-805 dark:text-rose-400";
                        } else {
                          opStyle = "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850 opacity-40 cursor-not-allowed";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={hasSubmitted || timeExpiredLock}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${opStyle} ${
                            isElderlyMode ? 'text-lg' : 'text-xs sm:text-sm'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs text-slate-500">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>

                          {hasSubmitted && (
                            <div className="shrink-0 scale-95">
                              {isCorrectChoice && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {!isCorrectChoice && isSelected && <XCircle className="w-4 h-4 text-rose-500" />}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submission and timing feedbacks */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2">
                    <div className="text-[11px] font-bold text-slate-400 leading-normal max-w-[190px]">
                      {timeExpiredLock ? (
                        <span className="text-rose-600 font-black animate-pulse flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Tapitra ny 30s! Voahidy ny valiny.</span>
                        </span>
                      ) : !hasSubmitted ? (
                        <span>Mifandrama amin'ny sora-pandaharana...</span>
                      ) : (
                        <span className={selectedOption === activeQuestions[currentQuestionIdx]?.answerIndex ? "text-emerald-650 font-black" : "text-rose-500 font-black"}>
                          {selectedOption === activeQuestions[currentQuestionIdx]?.answerIndex ? "✓ Marina marina tsara ! +1 pt" : "✕ Nahemotra ny fidirana !"}
                        </span>
                      )}
                    </div>

                    <div>
                      {!hasSubmitted && !timeExpiredLock ? (
                        <button
                          type="button"
                          onClick={handleSubmitAnswer}
                          disabled={selectedOption === null}
                          className="py-2 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-lg text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2.5px_0_0_#4f46e5] active:translate-y-[1.5px] cursor-pointer"
                        >
                          Andramo jereho
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className={`py-2 px-4 text-white font-black rounded-lg text-xs cursor-pointer flex items-center gap-1 ${
                            !timeExpiredLock && selectedOption === activeQuestions[currentQuestionIdx]?.answerIndex
                              ? "bg-emerald-600 shadow-[0_2.5px_0_0_#059669]"
                              : "bg-rose-600 shadow-[0_2.5px_0_0_#e11d48]"
                          }`}
                        >
                          <span>
                            {!timeExpiredLock && selectedOption === activeQuestions[currentQuestionIdx]?.answerIndex 
                              ? "Manaraka" 
                              : "Miverina fanontaniana 1"}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Explanatory biblical window block */}
                  {hasSubmitted && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-150 dark:border-blue-900/40 p-3.5 rounded-xl space-y-1 mt-1 animate-fadeIn">
                      <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-black text-[9.5px] uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span>Fanazavana Ara-Baiboly:</span>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed italic">
                        "{activeQuestions[currentQuestionIdx]?.explanation}"
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ======================== TAB B: BONUS (WHEEL) REGION ======================== */
        <div className="space-y-4">
          
          {/* Intro header for bonus wheel with customized description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
              <span className="text-[10px] font-mono py-0.5 px-2 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded font-black uppercase tracking-wider">
                🎁 ZARA HASINA MAHASOA (ROUE)
              </span>

              {/* Status display of attempts remaining */}
              <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span>Andrana sisa:</span>
                <span className="bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md font-mono">{spinsRemainingBonus} / 5</span>
              </div>
            </div>
            
            <p className="text-[11.5px] text-slate-500 font-bold leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-505/15 text-center">
              « Ahodino isaky ny 15 mn ny kodiarana! Tombony : +10, +20, +50, sns. Tandremo ny baomba 💣 : -20 pts. »
            </p>
          </div>

          {/* WHEEL BODY ASSEMBLED IN GORGEOUS HIGH SPEC CARDS WITH ENLARGED DIMENSIONS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-md flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            
            {/* Spinning statistics inline label bar */}
            <div className="flex gap-2 text-xs font-bold w-full justify-between items-center px-1">
              <span className="text-[10.5px] text-slate-400 uppercase font-black tracking-wider">Mihodina in-5 isaky ny 15 minitra</span>
              
              {bonusCooldownMs > 0 && (
                <div className="bg-rose-50 border border-rose-220 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900 px-2 py-0.5 rounded text-[10px] font-mono font-black animate-pulse flex items-center gap-1 shadow-xs">
                  <Timer className="w-3.5 h-3.5 text-rose-500" />
                  <span>Miverina afaka: {formatTimeLeftBonus(bonusCooldownMs)}</span>
                </div>
              )}
            </div>

            {/* Visual spinning apparatus - SIGNIFICANTLY ENLARGED to 330px */}
            <div className="relative w-72 h-72 sm:w-[330px] sm:h-[330px] flex items-center justify-center shrink-0">
              
              {/* Pointing arrow at the top boundary */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-md pointer-events-none">
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-500" />
                <div className="w-2 h-2 bg-white rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2" />
              </div>

              {/* ROTATING CIRCULAR GRID ELEMENT */}
              <div 
                className="w-full h-full rounded-full border-[10px] border-slate-900 dark:border-slate-950 shadow-2xl relative overflow-hidden"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning ? 'transform 4000ms cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none',
                }}
              >
                {/* SVG sector drawing of 21 slices */}
                <svg viewBox="0 0 200 200" className="w-full h-full transform rotate-[261deg]">
                  {WHEEL_SEGMENTS.map((seg, i) => {
                    const totalSegments = 21;
                    const radius = 98;
                    const center = 100;
                    const degPerSegment = 360 / totalSegments;
                    
                    const startAngle = i * degPerSegment;
                    const endAngle = (i + 1) * degPerSegment;
                    const rad = Math.PI / 180;
                    
                    // Coordinates of segments
                    const x1 = center + radius * Math.cos(startAngle * rad);
                    const y1 = center + radius * Math.sin(startAngle * rad);
                    const x2 = center + radius * Math.cos(endAngle * rad);
                    const y2 = center + radius * Math.sin(endAngle * rad);
                    
                    const pathString = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
                    
                    // Text offsets inside slices
                    const textAngle = startAngle + (degPerSegment / 2);
                    const textRad = textAngle * rad;
                    const tx = center + (radius * 0.6) * Math.cos(textRad);
                    const ty = center + (radius * 0.6) * Math.sin(textRad);

                    return (
                      <g key={i}>
                        {/* Segment Path Background */}
                        <path 
                          d={pathString} 
                          fill={seg.color} 
                          stroke="#1e293b" 
                          strokeWidth="0.5" 
                        />
                        {/* Label Overlay text - ENLARGED size from 6.5 to 8 */}
                        <text
                          x={tx}
                          y={ty}
                          fill="#ffffff"
                          fontSize="8"
                          fontWeight="940"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                        >
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Alternating rim lighting bulbs */}
                <div className="absolute inset-2 border-[2px] border-white/20 rounded-full pointer-events-none" />
              </div>

              {/* Pin Center Core Knob - ENLARGED to w-16 h-16 with Star inside */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-900 border-[5px] border-amber-400 shadow-xl flex flex-col items-center justify-center z-10 select-none">
                <span className="text-xl font-black text-amber-400 leading-none">⭐</span>
                <div className="absolute w-full h-full bg-amber-400/10 rounded-full animate-ping pointer-events-none" />
              </div>

            </div>

            {/* CONGRATULATIONS OVERLAY (Shown on completing spin) */}
            {showCongrats && spinOutcome && (
              <div className="absolute inset-0 bg-slate-950/95 dark:bg-slate-950/98 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-40 animate-scaleIn space-y-4">
                
                {spinOutcome.points > 0 ? (
                  // Positives / Win layout
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-3xl animate-bounce">
                      🎉
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                      MARIHAFA MANDRESY
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      TOHAVA MAMIRAPIRATRA !
                    </h3>
                    
                    <div className="my-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-6 py-2 border-b-[4px] border-emerald-700 font-mono font-black text-lg shadow-md">
                      {spinOutcome.text}
                    </div>

                    <p className="text-xs text-slate-350 max-w-xs leading-relaxed">
                      Ny bitsiky ny lanitra dia manome anao fahazavana! <br />
                      Miarahaba anao nahomby tamin'ny alalan'ny kodiarana vintana.
                    </p>
                  </div>
                ) : (
                  // Bomb / Warning layout
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="w-16 h-16 bg-rose-500/10 border-2 border-rose-500 rounded-full flex items-center justify-center text-3xl animate-pulse">
                      💣
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-rose-400 font-bold uppercase">
                      MANDRANITRA BAOMBA
                    </span>
                    <h3 className="text-xl font-black text-white">
                      OH RY KOTROKA !
                    </h3>
                    
                    <div className="my-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-2xl px-6 py-2 border-b-[4px] border-rose-900 font-mono font-black text-base shadow-md">
                      Isa nahemotra -20 pts
                    </div>

                    <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                      Aza tezitra na kivy velively! Ampitomboy fotsiny ny fitsapana ambaratonga fa mbola afaka manandrana indray ianao.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowCongrats(false);
                    setSpinOutcome(null);
                  }}
                  className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black tracking-wider rounded-xl text-xs active:scale-[0.97] transition-all cursor-pointer select-none"
                >
                  MANKASITRAKA INDRINDRA 🙏
                </button>
              </div>
            )}

            {/* BUTTON TRIGGERS AND STATE EXPOSURE REGENTS */}
            <div className="w-full text-center space-y-4">
              
              <div className="text-xs text-slate-400 font-bold">
                {isSpinning ? "Mihodina ny kodiarana... Andraso kely !" : "Tsindrio ny bokotra hahazoana valim-panomezana !"}
              </div>

              <button
                type="button"
                id="btn-spin-wheel"
                disabled={isSpinning || (spinsRemainingBonus <= 0 && bonusCooldownMs > 0)}
                onClick={handleSpinWheel}
                className={`py-3 px-8 text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg border-b-[4px] transition-all cursor-pointer select-none shrink-0 ${
                  spinsRemainingBonus <= 0 && bonusCooldownMs > 0
                    ? 'bg-slate-150 text-slate-400 border-slate-300 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-900 cursor-not-allowed border-b-2'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 border-orange-700 active:translate-y-[2px] active:border-b-[1px] text-slate-950'
                }`}
              >
                {isSpinning ? "Andraso kely..." : (spinsRemainingBonus <= 0 && bonusCooldownMs > 0) ? "Mbola mihidy (Katrana)" : "AHODINO NY KODIARANA ➔"}
              </button>

              {bonusCooldownMs > 0 && spinsRemainingBonus <= 0 ? (
                <div className="text-[10px] text-slate-450 dark:text-slate-550 leading-relaxed font-bold">
                  Mbola afaka mihodina indray ianao rehefa afaka <strong>{formatTimeLeftBonus(bonusCooldownMs)}</strong>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  Azonao ahodina in-<span className="text-amber-500 font-mono font-black">{spinsRemainingBonus}</span> fanampiny ianao amin'ity anjaranao ity.
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
