/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Volume2
} from 'lucide-react';
import { generateQuestionsForLevel, QuizQuestion } from '../quizGenerator';

interface QuizPageProps {
  isElderlyMode: boolean;
}

export default function QuizPage({ isElderlyMode }: QuizPageProps) {
  // 1. Difficulty Category selection: 'Facile' | 'Moyen' | 'Difficile'
  const [difficulty, setDifficulty] = useState<'Facile' | 'Moyen' | 'Difficile'>('Facile');
  
  // 2. Selected level (null = show levels grid view, 1 to 50 = playing)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // 3. Unlocked progress stored in localStorage (completed level index)
  const [unlockedProgress, setUnlockedProgress] = useState<Record<'Facile' | 'Moyen' | 'Difficile', number>>(() => {
    const saved = localStorage.getItem('mifandray_quiz_progress_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { 'Facile': 1, 'Moyen': 1, 'Difficile': 1 };
  });

  // Track the unlocked stages
  useEffect(() => {
    localStorage.setItem('mifandray_quiz_progress_v4', JSON.stringify(unlockedProgress));
  }, [unlockedProgress]);

  // Sound reading and TTS state removed of "vakio feo" buttons, but keeping text presentation for answers
  
  // 4. Game play state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [firstQuestionId, setFirstQuestionId] = useState<string | null>(null);
  const [sessionScore, setSessionScore] = useState(0);

  const [levelPassed, setLevelPassed] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);

  // Pagination for levels grid (1 to 25 and 26 to 50 for superb mobile sizing and spacing)
  const [levelTab, setLevelTab] = useState<'early' | 'late'>('early');

  // Generate and shuffle questions for selected level on entries
  const startLevel = (lvl: number) => {
    const baseQuestions = generateQuestionsForLevel(difficulty, lvl);
    
    // Perform standard randomized shuffle
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
  };

  // Fisher-Yates random shuffler with unique starting question criteria
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
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || hasSubmitted) return;
    
    setHasSubmitted(true);
    const activeQuestion = activeQuestions[currentQuestionIdx];
    
    if (selectedOption === activeQuestion.answerIndex) {
      // Correct answer
      setSessionScore(prev => prev + 1);
    } else {
      // Incorrect answer - Trigger instant game state fail or reset back to Question 1 with different question
      setWrongAnswersCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const activeQuestion = activeQuestions[currentQuestionIdx];
    const isCorrect = selectedOption === activeQuestion.answerIndex;

    if (!isCorrect) {
      // DYNAMIC FAIL RULE: Send user back to Question 1, but with a different first question
      // Shuffle again making sure the new first question id is != firstQuestionId
      const baseQuestions = generateQuestionsForLevel(difficulty, selectedLevel!);
      const reshuffled = shuffleQuestionsList(baseQuestions, firstQuestionId);
      
      setActiveQuestions(reshuffled);
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setHasSubmitted(false);
      setFirstQuestionId(reshuffled[0].id);
      setSessionScore(0);
      
      // Flash a notice/explanation message or alert
      alert(`⚠️ HASSINY SY DISO NY VALINY!\nKatsaho indray: Haverina any amin'ny Fanontaniana Voalohany ianao (fa ovana ny fanontaniana voalohany amin'ity lalao ity).`);
      return;
    }

    // If correct, proceed forward
    setSelectedOption(null);
    setHasSubmitted(false);

    if (currentQuestionIdx + 1 < activeQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // User passed all 10 questions successfully!
      setLevelPassed(true);
      // Unlock next stage if it was the active level
      const currentUnlocked = unlockedProgress[difficulty];
      if (selectedLevel === currentUnlocked && currentUnlocked < 50) {
        setUnlockedProgress(prev => ({
          ...prev,
          [difficulty]: currentUnlocked + 1
        }));
      }
    }
  };

  const currentQuestion = activeQuestions[currentQuestionIdx];

  // Helper colors for difficulties
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
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP HEADER WITH 3D STATS PANEL */}
      <div className="bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-[0_4px_0_0_rgba(15,23,42,0.05)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono py-1 px-2.5 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 rounded-full font-black uppercase tracking-wider">
            🎲 Kibon'ny Lalàna 3D
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-xl sm:text-2xl'} font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2 mt-1.5`}>
            <Award className="w-6 h-6 text-yellow-500" />
            <span>Fifaninanana Baiboly</span>
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-xs sm:text-sm'} text-slate-455 dark:text-slate-400 mt-1`}>
            Lalao fianarana ny Tenin'Andriamanitra misy ambaratonga 50 isaky ny sokajy.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <div className="bg-slate-50 dark:bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shadow-[0_2px_0_0_rgba(15,23,42,0.05)]">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-350">
              Voavaha: {unlockedProgress.Facile + unlockedProgress.Moyen + unlockedProgress.Difficile - 3} / 150
            </span>
          </div>
        </div>
      </div>

      {selectedLevel === null ? (
        /* --- BLOCK A: LEVEL SELECTOR CATEGORIES & LEVELS GRID --- */
        <div className="space-y-6">
          
          {/* Difficulty 3D Switch Selector Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            {(['Facile', 'Moyen', 'Difficile'] as const).map((cat) => {
              const isActive = difficulty === cat;
              const col = diffColors[cat];
              const unlockedNum = unlockedProgress[cat];
              
              return (
                <button
                  key={cat}
                  onClick={() => setDifficulty(cat)}
                  className={`relative rounded-2xl p-3 text-center border transition-all cursor-pointer select-none flex flex-col justify-between items-center text-left ${
                    isActive
                      ? `bg-gradient-to-br ${col.gradient} text-white ${col.border} translate-y-[2px] shadow-none ring-2 ring-white/10`
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-150 dark:border-slate-850 shadow-[0_4px_0_0_rgba(15,23,42,0.06)] active:translate-y-[2px] active:shadow-none'
                  }`}
                  style={{ minHeight: '110px' }}
                >
                  <span className="text-[9px] font-black uppercase tracking-wider opacity-90 block">
                    {cat === 'Facile' ? 'Mora' : cat === 'Moyen' ? 'Salasala' : 'Sarotra'}
                  </span>
                  
                  <div className="my-1.5 flex flex-col items-center">
                    <span className="text-sm font-black font-mono leading-none">
                      {cat}
                    </span>
                    <span className="text-[10px] opacity-80 mt-1 font-semibold">
                      Lv. {unlockedNum}/50
                    </span>
                  </div>

                  <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full rounded-full ${isActive ? 'bg-white' : col.bg}`}
                      style={{ width: `${(unlockedNum / 50) * 100}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level List Box in 3D Card Representation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 p-5 rounded-3xl shadow-[0_6px_0_0_rgba(15,23,42,0.04)] space-y-4">
            
            {/* Split Pagination Slider Tab to save mobile layout height constraints */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Misafidiana Ambaratonga (Level):</span>
              </span>

              <div className="flex gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setLevelTab('early')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                    levelTab === 'early'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Lv. 1 - 25
                </button>
                <button
                  onClick={() => setLevelTab('late')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                    levelTab === 'late'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Lv. 26 - 50
                </button>
              </div>
            </div>

            {/* Grid display of 25 levels based on the tab selected */}
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-3.5 py-2">
              {Array.from({ length: 25 }, (_, idx) => {
                const currentStageNum = levelTab === 'early' ? idx + 1 : idx + 26;
                const activeProgressLimit = unlockedProgress[difficulty];
                const isUnlocked = currentStageNum <= activeProgressLimit;
                const isCompleted = currentStageNum < activeProgressLimit;
                
                let btnStyle = "";
                if (!isUnlocked) {
                  // Locked style
                  btnStyle = "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50 shadow-none";
                } else if (isCompleted) {
                  // Cleared successfully green style
                  btnStyle = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400 text-emerald-700 dark:text-emerald-300 hover:brightness-105 shadow-[0_5px_0_0_#10b981] active:translate-y-[4px] active:shadow-none";
                } else {
                  // Active unsolved level (raised 3D design)
                  const col = diffColors[difficulty];
                  btnStyle = `bg-white dark:bg-slate-850 border-violet-400 dark:border-violet-850 text-violet-600 dark:text-violet-300 ring-2 ring-violet-500/10 hover:brightness-110 shadow-[0_5px_0_0_#8b5cf6] active:translate-y-[4px] active:shadow-none`;
                }

                return (
                  <button
                    key={currentStageNum}
                    disabled={!isUnlocked}
                    onClick={() => startLevel(currentStageNum)}
                    className={`h-14 rounded-2xl border text-center font-mono font-black text-sm flex flex-col items-center justify-center relative cursor-pointer select-none transition-all ${btnStyle}`}
                  >
                    {isUnlocked ? (
                      <>
                        <span className="text-[10px] opacity-60 leading-none">Lv</span>
                        <span className="text-base leading-none mt-0.5">{currentStageNum}</span>
                        {isCompleted && (
                          <span className="absolute -top-1 -right-1 text-[8px] bg-emerald-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-sans font-black shadow-xs">
                            ✓
                          </span>
                        )}
                      </>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400 dark:text-slate-650" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-150 dark:border-slate-800 text-[10px] text-slate-500 leading-relaxed space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-350 block uppercase tracking-wide">💡 Fitsipika sarobidy amin'ny sora-pandaharana:</span>
              <p>1. Mila mamaly tsara ny fanontaniana 10 milahatra vao tafavoaka ny ambaratonga ianao.</p>
              <p>2. Raha sendra manome valiny diso iray monja ianao dia haverina any amin'ny fiandohan'ny ambaratonga, nefa misafidy fanontaniana hafa ho fanombohana mba hitsapana tsara ny fahaizanao.</p>
            </div>

          </div>
        </div>
      ) : (
        /* --- BLOCK B: ACTIVE GAME PLAY IN 3D STYLED SCREEN --- */
        <div className="space-y-4">
          
          {/* Back to Stages list Button */}
          <button
            onClick={() => setSelectedLevel(null)}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-805 dark:hover:text-white font-bold bg-slate-100 dark:bg-slate-800 py-1.5 px-3.5 rounded-lg active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Hiverina amin'ny lisitra</span>
          </button>

          {levelPassed ? (
            /* Successful clear screen card design */
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-400 p-6 sm:p-8 rounded-3xl text-center shadow-[0_8px_0_0_#10b981] space-y-5 animate-scaleIn">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-500 text-3xl font-bold border-2 border-emerald-400 shrink-0">
                ✓
              </div>
              
              <div>
                <h3 className="text-xl font-black text-emerald-650 dark:text-emerald-400">
                  Tafita soa aman-tsara!
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Nahavita tsara ny fanontaniana 10 tao amin'ny sokajy <strong>{difficulty} - Level {selectedLevel}</strong> ianao.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 inline-block font-mono font-black text-xs space-y-1">
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Isa fanombohana:</span>
                <span className="text-violet-650 dark:text-violet-400 text-3xl">10 / 10</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                {selectedLevel < 50 ? (
                  <button
                    onClick={() => startLevel(selectedLevel + 1)}
                    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex justify-center items-center gap-2 cursor-pointer shadow-[0_4px_0_0_#047857] active:translate-y-[2px] active:shadow-none"
                  >
                    <span>Ambaratonga manaraka (Lv. {selectedLevel + 1})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs font-bold text-amber-600">🏆 Efa vitanao avokoa ny faritry ny ambaratonga tamin'ity sokajy ity!</span>
                )}
                
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="py-3 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-705 dark:text-white font-bold rounded-xl text-xs cursor-pointer active:scale-95 transition-all"
                >
                  Hiverina hifidy
                </button>
              </div>
            </div>
          ) : (
            /* Active Solving card screen block */
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-[0_6px_0_0_rgba(15,23,42,0.05)] space-y-4">
              
              {/* Level progress indicator and wrong attempt badge */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black uppercase ${diffColors[difficulty].text}`}>
                    Sokajy: {difficulty === 'Facile' ? 'Mora' : difficulty === 'Moyen' ? 'Salasala' : 'Sarotra'} • Level {selectedLevel}
                  </span>
                  <span className="text-xs font-extrabold text-slate-805 dark:text-white leading-tight">
                    Fanontaniana faha {currentQuestionIdx + 1} amin'ny 10
                  </span>
                </div>

                <div className="bg-amber-50 dark:bg-amber-955/20 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60 font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  Valiny Marina: {sessionScore} / 10
                </div>
              </div>

              {/* Progress dynamic strip bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-violet-605 dark:bg-violet-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx) / 10) * 100}%` }}
                />
              </div>

              {/* Question container */}
              <div className="py-2">
                <h3 className={`font-black text-slate-850 dark:text-slate-100 leading-snug ${isElderlyMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                  "{currentQuestion?.question}"
                </h3>
              </div>

              {/* Shuffled Options selectors grids in 3D presses action formatting */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuestion?.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = currentQuestion.answerIndex === idx;
                  
                  let optionStyle = "";
                  if (!hasSubmitted) {
                    optionStyle = isSelected 
                      ? "bg-violet-50 dark:bg-violet-950/20 border-violet-500 text-violet-750 dark:text-violet-300 shadow-[0_3px_0_0_#8b5cf6]"
                      : "bg-slate-50 hover:bg-slate-100/60 dark:bg-slate-950 dark:hover:bg-slate-900/80 border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-[0_3px_0_0_rgba(15,23,42,0.06)] active:translate-y-[2px] active:shadow-none";
                  } else {
                    if (isCorrectOption) {
                      optionStyle = "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-805 dark:text-emerald-300 font-bold shadow-none";
                    } else if (isSelected) {
                      optionStyle = "bg-rose-50 dark:bg-rose-955/30 border-rose-505 text-rose-805 dark:text-rose-405 shadow-none";
                    } else {
                      optionStyle = "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-805 opacity-55 shadow-none cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      id={`game-option-${idx}`}
                      key={idx}
                      disabled={hasSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-75 flex items-center justify-between cursor-pointer ${optionStyle} ${
                        isElderlyMode ? 'text-xl' : 'text-xs sm:text-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-xs flex items-center justify-center shrink-0 shadow-xs text-slate-650 dark:text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {hasSubmitted && (
                        <div className="shrink-0 scale-95">
                          {isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {!isCorrectOption && isSelected && <XCircle className="w-4 h-4 text-rose-500" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Actions submit and next level controls */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="text-[11px] font-bold text-slate-450 dark:text-slate-500">
                  {!hasSubmitted ? (
                    <span>Misafidiana valiny tsara rantsana iray...</span>
                  ) : (
                    <span className={selectedOption === currentQuestion.answerIndex ? "text-emerald-600 font-extrabold" : "text-rose-550 font-extrabold"}>
                      {selectedOption === currentQuestion.answerIndex ? "✓ Marina tsara! Tohizo." : "✕ Diso ny valiny!"}
                    </span>
                  )}
                </div>

                <div>
                  {!hasSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="py-2.5 px-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-lg text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_3px_0_0_#4f46e5] active:translate-y-[2px] active:shadow-none"
                    >
                      Hamarina valiny
                    </button>
                  ) : (
                    <button
                      id="btn-level-game-next"
                      onClick={handleNextQuestion}
                      className={`py-2.5 px-5 text-white font-black rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shadow-md ${
                        selectedOption === currentQuestion.answerIndex
                          ? "bg-emerald-600 shadow-[0_3px_0_0_#059669] active:translate-y-[2px]"
                          : "bg-rose-600 shadow-[0_3px_0_0_#e11d48] active:translate-y-[2px]"
                      }`}
                    >
                      <span>
                        {selectedOption === currentQuestion.answerIndex 
                          ? "Manaraka" 
                          : "Hiverina amin'ny fanontaniana 1"}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bible context presentation window */}
              {hasSubmitted && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/60 p-4 rounded-xl space-y-1.5 mt-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-black text-[10px] uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>Fanazavana ara-Baiboly:</span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed italic">
                    "{currentQuestion?.explanation}"
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
