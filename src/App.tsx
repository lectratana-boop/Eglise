/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Church, Member, Announcement, ChurchEvent, Sermon, Donation } from './types';
import {
  INITIAL_CHURCHES,
  INITIAL_MEMBERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_SERMONS,
  INITIAL_DONATIONS
} from './data';

// Component imports
import ChurchSelector from './components/ChurchSelector';
import BiblePage from './components/BiblePage';
import QuizPage from './components/QuizPage';
import GivingPage from './components/GivingPage';
import SermonsPage from './components/SermonsPage';
import MembersPage from './components/MembersPage';
import AnnouncementsPage from './components/AnnouncementsPage';
import AgendaPage from './components/AgendaPage';
import SongPage from './components/SongPage';
import YouthPage from './components/YouthPage';
import ChurchLogo from './components/ChurchLogo';

// Lucide icons
import {
  Home,
  BookOpen,
  Music,
  Megaphone,
  Grid,
  Heart,
  Calendar,
  Users,
  Mic,
  Award,
  Settings,
  Accessibility,
  Sun,
  Moon,
  Sparkles,
  Volume2,
  X,
  PhoneCall
} from 'lucide-react';

const DEFAULT_SLOGAN = "Fampiharana ho an'ny fiangonana eto Madagasikara: Baiboly Masina, fandalinana, fihirana, ary varavarana fifandraisana mivantana eo amin'ny mpino sy ny fiangonana rehetra.";

const DAILY_PROMISES = [
  { text: "Aza matahotra, fa momba anao Aho; aza miherikerika fotsiny, fa Izaho no Andriamanitrao; mampahery anao Aho sady mamonjy anao.", ref: "Isaia 41:10" },
  { text: "Fa Izaho mahalala ny hevitra eritreretiko ny aminere, hoy Jehovah, dia hevitra hahasoa, fa tsy hahamasina, hanome anareo fanantenana ny amin'ny ho avy.", ref: "Jeremia 29:11" },
  { text: "Mahay ny zavatra rehetra aho ao amin'Ilay mampahery ahy.", ref: "Filipiana 4:13" },
  { text: "Ary fantatsika fa ny zavatra rehetra dia miara-miasa hahasoa izay tia an'Andriamanitra, dia izay voantso araka ny fikasany sahady.", ref: "Romanina 8:28" },
  { text: "Jehovah no mpiandry ahy, tsy hanan-javaha-manantena aho. Mampandry ahy any amin'ny ahi-maitso Izy; mitondra ahy eo amin'ny rano mangina Izy.", ref: "Salamo 23:1-2" },
  { text: "Matokia an'i Jehovah amin'ny fonao rehetra, fa aza miantehitra amin'ny fahalalanao. Maneke Azy amin'ny alehanao rehetra, fa Izy handamina ny lalanao.", ref: "Ohabolana 3:5-6" }
];

export default function App() {
  // State management populated with localStorage persistence
  const [churches, setChurches] = useState<Church[]>(() => {
    const saved = localStorage.getItem('mifandray_churches');
    return saved ? JSON.parse(saved) : INITIAL_CHURCHES;
  });

  const [activeChurchId, setActiveChurchId] = useState<string>(() => {
    return churches[0]?.id || 'fjkm-isotry';
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('mifandray_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('mifandray_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [events, setEvents] = useState<ChurchEvent[]>(() => {
    const saved = localStorage.getItem('mifandray_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [sermons, setSermons] = useState<Sermon[]>(() => {
    const saved = localStorage.getItem('mifandray_sermons');
    return saved ? JSON.parse(saved) : INITIAL_SERMONS;
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('mifandray_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  // Settings & Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('mifandray_theme') === 'dark';
  });

  const [isElderlyMode, setIsElderlyMode] = useState<boolean>(() => {
    return localStorage.getItem('mifandray_elderly') === 'true';
  });

  // Navigation tab (Accueil, Bible, Chorales, Dimes / Giving, etc.)
  const [activeTab, setActiveTab] = useState<string>('Accueil');
  
  // Mobile 'More Menu' Slide-up Drawer State
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  // Daily promise dynamic index
  const [promiseIndex, setPromiseIndex] = useState(0);

  // Local edit states for active church
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editVerseText, setEditVerseText] = useState('');
  const [editVerseRef, setEditVerseRef] = useState('');

  // Custom announcements edit states to customize categories
  const [editFivorianaTitle, setEditFivorianaTitle] = useState('');
  const [editFivorianaContent, setEditFivorianaContent] = useState('');
  const [editHetsikaTitle, setEditHetsikaTitle] = useState('');
  const [editHetsikaContent, setEditHetsikaContent] = useState('');
  const [editHafaTitle, setEditHafaTitle] = useState('');
  const [editHafaContent, setEditHafaContent] = useState('');

  // Sync state to localStorage on modification
  useEffect(() => {
    localStorage.setItem('mifandray_churches', JSON.stringify(churches));
  }, [churches]);

  useEffect(() => {
    const activeChObj = churches.find(c => c.id === activeChurchId) || churches[0];
    if (activeChObj) {
      setEditName(activeChObj.name || '');
      setEditDescription(activeChObj.description || '');
      setEditVerseText(activeChObj.customVerseText || '');
      setEditVerseRef(activeChObj.customVerseRef || '');
      setEditFivorianaTitle(activeChObj.customFivorianaTitle || '');
      setEditFivorianaContent(activeChObj.customFivorianaContent || '');
      setEditHetsikaTitle(activeChObj.customHetsikaTitle || '');
      setEditHetsikaContent(activeChObj.customHetsikaContent || '');
      setEditHafaTitle(activeChObj.customHafaTitle || '');
      setEditHafaContent(activeChObj.customHafaContent || '');
    }
  }, [activeChurchId, churches]);

  useEffect(() => {
    localStorage.setItem('mifandray_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('mifandray_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('mifandray_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('mifandray_sermons', JSON.stringify(sermons));
  }, [sermons]);

  useEffect(() => {
    localStorage.setItem('mifandray_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('mifandray_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('mifandray_elderly', isElderlyMode ? 'true' : 'false');
  }, [isElderlyMode]);

  // Handle addition helpers
  const handleCreateChurch = (newChurch: Omit<Church, 'id'>) => {
    const fresh: Church = {
      ...newChurch,
      id: `ch-${Date.now()}`
    };
    setChurches(prev => [...prev, fresh]);
    setActiveChurchId(fresh.id);
  };

  const handleAddMember = (newMem: Omit<Member, 'id'>) => {
    const fresh: Member = {
      ...newMem,
      id: `mem-${Date.now()}`
    };
    setMembers(prev => [...prev, fresh]);
  };

  const handleAddAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date'>) => {
    const fresh: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [fresh, ...prev]);
  };

  const handleUpdateAnnouncement = (id: string, updatedFields: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(ann => ann.id === id ? { ...ann, ...updatedFields } : ann));
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm("Tena hovonoina tokoa ve ity filazana ity?")) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    }
  };

  const handleAddEvent = (newEv: Omit<ChurchEvent, 'id'>) => {
    const fresh: ChurchEvent = {
      ...newEv,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [...prev, fresh]);
  };

  const handleAddSermon = (newSermon: Omit<Sermon, 'id'>) => {
    const fresh: Sermon = {
      ...newSermon,
      id: `serm-${Date.now()}`
    };
    setSermons(prev => [fresh, ...prev]);
  };

  const handleAddDonation = (newDon: Omit<Donation, 'id' | 'date'>) => {
    const fresh: Donation = {
      ...newDon,
      id: `don-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setDonations(prev => [fresh, ...prev]);
  };

  const handleUpdateChurch = () => {
    if (!editName.trim()) {
      alert("Tsy azo avela ho foana ny anaran'ny fiangonana!");
      return;
    }
    
    const todayStr = new Date().toISOString().split('T')[0];

    setChurches(prev => prev.map(ch => {
      if (ch.id === activeChurchId) {
        const isFivorianaUpdated = 
          editFivorianaTitle !== (ch.customFivorianaTitle || '') || 
          editFivorianaContent !== (ch.customFivorianaContent || '');
          
        const isHetsikaUpdated = 
          editHetsikaTitle !== (ch.customHetsikaTitle || '') || 
          editHetsikaContent !== (ch.customHetsikaContent || '');
          
        const isHafaUpdated = 
          editHafaTitle !== (ch.customHafaTitle || '') || 
          editHafaContent !== (ch.customHafaContent || '');

        return {
          ...ch,
          name: editName,
          description: editDescription,
          customVerseText: editVerseText,
          customVerseRef: editVerseRef,
          customFivorianaTitle: editFivorianaTitle,
          customFivorianaContent: editFivorianaContent,
          customFivorianaDate: isFivorianaUpdated ? todayStr : (ch.customFivorianaDate || todayStr),
          customHetsikaTitle: editHetsikaTitle,
          customHetsikaContent: editHetsikaContent,
          customHetsikaDate: isHetsikaUpdated ? todayStr : (ch.customHetsikaDate || todayStr),
          customHafaTitle: editHafaTitle,
          customHafaContent: editHafaContent,
          customHafaDate: isHafaUpdated ? todayStr : (ch.customHafaDate || todayStr)
        };
      }
      return ch;
    }));
    alert("Voatahiry tsara ny fanovana momba ny fiangonana!");
  };

  const handleDeleteActiveChurch = () => {
    if (churches.length <= 1) {
      alert("Tsy azo fafana ity fiangonana ity satria tsy maintsy misy fiangonana iray farafahakeliny amin'ny fampiharana!");
      return;
    }
    if (confirm(`Tena te-hamafa ny fiangonana "${activeChurch.name}" tokoa ve ianao?`)) {
      const remainingChurches = churches.filter(ch => ch.id !== activeChurchId);
      setChurches(remainingChurches);
      setActiveChurchId(remainingChurches[0].id);
      alert("Voafafa soa aman-tsara ny fiangonana!");
    }
  };

  const activeChurch = churches.find(c => c.id === activeChurchId) || churches[0];

  const activeVerseText = activeChurch.customVerseText || DAILY_PROMISES[promiseIndex].text;
  const activeVerseRef = activeChurch.customVerseRef || DAILY_PROMISES[promiseIndex].ref;

  const handleRandomPromise = () => {
    const nextIdx = (promiseIndex + 1) % DAILY_PROMISES.length;
    setPromiseIndex(nextIdx);
  };

  // Helper to resolve specific category announcement (Fivoriana, Hetsika, Sokajy Hafa)
  const getDisplayAnnouncement = (cat: 'fivoriana' | 'hetsika' | 'hafa') => {
    const customTitle = 
      cat === 'fivoriana' ? activeChurch.customFivorianaTitle :
      cat === 'hetsika' ? activeChurch.customHetsikaTitle :
      activeChurch.customHafaTitle;
      
    const customContent = 
      cat === 'fivoriana' ? activeChurch.customFivorianaContent :
      cat === 'hetsika' ? activeChurch.customHetsikaContent :
      activeChurch.customHafaContent;

    const customDate = 
      cat === 'fivoriana' ? activeChurch.customFivorianaDate :
      cat === 'hetsika' ? activeChurch.customHetsikaDate :
      activeChurch.customHafaDate;

    // Get the default fallback announcement first
    const defaultAnn = announcements.find(a => a.churchId === activeChurchId && a.category === cat);
    
    // Fallback on a field-by-field basis if any is empty / blank
    const titleToUse = (customTitle && customTitle.trim()) ? customTitle.trim() : (defaultAnn?.title || "");
    const contentToUse = (customContent && customContent.trim()) ? customContent.trim() : (defaultAnn?.content || "");

    const isCustomized = !!((customTitle && customTitle.trim()) || (customContent && customContent.trim()));

    if (titleToUse || contentToUse) {
      return {
        id: defaultAnn?.id || `custom-${cat}`,
        title: titleToUse,
        content: contentToUse,
        // The date of communication must follow the date of update of the information
        date: isCustomized ? (customDate || new Date().toISOString().split('T')[0]) : (defaultAnn?.date || new Date().toISOString().split('T')[0]),
        category: cat,
        isCustom: isCustomized
      };
    }

    return null;
  };

  // Bottom primary tab bar items (Mobile Native layout style)
  const bottomNavItems = [
    { key: 'Accueil', label: 'Tongasoa', icon: <Home className="w-5 h-5" /> },
    { key: 'Bible', label: 'Baiboly', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'Chorales', label: 'Fihirana', icon: <Music className="w-5 h-5" /> },
    { key: 'Dimes', label: 'Fanomezana', icon: <Heart className="w-5 h-5" /> },
  ];

  // Secondary item drawer elements
  const secondaryMenuItems = [
    { key: 'Annonces', label: 'Filazana', icon: <Megaphone className="w-5 h-5" />, color: 'from-violet-500 to-purple-600' },
    { key: 'Events', label: 'Fandaharana', icon: <Calendar className="w-5 h-5" />, color: 'from-amber-400 to-orange-500' },
    { key: 'Jeunes', label: 'Sampana Tanora', icon: <Users className="w-5 h-5" />, color: 'from-orange-500 to-rose-500' },
    { key: 'Sermons', label: 'Toriteny', icon: <Mic className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600' },
    { key: 'Quiz', label: 'Lalao Quiz', icon: <Award className="w-5 h-5" />, color: 'from-yellow-400 to-amber-500' },
    { key: 'Settings', label: 'Fitantanana', icon: <Settings className="w-5 h-5" />, color: 'from-slate-500 to-slate-700' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 md:bg-slate-100 dark:md:bg-slate-950 flex items-center justify-center font-sans ${
      darkMode ? 'text-slate-100' : 'text-slate-900'
    }`}>
      
      {/* PHONE WRAPPER SHELL
          On screen sizes >= md: wraps inside a simulated iPhone-sized device border with a dark frame bezel and shadows
          On mobile screen sizes: behaves 100% full-screen without borders for direct standalone compiling or PWA wrap!
      */}
      <div className="w-full md:max-w-[420px] md:h-[840px] md:rounded-[40px] md:border-[12px] md:border-slate-900 md:shadow-2xl bg-white dark:bg-slate-900 md:relative md:overflow-hidden flex flex-col min-h-screen md:min-h-0">
        
        {/* TOP STATUS BAR REMOVED AND LEFT CLEAN AS REQUESTED */}

        {/* COMPREHENSIVE PHONE TOP HEADER ACTION RAIL - hidden on home screen */}
        {activeTab !== 'Accueil' && (
          <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between gap-1 shrink-0">
            <div className="flex-1 flex justify-start py-0.5">
              <ChurchLogo layout="horizontal" badgeSize="h-8.5 w-8.5" />
            </div>

            {/* Quick Accessibilities inside header */}
            <div className="flex items-center gap-1 shrink-0 justify-end">
              {/* Elderly Friendly Toggle button */}
              <button
                id="btn-toggle-accessibility"
                onClick={() => setIsElderlyMode(!isElderlyMode)}
                className={`p-1 rounded-lg border transition-all text-[8.5px] font-black cursor-pointer flex items-center justify-center gap-0.5 ${
                  isElderlyMode
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-705'
                }`}
                title="Mora vakina be taona"
              >
                <Accessibility className="w-3 h-3" />
              </button>

              {/* Theme switcher */}
              <button
                id="btn-toggle-dark-mode"
                onClick={() => setDarkMode(!darkMode)}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-705 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer active:scale-95 hover:shadow-sm"
                title="Loko maizina"
              >
                {darkMode ? <Sun className="w-3 h-3 text-amber-500 fill-amber-400" /> : <Moon className="w-3 h-3 text-slate-650" />}
              </button>
            </div>
          </header>
        )}

        {/* ACCESSIBLE ANNOUNCEMENT RAIL */}
        {isElderlyMode && (
          <div className="bg-amber-500 text-slate-950 py-1.5 px-3 shadow-inner text-[11px] font-black text-center flex items-center justify-center gap-1 animate-pulse shrink-0">
            <span>👵👨 Mode Be Taona : Sora-masina lehibe !</span>
          </div>
        )}

        {/* MOBILE ACTIVE TAB CONTENT DISPLAY VIEWPORT */}
        <div className={`flex-1 overflow-y-auto scrollbar-thin dark:bg-slate-950 ${activeTab === 'Accueil' ? 'p-0 pb-5' : 'p-4 space-y-5'}`}>
          
          {/* View Tab Selector Gate */}

          {/* 1. TONGASOA (HOME SCREEN) */}
          {activeTab === 'Accueil' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Elegant Official Logo Badge at the top of the Tongasoa view - flushed all the way up */}
              <div className="relative w-full">
                <ChurchLogo layout="square" className="rounded-t-none rounded-b-[32px] border-x-0 border-t-0 p-6 pt-8 w-full bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800/80 shadow-xs" />
                
                {/* Float Accessibility and Dark Mode toggles to the top right of the screen */}
                <div className="absolute right-4 top-4 flex items-center gap-1.5 z-10">
                  {/* Elderly Friendly Toggle button */}
                  <button
                    id="btn-toggle-accessibility-home"
                    onClick={() => setIsElderlyMode(!isElderlyMode)}
                    className={`p-1.5 rounded-lg border transition-all text-[8.5px] font-black cursor-pointer flex items-center justify-center gap-0.5 ${
                      isElderlyMode
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                    title="Mora vakina be taona"
                  >
                    <Accessibility className="w-3.5 h-3.5" />
                  </button>

                  {/* Theme switcher */}
                  <button
                    id="btn-toggle-dark-mode-home"
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer active:scale-95 hover:shadow-sm hover:bg-slate-100 dark:hover:bg-slate-750"
                    title="Loko maizina"
                  >
                    {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-650" />}
                  </button>
                </div>
              </div>

              {/* Home main padded container */}
              <div className="px-4 space-y-4">

                {/* Interactive greeting with dynamic island feel */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                <h2 className={`${isElderlyMode ? 'text-2xl' : 'text-lg'} font-black leading-tight text-white/95`}>
                  🏡 <span className="text-yellow-300">{activeChurch.name}</span>
                </h2>
                <p className="text-[11.5px] text-violet-100 leading-snug mt-2 font-medium">
                  {activeChurch.description || DEFAULT_SLOGAN}
                </p>
 
                {/* Inline Church Space Selector */}
                <div className="mt-3.5 bg-black/20 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                  <span className="block text-[8px] uppercase tracking-wider font-extrabold text-violet-200 mb-1">
                    Hifidy fiangonana hafa :
                  </span>
                  <select
                    value={activeChurchId}
                    onChange={(e) => setActiveChurchId(e.target.value)}
                    className="w-full bg-slate-900 border-none rounded-lg text-xs py-1.5 px-2 text-white outline-none font-bold cursor-pointer"
                  >
                    {churches.map(ch => (
                      <option key={ch.id} value={ch.id} className="bg-slate-900 text-white">
                        ⛪ {ch.name} ({ch.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
 
              {/* Dynamic Promise of today with robust design */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 border border-amber-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 py-0.5 px-2 rounded font-sans">
                    Andininy anio
                  </span>
                  <button
                    onClick={handleRandomPromise}
                    className="py-1 px-2.5 bg-amber-500 border-b-[3px] border-amber-700 text-white text-[9px] font-black rounded-lg active:translate-y-[1px] active:border-b-[1px] cursor-pointer"
                  >
                    Hafa 🔄
                  </button>
                </div>
                
                <blockquote className={`${isElderlyMode ? 'text-lg font-black' : 'text-xs font-semibold'} text-slate-800 dark:text-slate-100 italic font-sans leading-relaxed`}>
                  "{activeVerseText}"
                </blockquote>
                
                <p className="text-[10px] font-mono font-black text-amber-700 dark:text-amber-450 text-right">
                  — {activeVerseRef}
                </p>
 
                {/* TTS Reader for daily promise */}
                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(activeVerseText);
                    utterance.lang = 'fr-FR';
                    utterance.rate = isElderlyMode ? 0.8 : 0.9;
                    window.speechSynthesis.speak(utterance);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-705 dark:text-slate-200 text-[10px] font-black rounded-xl cursor-pointer flex items-center justify-center gap-1 border border-slate-200/50 dark:border-slate-800"
                >
                  🔊 Henoy amin'ny Feo
                </button>
              </div>
 
              {/* Grid of latest News & Events inline preview */}
              <div className="grid grid-cols-1 gap-3">
                
                {/* Expanded News preview (Annonces) utilizing empty screen space at bottom */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">📢</span>
                      <span className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Vaovao sy Filazana</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('Annonces')}
                      className="text-[9.5px] font-extrabold text-violet-650 bg-violet-50 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-300 px-2.5 py-1 rounded-lg cursor-pointer transition-all active:scale-95 border border-violet-100 dark:border-violet-900/40"
                    >
                      Hijery rehetra ➔
                    </button>
                  </div>
 
                  <div className="space-y-4 pt-1">
                    {['fivoriana', 'hetsika', 'hafa'].map((cat) => {
                      const ann = getDisplayAnnouncement(cat as 'fivoriana' | 'hetsika' | 'hafa');
                      if (!ann) return null;

                      const categoryColors = ann.category === 'fivoriana' 
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-350 border border-purple-200/50 dark:border-purple-800/40' 
                        : ann.category === 'hetsika'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-350 border border-amber-200/50 dark:border-amber-800/40'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-805 dark:text-indigo-350 border border-indigo-200/50 dark:border-indigo-800/40';

                      const categoryLabel = ann.category === 'fivoriana' 
                        ? 'Fivoriana 🗓️' 
                        : ann.category === 'hetsika'
                        ? 'Hetsika 🌟'
                        : 'Sokajy Hafa 📢';

                      const dateParts = ann.date ? ann.date.split('-') : [];
                      const formattedDate = dateParts.length === 3 
                        ? `Alahady, ${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
                        : ann.date;

                      return (
                        <div
                          key={ann.id}
                          className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-2 relative group overflow-hidden transition-all hover:shadow-xs"
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-black uppercase ${categoryColors}`}>
                              {categoryLabel}
                            </span>
                            {formattedDate && (
                              <span className="text-[8.5px] font-mono text-slate-400 dark:text-slate-500 font-bold">
                                📅 {formattedDate}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-xs font-black text-slate-800 dark:text-white leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {ann.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {ann.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
 
              </div>

              </div> {/* Close Home main padded container */}
 
            </div>
          )}

          {/* 2. OVERHAULED BIBLE VIEWPORT */}
          {activeTab === 'Bible' && (
            <BiblePage isElderlyMode={isElderlyMode} />
          )}

          {/* 3. CHORALES & HYMNALS DIRECTORY */}
          {activeTab === 'Chorales' && (
            <SongPage isElderlyMode={isElderlyMode} />
          )}

          {/* 4. DONATIONS & DIMES */}
          {activeTab === 'Dimes' && (
            <GivingPage
              churchId={activeChurchId}
              donations={donations}
              onAddDonation={handleAddDonation}
              isElderlyMode={isElderlyMode}
            />
          )}

          {/* 5. ANNOUNCEMENTS (FILAZANA NEWS) */}
          {activeTab === 'Annonces' && (
            <AnnouncementsPage
              churchId={activeChurchId}
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onUpdateAnnouncement={handleUpdateAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              isElderlyMode={isElderlyMode}
            />
          )}

          {/* 6. EXPANDED VIEWS RENDER PORT */}
          {activeTab === 'Events' && (
            <AgendaPage
              activeChurch={activeChurch}
              churchId={activeChurchId}
              events={events}
              onAddEvent={handleAddEvent}
              isElderlyMode={isElderlyMode}
            />
          )}

          {activeTab === 'Jeunes' && (
            <YouthPage isElderlyMode={isElderlyMode} />
          )}

          {activeTab === 'Sermons' && (
            <SermonsPage
              churchId={activeChurchId}
              sermons={sermons}
              onAddSermon={handleAddSermon}
              isElderlyMode={isElderlyMode}
            />
          )}

          {activeTab === 'Quiz' && (
            <QuizPage isElderlyMode={isElderlyMode} />
          )}

          {activeTab === 'Settings' && (
            <div className="space-y-4">
              {/* Fitantanana ny Fiangonana Active Admin Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-3">
                <span className="text-[9px] font-black uppercase bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 py-0.5 px-2 rounded font-sans">
                  Fitantanana ny Fiangonana
                </span>
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white leading-none mt-1">
                  Fikirana: <span className="text-violet-600 dark:text-violet-400">{activeChurch.name}</span>
                </h3>
                <p className="text-[10px] text-slate-400">Afaka ovaovanao eto ny anarana, teny faneva (slogan), ary ny andinin-tsoratra masina ny fiangonanao.</p>

                <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Anaran'ny Fiangonana
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Slogan / Mombamomba ny Fiangonana
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-805 dark:text-slate-100 outline-none focus:ring-1 focus:ring-violet-500 leading-snug"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Andininy anio an'ny Fiangonana</span>
                    
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                        Teny avy amin'ny Soratra Masina
                      </label>
                      <textarea
                        value={editVerseText}
                        onChange={(e) => setEditVerseText(e.target.value)}
                        placeholder="Soraty eto raha hanoratra andininy vaovao..."
                        rows={2}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-805 dark:text-slate-100 outline-none focus:ring-1 focus:ring-violet-500 italic"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                        Andalan-tsoratra (Ref)
                      </label>
                      <input
                        type="text"
                        value={editVerseRef}
                        onChange={(e) => setEditVerseRef(e.target.value)}
                        placeholder="Ohatra: Salamo 23:1"
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-805 dark:text-slate-100 outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Custom Welcome Screen Announcements Section */}
                  <div className="grid grid-cols-1 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-black text-slate-400 uppercase">Vaovao sy Filazana ao amin'ny Tongasoa</span>
                      <p className="text-[9.5px] text-slate-400 leading-normal">
                        Ovao eto ny filazana ho hita ao amin'ny pejin'ny Tongasoa. Raha avela foana ny banga, dia haverina ho an'ny default izany.
                      </p>
                    </div>

                    {/* 1. FIVORIANA */}
                    <div className="p-2.5 bg-purple-50/45 dark:bg-purple-950/20 border border-purple-100/60 dark:border-purple-900/30 rounded-lg space-y-2">
                      <span className="text-[8.5px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black rounded-full uppercase">1. Fivoriana 🗓️</span>
                      <div>
                        <label className="block text-[8.5px] font-bold text-slate-500 uppercase mb-0.5">Anaran'ny Fivoriana (Title)</label>
                        <input
                          type="text"
                          value={editFivorianaTitle}
                          onChange={(e) => setEditFivorianaTitle(e.target.value)}
                          placeholder="Default (Anaran'ny fivoriana)"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-md p-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-bold text-slate-500 uppercase mb-0.5">Vontoatiny (Content)</label>
                        <textarea
                          value={editFivorianaContent}
                          onChange={(e) => setEditFivorianaContent(e.target.value)}
                          placeholder="Default (Andraikitra na fandaharam-potoana...)"
                          rows={2}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-md p-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-purple-500 leading-snug"
                        />
                      </div>
                    </div>

                    {/* 2. HETSIKA */}
                    <div className="p-2.5 bg-amber-50/45 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/30 rounded-lg space-y-2">
                      <span className="text-[8.5px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-850 dark:text-amber-305 font-black rounded-full uppercase">2. Hetsika 🌟</span>
                      <div>
                        <label className="block text-[8.5px] font-bold text-slate-500 uppercase mb-0.5">Anaran'ny Hetsika (Title)</label>
                        <input
                          type="text"
                          value={editHetsikaTitle}
                          onChange={(e) => setEditHetsikaTitle(e.target.value)}
                          placeholder="Default (Hetsika manokana)"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-md p-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-bold text-slate-500 uppercase mb-0.5">Vontoatiny (Content)</label>
                        <textarea
                          value={editHetsikaContent}
                          onChange={(e) => setEditHetsikaContent(e.target.value)}
                          placeholder="Default (antsipirihany momba ny hetsika...)"
                          rows={2}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-md p-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-amber-500 leading-snug"
                        />
                      </div>
                    </div>

                    {/* 3. SOKAJY HAFA */}
                    <div className="p-2.5 bg-indigo-50/45 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/30 rounded-lg space-y-2">
                      <span className="text-[8.5px] px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-805 dark:text-indigo-300 font-black rounded-full uppercase">3. Sokajy Hafa 📢</span>
                      <div>
                        <label className="block text-[8.5px] font-bold text-slate-500 uppercase mb-0.5">Anaran'ny Filazana hafa (Title)</label>
                        <input
                          type="text"
                          value={editHafaTitle}
                          onChange={(e) => setEditHafaTitle(e.target.value)}
                          placeholder="Default (Filazana hafa...)"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-md p-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-bold text-slate-500 uppercase mb-0.5">Vontoatiny (Content)</label>
                        <textarea
                          value={editHafaContent}
                          onChange={(e) => setEditHafaContent(e.target.value)}
                          placeholder="Default (filazana antsipirihany manokana hafa...)"
                          rows={2}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-md p-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 leading-snug"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleUpdateChurch}
                      className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 font-bold text-white text-[10.5px] rounded-lg cursor-pointer transition-all active:translate-y-[1px] border-b-[3px] border-violet-800"
                    >
                      Tehirizina ny fanovana 💾
                    </button>
                    <button
                      onClick={handleDeleteActiveChurch}
                      className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 font-bold text-[10.5px] rounded-lg cursor-pointer transition-all active:scale-95 border border-red-200"
                      title="Hamafa ity fiangonana ity"
                    >
                      Hofafana ✕
                    </button>
                  </div>
                </div>
              </div>

              {/* Member lists nested in settings admin screen */}
              <div>
                <MembersPage
                  churchId={activeChurchId}
                  members={members}
                  onAddMember={handleAddMember}
                  isElderlyMode={isElderlyMode}
                />
              </div>

              {/* Core general reset settings panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-3">
                <h3 className="font-extrabold text-xs text-slate-800 dark:text-white uppercase">Paramètres PWA</h3>
                <p className="text-[10px] text-slate-400">Asa mpanorina sy fikirana ny rakitra ho an'ny iombonan'ny finoana.</p>
                
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-150 text-[10px] space-y-1">
                    <span className="font-bold text-slate-700 block">Drafitra fampianarana:</span>
                    <span className="text-slate-400">PWA Target Mode: APK Android Wrapper 2026.</span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("Haverina amin'ny voalohany ve ny rakitra rehetra (Reset all data)?")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 font-bold border-b-[4px] border-rose-800 text-white rounded-lg cursor-pointer transition-all active:translate-y-[1px] active:border-b-[1px] text-[10.5px]"
                  >
                    Hamarina ny Data rehetra (Reset) ✕
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MOCK HARDWARE APP BOTTOM NAVIGATION BAR (Fully responsive 3D buttons) */}
        <nav className="sticky bottom-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200/80 dark:border-slate-800/80 py-2 px-3 flex items-center justify-around shadow-lg">
          
          {bottomNavItems.map((item) => {
            const isActive = activeTab === item.key && !showMoreMenu;
            return (
              <button
                id={`btn-nav-${item.key}`}
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center p-1.5 transition-all outline-none rounded-xl relative select-none cursor-pointer ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400 scale-105'
                    : 'text-slate-450 dark:text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="shrink-0">{item.icon}</div>
                <span className="text-[9.5px] font-black tracking-wide mt-0.5">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400 rounded-full mt-0.5 absolute -bottom-1"></span>
                )}
              </button>
            );
          })}

          {/* THE 'MORE (HAFA)' TAB BUTTON WHICH ACCESSIBLY TRIGGERS DRAWERS */}
          <button
            id="btn-nav-more"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center p-1.5 transition-all outline-none rounded-xl select-none cursor-pointer ${
              showMoreMenu
                ? 'text-orange-500 scale-110'
                : 'text-slate-450 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <Grid className="w-5 h-5 shrink-0" />
            <span className="text-[9.5px] font-black tracking-wide mt-0.5">Hafa...</span>
            {showMoreMenu && (
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-0.5 absolute -bottom-1"></span>
            )}
          </button>

        </nav>

        {/* IMMERSIVE POPUP APP MANAGER LAUNCHER SHEET (THE HAFA OVERLAY DRAWER)
            Provides beautiful, colorful gradient card options for secondary app services!
        */}
        {showMoreMenu && (
          <div className="absolute inset-x-0 bottom-[64px] top-0 z-30 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end transition-all duration-300">
            {/* Click backdrop to exit modal */}
            <div className="flex-1" onClick={() => setShowMoreMenu(false)}></div>
            
            {/* White slide-up sheet */}
            <div className="bg-white dark:bg-slate-900 border-t-2 border-orange-500 p-5 rounded-t-[32px] space-y-4 shadow-2xl overflow-y-auto max-h-[75%] animate-fadeIn relative z-40">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase leading-none">Hetsika sy Sampana</h3>
                    <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase">Misafidiana andinbahoaka malalaka</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-500 dark:text-white cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Launcher grid in 3D custom coloring button grids! */}
              <div className="grid grid-cols-2 gap-3.5">
                {secondaryMenuItems.map((sec) => (
                  <button
                    id={`btn-sec-${sec.key}`}
                    key={sec.key}
                    onClick={() => {
                      setActiveTab(sec.key);
                      setShowMoreMenu(false);
                    }}
                    className="p-4 bg-slate-50 hover:bg-violet-50/50 dark:bg-slate-850 dark:hover:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-b-[4px]"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${sec.color} text-white flex items-center justify-center shadow-md`}>
                      {sec.icon}
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">{sec.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick closing footer block */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 font-semibold font-mono">
                ⛪ Fiangonana eto Madagascar v1.50
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
