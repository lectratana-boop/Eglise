/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Elegant, full-featured Hymnal page supporting all 827 FFPM, 50 FF and 40 Fifohazana hymns.
 * Persists favorites, features rich church pipe-organ accompaniment synth and dynamic visual note tracking.
 */

import React, { useState, useEffect, useRef } from 'react';
import { generateSong, searchSongs, getHymnTempoNotes, SongDetail } from '../songGenerator';
import { Music, Search, Play, Pause, ChevronRight, Star, Volume2, Sparkles } from 'lucide-react';

interface SongPageProps {
  isElderlyMode: boolean;
}

type BookType = 'FFPM' | 'FF' | 'Fifohazana' | 'Favoris';

export default function SongPage({ isElderlyMode }: SongPageProps) {
  const [activeBook, setActiveBook] = useState<BookType>('FFPM');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load favorites from local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('church_song_favs') || '["ffpm-1", "ffpm-23", "ffpm-480"]');
    } catch (e) {
      return ["ffpm-1", "ffpm-23", "ffpm-480"];
    }
  });

  // Keep track of the active song ID
  const [selectedSongId, setSelectedSongId] = useState<string>('ffpm-1');

  // Audio synths states
  const [isPlayingTune, setIsPlayingTune] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [synthInterval, setSynthInterval] = useState<any>(null);
  
  // Custom karaoke beat tracker for animated feedback
  const [currentBeat, setCurrentBeat] = useState(0);

  // Sync favorites storage
  useEffect(() => {
    localStorage.setItem('church_song_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

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
    stopKaraoke();
    setIsPlayingTune(false);
    setSelectedSongId(id);
  };

  // Dynamic lists with intelligent fallback
  const filteredSongs = searchSongs(searchQuery, activeBook, favorites);

  // Majestic Stereophonic Pipe-Organ Accompaniment
  const startKaraoke = (songNumber: number, bookType: 'FFPM' | 'FF' | 'Fifohazana') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);

      let step = 0;
      const notes = getHymnTempoNotes(songNumber, bookType);

      // Play notes every 0.55 seconds for a lively liturgical pace
      const interval = setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        
        const organGain = ctx.createGain();
        organGain.gain.setValueAtTime(0.0, ctx.currentTime);
        organGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.04); // swell/attack
        organGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.52); // decay/reverb

        const currentFreq = notes[step % notes.length];

        // 1. Principal Organ Voice (Triangle Wave)
        const principal = ctx.createOscillator();
        principal.type = 'triangle';
        principal.frequency.setValueAtTime(currentFreq, ctx.currentTime);

        // 2. Majestic Pedal Bass (Sine Wave - 1 Octave Lower)
        const pedalBass = ctx.createOscillator();
        pedalBass.type = 'sine';
        pedalBass.frequency.setValueAtTime(currentFreq / 2, ctx.currentTime);

        // 3. Harmonic Mixture Voice (Soft Sawtooth Wave - 1 Octave Higher + Perfect Fifth)
        // Ratio 1.5 is perfect third harmonic
        const mixtureHarmonic = ctx.createOscillator();
        mixtureHarmonic.type = 'triangle';
        mixtureHarmonic.frequency.setValueAtTime(currentFreq * 1.5, ctx.currentTime);

        const mixtureGain = ctx.createGain();
        mixtureGain.gain.setValueAtTime(0.02, ctx.currentTime);

        // Connect everything to destination
        principal.connect(organGain);
        pedalBass.connect(organGain);
        
        mixtureHarmonic.connect(mixtureGain);
        mixtureGain.connect(organGain);

        organGain.connect(ctx.destination);

        // Start oscillators simultaneously
        principal.start();
        pedalBass.start();
        mixtureHarmonic.start();

        // Graceful stop
        principal.stop(ctx.currentTime + 0.55);
        pedalBass.stop(ctx.currentTime + 0.55);
        mixtureHarmonic.stop(ctx.currentTime + 0.55);

        // Beat anim incrementor
        setCurrentBeat(prev => (prev + 1) % 8);
        step++;
      }, 550);

      setSynthInterval(interval);
    } catch (e) {
      console.error(e);
    }
  };

  const stopKaraoke = () => {
    if (synthInterval) {
      clearInterval(synthInterval);
      setSynthInterval(null);
    }
    if (audioCtx) {
      audioCtx.close();
      setAudioCtx(null);
    }
    setCurrentBeat(0);
  };

  const toggleTunePlay = () => {
    if (isPlayingTune) {
      stopKaraoke();
      setIsPlayingTune(false);
    } else {
      const parsed = parseSongId(selectedSongId);
      startKaraoke(parsed.num, parsed.book);
      setIsPlayingTune(true);
    }
  };

  // Clean audio-sources on transition/unmount
  useEffect(() => {
    return () => {
      stopKaraoke();
    };
  }, [selectedSongId]);

  return (
    <div className="space-y-4">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-[9px] font-extrabold py-0.5 px-2 bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 text-violet-700 dark:text-violet-300 rounded-full uppercase tracking-wider">
          🎵 Fihirana & Karaoké
        </span>
        <h2 className={`${isElderlyMode ? 'text-2xl font-black' : 'text-sm font-extrabold'} text-slate-850 dark:text-slate-100 flex items-center gap-1.5 mt-1`}>
          <Music className="w-5 h-5 text-violet-600 animate-pulse" />
          <span>Fihirana Malagasy Manontolo</span>
        </h2>
        <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-snug mt-1">
          Hira sy feon-kira feno amin'ny fombam-pivavahana: 827 hira FFPM, Fihirana Fanampiny, ary Fifohazana. Azonao ampiasaina ho karaoké hanampiana ny mino.
        </p>
      </div>

      {/* Main Container Split: Selector side & Reading Pane side */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: Books toggle and search directory */}
        <div className="md:col-span-5 space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          
          {/* Hymnal Source Tabs */}
          <div className="space-y-1">
            <span className="block text-[8.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Fidio Ny Boky (Sélectionner Hymnal):
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800">
              <button
                onClick={() => { setActiveBook('FFPM'); setSearchQuery(''); }}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center transition-all cursor-pointer ${
                  activeBook === 'FFPM'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-650 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-white'
                }`}
              >
                FFPM
              </button>
              <button
                onClick={() => { setActiveBook('FF'); setSearchQuery(''); }}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center transition-all cursor-pointer ${
                  activeBook === 'FF'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-650 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-white'
                }`}
              >
                Fanampiny
              </button>
              <button
                onClick={() => { setActiveBook('Fifohazana'); setSearchQuery(''); }}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center transition-all cursor-pointer ${
                  activeBook === 'Fifohazana'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-650 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-white'
                }`}
              >
                Fifohazana
              </button>
              <button
                onClick={() => { setActiveBook('Favoris'); setSearchQuery(''); }}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
                  activeBook === 'Favoris'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                ⭐ Favoris
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div className="space-y-1.5 pt-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeBook === 'FFPM' 
                    ? "Tadiavo amin'ny laharana (1-827), lohateny, na tonony..." 
                    : "Tiavo lohateny na teny ao amin'ny hira..."
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
                  Raha hira FFPM indray, soraty tsotra ny laharana 1 ka hatramin'ny 827 (ohatra: 480) mba ahafahana mamorona azy malalaka!
                </p>
              </div>
            ) : (
              filteredSongs.map((sg) => {
                const isSelected = selectedSongId === sg.id;
                const isFav = favorites.includes(sg.id);
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
                          {isFav && <span className="text-amber-400 shrink-0">★</span>}
                        </h4>
                        <span className={`text-[8.5px] uppercase font-bold leading-none ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>
                          {sg.book === 'FFPM' ? '📖 FFPM' : sg.book === 'FF' ? '🎵 Fanampiny' : '🔥 Fifohazana'} • {sg.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Interactive Star within row */}
                      <button
                        onClick={(e) => toggleFavorite(sg.id, e)}
                        className={`p-1 rounded-md transition-colors ${
                          isFav 
                            ? 'text-amber-400' 
                            : isSelected ? 'text-violet-300 hover:text-white' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl text-[8.5px] text-slate-400 dark:text-slate-500 font-medium leading-normal mt-auto border border-slate-100 dark:border-slate-850">
            📌 <strong>Toro-hevitra:</strong> Afaka mikaroka mivantana amin'ny soronao na laharana hira ao amin'ny FFPM ianao (1 hatramin'ny 827) mba handrindrana ny karaoke azy rehetra.
          </div>
        </div>

        {/* RIGHT COLUMN: Lyrics Reader and interactive Pipe-Organ simulation */}
        <div className="md:col-span-7 flex flex-col">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-full overflow-hidden">
            
            {/* Song Header & Actions pane */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 text-violet-600 dark:text-violet-300 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-2xs">
                  {activeSong.book === 'FF' ? `FF ${activeSong.number}` : activeSong.number}
                </span>
                <div>
                  <h3 className={`${isElderlyMode ? 'text-xl' : 'text-sm'} font-black text-slate-850 dark:text-slate-100 leading-tight flex items-center gap-1.5`}>
                    <span>{activeSong.title}</span>
                    <button 
                      onClick={() => toggleFavorite(activeSong.id)}
                      className="text-amber-400 hover:scale-110 active:scale-95 transition-transform"
                      title="Hira ankafizina"
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(activeSong.id) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    </button>
                  </h3>
                  <span className="text-[8.5px] uppercase font-black text-violet-600 dark:text-violet-400 tracking-wider">
                    {activeSong.book === 'FFPM' 
                      ? 'Fiangonana FFPM (Hira 1 - 827)' 
                      : activeSong.book === 'FF' ? 'Fihirana Fanampiny Vaovao' : 'Fihirana Fifohazana Malagasy'} • {activeSong.category}
                  </span>
                </div>
              </div>

              {/* Karaoke triggering Organ voice */}
              <button
                id="btn-tune-play"
                onClick={toggleTunePlay}
                className={`py-2 px-3.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                  isPlayingTune
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isPlayingTune ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white animate-bounce" />
                    <span>Ajanony (Pause)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white animate-pulse" />
                    <span>Tandrohina Organa 🎵</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated interactive note karaoke score visualizer overlay */}
            {isPlayingTune && (
              <div className="px-4 py-2 bg-slate-900 border-b border-indigo-950 flex flex-col gap-1">
                
                {/* Visual bouncing music notes header */}
                <div className="flex items-center justify-between text-[9px] text-violet-400 font-mono font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                    MIDI ORGANA COMPLET : FEON-KIRA BANJY (TEMPO ACTIV)
                  </span>
                  <span className="flex gap-1 animate-pulse text-indigo-300">
                    {['🎵', '♩', '🎶', '♩', '🎵', '♩', '🎶'][currentBeat % 7]}
                  </span>
                </div>

                {/* Bouncing visualizer bar graph */}
                <div className="flex items-end justify-center gap-1.5 h-8 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar, idx) => {
                    // Seed wave height calculated using beat index
                    const activeHeight = isPlayingTune 
                      ? Math.max(12, Math.floor(Math.sin((currentBeat + idx) * 0.7) * 20 + 20)) 
                      : 4;
                    return (
                      <div 
                        key={idx}
                        className={`w-1 rounded-t-xs transition-all duration-300 ${
                          idx % 3 === 0 
                            ? 'bg-emerald-450' 
                            : idx % 2 === 0 ? 'bg-violet-500' : 'bg-indigo-400'
                        }`}
                        style={{ height: `${activeHeight}px` }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Song lyrics and interactive scrolling representation */}
            <div className="p-4 sm:p-6 text-center bg-gradient-to-b from-white to-slate-50/20 dark:from-slate-900 dark:to-slate-950 flex-1 flex flex-col justify-between min-h-[300px]">
              
              {/* Floating note indicators in background */}
              <div className="relative py-4 flex-1 flex flex-col justify-center">
                {isPlayingTune && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="absolute top-[10%] left-[20%] text-3xl font-bold animate-bounce">🎵</div>
                    <div className="absolute top-[40%] right-[15%] text-4xl font-bold animate-ping">🎶</div>
                    <div className="absolute bottom-[20%] left-[40%] text-2xl font-bold">♩</div>
                    <div className="absolute bottom-[10%] left-[10%] text-3xl font-bold animate-pulse">🎵</div>
                  </div>
                )}

                {/* Actual stanzas with interactive highlight beats */}
                <div className="space-y-6">
                  {activeSong.lyrics.split('\n\n').map((stanza, idx) => {
                    const isChorus = stanza.trim().includes('Fiverenana') || stanza.trim().includes('Refrain');
                    // highlight corresponding stanza based on song beat steps
                    const isStanzaPulse = isPlayingTune && (currentBeat % 3 === idx % 3);

                    return (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-xl transition-all duration-300 relative ${
                          isChorus 
                            ? 'bg-amber-500/5 border border-amber-550/20 text-amber-900 dark:text-amber-200' 
                            : 'text-slate-800 dark:text-slate-200'
                        } ${isStanzaPulse ? 'ring-2 ring-violet-500/30 scale-[1.01] bg-slate-50/70 dark:bg-slate-950/20' : ''}`}
                      >
                        {isPlayingTune && isStanzaPulse && (
                          <span className="absolute -top-2 left-4 text-[10px] bg-violet-600 text-white font-extrabold px-1.5 py-0.5 rounded-md animate-bounce flex items-center gap-0.5 shadow-xs">
                            🎵 Active
                          </span>
                        )}
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
                <span>© Fiangonana Protestanta / Katolika Malagasy</span>
                <span>FFPM - Fihirana Fanampiny - Fifohazana</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
