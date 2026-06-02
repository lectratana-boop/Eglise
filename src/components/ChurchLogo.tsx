import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ChurchLogoProps {
  layout?: 'square' | 'horizontal';
  className?: string;
  badgeSize?: string;
}

export default function ChurchLogo({ layout = 'horizontal', className = '', badgeSize = 'h-9 w-9' }: ChurchLogoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // SVG of the circular logo badge
  const LogoBadge = ({ size = badgeSize }: { size?: string }) => (
    <svg
      viewBox="0 0 200 200"
      className={`${size} shrink-0 select-none transition-all duration-300`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle Frame */}
      <circle cx="100" cy="100" r="92" stroke="#003366" strokeWidth="5.5" fill="none" />
      
      {/* Cross in center */}
      <rect x="93" y="18" width="14" height="65" fill="#003366" rx="1" />
      <rect x="65" y="34" width="70" height="14" fill="#003366" rx="1" />

      {/* House/Church Facade below Cross */}
      {/* Roof outline */}
      <polygon points="50,118 100,75 150,118 138,118 100,86 62,118" fill="#003366" />
      {/* Facade under roof */}
      <polygon points="62,118 138,118 138,138 62,138" fill="#003366" />
      {/* White window in church */}
      <rect x="91" y="99" width="18" height="20" fill="#FFFFFF" rx="2" />
      <line x1="100" y1="99" x2="100" y2="119" stroke="#003366" strokeWidth="2" />
      <line x1="91" y1="109" x2="109" y2="109" stroke="#003366" strokeWidth="2" />

      {/* Open Book (Bible) at bottom support */}
      <path
        d="M 100,152 C 78,136 44,136 20,147 L 20,158 C 44,147 78,147 100,162 C 122,147 156,147 180,158 L 180,147 C 156,136 122,136 100,152 Z"
        fill="#003366"
      />
      <line x1="100" y1="152" x2="100" y2="162" stroke="#003366" strokeWidth="3" />

      {/* Green Leaf Stem on Left */}
      <path
        d="M 62,143 C 44,121 26,105 45,74"
        fill="none"
        stroke="#46882E"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Leaf 1 */}
      <path d="M 45,74 C 36,77 24,84 21,95 C 31,95 40,89 45,74 Z" fill="#46882E" />
      {/* Leaf 2 */}
      <path d="M 40,89 C 29,91 17,101 22,112 C 31,110 38,103 40,89 Z" fill="#46882E" />
      {/* Leaf 3 */}
      <path d="M 46,111 C 37,113 29,124 35,134 C 43,131 47,122 46,111 Z" fill="#46882E" />
      {/* Leaf 4 */}
      <path d="M 43,101 C 49,97 58,92 64,103 C 59,109 51,109 43,101 Z" fill="#46882E" />

      {/* Green Madagascar Map Silhouette on Right */}
      <path
        d="M 148,58 Q 153,63 148,68 T 146,74 T 144,83 T 138,95 T 136,102 T 138,108 T 137,114 T 134,122 T 136,128 C 131,130 127,123 128,117 C 132,111 130,104 130,99 C 132,94 129,89 131,84 T 135,74 T 137,67 T 143,62 Z"
        fill="#46882E"
      />
    </svg>
  );

  if (layout === 'square') {
    const sizeClass = isExpanded 
      ? "h-28 w-28 xs:h-36 xs:w-36 sm:h-44 sm:w-44" 
      : "h-16 w-16 xs:h-20 xs:w-20 sm:h-24 sm:w-24";
      
    return (
      <div className={`relative flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-sm ${className}`}>
        {/* Toggle Expand Button inside the logo card, right side */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-[#003366] dark:text-sky-305 border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-all flex items-center justify-center shadow-xs z-10"
          title={isExpanded ? "Hanameloka" : "Agrandir"}
        >
          {isExpanded ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Big logo badge - using high-resolution crisp SVGs */}
        <LogoBadge size={sizeClass} />
        
        {/* Texts matching custom logo */}
        <div className="mt-3.5 space-y-1 select-none">
          <h2 className="text-xl font-extrabold tracking-[0.25em] text-[#003366] dark:text-blue-450 font-sans leading-none">
            FIANGONANA
          </h2>
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold tracking-[0.15em] text-[#46882E] dark:text-emerald-400">
            <span className="opacity-60">—</span>
            <span>ETO MADAGASIKARA</span>
            <span className="opacity-60">—</span>
          </div>
          <p className="text-[11px] font-medium italic text-slate-500 dark:text-slate-400 font-serif pt-1">
            Mivavaka <span className="text-[#46882E] mx-1">•</span> Mifankatia <span className="text-[#46882E] mx-1">•</span> Manompo
          </p>
        </div>
      </div>
    );
  }

  // Horizontal layout for header representation
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <LogoBadge />
      <div className="flex flex-col items-start leading-none">
        <h1 className="text-xs font-black tracking-[0.22em] text-[#003366] dark:text-sky-305 font-sans leading-none md:text-sm">
          FIANGONANA
        </h1>
        <div className="text-[7.5px] font-extrabold tracking-[0.08em] text-[#46882E] dark:text-emerald-400 mt-0.5 uppercase leading-none sm:text-[8px]">
          eto Madagasikara
        </div>
        <p className="text-[7px] text-slate-450 dark:text-slate-500 italic font-serif leading-none mt-0.5 hidden xs:block">
          Mivavaka • Mifankatia • Manompo
        </p>
      </div>
    </div>
  );
}
