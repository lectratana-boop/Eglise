/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Announcement } from '../types';
import { Megaphone, Calendar, Filter, Plus, X, Tag, FileText, Edit2, Trash2, Save, Undo } from 'lucide-react';

interface AnnouncementsPageProps {
  churchId: string;
  announcements: Announcement[];
  onAddAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  onUpdateAnnouncement: (id: string, updatedFields: Partial<Announcement>) => void;
  onDeleteAnnouncement: (id: string) => void;
  isElderlyMode: boolean;
}

export default function AnnouncementsPage({
  churchId,
  announcements,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  isElderlyMode
}: AnnouncementsPageProps) {
  const [activeCategory, setActiveCategory] = useState<'rehetra' | 'fivoriana' | 'hetsika' | 'hafa'>('rehetra');
  const [isPublishing, setIsPublishing] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'fivoriana' | 'hetsika' | 'hafa'>('fivoriana');
  const [content, setContent] = useState('');

  // Local inline editing states for specific announcement card
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesChurch = ann.churchId === churchId;
    const matchesCategory = activeCategory === 'rehetra' || ann.category === activeCategory;
    return matchesChurch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Fenoy ny lohateny sy ny hevitra filazana azafady!");
      return;
    }

    onAddAnnouncement({
      churchId,
      title,
      category,
      content
    });

    setTitle('');
    setContent('');
    setCategory('fivoriana');
    setIsPublishing(false);
  };

  const startEditing = (ann: Announcement) => {
    setEditingId(ann.id);
    setEditTitle(ann.title);
    setEditContent(ann.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("Tsy azo avela ho foana ny lohateny sy ny vontoatiny!");
      return;
    }
    onUpdateAnnouncement(id, {
      title: editTitle.trim(),
      content: editContent.trim()
    });
    setEditingId(null);
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'fivoriana':
        return 'bg-blue-105 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
      case 'hetsika':
        return 'bg-emerald-105 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
      default:
        return 'bg-slate-105 text-slate-705 dark:bg-slate-750/50 dark:text-slate-350';
    }
  };

  return (
    <div className="space-y-6">
      {/* Detail header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full font-semibold uppercase tracking-wider">
            Filazana Vaovao
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mt-1.5`}>
            <Megaphone className="w-7 h-7 text-violet-600 animate-[pulse_1.5s_infinite]" />
            <span>Fampandrenesana rehetra</span>
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
            Araho mivantana eto ny filazana, fivoriana ary vaovao mikasika ny fiangonana mavitrika handraisanao anjara.
          </p>
        </div>

        <button
          onClick={() => setIsPublishing(true)}
          className={`flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl shadow-md font-bold transition-all cursor-pointer ${
            isElderlyMode ? 'py-4 px-6 text-xl' : 'py-3 px-4 text-sm'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Hampiditra</span>
        </button>
      </div>

      {/* Sorting section */}
      <div className="flex gap-2 border-b border-slate-205 dark:border-slate-750 pb-4">
        {([
          { key: 'rehetra', text: 'Rehetra' },
          { key: 'fivoriana', text: 'Fivoriana ' },
          { key: 'hetsika', text: 'Hetsika' },
          { key: 'hafa', text: 'Sokajy Hafa' }
        ] as const).map((tab) => {
          const isSelected = activeCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-755 text-slate-655 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.text}
            </button>
          );
        })}
      </div>

      {/* Announcements board cards with comfortable view sizes */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-905 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Megaphone className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-450 text-sm font-semibold">
              Tsy mbola misy fampandrenesana voasoratra ho an'ity fiangonana ity.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isEditing = editingId === ann.id;
            return (
              <div
                id={`announcement-card-${ann.id}`}
                key={ann.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-155 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* Meta details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider ${getCategoryTheme(ann.category)}`}>
                        {ann.category}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Navoaka: {ann.date}
                      </span>
                    </div>
                    
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded self-start sm:self-center">
                      Filazana ofisialy ✔
                    </span>
                  </div>

                  {isEditing ? (
                    /* EDIT MODE FORM FIELDS WITHIN CARD */
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                          Lohateny *
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 outline-none text-sm font-bold focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                          Vontoatiny (Content) *
                        </label>
                        <textarea
                          rows={3}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 outline-none text-sm leading-relaxed focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Announcement Message contents VIEW MODE */
                    <div className="space-y-2">
                      <h3 className={`${isElderlyMode ? 'text-2xl' : 'text-lg'} font-bold text-slate-850 dark:text-slate-100`}>
                        {ann.title}
                      </h3>
                      <p className={`${isElderlyMode ? 'text-lg lg:text-xl' : 'text-sm'} text-slate-600 dark:text-slate-350 leading-relaxed font-sans whitespace-pre-wrap`}>
                        {ann.content}
                      </p>
                    </div>
                  )}

                  {/* ACTION FOOTER CONTAINING THE 3 BUTTONS (DELETE, EDIT, SAUVEGARDE) AS REQUESTED */}
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700/50 pt-3.5 mt-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(ann.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                          title="Tahiry / Enregistrer (Sauvegarde)"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Sauvegarde</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-650 dark:text-slate-350 rounded-lg text-xs font-semibold cursor-pointer transition-all active:scale-95"
                          title="Manafoana"
                        >
                          <Undo className="w-3.5 h-3.5" />
                          <span>Hanafoana</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(ann)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/30 dark:hover:bg-violet-900/40 text-violet-600 dark:text-violet-300 rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-95 border border-violet-150/50 dark:border-violet-800/30"
                          title="Hanova / Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteAnnouncement(ann.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-955/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-95 border border-rose-150/50 dark:border-rose-900/20"
                          title="Hamafa / Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Popup Announcement Creator Modal */}
      {isPublishing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-205 dark:border-slate-705 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                  Hampiditra
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-400">
                  Soraty eto ny lohahevitra sy ny pitsopitsony fampandrenesana ho an'ny fiangonana.
                </p>
              </div>
              <button
                onClick={() => setIsPublishing(false)}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-450 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Lohahevitra na Lohateny *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mampandoeha momba ny fanompoam-pivavahana..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Sokajy filazana
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {([
                    { key: 'fivoriana', label: '🔵 Fivoriana' },
                    { key: 'hetsika', label: '🟢 Hetsika' },
                    { key: 'hafa', label: '⚪ Hafa / Vaovao' }
                  ] as const).map((catItem) => {
                    const isSelected = category === catItem.key;
                    return (
                      <button
                        type="button"
                        key={catItem.key}
                        onClick={() => setCategory(catItem.key)}
                        className={`py-2 px-2.5 rounded-lg border text-center font-bold text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-violet-600 text-white border-violet-600 shadow'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-100'
                        }`}
                      >
                        {catItem.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Hevitra Filazana (Content) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Soraty eto ny andinindininy rehetra toy ny ora, toerana, sy ny manodidina..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-750 text-white font-bold py-3 rounded-xl shadow cursor-pointer text-sm"
                >
                  Hamorona Filazana
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublishing(false)}
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
