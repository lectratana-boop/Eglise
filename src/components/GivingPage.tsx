/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Donation } from '../types';
import { Heart, Landmark, Plus, DollarSign, History, Check, Info } from 'lucide-react';

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
  const [method, setMethod] = useState<'MVola' | 'Orange Money' | 'Airtel Money' | 'Volan-tanana'>('MVola');
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
      method
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Giving Form panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 sm:p-8 space-y-6">
          
          <div className="flex items-start gap-4">
            <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 p-3 rounded-xl">
              <Heart className="w-8 h-8 fill-rose-100 dark:fill-rose-950" />
            </div>
            <div>
              <span className="text-xs font-mono py-1 px-2.5 bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded-full font-semibold uppercase tracking-wider">
                Sorona Fanao
              </span>
              <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-2xl'} font-bold text-slate-800 dark:text-slate-100 mt-1`}>
                Manomeza amim-pifaliana
              </h2>
              <p className={`${isElderlyMode ? 'text-lg' : 'text-sm'} text-slate-500 dark:text-slate-400 mt-1`}>
                "Tsy amin'ny alahelo, na amin'ny fanerena; fa ny mpanome amin'ny fifaliana no tian'Andriamanitra." (2 Korintiana 9:7)
              </p>
            </div>
          </div>

          {isSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/35 border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-305 p-4 rounded-r-xl flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🙌</span>
                <p className="text-sm font-semibold">
                  Mankasitraka indrindra! Voaray soa aman-tsara ny fanomezanao hiasana amin'ny asan'ny Tompo.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['Dimy', 'Fanatitra', 'Fanampiny'] as const).map((t) => {
                const label = t === 'Dimy' ? 'Dimy Ampahafolo (Dîme)' : t === 'Fanatitra' ? 'Fanatitra (Offrandes)' : 'Hetsika / Manokana';
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-3 px-3 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                      type === t
                        ? 'bg-violet-600 text-white border-violet-600 shadow-md translate-y-[-1px]'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block font-bold text-slate-700 dark:text-slate-300 mb-2 ${isElderlyMode ? 'text-xl' : 'text-sm'}`}>
                  Anarana feno / Fianakaviana
                </label>
                <input
                  type="text"
                  value={donor}
                  onChange={(e) => setDonor(e.target.value)}
                  placeholder="Ohatra: Fianakaviana Rakoto"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 transition-all text-base outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className={`block font-bold text-slate-700 dark:text-slate-300 mb-2 ${isElderlyMode ? 'text-xl' : 'text-sm'}`}>
                  Vola ho aloa (Ar) *
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ar"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 transition-all text-base outline-none focus:ring-2 focus:ring-violet-500 font-mono font-bold"
                />
              </div>
            </div>

            {/* Quick Amount select */}
            <div>
              <span className="block text-xs font-bold text-slate-450 dark:text-slate-550 uppercase mb-2">
                Hisafidy haingana:
              </span>
              <div className="flex flex-wrap gap-2">
                {[10000, 20000, 50000, 100000].map((sum) => (
                  <button
                    type="button"
                    key={sum}
                    onClick={() => setAmount(sum.toString())}
                    className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300 rounded-lg font-mono font-bold text-xs border border-slate-200/50 dark:border-slate-700 cursor-pointer"
                  >
                    + {formattedMoney(sum)}
                  </button>
                ))}
              </div>
            </div>

            {/* Payments Selector in Madagascar */}
            <div>
              <label className={`block font-bold text-slate-700 dark:text-slate-300 mb-3 ${isElderlyMode ? 'text-xl' : 'text-sm'}`}>
                Fomba handoavana azy (Opérateur):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  { key: 'MVola', color: 'bg-yellow-450 border-yellow-350', logoText: 'M', text: 'MVola (Telma)' },
                  { key: 'Orange Money', color: 'bg-orange-500 border-orange-400', logoText: 'O', text: 'Orange Money' },
                  { key: 'Airtel Money', color: 'bg-rose-600 border-rose-500', logoText: 'A', text: 'Airtel Money' },
                  { key: 'Volan-tanana', color: 'bg-emerald-650 border-emerald-555', logoText: 'V', text: 'Cash / Hand' }
                ] as const).map((oper) => {
                  const isSelected = method === oper.key;
                  return (
                    <button
                      type="button"
                      key={oper.key}
                      onClick={() => setMethod(oper.key)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                        isSelected
                          ? `${oper.color} text-white shadow-md ring-2 ring-violet-500/20`
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md font-extrabold text-[10px] flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white text-slate-800' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {oper.logoText}
                      </span>
                      <span className="text-xs font-bold leading-tight mt-1">{oper.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              id="btn-confirm-offering"
              type="submit"
              className={`w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                isElderlyMode ? 'py-4 text-xl' : 'py-3.5 text-base'
              }`}
            >
              Hanome Izao ({type})
            </button>
          </form>
        </div>
      </div>

      {/* History panel */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5 space-y-4 h-full flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <History className="w-5 h-5 text-violet-600" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider">
              Tantara ny fanomezana
            </h3>
          </div>

          <div className="space-y-3.5 overflow-y-auto flex-1 max-h-[460px] pr-1.5 scrollbar-thin">
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                <Landmark className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">Tsy mbola misy fanomezana voasoratra.</p>
              </div>
            ) : (
              filteredDonations.map((don) => (
                <div
                  key={don.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        don.type === 'Dimy'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/20 dark:text-cyan-400'
                      }`}>
                        {don.type}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {don.donor}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {don.date} • {don.method}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {formattedMoney(don.amount)}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Voaray ✔
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-850 mt-auto shrink-0">
            <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">
              Tontaliny voarain'ny Fiangonana:
            </span>
            <div className="font-mono font-extrabold text-xl text-violet-600 dark:text-violet-400">
              {formattedMoney(filteredDonations.reduce((acc, curr) => acc + curr.amount, 0))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
