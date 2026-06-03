/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member } from '../types';
import { 
  LogIn, 
  Phone, 
  User, 
  ShieldAlert, 
  UserPlus, 
  MapPin, 
  CheckSquare, 
  Square,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
// @ts-ignore
import loginBackground from '../assets/images/waterfall_background_1780423242474.png';

interface LoginPageProps {
  members: Member[];
  churchRoles: string[];
  onLogin: (member: Member) => void;
  onRegisterAndLogin: (name: string, phone: string, roles: string[], address: string) => void;
}

export default function LoginPage({ members, churchRoles, onLogin, onRegisterAndLogin }: LoginPageProps) {
  // Tabs: 'login' for Logging In, 'register' for "Insertion Membre pour connecte"
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  
  // Login Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Registration Form states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regSelectedRoles, setRegSelectedRoles] = useState<string[]>(["Sampana Tanora Kristiana (STK)"]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setError(`⚠️ Tsy mifanaraka indrindra amin'ny anarana na laharana misy ao amin'ny rafitra. Sisa andrana: ${3 - nextAttempts}`);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regName.trim() || !regPhone.trim()) {
      setError("Fenoy ny anarana sy ny laharana finday azafady!");
      return;
    }

    if (regSelectedRoles.length === 0) {
      setError("Azafady misafidiana sampana iray na maromaro misy anao!");
      return;
    }

    // Insert new member and auto-connect
    onRegisterAndLogin(
      regName.trim(),
      regPhone.trim(),
      regSelectedRoles,
      regAddress.trim() || "Lot 26 ter mahamasina"
    );

    setSuccess("Nahomby ny fampidirana anao! Tafiditra ianao izao.");
  };

  const handleToggleRegRole = (role: string) => {
    if (regSelectedRoles.includes(role)) {
      setRegSelectedRoles(prev => prev.filter(r => r !== role));
    } else {
      setRegSelectedRoles(prev => [...prev, role]);
    }
  };

  // Subtle function to reset lock for developers testing the application
  const handleDevResetLock = () => {
    setAttempts(0);
    setIsLocked(false);
    localStorage.setItem('mifandray_login_attempts', '0');
    localStorage.removeItem('mifandray_login_locked');
    setError('');
    setSuccess('Efa nodiovina ny sakan-dalana. Azonao andramana indray!');
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center text-white font-sans overflow-y-auto p-4 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {/* Light tint overlay to make the beautiful waterfall fully visible and legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 pointer-events-none z-0" />

      {/* Main Login Card with Selection Mode inside */}
      <div className="w-full max-w-sm mx-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 my-2 relative z-10">
        
        {/* TAB HEADER SELECTOR (HIDITRA VS HAMPIDITRA MPIKAMBANA) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
            className={`py-2 px-1 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 select-none ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-transparent'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Hiditra</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
            className={`py-2 px-1 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 select-none ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-transparent'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Hampiditra</span>
          </button>
        </div>

        {/* ERROR OR SUCCESS FLASHERS */}
        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] rounded-xl font-bold flex flex-col items-center gap-1 text-center animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
            {isLocked && (
              <button 
                type="button" 
                onClick={handleDevResetLock}
                className="mt-1 px-2.5 py-0.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[9px] rounded-md font-black uppercase cursor-pointer"
              >
                Fanalana sakana (Dev Reset)
              </button>
            )}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] rounded-xl font-bold text-center">
            {success}
          </div>
        )}

        {activeTab === 'login' ? (
          /* ================= LOGIN VIEW ================= */
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            
            {/* USER OR ADMIN SECTOR */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-900">
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setLoginType('user')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  loginType === 'user' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Mpikambana
              </button>
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setLoginType('admin')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  loginType === 'admin' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Fitantanana
              </button>
            </div>

            {/* NAME INPUT */}
            <div className="space-y-1">
              <label htmlFor="login-name" className="text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-violet-400" />
                <span>Anarana Feno indrindra (Exact) :</span>
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
                placeholder={loginType === 'admin' ? "Anarana fitantanana (Admin)" : "Soraty ny anaranao feno misy ao"}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-650"
              />
            </div>

            {/* PHONE INPUT */}
            <div className="space-y-1">
              <label htmlFor="login-phone" className="text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-violet-400" />
                <span>Laharana Finday (Exact) :</span>
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
                placeholder="Laharana finday tsy misy elanelana"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-650 font-mono"
              />
            </div>

            {/* SUBMIT BUTTON : Reduit par Hiditra (entrer) */}
            <button
              type="submit"
              disabled={isLocked}
              className={`w-full py-2.5 text-xs font-black uppercase tracking-wide rounded-xl shadow-md cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-1 border-b-[3px] mt-2 disabled:opacity-45 disabled:cursor-not-allowed ${
                loginType === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 border-amber-700'
                  : 'bg-gradient-to-r from-violet-605 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-indigo-800'
              }`}
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>Hiditra (entrer)</span>
            </button>
          </form>
        ) : (
          /* ================= REGISTRATION (INSERTION) VIEW ================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            
            {/* REGISTER NAME */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-violet-400" />
                <span>Anarana Feno :</span>
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ohatra: Naivo herinjaka"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>

            {/* REGISTER PHONE */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-violet-400" />
                <span>Laharana Finday :</span>
              </label>
              <input
                type="text"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="Ohatra: 0340000000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500 font-mono"
              />
            </div>

            {/* REGISTER ADDRESS */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-violet-400" />
                <span>Adiresy / Toerana :</span>
              </label>
              <input
                type="text"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="Ohatra: Lot III B 120 Isotry"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* MULTIPLE SAMPANAS SELECTOR */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">
                Fidio ny Sampana misy anao (Azonao asiana maromaro):
              </span>
              
              <div className="border border-slate-800 bg-slate-950/60 p-2.5 rounded-xl space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                {churchRoles.filter(role => role !== 'Mpitandrina' && role !== 'Secretaire').map((roleName) => {
                  const isChecked = regSelectedRoles.includes(roleName);
                  return (
                    <button
                      type="button"
                      key={roleName}
                      onClick={() => handleToggleRegRole(roleName)}
                      className={`w-full p-2 rounded-lg border text-left text-[11px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isChecked
                          ? 'bg-violet-950/50 border-violet-750 text-violet-300'
                          : 'bg-transparent border-slate-900 text-slate-400 hover:bg-slate-900/40'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{roleName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-black bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow-md border-b-[3px] border-indigo-800 cursor-pointer active:scale-[0.98] transition-all"
            >
              Hampiditra sy hiditra ➔
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
