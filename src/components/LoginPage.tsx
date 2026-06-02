/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member } from '../types';
import { LogIn, Phone, User, Sparkles, Shield, UserCheck, ShieldAlert } from 'lucide-react';
// @ts-ignore
import churchLogo from '../assets/images/church_logo_1780395512214.png';

interface LoginPageProps {
  members: Member[];
  onLogin: (member: Member) => void;
  onRegisterAndLogin: (name: string, phone: string) => void;
}

export default function LoginPage({ members, onLogin, onRegisterAndLogin }: LoginPageProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Fenoy avokoa ny anarana sy ny laharana finday azafady!");
      return;
    }

    // Attempt to match members case-insensitively, ignoring inner whitespaces for phone
    const cleanPhone = phone.replace(/\s+/g, '');
    const matched = members.find(m => {
      const dbName = m.name.toLowerCase().trim();
      const dbPhone = m.phone.replace(/\s+/g, '').trim();
      return dbName === name.toLowerCase().trim() && dbPhone === cleanPhone;
    });

    if (matched) {
      onLogin(matched);
    } else {
      // If not matched, register on the fly as a new member so they are never blocked
      onRegisterAndLogin(name.trim(), phone.trim());
    }
  };

  const handleQuickClick = (mName: string, mPhone: string) => {
    setName(mName);
    setPhone(mPhone);
    setError('');

    const cleanPhone = mPhone.replace(/\s+/g, '');
    const matched = members.find(m => {
      const dbPhone = m.phone.replace(/\s+/g, '').trim();
      return dbPhone === cleanPhone;
    });

    if (matched) {
      onLogin(matched);
    } else {
      onRegisterAndLogin(mName, mPhone);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-white font-sans overflow-y-auto p-6 relative">
      {/* Background decorations */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header section with Church Logo */}
      <div className="w-full text-center space-y-4 pt-6 animate-fadeIn">
        <div className="mx-auto w-24 h-24 rounded-full bg-white p-2.5 flex items-center justify-center shadow-2xl border border-violet-500/30 overflow-hidden">
          <img
            src={churchLogo}
            alt="Fiangonana Protestante Fifohazana (F.P.Fi)"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase select-none">
            Mifandray <span className="text-amber-400">F.P.Fi</span>
          </h1>
          <p className="text-xs text-slate-300 uppercase font-black tracking-widest mt-1">
            Fiangonana Protestante Fifohazana Isotry
          </p>
        </div>
      </div>

      {/* Main Login Form card */}
      <div className="w-full max-w-sm mx-auto bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5 my-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-black text-white">
            Fidirana Mpikambana
          </h2>
          <p className="text-xs text-slate-400">
            Ampidiro ny mombamomba anao raha hiditra ao amin'ny pejy ianao
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-xl font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="login-name" className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span>Anarana Feno:</span>
            </label>
            <input
              id="login-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Ohatra: Jean Razafindrabe"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="login-phone" className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-violet-400" />
              <span>Laharana Finday:</span>
            </label>
            <input
              id="login-phone"
              type="text"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              placeholder="Ohatra: 033 45 678 90"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wide rounded-xl shadow-md border-b-[3px] border-indigo-850 cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Hiditra ato amin'ny Sehatra ➔</span>
          </button>
        </form>

        <div className="border-t border-slate-800 pt-3">
          <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-500 uppercase font-bold text-center">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Sora-baventy voaaro sy azo antoka</span>
          </div>
        </div>
      </div>

      {/* QUICK LOGIN CHANNELS FOR ADMIN AND QUICK USER */}
      <div className="w-full max-w-sm mx-auto space-y-2 pb-6">
        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
          KITIHO RAHA HIDITRA HAINGANA:
        </span>
        <div className="grid grid-cols-2 gap-2">
          {/* Admin Account Option */}
          <button
            type="button"
            onClick={() => handleQuickClick("Admin", "034 65 154 53")}
            className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/30 to-amber-900/10 border border-amber-500/40 text-amber-300 hover:border-amber-400 active:scale-[0.96] transition-all block text-left shadow-lg text-xs"
          >
            <div className="font-black flex items-center gap-1 text-sm tracking-wide">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Admin</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 pt-1">
              034 65 154 53
            </div>
          </button>

          {/* User Account Option */}
          <button
            type="button"
            onClick={() => handleQuickClick("Tantely", "034 29 944 17")}
            className="p-3 rounded-2xl bg-gradient-to-br from-violet-950/30 to-violet-900/10 border border-violet-500/40 text-violet-300 hover:border-violet-400 active:scale-[0.96] transition-all block text-left shadow-lg text-xs"
          >
            <div className="font-black flex items-center gap-1 text-sm tracking-wide">
              <UserCheck className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Utilisateur</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 pt-1">
              034 29 944 17
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
