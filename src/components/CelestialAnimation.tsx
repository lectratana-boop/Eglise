import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import jesusGlorious from '../assets/images/jesus_glorious_1780573486313.png';

interface CelestialAnimationProps {
  onComplete: () => void;
}

export default function CelestialAnimation({ onComplete }: CelestialAnimationProps) {
  const [secondsLeft, setSecondsLeft] = useState(15);

  useEffect(() => {
    // 15 seconds celestial countdown
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 15000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  // Generate gentle ambient floating sparkles mimicking a divine sky
  const goldSparkles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    xStart: Math.random() * 100,
    yStart: 70 + Math.random() * 30, // Start from the lower portion of clouds/earth
    size: 1.5 + Math.random() * 3.5,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 8,
    drift: (Math.random() - 0.5) * 40
  }));

  return (
    <div className="relative w-full h-full bg-[#050402] overflow-hidden select-none flex flex-col items-center justify-center">
      
      {/* 1. SEAMLESS REVEAL FADE AND BACKGROUND ZOOM */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          {/* Ken Burns effect: Slow dramatic zoom and rise matching epic visual depth */}
          <motion.div
            initial={{ scale: 1.25, y: 15 }}
            animate={{ 
              scale: 1.02, 
              y: -5,
              filter: ["brightness(0.9) contrast(1.02)", "brightness(1.1) contrast(1.05)", "brightness(1.02) contrast(1.02)"] 
            }}
            transition={{ 
              duration: 15, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={jesusGlorious}
              alt="Glorious Appearance of Jesus Christ in Heaven"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* 2. ATMOSPHERIC GOLDEN GOD-RAYS AND VOLUMETRIC GLOWS */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden">
        {/* Soft center-top divine focus glow */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-amber-100/25 rounded-full blur-[60px] animate-pulse" />
        
        {/* Moving ethereal vertical gold ray overlays */}
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.65, 0.3],
            x: [-15, 15, -15],
            rotate: [-1, 1, -1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent blur-xl"
        />

        <motion.div 
          animate={{ 
            opacity: [0.15, 0.45, 0.15],
            x: [20, -20, 20],
            rotate: [2, -2, 2]
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-200/5 to-transparent blur-2xl"
        />
      </div>

      {/* 3. ASCENDING CELESTIAL AMBIENT PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {goldSparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 0, 
              y: "100%", 
              x: `${sparkle.xStart}%` 
            }}
            animate={{ 
              opacity: [0, 0.9, 0.9, 0],
              y: ["85%", "15%"],
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
            className="absolute rounded-full bg-gradient-to-b from-amber-100 to-amber-200 shadow-[0_0_8px_rgba(252,211,77,0.8)]"
            style={{
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
          />
        ))}
      </div>

      {/* 4. CLINICAL CINEMATIC END FADE OVERLAY */}
      {/* Starting at 13.5s, the screen gently darkens to black to prepare for seamless app entry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: secondsLeft <= 1.5 ? 1 : 0 
        }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="absolute inset-0 bg-black pointer-events-none z-30"
      />

    </div>
  );
}
