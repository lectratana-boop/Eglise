/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BIBLE_DATA } from '../data';
import { Search, Volume2, VolumeX, BookOpen, AlertCircle, Sparkles, Smile } from 'lucide-react';

interface BiblePageProps {
  isElderlyMode: boolean;
}

export default function BiblePage({ isElderlyMode }: BiblePageProps) {
  const [selectedBook, setSelectedBook] = useState('Salamo');
  const [selectedChapter, setSelectedChapter] = useState(23);
  const [searchQuery, setSearchQuery] = useState('');
  const [textSize, setTextSize] = useState(20); // default large readable font
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Filter books to match BIBLE_DATA
  const availableBooks = Array.from(new Set(BIBLE_DATA.map(v => v.book)));
  
  // Find chapter data
  const currentChapterData = BIBLE_DATA.find(
    b => b.book === selectedBook && b.chapter === selectedChapter
  ) || BIBLE_DATA.find(b => b.book === 'Salamo')!;

  // Handle Speech synthesis of the displayed chapter
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = currentChapterData.verses
        .map(v => `Andininy faha ${v.number}: ${v.text}`)
        .join('. ');

      const utterance = new SpeechSynthesisUtterance(
        `${selectedBook} toko faha ${selectedChapter}. ${textToRead}`
      );
      
      // Try to detect French/Malagasy or default voice
      utterance.lang = 'fr-FR'; // French voice accent generally reads Malagasy letters more closely than English
      utterance.rate = 0.85; // Slow down for elders
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setSpeechUtterance(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Perform search across all available chapters
  const handleSearch = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: { book: string; chapter: number; verseNumber: number; text: string }[] = [];
    BIBLE_DATA.forEach(b => {
      b.verses.forEach(v => {
        if (v.text.toLowerCase().includes(query) || b.book.toLowerCase().includes(query)) {
          results.push({
            book: b.book,
            chapter: b.chapter,
            verseNumber: v.number,
            text: v.text
          });
        }
      });
    });
    return results;
  };

  const searchResults = handleSearch();

  return (
    <div className="space-y-6">
      {/* Title & Accent */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full font-semibold uppercase tracking-wider">
            Sora-masina malagasy
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mt-1.5`}>
            <BookOpen className="w-7 h-7 text-violet-600" />
            <span>Baiboly Masina</span>
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
            Vakio sy sintonina ny tenin'Andriamanitra ho hery sy fahazavana ho an'ny lalanao.
          </p>
        </div>

        {/* Text Sizer for accessibility */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-3 rounded-xl shrink-0 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase shrink-0">
            Haben'ny soratra:
          </span>
          <input
            type="range"
            min="16"
            max="36"
            value={textSize}
            onChange={(e) => setTextSize(Number(e.target.value))}
            className="w-24 sm:w-32 accent-violet-600 h-2 bg-slate-200 rounded-lg appearance-auto cursor-pointer"
          />
          <span className="text-sm font-mono font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/20 px-2.5 py-1 rounded">
            {textSize}px
          </span>
        </div>
      </div>

      {/* Book selector & search row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 shadow-sm space-y-4">
            {/* Search inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                Hitady andininy:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Soraty ohatra: 'Andriamanitra'..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Books menu buttons (Gros boutons in grid) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                Bokin'ny Baiboly:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableBooks.map((bookName) => {
                  const isSelected = selectedBook === bookName;
                  return (
                    <button
                      id={`btn-book-${bookName}`}
                      key={bookName}
                      onClick={() => {
                        setSelectedBook(bookName);
                        // Find first chapter of this book
                        const firstCh = BIBLE_DATA.find(b => b.book === bookName)?.chapter || 1;
                        setSelectedChapter(firstCh);
                        setSearchQuery(''); // clear search when switching book
                      }}
                      className={`py-3 px-1 rounded-xl text-center text-sm font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-600 shadow-md translate-y-[-1px]'
                          : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700'
                      }`}
                    >
                      {bookName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chapters navigation */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                Toko (Chapitres):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {BIBLE_DATA.filter(b => b.book === selectedBook).map((b) => {
                  const isSelected = selectedChapter === b.chapter;
                  return (
                    <button
                      key={b.chapter}
                      onClick={() => {
                        setSelectedChapter(b.chapter);
                        setSearchQuery('');
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-600 shadow'
                          : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700'
                      }`}
                    >
                      {b.chapter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Viewer pane */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col h-full">
            
            {/* Reading header controls */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 shrink-0">📖</span>
                <div>
                  <h3 className={`${isElderlyMode ? 'text-2xl' : 'text-xl'} font-bold text-slate-800 dark:text-slate-100`}>
                    {selectedBook} {selectedChapter}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide">
                    Baiboly Protestanta / Katolika Malagasy (BPM)
                  </p>
                </div>
              </div>

              {/* Text To Speech Trigger (Gros bouton) */}
              <button
                id="btn-voice-synthesis"
                onClick={handleToggleVoice}
                className={`flex items-center justify-center gap-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 text-rose-600 dark:text-rose-400 py-3 px-5 text-base shadow'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 py-3 px-5 text-base shadow-md'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-5 h-5 animate-pulse" />
                    <span>Hatsahatra ny famakiana</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>Vakio ho ahy mafy (Feo synthesizera)</span>
                  </>
                )}
              </button>
            </div>

            {/* Reading Content Pane */}
            <div className="p-6 sm:p-8 flex-1">
              {searchQuery.trim() !== '' ? (
                /* Search Results display */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Vokatry ny fikarohana ({searchResults.length})
                    </h4>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-semibold text-violet-600 hover:underline cursor-pointer"
                    >
                      Hiverina hamaky
                    </button>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                        Tsy nisy vokany fikarohana tamin'ny teny hoe: "{searchQuery}"
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 rounded-lg"
                      >
                        Fafao ny soratra
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                      {searchResults.map((res, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedBook(res.book);
                            setSelectedChapter(res.chapter);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-850 transition-all cursor-pointer block group text-slate-850 dark:text-slate-200"
                        >
                          <div className="font-bold text-violet-600 dark:text-violet-400 text-sm group-hover:underline">
                            {res.book} {res.chapter}:{res.verseNumber}
                          </div>
                          <p className="text-sm mt-1 text-slate-600 dark:text-slate-350 italic">
                            "{res.text}"
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Regular reading pane with scalable fonts */
                <div>
                  {isPlayingAudio && (
                    <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 p-4 rounded-xl flex items-center gap-3">
                      <div className="flex gap-1 items-end h-5 w-6">
                        <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_1s_infinite] h-full" />
                        <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_0.2s] h-3" />
                        <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_0.4s] h-5" />
                        <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_0.1s] h-2" />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 animate-pulse uppercase tracking-wide">
                        Mihaino an'Andriamanitra: Amaky ny any amin'ny fokon'ny Baiboly ny synthesizera...
                      </span>
                    </div>
                  )}

                  <div 
                    className="space-y-5 leading-relaxed select-text"
                    style={{ fontSize: `${textSize}px` }}
                  >
                    {currentChapterData.verses.map((verse) => (
                      <div 
                        key={verse.number} 
                        className="flex items-start gap-3 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded px-2"
                      >
                        <span className="text-violet-600 dark:text-violet-400 font-extrabold font-mono text-base select-none shrink-0" style={{ fontSize: `${Math.max(14, textSize - 4)}px` }}>
                          {verse.number}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 font-sans tracking-wide">
                          {verse.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Accessible encouragement banner */}
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 dark:text-slate-500">
                    <span className="text-xs font-mono font-bold flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      Andininy feno ho an'ny androany
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedBook('Salamo');
                        setSelectedChapter(23);
                      }}
                      className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Smile className="w-4 h-4" />
                      Hiverina any amin'ny Salamo fotsiny
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
