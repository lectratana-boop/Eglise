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

// Explicit 5 image slideshow urls representing major waterfall aesthetics as requested
const SLIDESHOW_IMAGES = [
  "https://images.unsplash.com/photo-1432406845153-61488c7b6b9c?auto=format&fit=crop&w=1200&q=80", // Majestic mountain-side waterfall
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // Yosemite magnifique cascade montagne
  "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80", // Gorgeous sunlit canyon waterfall 
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80", // Lush tropical volcanic waterfall
  "https://images.unsplash.com/photo-1470071449604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"  // Cascade brumeuse matin montagne
];

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

  // Slideshow state
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Background slideshow timing loop
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveImageIdx(prev => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 4500); // Transitions to next landscape every 4.5 seconds
    return () => clearInterval(slideTimer);
  }, []);

  // Permanent Lock States stored in localStorage
  const [attempts, setAttempts] = useState<number>(() => {
    const saved = localStorage.getItem('mifandray_login_attempts');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem('mifandray_login_locked') === 'true';
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError("Voasakana tanteraka ny fidiranao (Locked permanently due to 3 failed attempts). Mifandraisa amin'ny Mpitandrina!");
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
      localStorage.setItem('mifandray_login_attempts', '0');
      onLogin(matched);
    } else {
      // Failed attempt
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      localStorage.setItem('mifandray_login_attempts', nextAttempts.toString());

      if (nextAttempts >= 3) {
        setIsLocked(true);
        localStorage.setItem('mifandray_login_locked', 'true');
        setError("⚠️ Efa nanao hadisoana in-3 ianao. Voasakana tanteraka ny fidiranao tamin'ny sehatra!");
      } else {
        setError(`⚠️ Tsy mifanaraka indrindra amin'ny anarana na laharana misy ao amin'ny rafitra ny fampahalalana nomenao. Sisa andrana: ${3 - nextAttempts}`);
      }
    }
  };

  // Reset lock for developers/admins testing the application
  const handleDevResetLock = () => {
    setAttempts(0);
    setIsLocked(false);
    localStorage.setItem('mifandray_login_attempts', '0');
    localStorage.removeItem('mifandray_login_locked');
    setError('');
    setSuccess('Efa nodiovina ny sakan-dalana. Azonao andramana indray!');
  };

  return (
    <div className="min-h-screen flex flex-col justify-end pb-10 sm:pb-16 text-white font-sans overflow-hidden p-4 relative">
      
      {/* Dynamic Ken Burns Slideshow Keyframe Definitions */}
      <style>{`
        @keyframes slideshowKenBurns {
          0% { transform: scale(1.0) translate(0, 0); }
          50% { transform: scale(1.16) translate(-1.5%, -0.8%); }
          100% { transform: scale(1.0) translate(0, 0); }
        }
        .animate-slideshowKenBurns {
          animation: slideshowKenBurns 24s ease-in-out infinite;
        }
      `}</style>

      {/* 5-Image Slideshow Background Layer with Fade and Ken Burns Animated Motion */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden bg-slate-950">
        {SLIDESHOW_IMAGES.map((imgUrl, idx) => (
          <div
            key={imgUrl}
            style={{ backgroundImage: `url(${imgUrl})` }}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1800ms] ease-in-out ${
              activeImageIdx === idx 
                ? 'opacity-[0.82] animate-slideshowKenBurns scale-100 z-10' 
                : 'opacity-0 scale-[1.04] z-0'
            }`}
          />
        ))}
        {/* High-contrast dark vignette overlay to keep all text and inputs beautifully readable over bright background images */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-slate-950/50 to-slate-950/92 z-10 animate-fadeIn" />
      </div>

      {/* Main Login Card - Refines with deep backdrop blur & dark opacity for premium contrast and perfect legibility */}
      <div className="w-full max-w-xs mx-auto bg-slate-950/70 backdrop-blur-md border border-white/20 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4 my-2 relative z-10 animate-scaleIn">
        
        {/* ERROR OR SUCCESS FLASHERS */}
        {error && (
          <div className="p-2.5 bg-red-955/75 border border-red-800/80 text-red-100 text-[10.5px] rounded-xl font-bold flex flex-col items-center gap-1 text-center animate-shake leading-tight">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{error}</span>
            {isLocked && (
              <button 
                type="button" 
                onClick={handleDevResetLock}
                className="mt-1 px-2 py-0.5 bg-red-900/80 hover:bg-red-800 text-rose-100 text-[8.5px] rounded font-black uppercase cursor-pointer"
              >
                Fanalana sakana (Dev Reset)
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
            <span>Hiditra (entrer) ➔</span>
          </button>
        </form>

      </div>
    </div>
  );
}
