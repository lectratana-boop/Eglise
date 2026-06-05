import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
// @ts-ignore
import jesusGlorious from '../assets/images/jesus_glorious_1780573486313.png';

interface CelestialAnimationProps {
  onComplete: () => void;
}

export default function CelestialAnimation({ onComplete }: CelestialAnimationProps) {
  // Let the splash play for 30 seconds for test as requested
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 30000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Gentle, high-performance sparkling star particles (only 12 for perfect mobile framerate)
  const starsArray = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 80}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    size: 2 + Math.random() * 3,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 overflow-hidden select-none flex flex-col justify-between p-6 z-[9999] animate-fadeIn">
      
      {/* 1. KEYFRAME ANIMATION INJECTIONS WITH hardware-accelerated 'will-change' */}
      <style>{`
        @keyframes kenBurnsBack {
          0% { transform: scale(1.05) translateY(0); }
          50% { transform: scale(1.18) translateY(-1.5%); }
          100% { transform: scale(1.05) translateY(0); }
        }
        @keyframes rotateRays {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-kenBurnsBack {
          animation: kenBurnsBack 22s ease-in-out infinite;
          will-change: transform;
        }
        .animate-rotateRays {
          animation: rotateRays 40s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* 2. MAJESTIC HEAVENLY BACKGROUND with stunning new mountain waterfall and rotating volumetric rays */}
      <div className="absolute inset-0 z-0">
        {/* Beautiful high-resolution mountain waterfall background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 animate-kenBurnsBack"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80")' }} 
        />
        
        {/* Deep dark backdrop gradient blend over the waterfall photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/65 via-slate-950/80 to-slate-950 z-10" />

        {/* Soft volumetric light beams emanating from center */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 mix-blend-color-dodge animate-rotateRays pointer-events-none z-15"
             style={{
               backgroundImage: 'conic-gradient(from 0deg, transparent 0deg, rgba(224, 242, 254, 0.4) 30deg, transparent 60deg, rgba(224, 242, 254, 0.4) 120deg, transparent 150deg, rgba(167, 139, 250, 0.3) 210deg, transparent 240deg, rgba(224, 242, 254, 0.4) 300deg, transparent 330deg)'
             }}
        />

        {/* Outer deep vignette to focus on center */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-950 z-20" />
      </div>

      {/* 3. SHINING STAR PARTICLES */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {starsArray.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0.1, scale: 0.8 }}
            animate={{ 
              opacity: [0.1, 0.8, 0.1],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {/* HEADER COLOURED BRANDING & SKIP BUTTON */}
      <div className="w-full text-center pt-8 z-20 space-y-1.5 relative">
        {/* Instant Skip Button for easy developer testing */}
        <button 
          onClick={onComplete}
          className="absolute right-2 top-0 bg-white/10 hover:bg-white/15 active:scale-95 text-white/80 rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-widest border border-white/10 transition-all cursor-pointer shadow-sm"
        >
          Mandalo ➔
        </button>

        <div className="flex items-center justify-center gap-1 text-[9px] font-black uppercase text-sky-450 tracking-widest bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full inline-flex mx-auto">
          <Sparkles className="w-3 h-3 text-sky-450 animate-spin" />
          <span>Fitaizana ara-panahy</span>
        </div>
        <h1 className="text-2xl font-black tracking-[0.18em] text-white uppercase drop-shadow-lg">
          MIFANDRAY
        </h1>
        <p className="text-[10px] text-sky-305 font-mono tracking-wider uppercase font-bold">
          Fiangonana eto Madagascar
        </p>
      </div>

      {/* 4. THE GLORIOUS CENTERPIECE IMAGE - JESUS CHRIST IN HIGHLIGHTED GLORY WITH ZOOM */}
      <div className="relative w-full flex items-center justify-center z-20 h-56">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border border-sky-400/20 shadow-[0_0_40px_rgba(14,165,233,0.15)] bg-slate-950 flex items-center justify-center animate-kenBurnsBack">
          <img 
            src={jesusGlorious} 
            alt="Jésus" 
            className="w-full h-full object-cover opacity-85"
            draggable="false"
          />
          {/* Inner ring rays overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        </div>
      </div>

      {/* FOOTER MESSAGE & LOADING BAR */}
      <div className="w-full text-center pb-8 z-20 max-w-xs mx-auto space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-black text-slate-200 italic">
            "Izaho no lalana sy fahamarinana ary fiainana"
          </p>
          <p className="text-[9px] text-sky-300 uppercase tracking-wider font-bold">
            Jaona 14:6
          </p>
        </div>

        {/* Dynamic 30s progress loading bar to match testing duration */}
        <div className="space-y-1 text-center">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[140px] mx-auto border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 30, ease: "linear" }}
              className="h-full bg-gradient-to-r from-sky-450 to-indigo-500 rounded-full"
            />
          </div>
          <span className="text-[8px] uppercase text-sky-400/70 font-black tracking-widest block pt-1 animate-pulse">
            andrana (30s) • tsindrio "mandalo" raha hiditra
          </span>
        </div>
      </div>

    </div>
  );
}
