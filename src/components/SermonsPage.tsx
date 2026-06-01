/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sermon } from '../types';
import { Video, Mic, Search, Plus, Play, Pause, ExternalLink, X, ArrowUpRight, HelpCircle } from 'lucide-react';

interface SermonsPageProps {
  churchId: string;
  sermons: Sermon[];
  onAddSermon: (sermon: Omit<Sermon, 'id'>) => void;
  isElderlyMode: boolean;
}

export default function SermonsPage({
  churchId,
  sermons,
  onAddSermon,
  isElderlyMode
}: SermonsPageProps) {
  const [filterType, setFilterType] = useState<'rehetra' | 'audio' | 'video'>('rehetra');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [preacher, setPreacher] = useState('');
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio');
  const [duration, setDuration] = useState('');
  
  // Active playing media slot
  const [activePlaySermon, setActivePlaySermon] = useState<Sermon | null>(null);

  const filteredSermons = sermons.filter(s => {
    const matchesChurch = s.churchId === churchId;
    const matchesType = filterType === 'rehetra' || s.type === filterType;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.preacher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChurch && matchesType && matchesSearch;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !preacher.trim()) {
      alert("Fenoy ny lohateny sy ny mpitory azafady!");
      return;
    }

    const defaultUrl = mediaType === 'video' 
      ? 'https://www.w3schools.com/html/mov_bbb.mp4' 
      : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';

    onAddSermon({
      churchId,
      title,
      preacher,
      date: new Date().toISOString().split('T')[0],
      type: mediaType,
      duration: duration.trim() || "30 mn",
      url: defaultUrl
    });

    setTitle('');
    setPreacher('');
    setDuration('');
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Detail header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full font-semibold uppercase tracking-wider">
            Toriteny sy Fampianarana
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-800 dark:text-slate-100 mt-1.5`}>
            Prezikazy & Soratra masina
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
            Sintonina sy jerena mivantana ny fampianarana sy ny toriten'ny Mpitandrina rehetra.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(true)}
          className={`flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow-md font-bold transition-all cursor-pointer ${
            isElderlyMode ? 'py-4 px-6 text-xl' : 'py-3 px-4 text-sm'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Hampiditra Prezikazy (Diffuser)</span>
        </button>
      </div>

      {/* Embedded active player container if something is active */}
      {activePlaySermon && (
        <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow-xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="animate-pulse bg-emerald-500 w-2 h-2 rounded-full" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                Mihaino mivantana : {activePlaySermon.type}
              </span>
            </div>
            <button
              onClick={() => setActivePlaySermon(null)}
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 space-y-1">
              <h4 className="text-lg font-bold font-sans text-white line-clamp-2">
                {activePlaySermon.title}
              </h4>
              <p className="text-xs text-slate-400">
                Toriteny nataon'i : <span className="text-slate-250 font-semibold">{activePlaySermon.preacher}</span>
              </p>
              <p className="text-[10px] text-slate-500">
                Nampidirina tamin'ny : {activePlaySermon.date} • {activePlaySermon.duration}
              </p>
            </div>

            <div className="md:col-span-2">
              {activePlaySermon.type === 'video' ? (
                <div className="aspect-video max-w-lg mx-auto bg-black rounded-lg overflow-hidden border border-white/10">
                  <video 
                    src={activePlaySermon.url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col justify-center items-center w-full max-w-md mx-auto space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-violet-600 rounded-full text-white animate-pulse">
                    <Mic className="w-6 h-6" />
                  </div>
                  <audio 
                    src={activePlaySermon.url} 
                    controls 
                    autoPlay 
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter tab row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-205 dark:border-slate-750 pb-4">
        {/* Type tabs (Gros bouton styling) */}
        <div className="flex gap-2">
          {(['rehetra', 'audio', 'video'] as const).map((type) => {
            const label = type === 'rehetra' ? 'Rehetra (All)' : type === 'audio' ? 'Audio Toriteny' : 'Video mivantana';
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-violet-600 text-white border-violet-600 shadow'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Karohy ny lohahevitra na mpitory..."
            className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-705 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Sermons grid list (gros boutons) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSermons.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-slate-50 dark:bg-slate-905 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Mic className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
              Tsy mbola misy toriteny na prezikazy voaray mifanaraka amin'ny sivana.
            </p>
          </div>
        ) : (
          filteredSermons.map((sermon) => {
            const isActive = activePlaySermon?.id === sermon.id;
            return (
              <div
                id={`sermon-card-${sermon.id}`}
                key={sermon.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-violet-50/50 dark:bg-violet-950/20 border-violet-500 shadow-md ring-2 ring-violet-500/10'
                    : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/60 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                      sermon.type === 'video'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                        : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-400'
                    }`}>
                      {sermon.type === 'video' ? <Video className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{sermon.type}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {sermon.date}
                    </span>
                  </div>

                  <h3 className={`${isElderlyMode ? 'text-2xl' : 'text-base'} font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2`}>
                    "{sermon.title}"
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    Mpitory : <span className="font-semibold text-slate-700 dark:text-slate-350">{sermon.preacher}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    Faharetany: {sermon.duration}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 mt-4 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide">
                    Live Broadcast Available
                  </span>
                  
                  <button
                    onClick={() => setActivePlaySermon(sermon)}
                    className="flex items-center gap-1 bg-violet-600 hover:bg-violet-750 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Vakio sy Henoy</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Simple Broadcast Uploader Form (Popup simulation modal) */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-205 dark:border-slate-705 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                  Difuso / Hampiditra Toriteny Vaovao
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ampidiro eto ny roha mivantana na raki-peo ho an'ny fiangonana.
                </p>
              </div>
              <button
                onClick={() => setIsUploading(false)}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-450 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Lohateny lehiben'ny Toriteny *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mampandoeha amin'ny finoana..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Anaran'ny Mpitandrina / Mpitory *
                </label>
                <input
                  type="text"
                  required
                  value={preacher}
                  onChange={(e) => setPreacher(e.target.value)}
                  placeholder="Ohatra: Past. Michel Rabenandrasana"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    Fitaovana (Media Type)
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as 'audio' | 'video')}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm cursor-pointer"
                  >
                    <option value="audio">🎤 Raki-peo (Audio Podcast)</option>
                    <option value="video">📹 Raki-tsary (Video Streaming)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    Faharetana (Duration Estimating)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ohatra: 45 mn"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-750 text-white font-bold py-3 rounded-xl shadow cursor-pointer text-sm"
                >
                  Hamorona ary Handefa
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-white font-bold py-3 rounded-xl cursor-pointer text-sm"
                >
                  Hanafoana
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
