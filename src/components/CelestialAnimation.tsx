import React, { useEffect } from 'react';
import { motion } from 'motion/react';
// @ts-ignore
import churchLogo from '../assets/images/church_logo_1780395512214.png';

interface CelestialAnimationProps {
  onComplete: () => void;
}

export default function CelestialAnimation({ onComplete }: CelestialAnimationProps) {
  // Respect general user's custom splash duration, with convenient "Mandalo" skip button
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-white overflow-hidden select-none flex flex-col justify-between p-8 z-[9999] animate-fadeIn">
      
      {/* Style for clean loading animation bar */}
      <style>{`
        @keyframes indeterminate-loading {
          0% { left: -35%; right: 100%; }
          60% { left: 100%; right: -90%; }
          100% { left: 100%; right: -90%; }
        }
        @keyframes indeterminate-loading-short {
          0% { left: -200%; right: 100%; }
          60% { left: 107%; right: -8%; }
          100% { left: 107%; right: -8%; }
        }
        .animate-load-bar {
          position: absolute;
          background-color: #d97706; /* Golden amber matching the logo */
          top: 0;
          bottom: 0;
          will-change: left, right;
          animation: indeterminate-loading 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        }
        .animate-load-bar-short {
          position: absolute;
          background-color: #f59e0b;
          top: 0;
          bottom: 0;
          will-change: left, right;
          animation: indeterminate-loading-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
          animation-delay: 1.15s;
        }
      `}</style>

      {/* Spacer */}
      <div className="w-full flex justify-end">
        <button 
          onClick={onComplete}
          className="bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-500 rounded-full px-4 py-1.5 text-[11px] uppercase font-bold tracking-widest border border-slate-200 transition-all cursor-pointer shadow-xs"
        >
          Mandalo ➔
        </button>
      </div>

      {/* Main Container - centering the EXACT, unmodified church logo */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-full max-h-[55vh] flex items-center justify-center bg-white"
        >
          <img 
            src={churchLogo} 
            alt="F.P.Fi" 
            className="w-full h-full max-w-xs sm:max-w-sm object-contain"
            draggable="false"
          />
        </motion.div>
      </div>

      {/* Minimalistic, clean loading progress bar at the bottom */}
      <div className="w-full flex flex-col items-center justify-center gap-3 pb-8">
        <div className="relative w-36 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="animate-load-bar rounded-full" />
          <div className="animate-load-bar-short rounded-full" />
        </div>
        <span className="text-[9px] uppercase text-slate-400 font-bold tracking-widest block pt-0.5">
          Andeha hidirana...
        </span>
      </div>

    </div>
  );
}
