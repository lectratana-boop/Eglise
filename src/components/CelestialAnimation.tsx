import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2, VolumeX, Play, Pause } from 'lucide-react';
// @ts-ignore
import jesusGlorious from '../assets/images/jesus_glorious_1780573486313.png';

interface CelestialAnimationProps {
  onComplete: () => void;
}

export default function CelestialAnimation({ onComplete }: CelestialAnimationProps) {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; delay: string; duration: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioUrlsRef = useRef<string[]>([
    'https://archive.org/download/alexandra_202102/Alexandra%20Burke%20-%20Hallelujah.mp3',
    'https://archive.org/download/hallelujah-alexandra-burke/Alexandra%20Burke%20-%20Hallelujah.mp3',
    'https://archive.org/download/alexandra-burke-hallelujah/Alexandra%20Burke%20-%20Hallelujah.mp3',
    'https://archive.org/download/alexandra_202102/Hallelujah.mp3',
    'https://archive.org/download/hallelujah-alexandra-burke/Hallelujah.mp3',
    'https://archive.org/download/hallelujah_201911/Alexandra%20Burke%20-%20Hallelujah.mp3',
    'https://archive.org/download/hallelujah_201911/Hallelujah.mp3',
    'https://archive.org/download/Hallelujah_703/Hallelujah.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  ]);
  const currentAudioIndexRef = useRef<number>(0);

  useEffect(() => {
    // Generate star coordinates on mount to avoid hydration mismatch
    const generated = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 3}s`,
      duration: `${Math.random() * 4 + 2}s`
    }));
    setStars(generated);

    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.85;
    audio.src = audioUrlsRef.current[currentAudioIndexRef.current];
    audioRef.current = audio;

    // Handle source load errors (404/503/CORS or failed resources)
    const handleError = () => {
      console.warn("Audio file failed to load:", audioUrlsRef.current[currentAudioIndexRef.current]);
      if (currentAudioIndexRef.current < audioUrlsRef.current.length - 1) {
        currentAudioIndexRef.current += 1;
        console.log("Switching to fallback audio source index:", currentAudioIndexRef.current);
        audio.src = audioUrlsRef.current[currentAudioIndexRef.current];
        audio.load();
        
        // Auto-resume playing on fallback if it was already playing
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };

    audio.addEventListener('error', handleError);

    // Fast autoplay attempt
    const attemptPlay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Autoplay blocked by browser policy. Showing interactive play cue.", err);
          setIsPlaying(false);
        });
    };

    audio.addEventListener('canplaythrough', attemptPlay);
    
    // Play on load and user click fallback
    const initTimer = setTimeout(attemptPlay, 1000);

    const timer = setTimeout(() => {
      onComplete();
    }, 45000); // 45 seconds

    return () => {
      audio.pause();
      audio.removeEventListener('canplaythrough', attemptPlay);
      audio.removeEventListener('error', handleError);
      clearTimeout(timer);
      clearTimeout(initTimer);
      audioRef.current = null;
    };
  }, [onComplete]);

  // Audio control toggle handlers
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Playback error, trying fallback source:", err);
          if (currentAudioIndexRef.current < audioUrlsRef.current.length - 1) {
            currentAudioIndexRef.current += 1;
            audioRef.current.src = audioUrlsRef.current[currentAudioIndexRef.current];
            audioRef.current.load();
            audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(e => console.error("Fallback target blocked:", e));
          } else {
            setIsPlaying(false);
          }
        });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    audioRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 overflow-hidden select-none flex flex-col justify-between p-8 z-[9999] animate-fadeIn text-white">
      
      {/* CSS Keyframes for celestial and loading animations */}
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
          background-color: #38bdf8; /* sky-400 */
          top: 0;
          bottom: 0;
          will-change: left, right;
          animation: indeterminate-loading 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        }
        .animate-load-bar-short {
          position: absolute;
          background-color: #0284c7; /* sky-600 */
          top: 0;
          bottom: 0;
          will-change: left, right;
          animation: indeterminate-loading-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
          animation-delay: 1.15s;
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-star {
          animation: star-twinkle var(--duration, 3s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.15); }
        }
        .animate-kenBurnsBack {
          animation: slow-zoom 12s ease-in-out infinite;
        }
        @keyframes breathe-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(14, 165, 233, 0.2); border-color: rgba(56, 189, 248, 0.15); }
          50% { box-shadow: 0 0 60px rgba(14, 165, 233, 0.45); border-color: rgba(56, 189, 248, 0.35); }
        }
        .animate-glow {
          animation: breathe-glow 4s ease-in-out infinite;
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float-gentle 6s ease-in-out infinite;
        }
        @keyframes wave-bounce {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .audio-bar {
          display: inline-block;
          width: 2px;
          height: 12px;
          background-color: #38bdf8;
          margin: 0 1px;
          transform-origin: bottom;
          animation: wave-bounce 1s ease-in-out infinite;
        }
        .audio-bar:nth-child(2) { animation-delay: 0.15s; }
        .audio-bar:nth-child(3) { animation-delay: 0.3s; }
        .audio-bar:nth-child(4) { animation-delay: 0.45s; }
      `}</style>

      {/* 1. BACKGROUND STARS */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-star"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--delay': star.delay,
              '--duration': star.duration,
            } as any}
          />
        ))}
      </div>

      {/* 2. TOP ACTION BAR WITH AUDIO TOGGLE & SKIP BUTTON */}
      <div className="w-full flex items-center justify-between z-30 pointer-events-auto">
        {/* Playback Control Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-300 pointer-events-auto shadow-md border cursor-pointer ${
              isPlaying 
                ? 'bg-sky-500/20 text-sky-200 border-sky-400/30' 
                : 'bg-amber-500/20 text-amber-300 border-amber-400/30 font-black animate-pulse'
              }`}
          >
            {isPlaying ? (
              <>
                <div className="flex h-3 items-end pb-0.5 mr-0.5">
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                </div>
                <span className="font-mono uppercase">Hallelujah</span>
                <Pause className="w-3 h-3 text-sky-300 ml-1" />
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-amber-400 fill-amber-400 animate-bounce" />
                <span className="uppercase font-mono">Hihira Hallelujah 🎵</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white transition-all pointer-events-auto cursor-pointer"
              title={isMuted ? "Mampihena ny feony" : "Mampiakatra ny feony"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
            </button>
          )}
        </div>

        {/* Skip button */}
        <button 
          onClick={onComplete}
          className="bg-slate-900/40 hover:bg-slate-800/60 active:scale-95 text-sky-200/80 hover:text-sky-100 rounded-full px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest border border-sky-500/20 transition-all cursor-pointer shadow-[0_0_15px_rgba(14,165,233,0.1)] back-blur-xs"
        >
          Mandalo ➔
        </button>
      </div>

      {/* 3. BRANDING UPPER SECTION */}
      <div className="w-full text-center flex flex-col items-center gap-2 z-20 pt-4">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-950/40 border border-sky-500/15 rounded-full text-[9px] text-sky-400 font-mono tracking-widest uppercase font-black">
          <Sparkles className="w-3 h-3 text-sky-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Fitaizana ara-panahy</span>
        </div>
        <h1 className="text-2xl font-black tracking-[0.12em] text-white drop-shadow-lg">
          F.P.Fi
        </h1>
        <p className="text-[10px] text-sky-305 font-mono tracking-wider font-bold text-sky-300">
          Fiangonana Protestanta Fifohazana
        </p>
      </div>

      {/* 4. THE GLORIOUS CENTERPIECE IMAGE - JESUS CHRIST IN HIGHLIGHTED GLORY WITH ZOOM */}
      <div className="relative w-full flex items-center justify-center z-20 h-64 overflow-visible animate-float">
        <div 
          onClick={togglePlay}
          style={{ transform: 'scale(2.0)' }}
          className="relative w-28 h-28 rounded-full overflow-hidden border border-sky-400/25 bg-slate-950 flex items-center justify-center origin-center animate-glow cursor-pointer group"
          title="Tsindrio hilalaovana / hampijanonana ny mozika"
        >
          <img 
            src={jesusGlorious} 
            alt="Jésus" 
            className="w-full h-full object-cover opacity-90 animate-kenBurnsBack group-hover:scale-105 transition-all duration-300"
            draggable="false"
          />
          {/* Subtle play indicator when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <div className="bg-amber-500 p-1.5 rounded-full shadow-lg border border-amber-300 text-slate-950 transition-all duration-300 pr-1 pl-1.5">
                <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. FOOTER MESSAGE & LOADING BAR */}
      <div className="w-full text-center pb-8 z-20 max-w-xs mx-auto space-y-4">
        <div className="space-y-1 px-3">
          <p className="text-[11px] sm:text-xs font-black text-slate-200 italic leading-relaxed">
            "Mifohaza ianareo izay matory ary mitsangana amin'ny maty dia hampahazava anao Kristy."
          </p>
          <p className="text-[9px] text-sky-400 uppercase tracking-widest font-bold font-mono">
            Efesiana 5:14
          </p>
        </div>

        {/* LOADING PROGRESS LOADER */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-36 h-1 bg-slate-900/60 rounded-full overflow-hidden border border-sky-950">
            <div className="animate-load-bar rounded-full" />
            <div className="animate-load-bar-short rounded-full" />
          </div>
          <span className="text-[9px] uppercase text-sky-400/60 font-black tracking-[0.15em] font-mono block pt-0.5">
            Andeha hidirana...
          </span>
        </div>
      </div>

    </div>
  );
}
