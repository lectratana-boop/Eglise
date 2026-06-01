/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data';
import { ArrowLeft, CheckCircle2, XCircle, Award, RefreshCw, Star, Info, HelpCircle } from 'lucide-react';

interface QuizPageProps {
  isElderlyMode: boolean;
}

export default function QuizPage({ isElderlyMode }: QuizPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || hasSubmitted) return;
    
    setHasSubmitted(true);
    if (selectedOption === currentQuestion.answerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-yellow-105 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 rounded-full font-semibold uppercase tracking-wider">
            Lalao fanabeazana
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mt-1.5`}>
            <Award className="w-7 h-7 text-yellow-500" />
            <span>Quiz & Lalao Baiboly</span>
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
            Ampitomboy ny fahalalanao ny Tenin'Andriamanitra amin'ny alalan'ny fanontaniana tsotra.
          </p>
        </div>

        {/* Score indicator */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/60 p-3 rounded-xl flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-amber-800 dark:text-amber-400 font-mono">
            Isa azo: {score} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-450 dark:text-slate-500 mb-1.5 uppercase">
              <span>Fanontaniana faha- {currentIndex + 1} amin'ny {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100)}% Vita</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-4 border-b border-dashed border-slate-150 dark:border-slate-700">
            <h3 className={`font-bold text-slate-850 dark:text-slate-100 leading-snug ${isElderlyMode ? 'text-2xl' : 'text-xl'}`}>
              "{currentQuestion.question}"
            </h3>
          </div>

          {/* Options Grid (Gros boutons class) */}
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = currentQuestion.answerIndex === idx;
              
              let optionStyle = "border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900 dark:hover:bg-slate-850";
              if (!hasSubmitted && isSelected) {
                optionStyle = "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20";
              } else if (hasSubmitted) {
                if (isCorrectOption) {
                  optionStyle = "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-805 dark:text-emerald-305 font-bold";
                } else if (isSelected) {
                  optionStyle = "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-805 dark:text-rose-305";
                } else {
                  optionStyle = "opacity-60 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900";
                }
              }

              return (
                <button
                  id={`quiz-option-${idx}`}
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasSubmitted}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${optionStyle} ${
                    isElderlyMode ? 'text-xl' : 'text-base'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-650 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm text-slate-700 dark:text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasSubmitted && (
                    <div className="shrink-0">
                      {isCorrectOption && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
                      {!isCorrectOption && isSelected && <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Prompt Action Panel */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-450">
              {!hasSubmitted ? (
                <span>Misafidiana valiny tsara amin'ireo rehetra ireo.</span>
              ) : (
                <span className={selectedOption === currentQuestion.answerIndex ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                  {selectedOption === currentQuestion.answerIndex ? "Tabaka ara-dalàna! Marina ny valiny." : "Diso ny valiny, mitohy hatrany!"}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {!hasSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-3.5 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                    isElderlyMode ? 'text-xl' : 'text-base'
                  }`}
                >
                  Hamarina ny valiny
                </button>
              ) : (
                <button
                  id="btn-next-question"
                  onClick={handleNextQuestion}
                  className={`px-8 py-3.5 bg-violet-600 text-white hover:bg-violet-700 font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                    isElderlyMode ? 'text-xl' : 'text-base'
                  }`}
                >
                  Fanontaniana manaraka
                </button>
              )}
            </div>
          </div>

          {/* Historical context explanation */}
          {hasSubmitted && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/60 p-5 rounded-xl space-y-2 mt-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                <Info className="w-4 h-4" />
                <span>FANAZAVANA ARA-BAIBOLY:</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-300 leading-relaxed italic">
                "{currentQuestion.explanation}"
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished scorecard screen */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center mx-auto text-amber-500 text-4xl">
            🏆
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Arahabaina! Vita ny Quiz Biblique
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Nahavita tsara ny Lalao Baiboly androany ianao. Miverena indray hitsapa ny fahalalanao ny teny masina.
            </p>
          </div>

          {/* Results Badge */}
          <div className="max-w-xs mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-xl space-y-2">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Ny tontalin'ny Naotinao
            </span>
            <div className="text-5xl font-extrabold text-violet-600 font-mono">
              {score * 20}/100
            </div>
            <p className="text-sm font-bold text-slate-650 dark:text-slate-300">
              Nahazo {score} marina tamin'ny {QUIZ_QUESTIONS.length} fanontaniana.
            </p>
          </div>

          <div>
            <button
              onClick={handleRestartQuiz}
              className={`inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all cursor-pointer ${
                isElderlyMode ? 'text-xl' : 'text-base'
              }`}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Hamerina hitsapa indray</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
