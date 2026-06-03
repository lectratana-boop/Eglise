import React from 'react';
import { Music } from 'lucide-react';

interface SongPageProps {
  isElderlyMode: boolean;
}

export default function SongPage({ isElderlyMode }: SongPageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl min-h-[350px] shadow-xs animate-fadeIn font-sans">
      <div className="bg-violet-100 dark:bg-violet-950/40 p-4 rounded-full text-violet-650 mb-3 shrink-0">
        <Music className="w-10 h-10" />
      </div>
      <h2 className={`${isElderlyMode ? 'text-3xl' : 'text-lg sm:text-xl'} font-extrabold text-slate-850 dark:text-slate-100`}>
        Fianarana Hira / Antoko Mpihira
      </h2>
      <p className={`${isElderlyMode ? 'text-lg' : 'text-xs sm:text-sm'} text-slate-455 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed`}>
        Malalaka ity takelaka ity hankatoavana fanovana hafa na hira/feon-kira any aoriana. Azonao ovana anarana na asiana zavatra hafa eto.
      </p>
    </div>
  );
}
