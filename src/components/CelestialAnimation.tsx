import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

const WATERFALL_IMAGES = [
  "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80", // Yosemite cascading waterfall
  "https://images.unsplash.com/photo-1432406845153-61488c7b6b9c?auto=format&fit=crop&w=1200&q=80", // Majestic mountain-side waterfall
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80", // Tropical jungle cascade
  "https://images.unsplash.com/photo-1470071449604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80", // High-altitude waterfall
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80"  // Beautiful forest falls
];

interface CelestialAnimationProps {
  onComplete: () => void;
}

export default function CelestialAnimation({ onComplete }: CelestialAnimationProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4.0); // Safe rapid 4-second cinematic loading
  const [isSkipped, setIsSkipped] = useState(false);

  // Rotate images in the slideshow every 900ms to showcase all 5 waterfalls within 4 seconds!
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % WATERFALL_IMAGES.length);
    }, 950);

    return () => clearInterval(imageInterval);
  }, []);

  // Safe countdown & completion trigger
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    const completeTimeout = setTimeout(() => {
      if (!isSkipped) {
        onComplete();
      }
    }, 4000); // Strict 4-second splash screen limit

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete, isSkipped]);

  const handleSkip = () => {
    setIsSkipped(true);
    onComplete();
  };

  // Generate gentle ambient floating water sparkles/mist
  const waterMistSparkles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    xStart: Math.random() * 100,
    yStart: 80 + Math.random() * 20,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 3,
    drift: -20 + Math.random() * 40
  }));

  // Progress Bar percentage calculation
  const progressPercent = Math.min(100, Math.max(0, ((4.0 - secondsLeft) / 4.0) * 100));

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none flex flex-col items-center justify-between p-6">
      
      {/* 1. DYNAMIC KEN BURNS SLIDESHOW KEYFRAME STYLE injection */}
      <style>{`
        @keyframes splashKenBurns {
          0% { transform: scale(1.0) translate(0, 0); }
          50% { transform: scale(1.15) translate(-1%, -0.5%); }
          100% { transform: scale(1.0) translate(0, 0); }
        }
        .animate-splashKenBurns {
          animation: splashKenBurns 18s ease-in-out infinite;
        }
      `}</style>

      {/* 2. CHUTE D'EAU BACKGROUND SLIDESHOW LAYER WITH KEN BURNS MOTION */}
      <div className="absolute inset-0 z-0">
        {WATERFALL_IMAGES.map((imgUrl, idx) => (
          <div
            key={imgUrl}
            style={{ backgroundImage: `url(${imgUrl})` }}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1100ms] ease-in-out ${
              activeImageIdx === idx 
                ? 'opacity-[0.72] scale-100 z-10 animate-splashKenBurns' 
                : 'opacity-0 scale-[1.04] z-0'
            }`}
          />
        ))}
        {/* Deep vignette overlay preserving high contrast of waterfall images without washing out inputs */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-slate-950/45 to-slate-950/90 z-20" />
      </div>

      {/* 3. FLOATING SPARKLING WATER MIST PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
        {waterMistSparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 0, 
              y: "100%", 
              x: `${sparkle.xStart}%` 
            }}
            animate={{ 
              opacity: [0, 0.85, 0.85, 0],
              y: ["90%", "20%"],
              x: [
                `${sparkle.xStart}%`, 
                `${sparkle.xStart + sparkle.drift / 2}%`, 
                `${sparkle.xStart + sparkle.drift}%`
              ]
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute rounded-full bg-sky-200/55 shadow-[0_0_6px_rgba(186,230,253,0.5)]"
            style={{
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
          />
        ))}
      </div>

      {/* HEADER SECTION */}
      <div className="w-full text-center pt-10 z-30 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[9px] font-black uppercase text-sky-305 border border-white/10 tracking-widest">
          <Sparkles className="w-3 h-3 text-sky-400 animate-spin" />
          Fandaharana Masina
        </span>
        <h1 className="text-2xl font-black tracking-widest text-white uppercase drop-shadow-md">
          MIFANDRAY
        </h1>
        <p className="text-[10px] text-sky-300 font-mono tracking-wider uppercase font-bold">
          Fiangonana eto Madagascar
        </p>
      </div>

      {/* MIDDLE SPIRITUAL WELCOME MESSAGES & PROGRESS LOADER */}
      <div className="w-full text-center z-30 max-w-xs space-y-6">
        <div className="p-4 rounded-2xl bg-slate-950/50 backdrop-blur-xs border border-white/5 space-y-2.5 shadow-sm">
          <p className="text-xs font-black text-white italic leading-relaxed">
            "Samy nandre fanehoana fitahiana ... fa ny loharanon'aina dia ao Aminy ihany."
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[9.5px] uppercase font-black tracking-wide text-slate-350">
            <span>Salamo sy hira fiderana</span>
          </div>
        </div>

        {/* PROGRESS INDICATOR ENGINE */}
        <div className="space-y-1.5 px-2">
          <div className="flex items-center justify-between text-[8.5px] uppercase font-bold text-slate-400">
            <span>Dihy sy fitsaboana loharano...</span>
            <span className="font-mono font-black text-sky-400">{Math.round(progressPercent)}%</span>
          </div>
          {/* Progress bar container */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-sky-400 via-violet-500 to-indigo-500 rounded-full transition-all duration-100 ease-out"
            />
          </div>
        </div>
      </div>

      {/* FOOTER & INSTANT ACTION SKIP BUTTON */}
      <div className="w-full text-center pb-8 z-30 max-w-xs space-y-4">
        <button
          type="button"
          onClick={handleSkip}
          className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 active:scale-[0.98] text-white flex items-center justify-center gap-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-indigo-600/20 border-b-2 border-indigo-700"
        >
          <span>Miditra avy hatrany ➔</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">
          Malagasy Web Dev Team • F.P.Fi
        </p>
      </div>

      {/* 4. SILENT EXIT FADE-TO-BLACK OVERLAY DURING LATE FRACTIONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: secondsLeft <= 0.6 ? 1 : 0 
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-slate-950 pointer-events-none z-40"
      />

    </div>
  );
}
