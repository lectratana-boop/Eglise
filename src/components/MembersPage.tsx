/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member } from '../types';
import { Search, Plus, Phone, User, MapPin, Briefcase, X, PhoneCall, Heart } from 'lucide-react';

interface MembersPageProps {
  churchId: string;
  members: Member[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  isElderlyMode: boolean;
}

export default function MembersPage({
  churchId,
  members,
  onAddMember,
  isElderlyMode
}: MembersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('Mpikambana');

  const filteredMembers = members.filter(m => {
    const matchesChurch = m.churchId === churchId;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.phone.includes(searchQuery);
    return matchesChurch && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Fenoy ny anarana sy laharana finday azafady!");
      return;
    }

    onAddMember({
      churchId,
      name,
      phone,
      address: address.trim() || 'Tsy voasoratra ny adiresy',
      role
    });

    setName('');
    setPhone('');
    setAddress('');
    setRole('Mpikambana');
    setIsAdding(false);
  };

  const [activeCallContact, setActiveCallContact] = useState<string | null>(null);

  const handleCallSimulation = (memberName: string) => {
    setActiveCallContact(memberName);
    setTimeout(() => {
      setActiveCallContact(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-full font-semibold uppercase tracking-wider">
            Sokajy Mpikambana
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-800 dark:text-slate-100 mt-1.5`}>
            Lisitry ny Mpikambana
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
            Mitantana sy mikaroka ireo rahalahy sy anabavy rehetra eto amin'ny fiangonana.
          </p>
        </div>

        <button
          id="btn-register-member"
          onClick={() => setIsAdding(true)}
          className={`flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl shadow-md font-bold transition-all cursor-pointer ${
            isElderlyMode ? 'py-4 px-6 text-xl' : 'py-3 px-4 text-sm'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Hampiditra Mpikambana Vaovao</span>
        </button>
      </div>

      {/* Pop-up Simulation when Calling */}
      {activeCallContact && (
        <div className="fixed inset-x-4 top-4 max-w-sm mx-auto bg-slate-900 border border-slate-750 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3.5 z-50 animate-bounce">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center animate-ping absolute shrink-0" />
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center relative shrink-0">
            <PhoneCall className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">Miantso finday...</span>
            <span className="text-sm font-bold">{activeCallContact}</span>
          </div>
        </div>
      )}

      {/* Roster lists & filters with responsive search */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5 space-y-4">
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Karohy amin'ny anarana, andraikitra na finds..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-violet-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Members card layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 dark:text-slate-500">
              <User className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">Tsy nisy mpikambana voaray hita mifanaraka amin'ny fikarohanao.</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                id={`member-card-${member.id}`}
                key={member.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-150 dark:border-slate-700/80 bg-white dark:bg-slate-850 hover:shadow-md transition-all flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-sm font-bold shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className={`${isElderlyMode ? 'text-xl' : 'text-base'} font-bold text-slate-800 dark:text-slate-100`}>
                      {member.name}
                    </h3>
                    
                    <span className="inline-flex items-center gap-1 text-[10px] bg-violet-50 dark:bg-violet-950/20 text-violet-650 dark:text-violet-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      <Briefcase className="w-3 h-3" />
                      {member.role}
                    </span>

                    <p className="text-xs text-slate-450 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {member.phone}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-450" />
                      {member.address}
                    </p>
                  </div>
                </div>

                <button
                  id={`btn-call-member-${member.id}`}
                  onClick={() => handleCallSimulation(member.name)}
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-350 cursor-pointer shadow-sm active:scale-95 transition-all shrink-0"
                  title="Hiantso finday izao"
                >
                  <Phone className="w-4 h-4 text-violet-600 dark:text-violet-400 fill-violet-50 dark:fill-violet-955" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pop-up form to register a new member */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-205 dark:border-slate-705 shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                  Hampiditra Mpikambana Vaovao
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ampidiro eto ny mombamomba mba hahafeno ny lisitra.
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
                  Anarana feno *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Soraty ny anarana feno..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-850 dark:text-slate-100 outline-none text-base transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Laharana Finday *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telephone (Ohatra: 034 12 345 67)"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-850 dark:text-slate-100 outline-none text-base transition-all focus:ring-2 focus:ring-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Adiresy / Toerana Fonenana
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ohatra: Ankorondrano, rihana faha-2"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-850 dark:text-slate-100 outline-none text-base transition-all focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Andraikitra ao amin'ny Fiangonana
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-850 dark:text-slate-100 outline-none text-base cursor-pointer"
                >
                  <option value="Mpikambana tsotra">Mpikambana tsotra (Membre)</option>
                  <option value="Loholona">Loholona (Ancien)</option>
                  <option value="Diakra">Diakra (Diacre)</option>
                  <option value="Mpitahiry vola">Mpitahiry vola (Trésorier)</option>
                  <option value="Mpihira chorale">Mpihira chorale (Choriste)</option>
                  <option value="Mpampianatra sekoly alahady">Mpampianatra sekoly alahady</option>
                  <option value="Tanora">Tanora (Jeunesse)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-750 text-white font-bold py-3 rounded-xl shadow cursor-pointer text-sm"
                >
                  Hampiditra ho Membra
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
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
