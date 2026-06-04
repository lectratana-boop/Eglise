import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CelestialAnimationProps {
  onComplete: () => void;
}

export default function CelestialAnimation({ onComplete }: CelestialAnimationProps) {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Stage 1: Divine sky reveals, angels appear (0s - 4s)
    // Stage 2: Celestial light shines, Jesus appears in radiency (4s - 10s)
    // Stage 3: Christians kneel down on the hill below in awe, particles ascend (10s - 14s)
    // Stage 4: Gentle celestial transition (14s - 15s)
    const timers = [
      setTimeout(() => setPhase(2), 3500),
      setTimeout(() => setPhase(3), 7500),
      setTimeout(() => onComplete(), 15000)
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  // Generate 25 floating sparkling celestial particles
  const particles = Array.from({ length: 28 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 7,
    size: 2 + Math.random() * 4,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 20}%`
  }));

  // Generate angels around the divine presence
  const angels = [
    { id: 1, x: -75, y: -40, scale: 0.6, delay: 1, angle: -25 },
    { id: 2, x: 75, y: -20, scale: 0.55, delay: 1.8, angle: 20 },
    { id: 3, x: -110, y: 15, scale: 0.5, delay: 2.5, angle: -15 },
    { id: 4, x: 110, y: 35, scale: 0.45, delay: 3.2, angle: 15 },
    { id: 5, x: -140, y: -80, scale: 0.4, delay: 4.1, angle: -35 },
    { id: 6, x: 140, y: -70, scale: 0.45, delay: 4.8, angle: 30 },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#090b16] via-[#101430] to-[#1a1429] flex flex-col items-center justify-between overflow-hidden select-none">
      
      {/* 1. CELESTIAL BACKGROUND & LIGHT GLOWS */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Divine Aurora / Nebulae background glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[120px] transition-opacity duration-1000" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-amber-200/10 rounded-full blur-[100px] transition-opacity duration-1000" />
        
        {/* Soft floating spiritual golden clouds */}
        <div className="absolute top-[20%] -left-10 w-48 h-20 bg-sky-300/5 blur-xl rounded-full animate-[pulse_6s_infinite_alternate]" />
        <div className="absolute top-[35%] -right-10 w-56 h-24 bg-purple-400/5 blur-xl rounded-full animate-[pulse_8s_infinite_alternate_2s]" />

        {/* Dynamic sunbeams / divine light rays emanating from center-top */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-25 mix-blend-screen animate-[spin_210s_linear_infinite]">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-amber-200/15">
            {Array.from({ length: 16 }).map((_, i) => {
              const startAngle = i * (360 / 16);
              const endAngle = startAngle + 11;
              return (
                <path
                  key={i}
                  d={`M 100 100 L ${100 + 100 * Math.cos((startAngle * Math.PI) / 180)} ${100 + 100 * Math.sin((startAngle * Math.PI) / 180)} L ${100 + 100 * Math.cos((endAngle * Math.PI) / 180)} ${100 + 100 * Math.sin((endAngle * Math.PI) / 180)} Z`}
                />
              );
            })}
          </svg>
        </div>

        {/* Sparkles ascending from earth to heaven */}
        <AnimatePresence>
          {phase >= 2 &&
            particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 150, x: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.8, 0],
                  y: -400,
                  x: Math.sin(p.id) * 35
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full bg-amber-200/60 shadow-[0_0_8px_rgba(253,230,138,0.8)] pointer-events-none"
                style={{
                  left: p.left,
                  bottom: p.bottom,
                  width: `${p.size}px`,
                  height: `${p.size}px`
                }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* 2. CHOSEN MAIN STAGE: JESUS AND THE ANGELS */}
      <div className="flex-1 w-full relative flex items-center justify-center">
        
        {/* Divine halo glow directly behind Jesus */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              transition={{ duration: 5, ease: "easeOut" }}
              className="absolute top-[12%] w-64 h-64 bg-radial from-amber-200/25 via-amber-300/5 to-transparent rounded-full filter blur-xl mix-blend-screen pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* ==================== JESUS FIGURE IN CELESTIAL SKY ==================== */}
        <div className="absolute top-[14%] flex flex-col items-center">
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 4.5, delay: 0.5, ease: "easeOut" }}
                className="relative flex flex-col items-center z-20"
              >
                {/* Visual Head Halo Ring */}
                <div className="w-14 h-14 rounded-full bg-amber-100/40 border-2 border-amber-200/90 blur-[1px] absolute -top-4 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
                
                {/* SVG silhouette representing Jesus with Open Outstretched Arms, radiating gold/white divinity */}
                <svg
                  viewBox="0 0 160 220"
                  className="w-48 h-64 filter drop-shadow-[0_0_15px_rgba(254,243,199,0.9)] overflow-visible"
                >
                  <defs>
                    <radialGradient id="jesusGlow" cx="50%" cy="45%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="60%" stopColor="#fef3c7" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.75" />
                    </radialGradient>
                  </defs>
                  
                  {/* Jesus Form Outline */}
                  <g fill="url(#jesusGlow)">
                    {/* Head */}
                    <circle cx="80" cy="22" r="14" />
                    
                    {/* Hair / Beard Outline */}
                    <path d="M 68 20 C 65 24 64 30 68 36 C 72 40 88 40 92 36 C 96 30 95 24 92 20 Z" opacity="0.85" />
                    
                    {/* Torso & Long Flowing Celestial Robe */}
                    <path d="M 74 38 Q 80 34 86 38 L 98 90 L 115 195 C 105 204 55 204 45 195 L 62 90 Z" />
                    
                    {/* Left Arm Outspoken (Offering path of peace) */}
                    <path d="M 69 44 C 55 45 30 52 14 62 C 10 65 11 70 15 70 C 24 68 46 60 64 54 Z" />
                    
                    {/* Right Arm Outspoken (Inward beckon) */}
                    <path d="M 91 44 C 105 45 130 52 146 62 C 150 65 149 70 145 70 C 136 68 114 60 96 54 Z" />
                    
                    {/* Flowing Outer Shawl / Celestial drape detail */}
                    <path
                      d="M 68 45 Q 80 43 92 45 L 105 85 Q 80 92 55 85 Z"
                      fill="#ffffff"
                      opacity="0.9"
                    />
                    <path
                      d="M 55 85 L 42 160 Q 80 180 118 160 L 105 85 Z"
                      fill="url(#jesusGlow)"
                      opacity="0.9"
                    />
                  </g>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ==================== CELESTIAL ANGELS ORBITING ==================== */}
        <div className="absolute top-[20%] w-full max-w-[340px] h-[340px] pointer-events-none flex items-center justify-center">
          <AnimatePresence>
            {phase >= 1 &&
              angels.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.9, scale: a.scale }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 3.5,
                    delay: a.delay,
                    ease: "easeOut"
                  }}
                  className="absolute"
                  style={{
                    x: a.x,
                    y: a.y,
                    transform: `rotate(${a.angle}deg)`
                  }}
                >
                  {/* Floating wing waving style animation */}
                  <div className="relative animate-[bounce_4.5s_infinite_alternate] flex flex-col items-center" style={{ animationDelay: `${a.delay}s` }}>
                    {/* Angel Silhouette SVG with prominent flowing wings */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-16 h-16 fill-amber-100/80 drop-shadow-[0_0_8px_rgba(253,230,138,0.7)]"
                    >
                      {/* Left wing */}
                      <path
                        d="M 50 35 C 38 10 15 20 5 35 C 10 50 25 45 50 45 Z"
                        className="animate-[pulse_2s_infinite]"
                        style={{ transformOrigin: "50px 45px" }}
                      />
                      {/* Right wing */}
                      <path
                        d="M 50 35 C 62 10 85 20 95 35 C 90 50 75 45 50 45 Z"
                        className="animate-[pulse_2s_infinite]"
                        style={{ transformOrigin: "50px 45px" }}
                      />
                      {/* Angel Center Body */}
                      <circle cx="50" cy="22" r="7" />
                      <path d="M 46 30 Q 50 27 54 30 L 62 65 C 55 68 45 68 38 65 Z" />
                      {/* Subtle Halo */}
                      <circle cx="50" cy="11" r="9" stroke="#fef3c7" strokeWidth="1" fill="none" opacity="0.8" />
                    </svg>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

      </div>

      {/* 3. EARTHLY HILL AND KNEELING CHRISTIANS AT THE BOTTOM */}
      <div className="w-full relative min-h-[170px] pointer-events-none flex items-end">
        
        {/* Soft mountain silhouette on bottom layer */}
        <div className="absolute inset-x-0 bottom-[-5px] h-36 bg-gradient-to-t from-[#0e0c15] via-[#100d1a] to-transparent shrink-0 opacity-80" />
        
        {/* Primary foreground landscape hill */}
        <svg
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          className="absolute bottom-[-2px] w-full h-24 fill-[#07050d] z-25"
        >
          <path d="M 0 120 L 0 50 Q 110 20 200 45 Q 290 60 400 35 L 400 120 Z" />
        </svg>

        {/* ==================== KNEELING CHRISTIANS SILHOUETTES ==================== */}
        <div className="absolute bottom-[10px] w-full px-8 z-30 flex justify-around items-end">
          <AnimatePresence>
            {phase >= 2 && (
              <>
                {/* Christian 1: Left Kneeling, looking up in prayerful hands */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  transition={{ duration: 3, delay: 0.8, ease: "easeOut" }}
                  className="w-10 h-14"
                >
                  <svg viewBox="0 0 60 90" className="w-full h-full fill-[#05040a] filter drop-shadow-[0_-1px_3px_rgba(253,230,138,0.25)]">
                    {/* Head tilted backwards */}
                    <circle cx="28" cy="18" r="7" />
                    {/* Kneeling prayerful torso & arms reaching forwards up */}
                    <path d="M 28 25 C 23 27 18 35 18 42 L 18 68 C 18 73 10 75 8 83 L 52 83 Q 50 63 32 45 Z" />
                    {/* Hands clasped together high */}
                    <path d="M 26 27 C 29 27 38 23 44 19 C 45 18 43 14 40 16 C 35 19 28 24 25 25" />
                  </svg>
                </motion.div>

                {/* Christian 2: Left-Center, Kneeling fully with hands raised wide open to heaven */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 3, delay: 1.5, ease: "easeOut" }}
                  className="w-11 h-13 mb-1"
                >
                  <svg viewBox="0 0 60 90" className="w-full h-full fill-[#05040a] filter drop-shadow-[0_-1px_3px_rgba(253,230,138,0.3)]">
                    {/* Head looking straight up */}
                    <circle cx="30" cy="19" r="6.5" />
                    {/* Main kneeling outline */}
                    <path d="M 30 25 C 25 28 21 34 21 44 L 21 68 C 19 72 11 76 11 81 L 49 81 C 49 76 41 72 39 68 L 39 44 C 39 34 35 28 30 25" />
                    {/* Left hand elevated wide */}
                    <path d="M 23 29 C 14 26 7 14 4 11 C 2 10 0 12 3 15 C 8 20 18 32 23 35" />
                    {/* Right hand elevated wide */}
                    <path d="M 37 29 C 46 26 53 14 56 11 C 58 10 60 12 57 15 C 52 20 42 32 37 35" />
                  </svg>
                </motion.div>

                {/* Christian 3: Center-Right, Humbling face down/prostrating in absolute devotion */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  transition={{ duration: 3.5, delay: 2.2, ease: "easeOut" }}
                  className="w-14 h-9"
                >
                  <svg viewBox="0 0 90 60" className="w-full h-full fill-[#05040a] filter drop-shadow-[0_-1px_3px_rgba(253,230,138,0.2)]">
                    {/* Torso hunched over low to ground */}
                    <path d="M 12 55 C 10 50 18 30 35 25 C 50 22 75 35 85 55 Z" />
                    {/* Head bowed down resting */}
                    <circle cx="16" cy="34" r="6" />
                    {/* Arms folded reaching forward flat on earth */}
                    <path d="M 18 38 C 15 38 10 44 2 52 C 0 54 2 56 6 54 C 11 50 20 42 22 41" />
                  </svg>
                </motion.div>

                {/* Christian 4: Far-Right, Kneeling with tilted upward face, hands folded on chest */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 3, delay: 1.1, ease: "easeOut" }}
                  className="w-9 h-14"
                >
                  <svg viewBox="0 0 60 90" className="w-full h-full fill-[#05040a] filter drop-shadow-[0_-1px_3px_rgba(253,230,138,0.25)]">
                    {/* Head raised back */}
                    <circle cx="26" cy="20" r="7" />
                    {/* Torso & hips kneeling */}
                    <path d="M 26 27 C 22 30 18 36 18 45 L 18 69 C 18 73 11 76 9 82 L 48 82 Q 46 62 31 42 Z" />
                    {/* Arms folded securely over center chest */}
                    <path d="M 26 28 Q 18 33 22 45 Q 26 48 30 40 Q 32 32 26 28" opacity="0.95" />
                  </svg>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Gentle Celestial Light Beam overlay */}
      <div className="absolute inset-0 bg-transparent pointer-events-none mix-blend-color-dodge">
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[350px] h-full bg-gradient-to-b from-amber-200/20 via-sky-300/10 to-transparent blur-2xl animate-[pulse_7s_infinite_alternate]" />
      </div>

    </div>
  );
}
