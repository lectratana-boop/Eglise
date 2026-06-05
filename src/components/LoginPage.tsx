/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { 
  LogIn, 
  Phone, 
  User, 
  ShieldAlert, 
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';

// @ts-ignore
import forestRiverLandscape from '../assets/images/forest_river_landscape_1780658429510.png';

interface LoginPageProps {
  members: Member[];
  churchRoles: string[];
  onLogin: (member: Member) => void;
  onRegisterAndLogin: (name: string, phone: string, roles: string[], address: string) => void;
}

export default function LoginPage({ members, churchRoles, onLogin, onRegisterAndLogin }: LoginPageProps) {
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  
  // Login Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Session-only lock states (resets on page refresh as requested by the user)
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError("⚠️ Efa nanao hadisoana in-3 ianao. Havaozy (Refresh / Reload) ny pejy raha hanandrana indray!");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError("Azafady fenoy avokoa ny anaranao sy ny laharana findainao!");
      return;
    }

    // Exact match security check (Exact name casing, exact spacing and exact trimmed phone matching)
    const cleanPhone = phone.replace(/\s+/g, '').trim();
    const typedName = name.trim();

    const matched = members.find(m => {
      const dbName = m.name.trim(); // Exact matching without toLowerCase() as per user request
      const dbPhone = m.phone.replace(/\s+/g, '').trim();
      return dbName === typedName && dbPhone === cleanPhone;
    });

    if (matched) {
      // Clean previous failed attempts
      setAttempts(0);
      onLogin(matched);
    } else {
      // Failed attempt
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setIsLocked(true);
        setError("⚠️ Efa nanao hadisoana in-3 ianao. Tsy maintsy havaozina (Refresh) ny pejy vao afaka miditra indray!");
      } else {
        setError(`⚠️ Tsy mifanaraka indrindra ny anarana na laharana. Sisa andrana: ${3 - nextAttempts}`);
      }
    }
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col justify-start pt-6 sm:pt-10 text-white font-sans overflow-hidden p-4 relative">
      
      {/* Dynamic Ken Burns Slideshow Keyframe Definitions */}
      <style>{`
        @keyframes slideshowKenBurns {
          0% { transform: scale(1.0) translate(0, 0); }
          50% { transform: scale(1.12) translate(-1%, -0.5%); }
          100% { transform: scale(1.0) translate(0, 0); }
        }
        .animate-slideshowKenBurns {
          animation: slideshowKenBurns 20s ease-in-out infinite;
        }
      `}</style>

      {/* Dynamic landscape background image (replacing the Unsplash slideshow and keeping high legibility) */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden bg-slate-950">
        <div
          style={{ backgroundImage: `url(${forestRiverLandscape})` }}
          className="absolute inset-0 bg-cover bg-center opacity-[0.9] animate-slideshowKenBurns scale-100 z-10"
        />
        {/* Soft high-contrast vignette overlay to keep text fully legible without blurring the gorgeous image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-slate-950/20 to-slate-950/85 z-10" />
      </div>

      {/* Main Login Card - Highly Translucent & Ultra Minimalist to emphasize Background Slideshow */}
      <div className="w-full max-w-[250px] mx-auto bg-slate-950/45 backdrop-blur-[3px] border border-white/20 p-3 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.85)] space-y-3 mt-2 relative z-10 animate-scaleIn">
        
        {/* ERROR OR SUCCESS FLASHERS */}
        {error && (
          <div className="p-2.5 bg-red-955/75 border border-red-800/80 text-red-100 text-[10.5px] rounded-xl font-bold flex flex-col items-center gap-1.5 text-center animate-shake leading-tight">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{error}</span>
            {isLocked && (
              <button 
                type="button" 
                onClick={handleReloadPage}
                className="mt-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[9px] rounded-lg font-black uppercase cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-sm"
              >
                <span>Havaozy 🔄</span>
              </button>
            )}
          </div>
        )}

        {success && (
          <div className="p-2.5 bg-emerald-955/75 border border-emerald-800/80 text-emerald-250 text-[10.5px] rounded-xl font-bold text-center">
            {success}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          
          {/* USER OR ADMIN SECTOR WITH VIBRANT LEFT-TO-RIGHT GRADIENTS */}
          <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              disabled={isLocked}
              onClick={() => setLoginType('user')}
              className={`py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                loginType === 'user' 
                  ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white shadow shadow-purple-550/20' 
                  : 'text-slate-405 hover:text-white'
              }`}
            >
              Mpikambana
            </button>
            <button
              type="button"
              disabled={isLocked}
              onClick={() => setLoginType('admin')}
              className={`py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                loginType === 'admin' 
                  ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-slate-955 shadow shadow-amber-500/20' 
                  : 'text-slate-305 hover:text-white'
              }`}
            >
              Mpitantana
            </button>
          </div>

          {/* NAME INPUT */}
          <div className="space-y-1">
            <label htmlFor="login-name" className="text-[10px] font-black text-slate-205 tracking-wide flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span>Anarana :</span>
            </label>
            <input
              id="login-name"
              type="text"
              required
              disabled={isLocked}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder={loginType === 'admin' ? "Anaran'ny Mpitantana" : "Soraty ny anaranao"}
              className="w-full bg-black/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-extrabold outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* PHONE INPUT */}
          <div className="space-y-1">
            <label htmlFor="login-phone" className="text-[10px] font-black text-slate-205 tracking-wide flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-violet-400" />
              <span>Laharana :</span>
            </label>
            <input
              id="login-phone"
              type="text"
              required
              disabled={isLocked}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              placeholder="Soraty ny laharanao"
              className="w-full bg-black/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-extrabold outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500 font-mono"
            />
          </div>

          {/* SUBMIT BUTTON - Elegant Left-to-Right vibrant color transition descended at the absolute bottom */}
          <button
            type="submit"
            disabled={isLocked}
            className={`w-full py-2.5 mt-2.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-b-2 disabled:opacity-45 disabled:cursor-not-allowed ${
              loginType === 'admin'
                ? 'bg-gradient-to-r from-yellow-450 via-amber-500 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-955 border-amber-600'
                : 'bg-gradient-to-r from-violet-500 via-purple-550 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-indigo-700'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span>Hiditra ➔</span>
          </button>
        </form>

      </div>
    </div>
  );
}
