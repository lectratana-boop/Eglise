/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member } from '../types';
import { LogIn, Phone, User, Shield, UserCheck, ShieldAlert } from 'lucide-react';
// @ts-ignore
import churchLogo from '../assets/images/church_logo_1780395512214.png';
// @ts-ignore
import loginBackground from '../assets/images/waterfall_background_1780423242474.png';

interface LoginPageProps {
  members: Member[];
  onLogin: (member: Member) => void;
  onRegisterAndLogin: (name: string, phone: string, role?: string) => void;
}

export default function LoginPage({ members, onLogin, onRegisterAndLogin }: LoginPageProps) {
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Azafady fenoy avokoa ny anaranao sy ny laharana findainao!");
      return;
    }

    // Secure verification of credentials
    const cleanPhone = phone.replace(/\s+/g, '');
    const matched = members.find(m => {
      const dbName = m.name.toLowerCase().trim();
      const dbPhone = m.phone.replace(/\s+/g, '').trim();
      return dbName === name.toLowerCase().trim() && dbPhone === cleanPhone;
    });

    if (matched) {
      onLogin(matched);
    } else {
      // If not already in the system, register them using their selected role on the fly
      const requestedRole = loginType === 'admin' ? 'Mpitandrina' : 'Sampana Tanora Kristiana (STK)';
      onRegisterAndLogin(name.trim(), phone.trim(), requestedRole);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-between text-white font-sans overflow-y-auto p-6 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {/* Light tint overlay to make the beautiful waterfall fully visible and legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/35 pointer-events-none z-0" />
      
      {/* Dynamic light glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Header section with F.P.Fi Church Logo in its original white space card - completely uncropped */}
      <div className="w-full text-center py-4 animate-fadeIn flex justify-center relative z-10">
        <div className="mx-auto w-52 h-52 sm:w-60 sm:h-60 rounded-3xl bg-white p-5 flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden transition-all hover:scale-[1.02]">
          <img
            src={`${churchLogo}?v=2`}
            alt="Fiangonana Protestante Fifohazana (F.P.Fi)"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain bg-white rounded-2xl"
          />
        </div>
      </div>

      {/* Main Login Card with Selection Mode inside */}
      <div className="w-full max-w-sm mx-auto bg-slate-950/80 backdrop-blur-md border border-slate-800/40 p-5 rounded-3xl shadow-2xl space-y-4 my-2 relative z-10">
        {/* Removed 'Fidirana Mpikambana' and description text as requested to highlight the waterfall background */}

        {/* 2 COMPULSORY ACCESSIBILITY ROLE SELECTORS (ADMIN OR USER) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setLoginType('user');
              setError('');
            }}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
              loginType === 'user'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-transparent'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Utilisateur</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginType('admin');
              setError('');
            }}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
              loginType === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-transparent'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-[11px] rounded-xl font-bold text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* USER NAME INPUT */}
          <div className="space-y-1">
            <label htmlFor="login-name" className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span>Anarana Feno :</span>
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
              placeholder={loginType === 'admin' ? "Soraty eto ny Anarana Admin" : "Soraty eto ny Anaranao Feno"}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* PHONE CALL INPUT */}
          <div className="space-y-1">
            <label htmlFor="login-phone" className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-violet-400" />
              <span>Laharana Finday :</span>
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
              placeholder={loginType === 'admin' ? "Laharana findain'ny Admin" : "Laharana findain'ny Utilisateur"}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600 focus:border-violet-500 font-mono"
            />
          </div>

          {/* SUBMIT "ENTRER" FORM TRIGGER */}
          <button
            type="submit"
            className={`w-full py-3 text-xs font-black uppercase tracking-wide rounded-xl shadow-md cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 border-b-[3px] mt-1 ${
              loginType === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 border-amber-700'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-indigo-805'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Hiditra ato amin'ny Sehatra (Entrer) ➔</span>
          </button>
        </form>
      </div>
    </div>
  );
}
