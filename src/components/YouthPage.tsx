/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Target, Users, Sparkles, Send, Flame, Zap, Compass, Smile } from 'lucide-react';

interface YouthPageProps {
  isElderlyMode: boolean;
}

interface YouthMessage {
  id: string;
  sender: string;
  message: string;
  color: string;
  time: string;
}

export default function YouthPage({ isElderlyMode }: YouthPageProps) {
  const [messages, setMessages] = useState<YouthMessage[]>([
    { id: "ym1", sender: "Andry Tiana", message: "Mirary fahasoavana ho an'ny tanora rehetra hanao fanadinana heriny masina izao! Matokia an'i Jehovah.", color: "bg-amber-50 dark:bg-amber-950/20 border-amber-200", time: "09:12" },
    { id: "ym2", sender: "Mialy R.", message: "Misokatra ny fisoratana anarana ho an'ny fivahinianana lehibe any Antsirabe izao ny Alahady tolakandro. Manatona an'i Nirina.", color: "bg-blue-50 dark:bg-blue-950/20 border-blue-200", time: "Androany 08:35" },
    { id: "ym3", sender: "Pastor Nirina", message: "Ry tanora malala, hery ho an'ny firenena sy ny fiangonana ianareo. Mahereza amin'ny asa tsara sy ny fianarana!", color: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200", time: "Androany" }
  ]);

  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-pink-50 dark:bg-pink-950/20 border-pink-200');

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !text.trim()) {
      alert("Fenoy ny anarana sy ny andinin-teny famporisihana!");
      return;
    }

    const newMsg: YouthMessage = {
      id: `ym-${Date.now()}`,
      sender: sender.trim(),
      message: text.trim(),
      color: selectedColor,
      time: "Vao teo"
    };

    setMessages([newMsg, ...messages]);
    setSender('');
    setText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Detail header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-705/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-450 rounded-full font-semibold uppercase tracking-wider">
            Sampana Tanora Kristiana
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-850 dark:text-slate-100 mt-1.5 flex items-center gap-2`}>
            <Users className="w-7 h-7 text-orange-500" />
            <span>Tanora Fiombonana (Youth Forum)</span>
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
            Toerana ifampizarana hafatra famporisihana, vavaka iraisana, ary hetsika fanatanjahantena ho an'ny tanora.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400 p-3 rounded-xl border border-orange-100 dark:border-orange-900/40">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span>Finoana Mavitrika (Mavitrika)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Youth Interactive forum submission box */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-705/65 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-3">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Hiara-mamporisika
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Soraty eto ambany ny fitsapana finoana na hafatra famporisihana (encouraging stickers) tianao ho zaraina amin'ireo tanora namanao.
            </p>

            <form onSubmit={handlePostMessage} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase mb-1.5">
                  Anaranao (Nickname)
                </label>
                <input
                  type="text"
                  required
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Ohatra: Mialy Tanora"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-705 rounded-xl p-3 text-slate-850 dark:text-slate-100 outline-none text-xs transition-all focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase mb-1.5">
                  Ny hafatrao *
                </label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Soraty ny teny fampaherezana na andinin-tsoratra masina..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-705 rounded-xl p-3 text-slate-850 dark:text-slate-100 outline-none text-xs transition-all focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Color selection panel */}
              <div>
                <span className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase mb-2">
                  Loko sary:
                </span>
                <div className="flex gap-2">
                  {[
                    { key: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200', color: 'bg-pink-400' },
                    { key: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100', color: 'bg-amber-400' },
                    { key: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200', color: 'bg-blue-400' },
                    { key: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200', color: 'bg-emerald-400' }
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.key}
                      onClick={() => setSelectedColor(preset.key)}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer ${preset.color} ${
                        selectedColor === preset.key ? 'border-indigo-650 scale-110 ring-2 ring-indigo-500/20' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                id="btn-post-message"
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 font-bold text-white rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Send className="w-4 h-4 fill-white" />
                <span>Alefa amin'ny Rindrina (Post)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Message board displays */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-705/65 p-6 shadow-sm space-y-4 h-[500px] flex flex-col overflow-hidden">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-3 shrink-0">
              <Compass className="w-4 h-4 text-orange-500" />
              Rindrin'ny Tanora (Youth Stickies Feed)
            </h3>

            <div className="overflow-y-auto flex-1 pr-1 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-sm relative ${msg.color}`}
                >
                  <p className={`${isElderlyMode ? 'text-xl' : 'text-sm'} text-slate-800 dark:text-slate-150 leading-relaxed font-sans`}>
                    "{msg.message}"
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800/20 mt-3 pt-2 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-250 flex items-center gap-1">
                      <Smile className="w-4 h-4 text-orange-500" />
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
