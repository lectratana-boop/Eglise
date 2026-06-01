/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Church } from '../types';
import { Plus, Check, Landmark, MapPin, Info, ArrowLeft, BookOpen, Heart, Shield, HelpCircle } from 'lucide-react';

interface ChurchSelectorProps {
  churches: Church[];
  activeChurchId: string;
  onSelectChurch: (id: string) => void;
  onCreateChurch: (church: Omit<Church, 'id'>) => void;
  isElderlyMode: boolean;
}

export default function ChurchSelector({
  churches,
  activeChurchId,
  onSelectChurch,
  onCreateChurch,
  isElderlyMode
}: ChurchSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('FJKM');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState<'cross' | 'bible' | 'dove' | 'heart' | 'star'>('cross');
  const [description, setDescription] = useState('');

  const activeChurch = churches.find(c => c.id === activeChurchId) || churches[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      alert("Fenoy ny anarana sy ny toerana azafady!");
      return;
    }
    onCreateChurch({
      name,
      type,
      location,
      logo,
      description: description || `Fiangonana ${type} miorina ao ${location}.`
    });
    setName('');
    setLocation('');
    setDescription('');
    setIsCreating(false);
  };

  const getLogoIcon = (type: string, sizeClass = "w-6 h-6") => {
    switch (type) {
      case 'cross':
        return <span className={`${sizeClass} font-bold text-center text-xl`}>✝</span>;
      case 'bible':
        return <BookOpen className={sizeClass} />;
      case 'dove':
        return <span className={`${sizeClass} font-bold text-center text-xl`}>🕊</span>;
      case 'heart':
        return <Heart className={sizeClass} />;
      default:
        return <span className={`${sizeClass} font-bold text-center text-xl`}>✝</span>;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-slate-200/60 dark:border-slate-800 transition-all">
      {!isCreating ? (
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <span className={`text-xs font-mono py-1 px-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full font-semibold uppercase tracking-wider`}>
                Toeram-piasana
              </span>
              <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-sans font-bold text-slate-800 dark:text-slate-100 mt-1`}>
                Fiangonana Hezahina
              </h2>
              <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-0.5`}>
                Safidio ny fiangonana tianao jerena na manomboka vaovao.
              </p>
            </div>
            
            <button
              id="btn-add-church"
              onClick={() => setIsCreating(true)}
              className={`flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white rounded-xl shadow-md font-medium transition-all cursor-pointer ${
                isElderlyMode ? 'py-4 px-6 text-xl' : 'py-2.5 px-4 text-sm'
              }`}
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Hanorina Fiangonana Vaovao</span>
            </button>
          </div>

          {/* Active Banner */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 dark:from-violet-800 dark:to-indigo-950 text-white p-5 sm:p-6 rounded-xl shadow-lg mb-6 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 font-bold text-9xl pointer-events-none select-none translate-x-10 translate-y-10">
              ✝
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/20 shadow-inner flex items-center justify-center shrink-0">
                  {getLogoIcon(activeChurch.logo, "w-8 h-8 text-white")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-white/20 py-0.5 px-2 rounded-full uppercase">
                      {activeChurch.type}
                    </span>
                    <span className="text-xs text-white/80 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {activeChurch.location}
                    </span>
                  </div>
                  <h3 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold font-sans mt-1.5`}>
                    {activeChurch.name}
                  </h3>
                  <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-violet-100/90 mt-2 max-w-2xl`}>
                    {activeChurch.description}
                  </p>
                </div>
              </div>
              <div className="shrink-0 bg-white/15 py-1.5 px-4 rounded-lg font-mono text-xs text-white/95 border border-white/10 self-start md:self-center">
                Espace Mavitrika
              </div>
            </div>
          </div>

          {/* List of other Churches */}
          <h4 className={`${isElderlyMode ? 'text-xl' : 'text-xs'} font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3`}>
            Lisitry ny Fiangonana Malagasy misy
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {churches.map((church) => {
              const isActive = church.id === activeChurchId;
              return (
                <button
                  id={`church-card-${church.id}`}
                  key={church.id}
                  onClick={() => onSelectChurch(church.id)}
                  className={`text-left p-4 sm:p-5 rounded-xl border transition-all relative flex flex-col justify-between h-full cursor-pointer group ${
                    isActive
                      ? 'bg-violet-50/50 dark:bg-violet-950/20 border-violet-500 shadow-md ring-2 ring-violet-500/20'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-350 dark:hover:border-slate-600 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {getLogoIcon(church.logo, "w-6 h-6")}
                    </div>
                    {isActive ? (
                      <span className="bg-violet-600 text-white rounded-full p-1 self-start">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded group-hover:bg-slate-100 dark:group-hover:bg-slate-750 transition-all uppercase">
                        {church.type}
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <h5 className={`${isElderlyMode ? 'text-xl' : 'text-base'} font-bold text-slate-800 dark:text-slate-150`}>
                      {church.name}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {church.location}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {church.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Church Registration Screen */
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setIsCreating(false)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-6 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Hiverina</span>
          </button>

          <div>
            <span className="text-xs font-mono py-1 px-2.5 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-full font-semibold uppercase tracking-wider">
              Hanorina Espace Vaovao
            </span>
            <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-sans font-bold text-slate-800 dark:text-slate-100 mt-1`}>
              Hanorina ny Fiangonanao
            </h2>
            <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1.5`}>
              Ampidiro eto ny mombamomba ny fiangonanao mba hahafahan'ny mpino rehetra miaraka mampiasa azy.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className={`block font-bold text-slate-755 dark:text-slate-300 mb-2 ${isElderlyMode ? 'text-xl' : 'text-sm'}`}>
                Anaran'ny Fiangonana (Ohatra: FJKM Isotry Fitiavana) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tsindrio eto hanoratra ny anarana..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-800 dark:text-slate-100 p-3 outline-none shadow-sm transition-all text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block font-bold text-slate-755 dark:text-slate-300 mb-2 ${isElderlyMode ? 'text-xl' : 'text-sm'}`}>
                  Sokajy / Fiombonana *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-800 dark:text-slate-100 p-3 outline-none shadow-sm transition-all text-base cursor-pointer"
                >
                  <option value="FJKM">FJKM (Protestanta)</option>
                  <option value="EKAR">EKAR (Katolika)</option>
                  <option value="FLM">FLM (Loterana)</option>
                  <option value="EEM">EEM (Anglikana)</option>
                  <option value="Finoana hafa">Finoana hafa / Fiangonana tsy miankina</option>
                </select>
              </div>

              <div>
                <label className={`block font-bold text-slate-755 dark:text-slate-300 mb-2 ${isElderlyMode ? 'text-xl' : 'text-sm'}`}>
                  Toerana na Adiresy *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ohatra: Antananarivo, 67Ha"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-800 dark:text-slate-100 p-3 outline-none shadow-sm transition-all text-base"
                />
              </div>
            </div>

            <div>
              <label className={`block font-bold text-slate-755 dark:text-slate-300 mb-2 ${isElderlyMode ? 'text-xl' : 'text-sm'}`}>
                Sary Famantarana / Logo
              </label>
              <div className="grid grid-cols-5 gap-3.5">
                {(['cross', 'bible', 'dove', 'heart', 'star'] as const).map((option) => {
                  const isSelected = logo === option;
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setLogo(option)}
                      className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-600 shadow-md ring-2 ring-violet-500/25'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {getLogoIcon(option, "w-6 h-6")}
                      <span className="text-[10px] capitalize font-semibold">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={`block font-bold text-slate-755 dark:text-slate-300 mb-2 ${isElderlyMode ? 'text-xl' : 'text-sm'}`}>
                Fampidirina na Filazana fohy momba ny fiangonana
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Soraty eto raha misy teny fanehoana na tantara fohy momba ny fianakaviamben'ny finoana..."
                rows={3}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-800 dark:text-slate-100 p-3 outline-none shadow-sm transition-all text-base"
              />
            </div>

            <div className="pt-2 flex gap-4">
              <button
                type="submit"
                className={`flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                  isElderlyMode ? 'py-4 text-xl' : 'py-3 text-base'
                }`}
              >
                Hanorina ary Hiditra
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className={`flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer ${
                  isElderlyMode ? 'py-4 text-xl' : 'py-3 text-base'
                }`}
              >
                Hanafoana
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
