import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
// @ts-ignore
import churchLogo from '../assets/images/church_logo_1780395512214.png';

interface ChurchLogoProps {
  layout?: 'square' | 'horizontal';
  className?: string;
  badgeSize?: string;
}

export default function ChurchLogo({ layout = 'horizontal', className = '', badgeSize = 'h-9 w-9' }: ChurchLogoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (layout === 'square') {
    const sizeClass = isExpanded 
      ? "w-full h-96 max-w-full" 
      : "w-full h-[180px] sm:h-[220px] max-w-full";
      
    return (
      <div className={`relative flex flex-col items-center justify-start p-1.5 pt-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs ${className}`}>
        {/* Toggle Expand Button inside the logo card, right side */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-605 dark:text-slate-350 border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-all flex items-center justify-center shadow-xs z-10"
          title={isExpanded ? "Hanameloka" : "Agrandir"}
        >
          {isExpanded ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Generated elegant gold church logo */}
        <div className={`transition-all duration-300 flex items-center justify-center ${sizeClass}`}>
          <img
            src={churchLogo}
            alt="Fiangonana Protestante Fifohazana (F.P.Fi)"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white rounded-2xl"
          />
        </div>
      </div>
    );
  }

  // Horizontal layout for header representation
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className={`bg-white rounded-lg p-0.5 border border-slate-150 dark:border-slate-800 ${badgeSize} flex items-center justify-center overflow-hidden`}>
        <img
          src={churchLogo}
          alt="F.P.Fi"
          referrerPolicy="no-referrer"
          className="max-w-full max-h-full object-contain mix-blend-multiply"
        />
      </div>
    </div>
  );
}
