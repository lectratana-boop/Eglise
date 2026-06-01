/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChurchEvent } from '../types';
import { Calendar, Clock, MapPin, Plus, X, Search, FileText } from 'lucide-react';

interface AgendaPageProps {
  churchId: string;
  events: ChurchEvent[];
  onAddEvent: (ev: Omit<ChurchEvent, 'id'>) => void;
  isElderlyMode: boolean;
}

export default function AgendaPage({
  churchId,
  events,
  onAddEvent,
  isElderlyMode
}: AgendaPageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const filteredEvents = events.filter(e => e.churchId === churchId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !time.trim() || !location.trim()) {
      alert("Fenoy ny banga rehetra azafady!");
      return;
    }

    onAddEvent({
      churchId,
      title,
      date,
      time,
      location,
      description: description.trim() || 'Tsy misy tsipiriany fanampiny.'
    });

    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Detail header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full font-semibold uppercase tracking-wider">
            Fandrindrana Fiangonana
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-800 dark:text-slate-100 mt-1.5 flex items-center gap-2`}>
            <Calendar className="w-7 h-7 text-violet-600" />
            <span>Fandaharam-potoana (Événements)</span>
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
            Jerena eto ny fotoam-pivavahana, fianarana hira, ary hetsika rehetra voatondro ho avy.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className={`flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl shadow-md font-bold transition-all cursor-pointer ${
            isElderlyMode ? 'py-4 px-6 text-xl' : 'py-3 px-4 text-sm'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Hampiditra Fandaharan'Asa vaovao</span>
        </button>
      </div>

      {/* Events Agenda list view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-slate-50 dark:bg-slate-905 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-450 text-sm font-semibold">
              Tsy mbola misy fandaharan'asa na hetsika voatondro ho avy.
            </p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              id={`event-card-${ev.id}`}
              key={ev.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700/80 shadow-sm flex items-start gap-4 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider">Lota</span>
                <span className="text-lg font-bold font-mono">
                  {ev.date.split('-')[2] || '01'}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                <h3 className={`${isElderlyMode ? 'text-2xl' : 'text-base'} font-bold text-slate-850 dark:text-slate-100`}>
                  {ev.title}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ora: {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Toerana: {ev.location}</span>
                  </div>
                </div>

                <p className={`${isElderlyMode ? 'text-lg text-slate-700 dark:text-slate-300' : 'text-xs text-slate-450 dark:text-slate-400'} border-t border-slate-100 dark:border-slate-700 pt-2 font-medium leading-relaxed`}>
                  {ev.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup Event Creator Form */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-205 dark:border-slate-705 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                  Hampiditra Fandaharan'Asa vaovao
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-400">
                  Soraty eto ny hetsika mba hisoratra eo amin'ny kalandrie.
                </p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-450 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Anaran'ny Hetsika na Fihaonana *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ohatra: Fivoriana Alahady (Kulto lehibe)"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    Daty andro *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    Laharana Ora (Time range) *
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Ohatra: 08:00 - 11:30"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-705 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Toerana hanaovana azy *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ohatra: Tempoly lehibe Isotry"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Mombamomba na pitsopitsony fanampiny
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Soraty eto ny momba ny hira hovakina, ny mpitarika, na ny andininy tiana ho fantatra..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-750 text-white font-bold py-3 rounded-xl shadow cursor-pointer text-sm"
                >
                  Hamorona Hetsika
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-105 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-white font-bold py-3 rounded-xl cursor-pointer text-sm"
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
