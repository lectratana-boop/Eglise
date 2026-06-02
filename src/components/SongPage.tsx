/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SONGS } from '../data';
import { Music, Search, Play, Pause, ChevronRight } from 'lucide-react';

interface SongPageProps {
  isElderlyMode: boolean;
}

export default function SongPage({ isElderlyMode }: SongPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSongId, setSelectedSongId] = useState<string>(SONGS[0].id);
  const [isPlayingTune, setIsPlayingTune] = useState(false);

  // Web Audio backing synthesizer for karaoke
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [synthInterval, setSynthInterval] = useState<any>(null);

  const startKaraoke = (songNumber: number) => {
    try {
      // Create audio context
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);

      let step = 0;
      // Define a beautiful chord and notes sequence depending on the song
      let notes: number[] = [];
      if (songNumber === 1) {
        // D major hymn: D4, F#4, A4, B4, A4 etc.
        notes = [293.66, 369.99, 440.00, 493.88, 440.00, 369.99, 329.63, 293.66];
      } else if (songNumber === 23) {
        // G major pastoral: G4, B4, D5, C5, B4, A4, G4
        notes = [392.00, 493.88, 587.33, 523.25, 493.88, 440.00, 392.00, 440.00];
      } else if (songNumber === 104) {
        // F major gospel: F4, A4, C5, D5, C5 etc.
        notes = [349.23, 440.00, 523.25, 587.33, 523.25, 440.05, 392.00, 349.23];
      } else {
        // C major warm: C4, E4, G4, A4, G4
        notes = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 261.63];
      }

      // Schedule notes playing every 0.6 seconds
      const interval = setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Beautiful soft sine/triangle church organ voice
        osc.type = 'triangle';
        const currentFreq = notes[step % notes.length];
        osc.frequency.setValueAtTime(currentFreq, ctx.currentTime);
        
        // Play an octave lower organ pedal too!
        const pedalOsc = ctx.createOscillator();
        pedalOsc.type = 'sine';
        pedalOsc.frequency.setValueAtTime(currentFreq / 2, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05); // attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55); // decay
        
        osc.connect(gainNode);
        pedalOsc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        pedalOsc.start();
        osc.stop(ctx.currentTime + 0.6);
        pedalOsc.stop(ctx.currentTime + 0.6);
        
        step++;
      }, 600);

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
  };

  const toggleTunePlay = () => {
    if (isPlayingTune) {
      stopKaraoke();
      setIsPlayingTune(false);
    } else {
      startKaraoke(activeSong.number);
      setIsPlayingTune(true);
    }
  };

  const handleSelectSong = (id: string) => {
    stopKaraoke();
    setIsPlayingTune(false);
    setSelectedSongId(id);
  };

  // Clean audio on unmount
  React.useEffect(() => {
    return () => {
      stopKaraoke();
    };
  }, [audioCtx, synthInterval]);

  const filteredSongs = SONGS.filter(s => {
    return s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           s.number.toString().includes(searchQuery) ||
           s.lyrics.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeSong = SONGS.find(s => s.id === selectedSongId) || SONGS[0];

  return (
    <div className="space-y-4">
      {/* Detail header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-[9px] font-extrabold py-0.5 px-2 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full uppercase tracking-wider">
          Fihirana & Chorales
        </span>
        <h2 className={`${isElderlyMode ? 'text-xl font-black' : 'text-sm font-extrabold'} text-slate-850 dark:text-slate-100 flex items-center gap-1.5 mt-1`}>
          <Music className="w-5 h-5 text-violet-600" />
          <span>Hira sy Feonkira ofisialy</span>
        </h2>
        <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-snug mt-0.5">
          Tonon-kira fihirana ara-piangonana malagasy rehetra.
        </p>
      </div>

      <div className="space-y-4">
        
        {/* Songs selector directory list */}
        <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">
              Hitady hira (Karoka):
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nomerao na teny ao amin'ny hira..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-850 dark:text-white outline-none focus:ring-2 focus:ring-violet-550 font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="max-h-[160px] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
            {filteredSongs.length === 0 ? (
              <p className="text-[10px] text-slate-400 text-center py-6 font-mono font-bold">Tsy misy hira mifanaraka.</p>
            ) : (
              filteredSongs.map((sg) => {
                const isSelected = selectedSongId === sg.id;
                return (
                  <button
                    id={`btn-song-${sg.id}`}
                    key={sg.id}
                    onClick={() => handleSelectSong(sg.id)}
                    className={`w-full text-left p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-violet-600 border-violet-500 text-white font-extrabold shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-950 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg font-mono font-black text-[11px] flex items-center justify-center shrink-0 border ${
                        isSelected 
                          ? 'bg-violet-700 text-white border-violet-500' 
                          : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-350 border-slate-200'
                      }`}>
                        {sg.number}
                      </span>
                      <div className="truncate max-w-[220px]">
                        <h4 className="text-xs font-black truncate leading-tight">
                          {sg.title}
                        </h4>
                        <span className={`text-[8.5px] uppercase font-bold leading-none ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>
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

        {/* Selected song lyrics render pane */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          
          {/* Song title, index and play tools */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 bg-violet-100 dark:bg-violet-950/40 text-violet-600 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0">
                {activeSong.number}
              </span>
              <div>
                <h3 className={`${isElderlyMode ? 'text-xl' : 'text-xs'} font-black text-slate-850 dark:text-slate-100 leading-tight`}>
                  {activeSong.title}
                </h3>
                <span className="text-[8.5px] uppercase font-extrabold text-slate-400 dark:text-slate-550 tracking-wider">
                  Fihirana Fanampiny Malagasy
                </span>
              </div>
            </div>

            {/* Play simulation accompaniment chord with beautiful 3D color trigger */}
            <button
              id="btn-tune-play"
              onClick={toggleTunePlay}
              className={`py-2 px-3 rounded-xl text-[10.5px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                isPlayingTune
                  ? 'btn-3d-rose'
                  : 'btn-3d-emerald'
              }`}
            >
              {isPlayingTune ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Hatsaharo</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Tandramo MIDI</span>
                </>
              )}
            </button>
          </div>

          {/* Song lyrics display */}
          <div className="p-4 sm:p-5 text-center bg-gradient-to-b from-white to-slate-50/20 dark:from-slate-900 dark:to-slate-950 flex flex-col justify-between">
            
            {/* Optional melody audio message */}
            {isPlayingTune && (
              <div className="mb-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-2 rounded-lg text-[9px] text-emerald-700 dark:text-emerald-400 font-bold animate-pulse flex items-center justify-center gap-1.5 uppercase tracking-wide">
                <span>🎵</span>
                <span>Mandefa feon-kira fampianarana ho an'ny mpihira...</span>
              </div>
            )}

            <div className={`whitespace-pre-line leading-relaxed font-sans text-slate-800 dark:text-slate-205 select-text py-2 ${
              isElderlyMode ? 'text-lg font-black' : 'text-xs font-semibold'
            }`}>
              {activeSong.lyrics}
            </div>

            <div className="text-[8px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              © Fihirana Malagasy - Synode FJKM / FLM / EKAR
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
