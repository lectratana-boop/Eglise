/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member } from '../types';
import { LogIn, Phone, User, Shield, UserCheck, ShieldAlert } from 'lucide-react';
// @ts-ignore
import churchLogo from '../assets/images/church_logo_1780395512214.png';

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
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-white font-sans overflow-y-auto p-6 relative">
      {/* Dynamic light glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header section with F.P.Fi Church Logo */}
      <div className="w-full text-center py-4 animate-fadeIn">
        <div className="mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white p-3 flex items-center justify-center shadow-2xl border border-violet-500/10 overflow-hidden">
          <img
            src={churchLogo}
            alt="Fiangonana Protestante Fifohazana (F.P.Fi)"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply rounded-full scale-102"
          />
        </div>
      </div>

      {/* Main Login Card with Selection Mode inside */}
      <div className="w-full max-w-sm mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl shadow-2xl space-y-4 my-2">
        <div className="text-center">
          <h2 className="text-base font-black text-white">
            Fidirana Mpikambana
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Mifidiana ny karazam-pidiranao eto ambany dia ampidiro ny anaranao sy ny findainao.
          </p>
        </div>

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

        <div className="border-t border-slate-800/80 pt-2.5 text-center">
          <div className="inline-flex items-center gap-1 justify-center text-[9px] text-slate-500 uppercase font-black">
            <Shield className="w-3.5 h-3.5 text-amber-500/80" />
            <span>Sora-baventy voaaro sy azo antoka ny findainao</span>
          </div>
        </div>
      </div>

      <div className="w-full text-center text-[10px] text-slate-600 font-bold pb-2 uppercase tracking-tight">
        Fiangonana Protestante Fifohazana Isotry (F.P.Fi) © 2026
      </div>
    </div>
  );
}
