/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member } from '../types';
import { Search, Plus, Phone, User, MapPin, Briefcase, X, PhoneCall, Trash2, Edit2, CheckSquare, Square } from 'lucide-react';

interface MembersPageProps {
  churchId: string;
  members: Member[];
  churchRoles: string[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (id: string, updatedFields: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
  isElderlyMode: boolean;
}

export default function MembersPage({
  churchId,
  members,
  churchRoles,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  isElderlyMode
}: MembersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration Form State
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [photo, setPhoto] = useState('');

  // Editing Form State
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editSelectedRoles, setEditSelectedRoles] = useState<string[]>([]);
  const [editPhoto, setEditPhoto] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("⚠️ Lehibe loatra ny sary! Misafidiana sary latsaky ny 2MB azafady.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isEdit) {
          setEditPhoto(result);
        } else {
          setPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesChurch = m.churchId === churchId;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.phone.includes(searchQuery);
    return matchesChurch && matchesSearch;
  });

  const handleRegisterRoleToggle = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(prev => prev.filter(r => r !== roleName));
    } else {
      setSelectedRoles(prev => [...prev, roleName]);
    }
  };

  const handleEditRoleToggle = (roleName: string) => {
    if (editSelectedRoles.includes(roleName)) {
      setEditSelectedRoles(prev => prev.filter(r => r !== roleName));
    } else {
      setEditSelectedRoles(prev => [...prev, roleName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Fenoy ny anarana sy laharana finday azafady!");
      return;
    }

    if (selectedRoles.length === 0) {
      alert("Mifidiana andraikitra na sampana farafahakeliny iray azafady!");
      return;
    }

    onAddMember({
      churchId,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || 'Tsy voasoratra ny adiresy',
      role: selectedRoles.join(', '), // Comma-separated presentation for backward compatibility
      roles: selectedRoles, // Array storage for modular access
      photo: photo || undefined
    });

    setName('');
    setPhone('');
    setAddress('');
    setSelectedRoles([]);
    setPhoto('');
    setIsAdding(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (!editName.trim() || !editPhone.trim()) {
      alert("Fenoy ny anarana sy laharana finday azafady!");
      return;
    }

    if (editSelectedRoles.length === 0) {
      alert("Mifidiana andraikitra na sampana farafahakeliny iray azafady!");
      return;
    }

    onUpdateMember(editingMember.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      role: editSelectedRoles.join(', '),
      roles: editSelectedRoles,
      photo: editPhoto || undefined
    });

    setEditingMember(null);
  };

  const startEdit = (m: Member) => {
    setEditingMember(m);
    setEditName(m.name);
    setEditPhone(m.phone);
    setEditAddress(m.address);
    // Backward-compatibility: parse from comma string if roles is not set
    const parsedRoles = m.roles || (m.role ? m.role.split(', ').map(r => r.trim()).filter(Boolean) : []);
    setEditSelectedRoles(parsedRoles);
    setEditPhoto(m.photo || '');
  };

  const [activeCallContact, setActiveCallContact] = useState<string | null>(null);

  const handleCallSimulation = (memberName: string) => {
    setActiveCallContact(memberName);
    setTimeout(() => {
      setActiveCallContact(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono py-1 px-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-350 rounded-full font-semibold uppercase tracking-wider">
            Sokajy Mpikambana
          </span>
          <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-850 dark:text-slate-100 mt-1.5`}>
            Lisitry ny Mpikambana
          </h2>
          <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-450 mt-1`}>
            Mitantana sy mikaroka ireo rahalahy sy anabavy rehetra eto amin'ny fiangonana.
          </p>
        </div>

        <button
          id="btn-register-member"
          onClick={() => {
            setSelectedRoles([]);
            setIsAdding(true);
          }}
          className={`flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow-md font-bold transition-all cursor-pointer ${
            isElderlyMode ? 'py-4 px-6 text-xl' : 'py-3 px-4 text-sm'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Hampiditra</span>
        </button>
      </div>

      {/* Pop-up Simulation when Calling */}
      {activeCallContact && (
        <div className="fixed inset-x-4 top-4 max-w-sm mx-auto bg-slate-950 border border-slate-800 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 z-50 animate-bounce">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-5 space-y-4">
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Karohy amin'ny anarana, andraikitra na finday..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-violet-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Members card layout - reduced to half size to view more members at once */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-400 dark:text-slate-500">
              <User className="w-10 h-10 mx-auto mb-1 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-semibold">Tsy nisy mpikambana voaray hita mifanaraka amin'ny fikarohanao.</p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const parsedRoles = member.roles || (member.role ? member.role.split(', ') : []);
              return (
                <div
                  id={`member-card-${member.id}`}
                  key={member.id}
                  className="p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-850 hover:shadow-sm transition-all flex flex-col justify-between gap-2 h-full text-left"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-violet-200 dark:border-violet-850 overflow-hidden shrink-0 bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] uppercase font-black text-violet-600 dark:text-violet-400">
                            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate" title={member.name}>
                          {member.name}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Flex wrap list of assigned roles (miniaturized) */}
                    <div className="flex flex-wrap gap-0.5">
                      {parsedRoles.length > 0 ? (
                        parsedRoles.slice(0, 2).map((roleName) => (
                          <span key={roleName} className="inline-flex items-center gap-0.5 text-[7.5px] bg-violet-50 dark:bg-violet-950/50 text-violet-650 dark:text-violet-350 px-1 py-0.5 rounded font-extrabold tracking-tight truncate max-w-full">
                            <Briefcase className="w-2 h-2 shrink-0" />
                            <span className="truncate max-w-[65px]">{roleName}</span>
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[7.5px] bg-slate-50 dark:bg-slate-900 text-slate-450 px-1 py-0.5 rounded font-extrabold">
                          Tsotra
                        </span>
                      )}
                      {parsedRoles.length > 2 && (
                        <span className="inline-flex items-center text-[7px] bg-amber-50 dark:bg-amber-950/30 text-amber-600 px-1 py-0.5 rounded font-black">
                          +{parsedRoles.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5 text-[9px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <p className="flex items-center gap-1 font-mono font-semibold truncate">
                        <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>{member.phone}</span>
                      </p>
                      <p className="flex items-center gap-1 truncate" title={member.address}>
                        <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="truncate">{member.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 border-t border-slate-100 dark:border-slate-800/60 pt-2 shrink-0">
                    <button
                      onClick={() => startEdit(member)}
                      className="flex-1 py-1 px-1.5 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-350 border border-slate-150 dark:border-slate-700 font-bold text-[8.5px] flex items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                      title="Hanova"
                    >
                      <Edit2 className="w-2.5 h-2.5 text-violet-600" />
                      <span>Hanova</span>
                    </button>
                    <button
                      onClick={() => onDeleteMember(member.id)}
                      className="py-1 px-1.5 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-[8.5px] flex items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-all border border-rose-100/60 dark:border-rose-900/30"
                      title="Hamafa"
                    >
                      <Trash2 className="w-2.5 h-2.5 text-rose-600" />
                      <span>Hamafa</span>
                    </button>
                    <button
                      onClick={() => handleCallSimulation(member.name)}
                      className="w-5 h-5 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 cursor-pointer border border-emerald-100 dark:border-emerald-900 absolute-none"
                      title="Hiantso finday"
                    >
                      <Phone className="w-2.5 h-2.5 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pop-up form to register a new member with Multi-select Roles */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-905/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-2xl w-full max-w-lg my-6 overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-black text-slate-850 dark:text-white text-lg leading-tight">
                  Hampiditra
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-400">
                  Ampidiro eto ny mombamomba azy sy ny andraikiny rehetra.
                </p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-450 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 scrollbar-thin">
              <div>
                <label className="block text-[10px] font-black text-slate-450 dark:text-slate-450 uppercase mb-1">
                  Anarana feno *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ohatra: Marie Rasoa..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-slate-100 outline-none text-xs font-semibold focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-450 dark:text-slate-450 uppercase mb-1">
                  Laharana Finday *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Laharana (Ohatra: 034 12 345 67)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-slate-100 outline-none text-xs font-semibold focus:ring-1 focus:ring-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-450 uppercase mb-1">
                  Adiresy / Toerana Fonenana
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ohatra: Isotry, rihana faha-2"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-slate-100 outline-none text-xs font-semibold focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* AMPIDIRO SARY (PHOTO INSERTION) */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-455 uppercase">
                  Sarin'ny Mpikambana (Insera Sary)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {photo ? (
                      <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, false)}
                      className="hidden"
                      id="member-photo-file-add"
                    />
                    <label
                      htmlFor="member-photo-file-add"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-xs transition-all select-none"
                    >
                      Mifidiana Sary 📤
                    </label>
                    {photo && (
                      <button
                        type="button"
                        onClick={() => setPhoto('')}
                        className="block text-[9px] text-red-500 font-extrabold hover:underline"
                      >
                        Fafao ny sary ✕
                      </button>
                    )}
                    <span className="block text-[8px] text-slate-400 leading-none mt-0.5 border-0">JPEG/PNG latsaky ny 2MB</span>
                  </div>
                </div>
              </div>

              {/* CHECKBOX ROLES LIST */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-black text-slate-450 dark:text-slate-450 uppercase">
                    Mifidiana Andraikitra sy Sampana (1 na maromaro) *
                  </label>
                  <span className="text-[10px] text-violet-650 dark:text-violet-400 font-black">
                    {selectedRoles.length} voafidy
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-3 bg-slate-50 dark:bg-slate-950/50 max-h-56 overflow-y-auto scrollbar-thin">
                  {churchRoles.map((roleName) => {
                    const isChecked = selectedRoles.includes(roleName);
                    return (
                      <button
                        type="button"
                        key={roleName}
                        onClick={() => handleRegisterRoleToggle(roleName)}
                        className={`p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-violet-100/70 border-violet-300 dark:bg-violet-950/30 dark:border-violet-800 text-violet-750 dark:text-violet-300 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/60 text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-350 shrink-0" />
                        )}
                        <span className="truncate">{roleName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex gap-2.5 shrink-0">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-md cursor-pointer text-xs"
                >
                  Hampiditra
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-705 dark:text-white font-black rounded-xl cursor-pointer text-xs"
                >
                  Hanafoana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pop-up form to EDIT existing member with Multi-select Roles */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-905/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-2xl w-full max-w-lg my-6 overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-black text-slate-850 dark:text-white text-lg leading-tight">
                  Hanova ny mombamomba an'i: {editingMember.name}
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-400">
                  Ovao eto ny anarana, lahany, adiresy, ary ireo andraikiny eto amin'ny fiangonana.
                </p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-450 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 overflow-y-auto flex-1 scrollbar-thin">
              <div>
                <label className="block text-[10px] font-black text-slate-455 dark:text-slate-450 uppercase mb-1">
                  Anarana feno *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-slate-100 outline-none text-xs font-semibold focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-455 dark:text-slate-450 uppercase mb-1">
                  Laharana Finday *
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-slate-100 outline-none text-xs font-semibold focus:ring-1 focus:ring-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-455 dark:text-slate-450 uppercase mb-1">
                  Adiresy / Toerana Fonenana
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-slate-100 outline-none text-xs font-semibold focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* HANAMPY SARY HANDOVANA (EDIT PHOTO) */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                <label className="block text-[10px] font-black text-slate-455 dark:text-slate-450 uppercase">
                  Hanova Sarin'ny Mpikambana (Insera Sary)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {editPhoto ? (
                      <img src={editPhoto} alt="Edit Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, true)}
                      className="hidden"
                      id="member-photo-file-edit"
                    />
                    <label
                      htmlFor="member-photo-file-edit"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-xs transition-all select-none"
                    >
                      Mifidiana Sary 📤
                    </label>
                    {editPhoto && (
                      <button
                        type="button"
                        onClick={() => setEditPhoto('')}
                        className="block text-[9px] text-red-500 font-extrabold hover:underline"
                      >
                        Fafao ny sary ✕
                      </button>
                    )}
                    <span className="block text-[8px] text-slate-400 leading-none mt-0.5 border-0">JPEG/PNG latsaky ny 2MB</span>
                  </div>
                </div>
              </div>

              {/* EDIT CHECKBOX ROLES LIST */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-black text-slate-455 dark:text-slate-450 uppercase">
                    Mifidiana Andraikitra sy Sampana (1 na maromaro) *
                  </label>
                  <span className="text-[10px] text-violet-650 dark:text-violet-400 font-black">
                    {editSelectedRoles.length} voafidy
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-3 bg-slate-50 dark:bg-slate-950/50 max-h-56 overflow-y-auto scrollbar-thin">
                  {churchRoles.map((roleName) => {
                    const isChecked = editSelectedRoles.includes(roleName);
                    return (
                      <button
                        type="button"
                        key={roleName}
                        onClick={() => handleEditRoleToggle(roleName)}
                        className={`p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-violet-100/70 border-violet-300 dark:bg-violet-950/30 dark:border-violet-800 text-violet-750 dark:text-violet-300 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/60 text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-350 shrink-0" />
                        )}
                        <span className="truncate">{roleName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex gap-2.5 shrink-0">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-md cursor-pointer text-xs"
                >
                  Tehirizina ny fanovana
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-705 dark:text-white font-black rounded-xl cursor-pointer text-xs"
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
