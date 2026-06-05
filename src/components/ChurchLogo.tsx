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
      ? "w-full h-80 sm:h-96 max-w-full" 
      : "w-full h-[180px] sm:h-[220px] max-w-full";
      
    return (
      <div className={`relative flex flex-col items-center justify-start p-3 bg-white rounded-3xl border border-slate-150 shadow-xs ${className}`}>
        {/* Toggle Expand Button inside the logo card, right side */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-250 cursor-pointer active:scale-95 transition-all flex items-center justify-center shadow-xs z-10"
          title={isExpanded ? "Hanameloka" : "Agrandir"}
        >
          {isExpanded ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Elegant original gold church logo on its native spacious white background */}
        <div className={`transition-all duration-300 flex items-center justify-center bg-white ${sizeClass}`}>
          <img
            src={churchLogo}
            alt="Fiangonana Protestanta Fihavaozana (F.P.Fi)"
            className="w-full h-full object-contain rounded-2xl bg-white"
          />
        </div>
      </div>
    );
  }

  // Horizontal layout for header representation
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className={`bg-white rounded-lg p-0.5 border border-slate-150 ${badgeSize} flex items-center justify-center overflow-hidden`}>
        <img
          src={churchLogo}
          alt="F.P.Fi"
          className="max-w-full max-h-full object-contain bg-white"
        />
      </div>
    </div>
  );
}
