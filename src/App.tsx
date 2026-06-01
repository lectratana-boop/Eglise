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

// Lucide icons
import {
  BookOpen,
  Megaphone,
  Calendar,
  Heart,
  Music,
  Users,
  Mic,
  Award,
  Settings,
  Home,
  Check,
  Sun,
  Moon,
  Accessibility,
  Sparkles,
  PhoneCall,
  UserPlus,
  Compass,
  Smile
} from 'lucide-react';

const DAILY_PROMISES = [
  { text: "Aza matahotra, fa momba anao Aho; aza miherikerika fotsiny, fa Izaho no Andriamanitrao; mampahery anao Aho sady mamonjy anao.", ref: "Isaia 41:10" },
  { text: "Fa Izaho mahalala ny hevitra eritreretiko ny aminareo, hoy Jehovah, dia hevitra hahasoa, fa tsy hahamasina, hanome anareo fanantenana ny amin'ny ho avy.", ref: "Jeremia 29:11" },
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

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('Accueil'); // 'Accueil', 'Bible', 'Verset', 'Annonces', 'Events', 'Dimes', 'Chorales', 'Jeunes', 'Sermons', 'Quiz', 'Settings'

  // Daily promise dynamic index
  const [promiseIndex, setPromiseIndex] = useState(0);

  // Sync state to localStorage on modification
  useEffect(() => {
    localStorage.setItem('mifandray_churches', JSON.stringify(churches));
  }, [churches]);

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

  const activeChurch = churches.find(c => c.id === activeChurchId) || churches[0];

  const handleRandomPromise = () => {
    const nextIdx = (promiseIndex + 1) % DAILY_PROMISES.length;
    setPromiseIndex(nextIdx);
  };

  // Menu lists in Malagasy
  const menuItems = [
    { key: 'Accueil', label: 'Accueil (Tongasoa)', icon: <Home className="w-5 h-5" /> },
    { key: 'Bible', label: 'Bible (Baiboly)', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'Verset', label: 'Verset du jour (Andininy)', icon: <Sparkles className="w-5 h-5" /> },
    { key: 'Annonces', label: 'Annonces (Filazana)', icon: <Megaphone className="w-5 h-5" /> },
    { key: 'Events', label: 'Événements (Fandaharana)', icon: <Calendar className="w-5 h-5" /> },
    { key: 'Dimes', label: 'Dîmes & Offrandes (Fanomezana)', icon: <Heart className="w-5 h-5" /> },
    { key: 'Chorales', label: 'Chorales (Hira fihirana)', icon: <Music className="w-5 h-5" /> },
    { key: 'Jeunes', label: 'Jeunes (Sokajy Tanora)', icon: <Users className="w-5 h-5" /> },
    { key: 'Sermons', label: 'Prédications (Prezikazy)', icon: <Mic className="w-5 h-5" /> },
    { key: 'Quiz', label: 'Quiz biblique (Fihaonana)', icon: <Award className="w-5 h-5" /> },
    { key: 'Settings', label: 'Paramètres (Fikirana)', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* GLOBAL BANNER HEADER AT TOP */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white ring-4 ring-violet-500/10 shadow-md">
              <span className="font-extrabold text-xl">✝</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Fiangonana Mifandray
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">
                App ho an'ny fiangonana Malagasy
              </p>
            </div>
          </div>

          {/* Quick switch indicator of other churches */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/60 transition-colors">
            <span className="text-[10px] uppercase font-extrabold text-slate-450 dark:text-slate-500 pl-2">Active:</span>
            <select
              value={activeChurchId}
              onChange={(e) => setActiveChurchId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none pr-1 cursor-pointer"
            >
              {churches.map(ch => (
                <option key={ch.id} value={ch.id} className="dark:bg-slate-900 dark:text-white">
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility & Theme triggers (Gros boutons class) */}
          <div className="flex items-center gap-2">
            
            {/* Elderly Friendly Toggle button */}
            <button
              id="btn-toggle-accessibility"
              onClick={() => setIsElderlyMode(!isElderlyMode)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer hover:shadow active:scale-95 ${
                isElderlyMode
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 border-slate-200 dark:border-slate-700'
              }`}
              title="Accessible be taona (Grands caractères)"
            >
              <Accessibility className={`w-4 h-4 ${isElderlyMode ? 'animate-bounce text-amber-600' : ''}`} />
              <span className="hidden md:inline">
                {isElderlyMode ? "Sora-masina Lehibe (Aktiv)" : "Mora vakina (Elders)"}
              </span>
            </button>

            {/* Dark Mode toggle */}
            <button
              id="btn-toggle-dark-mode"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:shadow active:scale-95 transition-all cursor-pointer"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

        </div>
      </header>

      {/* DYNAMIC ACCESSIBLE STATUS BAR FOR ELDERLY */}
      {isElderlyMode && (
        <div className="bg-amber-500 text-white py-2 px-4 shadow-inner text-center text-sm font-bold flex items-center justify-center gap-2 animate-fadeIn uppercase tracking-wide">
          <span>👵👨 Mora vakina ho an'ny Be Taona : Natao lehibe sady mazava ny soratra rehetra !</span>
        </div>
      )}

      {/* MAIN LAYOUT GATE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Multi-church workspace switcher block */}
        <div className="mb-8">
          <ChurchSelector
            churches={churches}
            activeChurchId={activeChurchId}
            onSelectChurch={(id) => setActiveChurchId(id)}
            onCreateChurch={handleCreateChurch}
            isElderlyMode={isElderlyMode}
          />
        </div>

        {/* Dual grid for navigation and contents */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Menu Side Panel (Tous en malagasy as requested) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm transition-colors">
              <span className="block text-xs font-mono py-1 px-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded font-semibold uppercase tracking-wider mb-3">
                Fizahan'Asa (Main Menu)
              </span>

              {/* Grid or List list row */}
              <nav className="space-y-1 sm:grid sm:grid-cols-2 sm:gap-2 lg:block lg:space-y-1">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      id={`btn-menu-${item.key}`}
                      key={item.key}
                      onClick={() => setActiveTab(item.key)}
                      className={`w-full text-left rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                        isElderlyMode ? 'py-4 px-4 text-base' : 'py-3 px-3.5 text-xs'
                      } ${
                        isActive
                          ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-500/10'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : 'text-violet-600 dark:text-violet-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick members counter sidebar */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/25 dark:to-violet-950/25 border border-indigo-100/60 dark:border-violet-950 p-5 rounded-2xl space-y-3.5 transition-colors">
              <div>
                <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
                  Mombamomba ny Espace
                </h4>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">
                  Database mifandray ho an'ny iombonan'ny finoana.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-655 dark:text-slate-400">
                  <span>Mpikambana rehetra:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                    {members.filter(m => m.churchId === activeChurchId).length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-655 dark:text-slate-400">
                  <span>Filazana navoaka:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                    {announcements.filter(a => a.churchId === activeChurchId).length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-655 dark:text-slate-400">
                  <span>Prezikazy rehetra:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                    {sermons.filter(s => s.churchId === activeChurchId).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active View Render Pane Panel */}
          <div className="lg:col-span-3">
            
            {/* 1. ACCUEIL HUB (Fandraisana Tongasoa) */}
            {activeTab === 'Accueil' && (
              <div className="space-y-6">
                
                {/* Greeting Hero box */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
                  <div className="absolute right-0 top-0 opacity-5 dark:opacity-10 text-[180px] font-bold pointer-events-none select-none select-text">
                    ⛪
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <span className="text-xs font-mono py-1 px-2.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full font-semibold uppercase tracking-wider">
                      Salama! Tonon-tsoa ho anao androany.
                    </span>
                    <h2 className={`${isElderlyMode ? 'text-4xl' : 'text-3xl'} font-bold text-slate-850 dark:text-slate-100 font-sans tracking-tight`}>
                      Tonga soa eto amin'ny <span className="text-violet-600 dark:text-violet-400">{activeChurch.name}</span>
                    </h2>
                    
                    <p className={`${isElderlyMode ? 'text-xl' : 'text-sm'} text-slate-500 dark:text-slate-450 max-w-2xl leading-relaxed`}>
                      Ity dia sehatra iraisan'ny fiangonana malagasy rehetra mitantana ny mpikambana sy fitaizana ny finoana. Safidio ny bokotra eto ambany na eo amin'ny menu mba hiditra amin'ireo sampan-draharaha rehetra.
                    </p>

                    {/* Quick navigation large shortcuts grid */}
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Gros Boutons Fidirana Haingana (Shortcuts):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => setActiveTab('Bible')}
                          className="p-4 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <span className="text-2xl block mb-1">📖</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-violet-630 block">Baiboly Masina</span>
                        </button>
                        
                        <button
                          onClick={() => setActiveTab('Annonces')}
                          className="p-4 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <span className="text-2xl block mb-1">📢</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-violet-630 block">Fampandrenesana</span>
                        </button>
                        
                        <button
                          onClick={() => setActiveTab('Dimes')}
                          className="p-4 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <span className="text-2xl block mb-1">💖</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-violet-630 block">Dîmes & Offrandes</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('Sermons')}
                          className="p-4 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <span className="text-2xl block mb-1">🎤</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-violet-630 block">Prezikazy mivantana</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('Quiz')}
                          className="p-4 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <span className="text-2xl block mb-1">🏆</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-violet-630 block">Lalao Quiz biblique</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('Events')}
                          className="p-4 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <span className="text-2xl block mb-1">📅</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-violet-630 block">Fandaharam-potoana</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verset du jour (Andininy anio) inline card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-slate-900 dark:to-slate-900 border border-amber-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300">
                  <div className="space-y-2">
                    <span className="text-xs font-mono py-0.5 px-2.5 bg-amber-100 dark:bg-amber-955 text-amber-800 dark:text-amber-400 rounded font-bold uppercase tracking-wide">
                      Andininy anio (Quote)
                    </span>
                    <blockquote className={`${isElderlyMode ? 'text-2xl font-bold' : 'text-lg font-medium'} text-slate-800 dark:text-slate-100 italic font-sans leading-relaxed`}>
                      "{DAILY_PROMISES[promiseIndex].text}"
                    </blockquote>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                      — {DAILY_PROMISES[promiseIndex].ref}
                    </p>
                  </div>

                  <button
                    onClick={handleRandomPromise}
                    className="shrink-0 bg-amber-550 hover:bg-amber-600 text-white font-bold py-3 px-5 rounded-xl shadow-md transition-all text-xs cursor-pointer active:scale-95"
                  >
                    Hizaha andininy hafa 🔄
                  </button>
                </div>

                {/* Active Church specific features preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Announcements Preview column */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-750 pb-2.5">
                      <h3 className="font-bold text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Filazana Farany (Latest News)
                      </h3>
                      <button onClick={() => setActiveTab('Annonces')} className="text-xs font-bold text-violet-605">
                        Hijery rehetra
                      </button>
                    </div>

                    <div className="space-y-3">
                      {announcements.filter(a => a.churchId === activeChurchId).slice(0, 2).map(ann => (
                        <div key={ann.id} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-1">
                          <span className="text-[9px] font-bold uppercase bg-violet-100 text-violet-800 dark:bg-violet-950 px-1.5 py-0.5 rounded">
                            {ann.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-850 dark:text-white pt-1">
                            {ann.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {ann.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Members directory Preview column */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-750 pb-2.5">
                      <h3 className="font-bold text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Mpikambana mavitrika taona ity
                      </h3>
                      <button onClick={() => setActiveTab('Settings')} className="text-xs font-bold text-violet-605">
                        Tantano membra
                      </button>
                    </div>

                    <div className="space-y-3">
                      {members.filter(m => m.churchId === activeChurchId).slice(0, 3).map(mem => (
                        <div key={mem.id} className="flex items-center justify-between text-xs p-2.5 bg-slate-50/50 dark:bg-slate-850 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded text-[9px] font-bold flex items-center justify-center">
                              {mem.role[0] || 'M'}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-205">{mem.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-450">{mem.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. BIBLE PAGE VIEW */}
            {activeTab === 'Bible' && (
              <BiblePage isElderlyMode={isElderlyMode} />
            )}

            {/* 3. VERSET DU JOUR STANDALONE PAGE */}
            {activeTab === 'Verset' && (
              <div className="max-w-xl mx-auto py-10 space-y-8 text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-150 dark:border-slate-800">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 rounded-full flex items-center justify-center text-3xl mx-auto animate-[bounce_2s_infinite]">
                  ✨
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-mono py-1 px-3 bg-amber-100 dark:bg-amber-955 text-amber-800 dark:text-amber-400 rounded-full font-bold uppercase tracking-wider">
                    Tenin'Andriamanitra ho anao androany
                  </span>

                  <blockquote className="text-2xl font-serif text-slate-800 dark:text-slate-50 leading-relaxed italic select-text">
                    "{DAILY_PROMISES[promiseIndex].text}"
                  </blockquote>

                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
                    — {DAILY_PROMISES[promiseIndex].ref}
                  </p>
                </div>

                <div className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex gap-4">
                  <button
                    onClick={handleRandomPromise}
                    className="flex-1 py-4 bg-amber-530 hover:bg-amber-600 text-white font-bold rounded-xl shadow cursor-pointer text-base active:scale-95 transition-all"
                  >
                    Haka andininy hafa (Random Promise)
                  </button>
                  <button
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(DAILY_PROMISES[promiseIndex].text);
                      utterance.lang = 'fr-FR';
                      window.speechSynthesis.speak(utterance);
                    }}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl cursor-pointer text-base"
                  >
                    Henoy amin'ny Feo (Read out) 🔊
                  </button>
                </div>
              </div>
            )}

            {/* 4. ANNOUNCEMENTS PAGE VIEW */}
            {activeTab === 'Annonces' && (
              <AnnouncementsPage
                churchId={activeChurchId}
                announcements={announcements}
                onAddAnnouncement={handleAddAnnouncement}
                isElderlyMode={isElderlyMode}
              />
            )}

            {/* 5. EVENTS AGENDA PAGE VIEW */}
            {activeTab === 'Events' && (
              <AgendaPage
                churchId={activeChurchId}
                events={events}
                onAddEvent={handleAddEvent}
                isElderlyMode={isElderlyMode}
              />
            )}

            {/* 6. DIMES & OFFERING PAGE VIEW */}
            {activeTab === 'Dimes' && (
              <GivingPage
                churchId={activeChurchId}
                donations={donations}
                onAddDonation={handleAddDonation}
                isElderlyMode={isElderlyMode}
              />
            )}

            {/* 7. HYMNALS & CHORALES PAGE VIEW */}
            {activeTab === 'Chorales' && (
              <SongPage isElderlyMode={isElderlyMode} />
            )}

            {/* 8. YOUTH WALL PAGE VIEW */}
            {activeTab === 'Jeunes' && (
              <YouthPage isElderlyMode={isElderlyMode} />
            )}

            {/* 9. SERMONS STREAMING PAGE VIEW */}
            {activeTab === 'Sermons' && (
              <SermonsPage
                churchId={activeChurchId}
                sermons={sermons}
                onAddSermon={handleAddSermon}
                isElderlyMode={isElderlyMode}
              />
            )}

            {/* 10. QUIZ GAME PAGE VIEW */}
            {activeTab === 'Quiz' && (
              <QuizPage isElderlyMode={isElderlyMode} />
            )}

            {/* 11. SETTINGS & MEMBER MANAGEMENT */}
            {activeTab === 'Settings' && (
              <div className="space-y-6">
                
                {/* Embedded management of members directly inside settings pane */}
                <div>
                  <MembersPage
                    churchId={activeChurchId}
                    members={members}
                    onAddMember={handleAddMember}
                    isElderlyMode={isElderlyMode}
                  />
                </div>

                {/* Core settings controls */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                      Fikirana ny Sehatra (Settings & Preferences)
                    </h3>
                    <p className="text-xs text-slate-450 dark:text-slate-400">
                      Sivana fakan-drivotra ho an'ny iombonan'ny finoana.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                    
                    {/* Dark/light trigger */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
                        {darkMode ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                        <span>Endrika (Theme display)</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450">
                        Mifandimby amin'ny Maizina na ny Mazava mba ho mora vakina ny andro na alina.
                      </p>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="mt-2 py-2 px-4 bg-white dark:bg-slate-800 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold cursor-pointer hover:shadow-sm"
                      >
                        {darkMode ? "Hivadika ho Mode Clair" : "Hivadika ho Mode Sombre"}
                      </button>
                    </div>

                    {/* Elderly font scale trigger */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
                        <Accessibility className="w-4 h-4 text-violet-600" />
                        <span>Fampiasana Mora Be Taona</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450">
                        Manalehibe sy manazava contrast mba ho mora vakina ho an'ny zokiolona na olona manana fahasembanana maso.
                      </p>
                      <button
                        onClick={() => setIsElderlyMode(!isElderlyMode)}
                        className={`mt-2 py-2 px-4 rounded-lg text-xs font-bold cursor-pointer hover:shadow-sm border ${
                          isElderlyMode 
                            ? 'bg-amber-100 text-amber-800 border-amber-300' 
                            : 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isElderlyMode ? "Hanafoana ny Haben'ny soratra" : "Avelao ho soratra lehibe (On)"}
                      </button>
                    </div>

                  </div>

                  {/* Reset defaults button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Fiangonana Mifandray v1.4.0 Malagasy Edition</span>
                    <button
                      onClick={() => {
                        if (confirm("Haverina amin'ny voalohany ve ny rakitra rehetra (Reset all data)?")) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="text-rose-500 hover:underline font-bold cursor-pointer"
                    >
                      Hamafa ny rakitra mpanorina (Reset Data)
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-sans transition-colors">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-semibold text-slate-500 dark:text-slate-400">
            ✝ Fiangonana Mifandray - "Andriamanitra ho any afovoanao" (Zefania 3:17)
          </p>
          <p>
            Rafi-piasana fiarovana nomerika ho an'ny Fiangonana Malagasy rehetra: FJKM, EKAR, FLM, EEM sy ireo hafa.
          </p>
          <div className="flex justify-center gap-4 text-[10px] text-slate-450 dark:text-slate-600 font-mono">
            <span>Server Container Ingress Mode</span>
            <span>•</span>
            <span>No Cookies Tracked</span>
            <span>•</span>
            <span>Madagascar 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
