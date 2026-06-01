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
    { id: "ym1", sender: "Andry Tiana", message: "Mirary fahasoavana ho an'ny tanora rehetra hanao fanadinana heriny masina izao! Matokia an'i Jehovah.", color: "bg-amber-50 dark:bg-amber-955/20 border-amber-200", time: "09:12" },
    { id: "ym2", sender: "Mialy R.", message: "Misokatra ny fisoratana anarana ho an'ny fivahinianana lehibe any Antsirabe izao ny Alahady tolakandro. Manatona an'i Nirina.", color: "bg-blue-50 dark:bg-blue-955/20 border-blue-200", time: "08:35" },
    { id: "ym3", sender: "Pastor Nirina", message: "Ry tanora malala, hery ho an'ny firenena sy ny fiangonana ianareo. Mahereza amin'ny asa tsara sy ny fianarana!", color: "bg-emerald-50 dark:bg-emerald-955/20 border-emerald-200", time: "Androany" }
  ]);

  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-pink-50 dark:bg-pink-955/20 border-pink-200');

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !text.trim()) {
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
    <div className="space-y-4">
      
      {/* Detail header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-extrabold py-0.5 px-2 bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 rounded-full uppercase tracking-wider">
            Sampana Tanora Kristiana
          </span>
          <h2 className={`${isElderlyMode ? 'text-xl' : 'text-sm'} font-black text-slate-850 dark:text-slate-100 mt-1 flex items-center gap-1.5`}>
            <Users className="w-5 h-5 text-orange-500" />
            <span>Tanora Fiombonana</span>
          </h2>
          <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-snug mt-0.5">
            Ifampizarana vavaka, famporisihana sy hetsiky ny tanora.
          </p>
        </div>

        <div className="flex items-center gap-1 font-mono text-[9px] font-extrabold bg-orange-50 dark:bg-orange-950/30 text-orange-850 dark:text-orange-400 p-2 rounded-xl border border-orange-100 dark:border-orange-900/40 shrink-0">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
          <span className="hidden sm:inline">Mavitrika</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        
        {/* Youth Interactive forum submission box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Zarao ny teny fampaherezana
          </h3>

          <form onSubmit={handlePostMessage} className="space-y-3">
            <div>
              <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">
                Anaranao (Anarana)
              </label>
              <input
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Tsindrio eto hanoratra..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-850 dark:text-white outline-none text-xs font-semibold focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">
                Hafatra tiana ho zaraina *
              </label>
              <textarea
                required
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Andinin-tSoratra Masina na fampaherezana..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-white outline-none text-xs font-semibold focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* Color selection panel */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">
                  Loko sary:
                </span>
                <div className="flex gap-1.5">
                  {[
                    { key: 'bg-pink-50 dark:bg-pink-955/20 border-pink-200', color: 'bg-pink-400' },
                    { key: 'bg-amber-50 dark:bg-amber-955/20 border-amber-100', color: 'bg-amber-400' },
                    { key: 'bg-blue-50 dark:bg-blue-955/20 border-blue-200', color: 'bg-blue-400' },
                    { key: 'bg-emerald-50 dark:bg-emerald-955/20 border-emerald-250', color: 'bg-emerald-400' }
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.key}
                      onClick={() => setSelectedColor(preset.key)}
                      className={`w-5 h-5 rounded-full border cursor-pointer ${preset.color} ${
                        selectedColor === preset.key ? 'ring-2 ring-orange-500' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <button
                  id="btn-post-message"
                  type="submit"
                  className="py-2 px-4 btn-3d-orange rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer select-none"
                >
                  <Send className="w-3.5 h-3.5 fill-white" />
                  <span>Haparitaka (Post)</span>
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Message board displays (In-app Feed, with scroll limitation) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800 p-4 shadow-sm space-y-3 flex flex-col h-[320px]">
          <h3 className="font-extrabold text-slate-805 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 shrink-0">
            <Compass className="w-3.5 h-3.5 text-orange-500" />
            Rindrin'ny Tanora ( Stickies Feed )
          </h3>

          <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-xl border transition-all shadow-xs relative ${msg.color}`}
              >
                <p className={`${isElderlyMode ? 'text-lg font-black' : 'text-xs font-semibold'} text-slate-805 dark:text-slate-150 leading-relaxed font-sans`}>
                  "{msg.message}"
                </p>
                
                <div className="flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800/20 mt-2.5 pt-1.5 text-[10px] uppercase font-bold leading-none">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Smile className="w-3.5 h-3.5 text-orange-500" />
                    {msg.sender}
                  </span>
                  <span className="text-[8.5px] text-slate-400 font-mono font-bold">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
