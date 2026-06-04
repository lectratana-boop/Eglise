/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FinancialRecord, ChurchProject, Member } from '../types';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Target, 
  Calendar, 
  User, 
  ShieldAlert, 
  Check, 
  Info, 
  Eye, 
  Edit3,
  Bookmark,
  Sparkles,
  Award
} from 'lucide-react';

interface GivingPageProps {
  churchId: string;
  loggedInMember: Member | null;
  isElderlyMode: boolean;
}

// Pre-populate mock database structures if none exist in localStorage
const INITIAL_PROJECTS: ChurchProject[] = [
  {
    id: "proj-1",
    churchId: "c-1",
    title: "⛪ Fananganana Fidirana Lehibe",
    description: "Fanampiana ho fanatsarana ny rindrina ivelany sy ny lavarangana fidirana an'ny fiangonana mba hanehoana ny voninahitr'Andriamanitra.",
    targetAmount: 5500000,
    raisedAmount: 3800000,
    status: 'mandeha'
  },
  {
    id: "proj-2",
    churchId: "c-1",
    title: "🔊 Fividianana Fanamafisam-peo vaovao",
    description: "Fitaovana fanamafisam-peo hiatrehana ny fotoam-pivavahana, fampiofanana ary fitoriana ny filazantsara.",
    targetAmount: 2500000,
    raisedAmount: 2500000,
    status: 'vitany'
  },
  {
    id: "proj-3",
    churchId: "c-1",
    title: "🪑 Solon-dabilio 50 ho an'ny Mpino",
    description: "Fividianana dabilio hazo kesika mafy hamenoana ny efitra ambony ho an'ny mpino vao tonga.",
    targetAmount: 3000000,
    raisedAmount: 1200000,
    status: 'mandeha'
  }
];

const INITIAL_FIN_RECORDS: FinancialRecord[] = [
  {
    id: "fin-1",
    churchId: "c-1",
    type: "tahiry",
    amount: 1450000,
    reason: "Adidy isam-bolana ho an'ny mpikambana rehetra (Adidy feno)",
    date: "2026-05-30",
    memberOrStaff: "Mpitantsoratra"
  },
  {
    id: "fin-2",
    churchId: "c-1",
    type: "tahiry",
    amount: 850000,
    reason: "Fanatitra tamin'ny fanompoam-pivavahana Alahady Maraina",
    date: "2026-05-31",
    memberOrStaff: "Mpamolavola"
  },
  {
    id: "fin-3",
    churchId: "c-1",
    type: "fandaniana",
    amount: 420000,
    reason: "Fividianana fitaovana fikojakojana ny jiro sy fanamafisam-peo",
    date: "2026-06-01",
    memberOrStaff: "Mpitandrina"
  }
];

export default function GivingPage({ churchId, loggedInMember, isElderlyMode }: GivingPageProps) {
  // Mode selection: 'tahirimbola' OR 'tanjona'
  const [activeTab, setActiveTab] = useState<'tahirimbola' | 'tanjona'>('tahirimbola');
  
  // Financial tab: 'tahiry' OR 'fandaniana'
  const [finType, setFinType] = useState<'tahiry' | 'fandaniana'>('tahiry');

  // Local states linked with persistence
  const [records, setRecords] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('mifandray_fin_records');
    return saved ? JSON.parse(saved) : INITIAL_FIN_RECORDS;
  });

  const [projects, setProjects] = useState<ChurchProject[]>(() => {
    const saved = localStorage.getItem('mifandray_church_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem('mifandray_fin_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('mifandray_church_projects', JSON.stringify(projects));
  }, [projects]);

  // Is Admin or Secretariat check
  const isAdminOrSecretStaff = loggedInMember?.roles?.some(r => 
    ['Mpitandrina', 'Secretaire', 'Mpitahiry vola', 'Admin', 'Président', 'Comité', 'Mpamolavola'].includes(r)
  ) || loggedInMember?.id === 'm-admin' || 
       ['Mpitandrina', 'Secretaire', 'Mpitahiry vola', 'Admin', 'Président', 'Comité'].includes(loggedInMember?.role || '');

  // --- Financial Form States ---
  const [finAmount, setFinAmount] = useState('');
  const [finReason, setFinReason] = useState('');
  const [finMember, setFinMember] = useState('');

  // --- Project Form States ---
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTarget, setProjTarget] = useState('');
  const [projRaised, setProjRaised] = useState('');
  const [projStatus, setProjStatus] = useState<'mandeha' | 'vitany'>('mandeha');

  // Edit / Add Raised amount directly states
  const [selectedProjForUpdate, setSelectedProjForUpdate] = useState<string | null>(null);
  const [additionalRaisedInput, setAdditionalRaisedInput] = useState('');

  // Math totals
  const currentChurchRecords = records.filter(r => r.churchId === churchId);
  const currentChurchProjects = projects.filter(p => p.churchId === churchId);

  const totalIncomings = currentChurchRecords
    .filter(r => r.type === 'tahiry')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutgoings = currentChurchRecords
    .filter(r => r.type === 'fandaniana')
    .reduce((sum, item) => sum + item.amount, 0);

  const netBalanceCaisse = totalIncomings - totalOutgoings;

  // Format utility
  const formattedMoney = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA', currencyDisplay: 'code' })
      .format(val)
      .replace('MGA', 'Ar');
  };

  // Add Finance record
  const handleAddFinRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(finAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("⚠️ Soraty tsara ny salan'ny vola miditra na mivoaka!");
      return;
    }
    if (!finReason.trim()) {
      alert("⚠️ Azafady nampidiro ny antony na fanazavana!");
      return;
    }

    const newRec: FinancialRecord = {
      id: `fin-${Date.now()}`,
      churchId,
      type: finType,
      amount: parsedAmount,
      reason: finReason.trim(),
      date: new Date().toISOString().split('T')[0],
      memberOrStaff: finMember.trim() || loggedInMember?.name || "Tsy fantatra anarana"
    };

    setRecords(prev => [newRec, ...prev]);
    setFinAmount('');
    setFinReason('');
    setFinMember('');
    alert("🙌 Voatahiry soa aman-tsara ny mombamomba ny vola vao nampidirina!");
  };

  // Delete Record
  const handleDeleteRecord = (id: string) => {
    if (!isAdminOrSecretStaff) {
      alert("🚫 Ny Secretaire na ny Mpitandrina ihany no mahazo alalana mamafa fidirana ao amin'ny caisse!");
      return;
    }
    if (confirm("Tena te-hamafa ity firaketana ara-bola ity tokoa ve ianao?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  // Add Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(projTarget);
    if (!projTitle.trim()) {
      alert("Soraty ny anaran'ny tetikasa!");
      return;
    }
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      alert("Mampidira tetim-bola kendrena marina!");
      return;
    }

    const newProj: ChurchProject = {
      id: `proj-${Date.now()}`,
      churchId,
      title: projTitle.trim(),
      description: projDesc.trim() || "Tsy misy fanazavana fanampiny.",
      targetAmount: parsedTarget,
      raisedAmount: parseFloat(projRaised) || 0,
      status: projStatus
    };

    setProjects(prev => [...prev, newProj]);
    setProjTitle('');
    setProjDesc('');
    setProjTarget('');
    setProjRaised('');
    alert("⛪ Voatahiry soa aman-tsara ny Tanjona / Tetikasa vaovao!");
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    if (!isAdminOrSecretStaff) {
      alert("🚫 Ny Secretaire na ny Mpitandrina ihany no mahazo alalana mamafa tanjona!");
      return;
    }
    if (confirm("Tena te-hamafa ity tetikasa ity tokoa ve ianao?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  // Add Raised progress directly
  const handleUpdateRaisedAmount = (projId: string) => {
    const additional = parseFloat(additionalRaisedInput);
    if (isNaN(additional) || additional <= 0) {
      alert("Soraty tsara ny vola ampiana!");
      return;
    }

    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        const nextRaised = Math.min(p.targetAmount, p.raisedAmount + additional);
        return {
          ...p,
          raisedAmount: nextRaised,
          status: nextRaised >= p.targetAmount ? 'vitany' : p.status
        };
      }
      return p;
    }));

    setAdditionalRaisedInput('');
    setSelectedProjForUpdate(null);
    alert("💵 Nampiana soa aman-tsara ny fandraisana anjara tamin'ity Tanjona ity!");
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Upper Mode Switcher - 3D Half colored tab buttons */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('tahirimbola')}
          className={`py-3 px-4 font-black transition-all cursor-pointer rounded-xl flex items-center justify-center gap-1.5 select-none ${
            activeTab === 'tahirimbola'
              ? 'btn-3d-violet scale-[1.03]'
              : 'bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-400 font-bold border-b border-slate-300 dark:border-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>VAINGA 1 : Tahirim-bola 📥</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tanjona')}
          className={`py-3 px-4 font-black transition-all cursor-pointer rounded-xl flex items-center justify-center gap-1.5 select-none ${
            activeTab === 'tanjona'
              ? 'btn-3d-amber scale-[1.03]'
              : 'bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-400 font-bold border-b border-slate-300 dark:border-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>VAINGA 2 : Tanjona 🎯</span>
        </button>
      </div>

      {activeTab === 'tahirimbola' ? (
        /* ================= TAHIRIM-BOLA SEGMENT ================= */
        <div className="space-y-5">
          
          {/* Quick Balance indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-400 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xl">
                📥
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400 block tracking-wider">Totalin'ny Tahiry (Fidirana)</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-300 font-mono">{formattedMoney(totalIncomings)}</span>
              </div>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-900 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/10 border border-rose-400 text-rose-600 rounded-xl flex items-center justify-center font-black text-xl">
                💸
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase text-rose-800 dark:text-rose-400 block tracking-wider">Fandaniana (Vola mivoaka)</span>
                <span className="text-sm font-black text-rose-700 dark:text-rose-300 font-mono">{formattedMoney(totalOutgoings)}</span>
              </div>
            </div>

            <div className="p-4 bg-violet-50 dark:bg-violet-950/20 border border-violet-250 dark:border-violet-900 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/10 border border-violet-400 text-violet-650 rounded-xl flex items-center justify-center font-black text-xl">
                ⚖️
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase text-violet-850 dark:text-violet-300 block tracking-wider">Tahiry Net (Ao amin'ny Caisse)</span>
                <span className={`text-sm font-black font-semi font-mono ${netBalanceCaisse >= 0 ? 'text-violet-600 dark:text-violet-400' : 'text-rose-600'}`}>
                  {formattedMoney(netBalanceCaisse)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Form for insertion : admin / secretaire authorized only */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-805 pb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-sm font-bold">
                    📝
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Fampidirana Ara-bola</h3>
                    <p className="text-[9.5px] text-slate-400">Tahiry sy Fandaniana (Vola Mivoaka) ny fiangonana</p>
                  </div>
                </div>

                {!isAdminOrSecretStaff ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-[11px] text-slate-500 leading-relaxed font-semibold">
                    🔑 Ny <strong>Mpitandrina</strong> na ny <strong>Secretaire</strong> ihany no nahazo lalana hampiditra vola mivoaka sy miditra ho an'ny Caisse. <br />
                    Mankasitraka indrindra!
                  </div>
                ) : (
                  <form onSubmit={handleAddFinRecord} className="space-y-3">
                    
                    {/* Choose Record direction */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-850">
                      <button
                        type="button"
                        onClick={() => setFinType('tahiry')}
                        className={`py-1.5 rounded-lg text-[10.5px] font-extrabold transition-all cursor-pointer ${
                          finType === 'tahiry'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        📥 Tahiry / Fidirana
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFinType('fandaniana')}
                        className={`py-1.5 rounded-lg text-[10.5px] font-extrabold transition-all cursor-pointer ${
                          finType === 'fandaniana'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        💸 Fandaniana (Mivoaka)
                      </button>
                    </div>

                    {/* Vola miditra/mivoaka (Amount) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">Vola mifanitsy (Ar) :</label>
                      <input
                        type="number"
                        required
                        value={finAmount}
                        onChange={(e) => setFinAmount(e.target.value)}
                        placeholder="Ohatra: 250000"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>

                    {/* Reason */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">Antony na Fanazavana fohy :</label>
                      <input
                        type="text"
                        required
                        value={finReason}
                        onChange={(e) => setFinReason(e.target.value)}
                        placeholder={finType === 'tahiry' ? "Ohatra: Adidy feno an'ny Volana" : "Ohatra: Solofana takajy fanamafisam-peo"}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 font-semibold overview-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>

                    {/* User / Responsible staff */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Mpitantana na Mpandoa adidy :</label>
                      <input
                        type="text"
                        value={finMember}
                        onChange={(e) => setFinMember(e.target.value)}
                        placeholder="Ohatra: Jaona (Secretaire)"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-805 dark:text-slate-150 outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-2 text-xs font-black uppercase text-white bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-750 hover:to-indigo-750 rounded-xl cursor-pointer shadow border-b-[3px] border-violet-800"
                    >
                      ✓ Tehirizina ao amin'ny Caisse
                    </button>

                  </form>
                )}

              </div>
            </div>

            {/* List of Transactions in the Caisse */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-xs sm:text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                  📜 Tatitra ara-bola farany (Caisse Transactions)
                </h3>

                {currentChurchRecords.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 italic text-xs">
                    Tsy misy tatitra ara-bola voasoratra.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto scrollbar-thin">
                    {currentChurchRecords.map((rec) => (
                      <div
                        key={rec.id}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                          rec.type === 'tahiry'
                            ? 'bg-emerald-50/20 border-emerald-100/65 dark:bg-emerald-950/5 dark:border-emerald-900/30'
                            : 'bg-rose-50/20 border-rose-100/65 dark:bg-rose-950/5 dark:border-rose-900/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-black text-sm ${
                          rec.type === 'tahiry' ? 'bg-emerald-200 dark:bg-emerald-950 text-emerald-805' : 'bg-rose-200 dark:bg-rose-950 text-rose-805'
                        }`}>
                          {rec.type === 'tahiry' ? '📥' : '💸'}
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {rec.reason}
                            </h4>
                            <span className={`text-xs font-black font-mono shrink-0 ${
                              rec.type === 'tahiry' ? 'text-emerald-600 dark:text-emerald-450' : 'text-rose-600 dark:text-rose-450'
                            }`}>
                              {rec.type === 'tahiry' ? '+' : '-'}{formattedMoney(rec.amount)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1.5 flex-wrap text-[10px] text-slate-450">
                            <span className="flex items-center gap-0.5 font-semibold">
                              <User className="w-3 h-3 text-slate-400" />
                              Andrapandray: {rec.memberOrStaff}
                            </span>
                            <span className="font-mono">
                              📅 {rec.date}
                            </span>
                          </div>
                        </div>

                        {isAdminOrSecretStaff && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hamafa ity firaketana ity"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ================= TANJONA (CHURCH PROJECTS) SEGMENT ================= */
        <div className="space-y-5">
          
          {/* Caisse display block at the top as requested */}
          <div className="p-5 bg-gradient-to-br from-violet-650 to-indigo-750 text-white rounded-3xl shadow-lg space-y-4">
            
            <div className="flex items-center justify-between border-b border-indigo-500/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-base">
                  🏦
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-200">KAISSA PAR TAPITRA (VALINY NY CAISSE)</h3>
                  <p className="text-[10px] text-indigo-300">Fikambanana ankapobeny manontolo ny fiangonana izao</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-black px-2 py-0.5 bg-emerald-500/30 text-emerald-300 rounded-full">
                  Caisse Active 🔑
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-0.5">
                <span className="text-[9.5px] uppercase font-bold text-slate-300">Fitongonan'ny Tahiry</span>
                <p className="text-lg font-black font-mono text-emerald-400">+{formattedMoney(totalIncomings)}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9.5px] uppercase font-bold text-slate-300">Fitongonan'ny Fandaniana</span>
                <p className="text-lg font-black font-mono text-rose-300">-{formattedMoney(totalOutgoings)}</p>
              </div>
              <div className="space-y-0.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">BALANCE NET ANKEHITRINY :</span>
                <p className="text-xl font-extrabold font-mono text-white leading-tight">{formattedMoney(netBalanceCaisse)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Create new project goal form (Admin/Secretaire helper) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-805 pb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-sm font-bold">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Hampiditra Tanjona Vaovao</h3>
                    <p className="text-[9.5px] text-slate-400">Tetikasa tian'ny fiangonana ho tanterahina</p>
                  </div>
                </div>

                {!isAdminOrSecretStaff ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                    🔑 Ny <strong>Mpitandrina</strong> na ny <strong>Secretaire</strong> ihany no afaka manampy Tanjona / Projet vaovao mba ho hitan'ny mpikambana rehetra sy hampiharana fandraisan'anjara.
                  </div>
                ) : (
                  <form onSubmit={handleAddProject} className="space-y-3">
                    
                    {/* Project Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">Anaran'ny Tetikasa :</label>
                      <input
                        type="text"
                        required
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        placeholder="Ohatra: Fividianana dabilio 🪑"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-extrabold outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Project Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">Fanazavana momba izany :</label>
                      <textarea
                        value={projDesc}
                        onChange={(e) => setProjDesc(e.target.value)}
                        placeholder="Inona avy ny hetsika hatao?..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-amber-500 h-16 resize-none"
                      />
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-extrabold text-slate-500 uppercase">Vola Kendrena (Ar) :</label>
                        <input
                          type="number"
                          required
                          value={projTarget}
                          onChange={(e) => setProjTarget(e.target.value)}
                          placeholder="Ohatra: 2000000"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] font-extrabold text-slate-500 uppercase">Vola efa voaray (Ar) :</label>
                        <input
                          type="number"
                          value={projRaised}
                          onChange={(e) => setProjRaised(e.target.value)}
                          placeholder="Ohatra: 500000"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-905 dark:text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-2 text-xs font-black uppercase text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-550 hover:to-amber-600 rounded-xl cursor-pointer shadow border-b-[3px] border-amber-700 font-black"
                    >
                      ✓ Mamorona Tanjona vaovao
                    </button>
                    
                  </form>
                )}

              </div>
            </div>

            {/* List of Church Projects */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4">
                
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-xs sm:text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                  🎯 Ny Tetikasa sy Tanjon'ny Fiangonana
                </h3>

                {currentChurchProjects.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 italic text-xs">
                    Tsy misy tanjona tian'ny fiangonana voasoratra.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[460px] overflow-y-auto scrollbar-thin">
                    {currentChurchProjects.map((proj) => {
                      const percent = Math.min(100, Math.round((proj.raisedAmount / proj.targetAmount) * 100));
                      
                      return (
                        <div
                          key={proj.id}
                          className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-3 relative overflow-hidden"
                        >
                          
                          {/* Banner or state flag badge */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-0.5">
                              <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white flex items-center gap-1">
                                {proj.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                                {proj.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                                proj.status === 'vitany'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450'
                                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-450'
                              }`}>
                                {proj.status === 'vitany' ? 'Vitany soa aman-tsara! 🎉' : 'Mbola mandeha ⚙️'}
                              </span>

                              {isAdminOrSecretStaff && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Progress bar container */}
                          <div className="space-y-1.5 pt-1">
                            
                            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-550">
                              <span>Salan'ny Vola efa voaray :</span>
                              <span className="font-mono text-xs text-slate-800 dark:text-white font-black">
                                {formattedMoney(proj.raisedAmount)} / <span className="text-slate-400">{formattedMoney(proj.targetAmount)}</span>
                              </span>
                            </div>

                            <div className="w-full h-3 border border-slate-200/50 dark:border-slate-900 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden relative">
                              <div
                                style={{ width: `${percent}%` }}
                                className={`h-full rounded-full transition-all duration-[800ms] ${
                                  percent >= 100
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                    : percent >= 50
                                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                                    : 'bg-gradient-to-r from-amber-400 to-amber-500'
                                }`}
                              />
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                              <span>Fidiran'ny fandraisan'anjara</span>
                              <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">{percent}%</span>
                            </div>
                          </div>

                          {/* Update contribution direct button for helper */}
                          {isAdminOrSecretStaff && (
                            <div className="border-t border-slate-200/50 dark:border-slate-900 pt-2.5 flex items-center justify-between gap-3 flex-wrap">
                              {selectedProjForUpdate === proj.id ? (
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <input
                                    type="number"
                                    value={additionalRaisedInput}
                                    onChange={(e) => setAdditionalRaisedInput(e.target.value)}
                                    placeholder="Ampio vola (Ar)..."
                                    className="w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg px-2 py-1 text-[11px] font-mono font-bold outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateRaisedAmount(proj.id)}
                                    className="py-1 px-3 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                                  >
                                    Fankatoavana
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProjForUpdate(null)}
                                    className="py-1 px-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-305 font-bold text-[10px] rounded-lg cursor-pointer"
                                  >
                                    C
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-[9.5px] italic text-slate-450 font-medium">Asio tamberom-vola voaray fanampiny :</span>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProjForUpdate(proj.id)}
                                    className="py-1 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-705 dark:text-slate-200 text-[10px] rounded-lg font-black transition-all cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3 shrink-0" />
                                    <span>Hiditra fanomezana tetikasa</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
