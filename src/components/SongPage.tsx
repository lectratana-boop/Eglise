/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SONGS } from '../data';
import { Music, Search, BookOpen, Play, Pause, ChevronRight } from 'lucide-react';

interface SongPageProps {
  isElderlyMode: boolean;
}

export default function SongPage({ isElderlyMode }: SongPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSongId, setSelectedSongId] = useState<string>(SONGS[0].id);
  const [isPlayingTune, setIsPlayingTune] = useState(false);

  const filteredSongs = SONGS.filter(s => {
    return s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           s.number.toString().includes(searchQuery) ||
           s.lyrics.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeSong = SONGS.find(s => s.id === selectedSongId) || SONGS[0];

  return (
    <div className="space-y-6">
      {/* Detail header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full font-semibold uppercase tracking-wider">
            Antoko Mpihira & Hira
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-800 dark:text-slate-100 mt-1.5 flex items-center gap-2`}>
            <Music className="w-7 h-7 text-violet-600" />
            <span>Fihirana & Chorales</span>
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
            Karohy ny tonon-kira ofisialy rehetra fihirana ao am-piangonana sy fanao rehefa hira fifaninanana.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Songs selector directory list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm space-y-3 flex flex-col h-[540px]">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-505 uppercase mb-2">
                Hitady fihirana (Karoka):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Lohateny, Nomerao na tonony..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-2 scrollbar-thin">
              {filteredSongs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-12">Tsy misy hira hita mifanaraka.</p>
              ) : (
                filteredSongs.map((sg) => {
                  const isSelected = selectedSongId === sg.id;
                  return (
                    <button
                      id={`btn-song-${sg.id}`}
                      key={sg.id}
                      onClick={() => {
                        setSelectedSongId(sg.id);
                        setIsPlayingTune(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-violet-55 border-violet-500 text-violet-850 dark:bg-violet-950/20 dark:text-violet-300'
                          : 'bg-slate-50/50 dark:bg-slate-900 border-slate-150 dark:border-slate-705/55 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-350 shrink-0">
                          {sg.number}
                        </span>
                        <div className="truncate max-w-[140px] sm:max-w-xs">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {sg.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                            Sokajy: {sg.category || 'Fiderana'}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-[2px]' : ''}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Selected song lyrics render pane */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm h-[540px] flex flex-col overflow-hidden">
            
            {/* Song title, index and play tools */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-705 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-violet-100 dark:bg-violet-950/40 text-violet-600 rounded-xl flex items-center justify-center font-mono font-extrabold text-base shrink-0">
                  {activeSong.number}
                </span>
                <div>
                  <h3 className={`${isElderlyMode ? 'text-2xl' : 'text-lg'} font-bold text-slate-800 dark:text-slate-100 leading-snug`}>
                    {activeSong.title}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                    Fihirana Fanampiny / Antoko Mpihira
                  </span>
                </div>
              </div>

              {/* Play simulation accompaniment chord */}
              <button
                id="btn-tune-play"
                onClick={() => setIsPlayingTune(!isPlayingTune)}
                className={`py-2 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingTune
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-250'
                    : 'bg-violet-600 hover:bg-violet-750 text-white border-violet-600 shadow'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlayingTune ? "Mihira mpihira (Playing)" : "Henoy Mozika feo (Midi)"}</span>
              </button>
            </div>

            {/* Song lyrics display */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900/10 text-center flex flex-col justify-between">
              
              {/* Optional melody audio message */}
              {isPlayingTune && (
                <div className="mb-4 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-150 p-3 rounded-lg text-xs text-emerald-700 dark:text-emerald-400 font-medium animate-pulse flex items-center justify-center gap-2">
                  <span className="text-sm">🎵</span>
                  <span>Mandefa feon-kira fampianarana ho an'ny Antoko mpihira...</span>
                </div>
              )}

              <div className={`whitespace-pre-line leading-relaxed font-sans text-slate-800 dark:text-slate-200 select-text ${
                isElderlyMode ? 'text-2xl font-bold' : 'text-base font-medium'
              }`}>
                {activeSong.lyrics}
              </div>

              <div className="text-[10px] text-slate-400 font-mono mt-6">
                © Fihirana Malagasy - Synode FJKM / FLM / EKAR Edition
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
