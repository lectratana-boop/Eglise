/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Donation } from '../types';
import { Heart, Landmark, Check, Coins, Gift, Sparkles, Trash2, Calendar } from 'lucide-react';

interface GivingPageProps {
  churchId: string;
  donations: Donation[];
  onAddDonation: (donation: Omit<Donation, 'id' | 'date'>) => void;
  isElderlyMode: boolean;
}

export default function GivingPage({
  churchId,
  donations,
  onAddDonation,
  isElderlyMode
}: GivingPageProps) {
  const [donor, setDonor] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'Dimy' | 'Fanatitra' | 'Fanampiny'>('Dimy');
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter donations belonging to this active church
  const filteredDonations = donations.filter(d => d.churchId === churchId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert("Mampidira vola marina azafady!");
      return;
    }

    onAddDonation({
      churchId,
      type,
      amount: parsedAmount,
      donor: donor.trim() || 'Tsy fantatra anarana (Anonyme)',
      method: 'Volan-tanana' // Default method as operator buttons are removed
    });

    setDonor('');
    setAmount('');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 4500);
  };

  const formattedMoney = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA', currencyDisplay: 'code' })
      .format(val)
      .replace('MGA', 'Ar');
  };

  // Helper: Adds quick amount cumulatively as requested
  const handleAddQuickAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  // Grouping helper by Week and Date
  const getGroupedByWeekAndDate = (categoryDonations: Donation[]) => {
    // Sort descending by date to see latest insertions first
    const sorted = [...categoryDonations].sort((a, b) => b.date.localeCompare(a.date));
    
    interface GroupedWeek {
      weekLabel: string;
      total: number;
      dates: {
        dateString: string;
        formattedDate: string;
        donations: Donation[];
      }[];
    }
    
    const weeklyData: GroupedWeek[] = [];
    
    for (const don of sorted) {
      const d = new Date(don.date);
      if (isNaN(d.getTime())) continue;
      
      // Calculate start of the week (Monday)
      const day = d.getDay();
      const diff = d.getDate() - (day === 0 ? 6 : day - 1);
      const Monday = new Date(d);
      Monday.setDate(diff);
      Monday.setHours(0, 0, 0, 0);
      
      const Sunday = new Date(Monday);
      Sunday.setDate(Monday.getDate() + 6);
      Sunday.setHours(23, 59, 59, 999);
      
      const padNum = (num: number) => String(num).padStart(2, '0');
      const formattedMonday = `${padNum(Monday.getDate())}/${padNum(Monday.getMonth() + 1)}/${Monday.getFullYear()}`;
      const formattedSunday = `${padNum(Sunday.getDate())}/${padNum(Sunday.getMonth() + 1)}/${Sunday.getFullYear()}`;
      const weekLabel = `Herinandro: ${formattedMonday} - ${formattedSunday}`;
      
      let weekObj = weeklyData.find(w => w.weekLabel === weekLabel);
      if (!weekObj) {
        weekObj = {
          weekLabel,
          total: 0,
          dates: []
        };
        weeklyData.push(weekObj);
      }
      
      weekObj.total += don.amount;
      
      // Group by date inside this week
      let dateObj = weekObj.dates.find(dt => dt.dateString === don.date);
      if (!dateObj) {
        const parts = don.date.split('-');
        const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : don.date;
        dateObj = {
          dateString: don.date,
          formattedDate,
          donations: []
        };
        weekObj.dates.push(dateObj);
      }
      
      dateObj.donations.push(don);
    }
    
    return weeklyData;
  };

  // Get data for each of the three requested categories
  const getCategoryDetails = (categoryKey: 'Dimy' | 'Fanatitra' | 'Fanampiny') => {
    const categoryDons = filteredDonations.filter(d => d.type === categoryKey);
    const grandTotal = categoryDons.reduce((sum, item) => sum + item.amount, 0);
    const groupedWeeks = getGroupedByWeekAndDate(categoryDons);
    return { grandTotal, groupedWeeks };
  };

  const dimyInfo = getCategoryDetails('Dimy');
  const fanatitraInfo = getCategoryDetails('Fanatitra');
  const hetsikaInfo = getCategoryDetails('Fanampiny');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT COLUMN: Donation Input Form (occupies 5 columns) */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-5">
          
          <div className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 p-2.5 rounded-xl shrink-0">
              <Heart className="w-6 h-6 fill-rose-100 dark:fill-rose-950" />
            </div>
            <div>
              <span className="text-[9px] font-mono py-0.5 px-2 bg-rose-105 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-full font-black uppercase tracking-wider">
                Fandraisana Fanomezana
              </span>
              <h2 className={`${isElderlyMode ? 'text-2xl' : 'text-base'} font-black text-slate-850 dark:text-slate-100 leading-tight mt-0.5`}>
                Manomeza amim-pifaliana
              </h2>
            </div>
          </div>

          {isSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/35 border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-305 p-3 rounded-r-xl flex items-center justify-between text-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-base">🙌</span>
                <p className="font-bold">
                  Mankasitraka! Voasoratra soa aman-tsara ny fanomezanao hiasana amin'ny asan'ny Tompo.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category selection */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Sokajy (Type)</span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-850">
                {(['Dimy', 'Fanatitra', 'Fanampiny'] as const).map((t) => {
                  const isSelected = type === t;
                  const label = t === 'Dimy' ? 'Dimy' : t === 'Fanatitra' ? 'Fanatitra' : 'Hetsika';
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      className={`py-2 rounded-lg text-xs font-extrabold text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-violet-600 to-indigo-650 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-850 dark:hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Donor input */}
            <div>
              <label className={`block font-black text-slate-700 dark:text-slate-350 mb-1 ${isElderlyMode ? 'text-base' : 'text-xs'}`}>
                Anarana / Fianakaviana (Nom/Famille)
              </label>
              <input
                type="text"
                value={donor}
                onChange={(e) => setDonor(e.target.value)}
                placeholder="Fianakaviana Rakoto (Anonyme raha avela banga)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
              />
            </div>

            {/* Price value amount input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`font-black text-slate-700 dark:text-slate-350 ${isElderlyMode ? 'text-base' : 'text-xs'}`}>
                  Vola ho aloa (Montant en Ar) *
                </label>
                {amount && (
                  <button
                    type="button"
                    onClick={() => setAmount('')}
                    className="text-[9.5px] font-black text-rose-650 hover:text-rose-700 cursor-pointer flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Fafao (Effacer)</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ampidiro ny sandany (Ar)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl py-3 pl-3 pr-8 text-sm text-slate-850 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 font-mono font-bold"
                />
                <span className="absolute right-3.5 top-3.5 text-xs font-mono font-black text-slate-400">Ar</span>
              </div>
            </div>

            {/* 3- Hisafidy haingana: met les bouton de 100Ar à 20 000Ar, cumulable cumulativement */}
            <div className="space-y-1.5 p-3 bg-slate-50/50 dark:bg-slate-955/30 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="block text-[8.5px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                Kitiho hanampiana sora-bola haingana (Cumulatif Ar):
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 200, 500, 1000, 2000, 5000, 10000, 20000].map((sum) => (
                  <button
                    type="button"
                    key={sum}
                    onClick={() => handleAddQuickAmount(sum)}
                    className="py-1.5 px-1 bg-white hover:bg-slate-105 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-100 rounded-lg font-mono font-black text-[10px] border border-slate-200/60 dark:border-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-3xs"
                  >
                    +{sum}Ar
                  </button>
                ))}
              </div>
            </div>

            {/* Note about operator removal */}
            <div className="text-[9.5px] text-slate-400/90 dark:text-slate-450 leading-relaxed font-sans bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-850">
              ℹ️ Aloavy amin'ny mpihazona rakitra na mpiandraikitra ny vola on-site rehefa voasoratra eto.
            </div>

            {/* Submit Action Button */}
            <button
              id="btn-confirm-offering"
              type="submit"
              className={`w-full bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-xs border-b-[4px] border-rose-800 transition-all active:translate-y-[1.5px] active:border-b-0 cursor-pointer ${
                isElderlyMode ? 'py-3 text-lg' : 'py-2.5 text-xs'
              }`}
            >
              Hanome Izao ({type === 'Dimy' ? 'Dimy Ampahafolo' : type === 'Fanatitra' ? 'Fanatitra sy Rakitra' : 'Hetsika manokana'})
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: 3 Stacked Cards according to requested category (takes 7 columns) */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* 1. DIMY AMPAHAFOLO CARD (TOP) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Coins className="w-5 h-5" />
              <h3 className="font-black text-xs uppercase tracking-wide text-slate-850 dark:text-slate-100">
                Dimy Ampahafolo (Dîmes)
              </h3>
            </div>
            <div className="font-mono font-black text-sm text-slate-850 dark:text-white bg-amber-500/5 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/10">
              Total: {formattedMoney(dimyInfo.grandTotal)}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {dimyInfo.groupedWeeks.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic text-center py-6">Tsy misy dimy ampahafolo voarakitra eto.</p>
            ) : (
              dimyInfo.groupedWeeks.map((week) => (
                <div key={week.weekLabel} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200/30 dark:border-slate-850 pb-1">
                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 font-mono">{week.weekLabel}</span>
                    <span className="text-[9.5px] font-black text-amber-700 dark:text-amber-400 font-mono">Tontaliny: {formattedMoney(week.total)}</span>
                  </div>
                  
                  {week.dates.map((dt) => (
                    <div key={dt.dateString} className="space-y-1">
                      <div className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">{dt.formattedDate}</div>
                      <div className="space-y-1 pl-1">
                        {dt.donations.map((don) => (
                          <div key={don.id} className="flex justify-between items-center text-[10.5px]">
                            <span className="text-slate-705 dark:text-slate-300 font-bold truncate max-w-[140px]">{don.donor}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-slate-800 dark:text-slate-100">{formattedMoney(don.amount)}</span>
                              <span className="text-[8.5px] text-emerald-600 dark:text-emerald-450 font-black">Voaray ✔</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. FANATITRA SY RAKITRA CARD (CENTER) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Gift className="w-5 h-5" />
              <h3 className="font-black text-xs uppercase tracking-wide text-slate-850 dark:text-slate-100">
                Fanatitra sy Rakitra (Offrandes)
              </h3>
            </div>
            <div className="font-mono font-black text-sm text-slate-850 dark:text-white bg-emerald-500/5 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/10">
              Total: {formattedMoney(fanatitraInfo.grandTotal)}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {fanatitraInfo.groupedWeeks.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic text-center py-6">Tsy misy fanatitra voarakitra eto.</p>
            ) : (
              fanatitraInfo.groupedWeeks.map((week) => (
                <div key={week.weekLabel} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200/30 dark:border-slate-850 pb-1">
                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 font-mono">{week.weekLabel}</span>
                    <span className="text-[9.5px] font-black text-emerald-700 dark:text-emerald-400 font-mono">Tontaliny: {formattedMoney(week.total)}</span>
                  </div>
                  
                  {week.dates.map((dt) => (
                    <div key={dt.dateString} className="space-y-1">
                      <div className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">{dt.formattedDate}</div>
                      <div className="space-y-1 pl-1">
                        {dt.donations.map((don) => (
                          <div key={don.id} className="flex justify-between items-center text-[10.5px]">
                            <span className="text-slate-705 dark:text-slate-300 font-bold truncate max-w-[140px]">{don.donor}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-slate-800 dark:text-slate-100">{formattedMoney(don.amount)}</span>
                              <span className="text-[8.5px] text-emerald-600 dark:text-emerald-450 font-black">Voaray ✔</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. HETSIKA MANOKANA CARD (BOTTOM) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-black text-xs uppercase tracking-wide text-slate-850 dark:text-slate-100">
                Hetsika Manokana (Travaux/Spécial)
              </h3>
            </div>
            <div className="font-mono font-black text-sm text-slate-850 dark:text-white bg-rose-500/5 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/10">
              Total: {formattedMoney(hetsikaInfo.grandTotal)}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {hetsikaInfo.groupedWeeks.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic text-center py-6">Tsy misy hetsika manokana voarakitra eto.</p>
            ) : (
              hetsikaInfo.groupedWeeks.map((week) => (
                <div key={week.weekLabel} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200/30 dark:border-slate-850 pb-1">
                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 font-mono">{week.weekLabel}</span>
                    <span className="text-[9.5px] font-black text-rose-700 dark:text-rose-400 font-mono">Tontaliny: {formattedMoney(week.total)}</span>
                  </div>
                  
                  {week.dates.map((dt) => (
                    <div key={dt.dateString} className="space-y-1">
                      <div className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">{dt.formattedDate}</div>
                      <div className="space-y-1 pl-1">
                        {dt.donations.map((don) => (
                          <div key={don.id} className="flex justify-between items-center text-[10.5px]">
                            <span className="text-slate-705 dark:text-slate-300 font-bold truncate max-w-[140px]">{don.donor}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-slate-800 dark:text-slate-100">{formattedMoney(don.amount)}</span>
                              <span className="text-[8.5px] text-emerald-600 dark:text-emerald-450 font-black">Voaray ✔</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
