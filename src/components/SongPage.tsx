/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Elegant, full-featured Hymnal page supporting all 827 FFPM, 50 FF and 40 Fifohazana hymns.
 * Focuses purely on clean readability, simple navigation, and direct song number selection.
 */

import React, { useState } from 'react';
import { generateSong, searchSongs, SongDetail } from '../songGenerator';
import { Music, Search, ChevronRight } from 'lucide-react';

interface SongPageProps {
  isElderlyMode: boolean;
}

type BookType = 'FFPM' | 'FF' | 'Fifohazana';

export default function SongPage({ isElderlyMode }: SongPageProps) {
  const [activeBook, setActiveBook] = useState<BookType>('FFPM');
  const [searchQuery, setSearchQuery] = useState('');
  const [directNumber, setDirectNumber] = useState('');

  // Keep track of the active song ID
  const [selectedSongId, setSelectedSongId] = useState<string>('ffpm-1');

  // Extract book and number from song ID
  const parseSongId = (id: string): { book: 'FFPM' | 'FF' | 'Fifohazana'; num: number } => {
    const parts = id.split('-');
    const book = (parts[0].toUpperCase() as 'FFPM' | 'FF' | 'Fifohazana') || 'FFPM';
    const num = parseInt(parts[1], 10) || 1;
    return { book, num };
  };

  // Active loaded song item
  const activeSong: SongDetail = (() => {
    const parsed = parseSongId(selectedSongId);
    return generateSong(parsed.book, parsed.num);
  })();

  const handleSelectSong = (id: string) => {
    setSelectedSongId(id);
  };

  // Intelligent lyric filtering
  const filteredSongs = searchSongs(searchQuery, activeBook);

  // Directly select a song by its number
  const handleDirectNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(directNumber, 10);
    if (!isNaN(num) && num > 0) {
      let maxLimit = 827;
      if (activeBook === 'FF') maxLimit = 50;
      if (activeBook === 'Fifohazana') maxLimit = 40;

      if (num <= maxLimit) {
        const targetId = `${activeBook.toLowerCase()}-${num}`;
        setSelectedSongId(targetId);
        setDirectNumber('');
        setSearchQuery(''); // clear query to show lists
      }
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className={`${isElderlyMode ? 'text-2xl font-black' : 'text-lg font-extrabold'} text-slate-850 dark:text-slate-100 flex items-center gap-2`}>
          <Music className="w-5 h-5 text-violet-650 animate-pulse" />
          <span>Fihirana Malagasy Manontolo</span>
        </h2>
        <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-snug mt-1.5 font-medium">
          Hira feno amin'ny fombam-pivavahana: hira 827 ao amin'ny bokin'ny FFPM fototra, Fihirana Fanampiny (FF), ary Fihirana Fifohazana.
        </p>
      </div>

      {/* Main Container Split: Selector side & Reading Pane side */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: Books toggle and search directory */}
        <div className="md:col-span-5 space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          
          {/* Hymnal Source Tabs - put tightly on a single row */}
          <div className="space-y-1">
            <span className="block text-[8.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Fidio Ny Boky (Sélectionner l'Hymnal):
            </span>
            <div className="flex flex-row gap-1 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 w-full overflow-hidden">
              <button
                onClick={() => { setActiveBook('FFPM'); setSearchQuery(''); }}
                className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase text-center transition-all cursor-pointer ${
                  activeBook === 'FFPM'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-650 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-white'
                }`}
              >
                FFPM
              </button>
              <button
                onClick={() => { setActiveBook('FF'); setSearchQuery(''); }}
                className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase text-center transition-all cursor-pointer ${
                  activeBook === 'FF'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-650 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-white'
                }`}
              >
                Fanampiny
              </button>
              <button
                onClick={() => { setActiveBook('Fifohazana'); setSearchQuery(''); }}
                className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase text-center transition-all cursor-pointer ${
                  activeBook === 'Fifohazana'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-650 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-white'
                }`}
              >
                Fifohazana
              </button>
            </div>
          </div>

          {/* Type song number directamente */}
          <div className="space-y-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
            <span className="block text-[8.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Hizaha amin'ny Laharana hira:
            </span>
            <form onSubmit={handleDirectNumberSubmit} className="flex gap-1.5 items-center mt-1">
              <input
                type="number"
                min="1"
                max={activeBook === 'FFPM' ? 827 : activeBook === 'FF' ? 50 : 40}
                value={directNumber}
                onChange={(e) => setDirectNumber(e.target.value)}
                placeholder={`Isan'ny hira (1 - ${activeBook === 'FFPM' ? 827 : activeBook === 'FF' ? 50 : 40})`}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs font-bold text-slate-855 dark:text-white outline-none focus:ring-1 focus:ring-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white text-[10.5px] font-extrabold py-1.5 px-3 rounded-lg transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                Hizaha 📖
              </button>
            </form>
          </div>

          {/* Quick Search string input */}
          <div className="space-y-1">
            <span className="block text-[8.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Tadiavo amin'ny alalan'ny teny:
            </span>
            <div className="relative mt-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeBook === 'FFPM' 
                    ? "Tadiavo amin'ny laharana, lohateny, na tonony..." 
                    : "Tiavo lohateny na teny amin'ny tononkira..."
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-850 dark:text-white outline-none focus:ring-2 focus:ring-violet-550 font-bold placeholder-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Song listing directories scrollable area */}
          <div className="max-h-[360px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
            {filteredSongs.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                  Tsy hita ity hira ity
                </p>
                <p className="text-[9px] text-slate-400 px-4">
                  Ampiasao ny laharana hira (1 ka hatramin'ny 827 ho an'ny FFPM) mba hahitana azy amin'ny fomba mety.
                </p>
              </div>
            ) : (
              filteredSongs.map((sg) => {
                const isSelected = selectedSongId === sg.id;
                return (
                  <div
                    key={sg.id}
                    onClick={() => handleSelectSong(sg.id)}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white font-extrabold shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-950 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-105'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className={`w-8 h-8 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 border ${
                        isSelected 
                          ? 'bg-violet-700 text-white border-violet-500' 
                          : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-350 border-slate-200'
                      }`}>
                        {sg.book === 'FF' ? `FF ${sg.number}` : sg.number}
                      </span>
                      <div className="truncate">
                        <h4 className="text-xs font-black truncate leading-tight flex items-center gap-1">
                          {sg.title}
                        </h4>
                        <span className={`text-[8.5px] uppercase font-bold leading-none ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>
                          {sg.book === 'FFPM' ? '📖 FFPM' : sg.book === 'FF' ? '🎵 Fanampiny' : '🔥 Fifohazana'} • {sg.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
        </div>

        {/* RIGHT COLUMN: Lyrics Reader */}
        <div className="md:col-span-7 flex flex-col">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-full overflow-hidden">
            
            {/* Song Header & Actions pane */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 text-violet-600 dark:text-violet-300 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-2xs">
                  {activeSong.book === 'FF' ? `FF ${activeSong.number}` : activeSong.number}
                </span>
                <div>
                  <h3 className={`${isElderlyMode ? 'text-xl' : 'text-sm'} font-black text-slate-850 dark:text-slate-100 leading-tight`}>
                    {activeSong.title}
                  </h3>
                  <span className="text-[8.5px] uppercase font-black text-violet-600 dark:text-violet-400 tracking-wider">
                    {activeSong.book === 'FFPM' 
                      ? 'Fiangonana FFPM (Hira 1 - 827)' 
                      : activeSong.book === 'FF' ? 'Fihirana Fanampiny Vaovao' : 'Fihirana Fifohazana Malagasy'} • {activeSong.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Song lyrics and scrolling representation */}
            <div className="p-4 sm:p-6 text-center bg-gradient-to-b from-white to-slate-50/20 dark:from-slate-900 dark:to-slate-950 flex-1 flex flex-col justify-between min-h-[300px]">
              
              <div className="relative py-4 flex-1 flex flex-col justify-center">
                
                {/* Actual stanzas */}
                <div className="space-y-6">
                  {activeSong.lyrics.split('\n\n').map((stanza, idx) => {
                    const isChorus = stanza.trim().includes('Fiverenana') || stanza.trim().includes('Refrain');

                    return (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-xl transition-all duration-300 relative ${
                          isChorus 
                            ? 'bg-amber-500/5 border border-amber-550/20 text-amber-900 dark:text-amber-200' 
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <p className={`whitespace-pre-line leading-relaxed font-sans ${
                          isElderlyMode 
                            ? 'text-lg font-black' 
                            : isChorus ? 'text-xs font-bold leading-relaxed' : 'text-xs font-semibold leading-relaxed'
                        }`}>
                          {stanza}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Liturgical bottom citation info */}
              <div className="text-[8.5px] text-slate-400 dark:text-slate-500 font-mono mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 uppercase tracking-wide">
                <span>© Fiangonana Protestanta Malagasy</span>
                <span>FFPM - Fihirana Fanampiny - Fifohazana</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
