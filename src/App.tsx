/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Church, Member, Announcement, ChurchEvent, Sermon, Donation, DailyMana } from './types';
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
import LoginPage from './components/LoginPage';
import CelestialAnimation from './components/CelestialAnimation';


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
  PhoneCall,
  Plus,
  Star,
  ArrowLeft
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

const INITIAL_DAILY_MANAS: DailyMana[] = [
  {
    id: "m-j1",
    churchId: "fjkm-isotry",
    code: "J1",
    num: 1,
    text: "Matokia an'i Jehovah amin'ny fonao rehetra, fa aza miantehitra amin'ny fahalalanao. Maneke Azy amin'ny alehanao rehetra, fa Izy handamina ny lalanao.",
    ref: "Ohabolana 3:5-6",
    commentary: "Ny fahatokiana an'Andriamanitra amin'ny fo rehetra no fototry ny fiainana kristiana vanona. Rehefa manolotra ny lalantsika ho Azy isika, dia Izy no hitantana sy handamina ny androm-piainantsika."
  },
  {
    id: "m-j2",
    churchId: "fjkm-isotry",
    code: "J2",
    num: 2,
    text: "Fa mangataha aloha ny fanjakany sy ny fahamarinany, dia hanampy ho anareo izany rehetra izany.",
    ref: "Matio 6:33",
    commentary: "Aza manahy ny hohanina na ny hosotroina na ny hotafiana. Ny fitadiavana ny Fanjakan'Andriamanitra aloha no zava-dehibe indrindra, ary ny antsiny rehetra dia homeny ho fanampiny."
  },
  {
    id: "m-j3",
    churchId: "fjkm-isotry",
    code: "J3",
    num: 3,
    text: "Fa Izaho mahalala ny hevitra eritreretiko ny aminere, hoy Jehovah, dia hevitra hahasoa, fa tsy hahamasina, hanome anareo fanantenana ny amin'ny ho avy.",
    ref: "Jeremia 29:11",
    commentary: "Na dia be aza ny fitsapana sy ny manjo, ny hevitry ny fona Andriamanitra dia feno fitiavana sy fanantenana ho antsika. Manana hoavy mamirapiratra isika ao Aminy."
  },
  {
    id: "m-j4",
    churchId: "fjkm-isotry",
    code: "J4",
    num: 4,
    text: "Aza matahotra, fa momba anao Aho; aza miherikerika fotsiny, fa Izaho no Andriamanitrao; mampahery anao Aho sady mamonjy anao.",
    ref: "Isaia 41:10",
    commentary: "Tsy miala amintsika ny herin'i Jehovah. Na aiza na aiza alehantsika dia mampahery sy mitantana ary mamonjy isika raha mitoky Aminy."
  }
];


export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  // State management populated with localStorage persistence
  const [churches, setChurches] = useState<Church[]>(() => {
    return INITIAL_CHURCHES;
  });

  const [activeChurchId, setActiveChurchId] = useState<string>(() => {
    return churches[0]?.id || 'fjkm-isotry';
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('mifandray_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [loggedInMember, setLoggedInMember] = useState<Member | null>(() => {
    const saved = localStorage.getItem('mifandray_logged_in_member');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [userScores, setUserScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mifandray_user_scores_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('mifandray_user_scores_v1', JSON.stringify(userScores));
  }, [userScores]);

  const handleUpdateScore = (memberId: string, diff: number) => {
    setUserScores(prev => {
      const current = prev[memberId] || 0;
      const next = Math.max(0, current + diff); // cap at 0
      return { ...prev, [memberId]: next };
    });
  };

  useEffect(() => {
    if (loggedInMember) {
      localStorage.setItem('mifandray_logged_in_member', JSON.stringify(loggedInMember));
    } else {
      localStorage.removeItem('mifandray_logged_in_member');
    }
  }, [loggedInMember]);

  const handleRegisterAndLogin = (name: string, phone: string, requestedRoles: string[], address?: string) => {
    const rolesList = (requestedRoles && requestedRoles.length > 0) ? requestedRoles : ["Sampana Tanora Kristiana (STK)"];
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      churchId: activeChurchId || 'fjkm-isotry',
      name: name,
      phone: phone,
      address: address || "Lot 26 ter mahamasina",
      role: rolesList.join(', '),
      roles: rolesList
    };
    setMembers(prev => [...prev, newMember]);
    setLoggedInMember(newMember);
  };

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
  const [churchRoles, setChurchRoles] = useState<string[]>(() => {
    const saved = localStorage.getItem('mifandray_church_roles');
    const defaultRoles = [
      "Sampana Dorkasy",
      "Sampana Lehilahy Kristianina (SLK)",
      "Sampana Tanora Kristiana (STK)",
      "Sampana Sekoly Alahady (SA)",
      "Sampana Vokovoko Manga",
      "SAMPATI (Sampana Mpanazava sy Tily)",
      "Sampana Fifohazana (SAFIF)",
      "Sampana SF (Sampana Fiangonana)",
      "Chorales (Pihira choral / Antoko mpihira)",
      "Mpampianatra sekoly alahady",
      "Diakra",
      "Mpitandrina",
      "Secretaire"
    ];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.includes("Secretaire")) {
          parsed.push("Secretaire");
        }
        return parsed;
      } catch (e) {}
    }
    return defaultRoles;
  });

  useEffect(() => {
    localStorage.setItem('mifandray_church_roles', JSON.stringify(churchRoles));
  }, [churchRoles]);

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

  // Admin dynamic roles edit states
  const [roleInputValue, setRoleInputValue] = useState('');
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
  const [showChurchSetup, setShowChurchSetup] = useState<boolean>(false);

  // Daily Mana automatic scheduling states
  const [dailyManas, setDailyManas] = useState<DailyMana[]>(() => {
    const saved = localStorage.getItem('mifandray_daily_manas_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DAILY_MANAS;
      }
    }
    return INITIAL_DAILY_MANAS;
  });

  useEffect(() => {
    localStorage.setItem('mifandray_daily_manas_v1', JSON.stringify(dailyManas));
  }, [dailyManas]);

  // Publication start date for automatic J1 publication
  const [manaStartDate, setManaStartDate] = useState<string>(() => {
    const saved = localStorage.getItem('mifandray_mana_start_date_v1');
    return saved || '2026-06-05'; // default to June 5, 2026
  });

  useEffect(() => {
    localStorage.setItem('mifandray_mana_start_date_v1', manaStartDate);
  }, [manaStartDate]);

  const [showManaAdmin, setShowManaAdmin] = useState<boolean>(false);
  const [newManaCode, setNewManaCode] = useState('J5');
  const [newManaText, setNewManaText] = useState('');
  const [newManaRef, setNewManaRef] = useState('');
  const [newManaCommentary, setNewManaCommentary] = useState('');
  const [editingManaId, setEditingManaId] = useState<string | null>(null);

  const [selectedManaIndexOffset, setSelectedManaIndexOffset] = useState<number>(0);
  const [showManaCommentary, setShowManaCommentary] = useState<boolean>(false);


  const addNewRole = () => {
    if (!roleInputValue.trim()) {
      alert("Tsy azo avela ho foana ny anaran'andraikitra!");
      return;
    }
    setChurchRoles(prev => [...prev, roleInputValue.trim()]);
    setRoleInputValue('');
  };

  const saveEditedRole = () => {
    if (!roleInputValue.trim()) {
      alert("Tsy azo avela ho foana ny anaran'andraikitra!");
      return;
    }
    if (editingRoleIndex !== null) {
      setChurchRoles(prev => {
        const copy = [...prev];
        copy[editingRoleIndex] = roleInputValue.trim();
        return copy;
      });
      setRoleInputValue('');
      setEditingRoleIndex(null);
    }
  };

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

  const handleUpdateMember = (id: string, updatedFields: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Tena hovonoina tokoa ve ity mpikambana ity?")) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
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

  const handleUpdateEvent = (id: string, updatedFields: Partial<ChurchEvent>) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updatedFields } : ev));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
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

  // Madagascar timezone-aware automatic daily publication calculation (06:00 rollover)
  const getMadagascarActiveMana = () => {
    const churchManas = dailyManas.filter(m => m.churchId === activeChurchId);
    if (churchManas.length === 0) {
      return { 
        mana: null, 
        dayIndex: 0, 
        isPublished: false,
        debugTargetTimeStr: "",
        elapsedDays: 0
      };
    }

    // Sort by num ascending
    const sortedManas = [...churchManas].sort((a, b) => a.num - b.num);

    const now = new Date();
    // UTC offset shift
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const madaTime = new Date(utcTime + (3 * 3600000)); // UTC+3 Madagascar

    // Publish day rollover at 06:00
    // If hour < 6, use yesterday's day number
    const madaActiveDate = new Date(madaTime);
    if (madaTime.getHours() < 6) {
      madaActiveDate.setDate(madaActiveDate.getDate() - 1);
    }

    // Process Start Date
    const startParts = manaStartDate.split('-');
    // Month is 0-indexed in Date constructor
    const startDate = new Date(
      parseInt(startParts[0], 10), 
      parseInt(startParts[1], 10) - 1, 
      parseInt(startParts[2], 10)
    );

    // Normalize midnights to compute calendar date difference
    const madaMidnight = new Date(madaActiveDate.getFullYear(), madaActiveDate.getMonth(), madaActiveDate.getDate());
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    const diffTime = madaMidnight.getTime() - startMidnight.getTime();
    const elapsedDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    const dayIndex = elapsedDays + 1; // start index = 1 for the first day

    const formattedTime = madaTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (dayIndex <= 0) {
      // Future start date
      return {
        mana: sortedManas[0],
        dayIndex: 1,
        isPublished: false,
        debugTargetTimeStr: formattedTime,
        elapsedDays: elapsedDays
      };
    }

    // Cyclic publish using modulo
    const sequenceIdx = (dayIndex - 1) % sortedManas.length;
    return {
      mana: sortedManas[sequenceIdx],
      dayIndex: dayIndex,
      isPublished: true,
      debugTargetTimeStr: formattedTime,
      elapsedDays: elapsedDays
    };
  };

  const handleSaveMana = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManaCode.trim() || !newManaText.trim() || !newManaRef.trim()) {
      alert("Fenoy avokoa ny banga (Laharana, teny, andalan-tsoratra)!");
      return;
    }

    const numMatch = newManaCode.match(/\d+/);
    const parsedNum = numMatch ? parseInt(numMatch[0], 10) : (dailyManas.filter(m => m.churchId === activeChurchId).length + 1);

    if (editingManaId) {
      setDailyManas(prev => prev.map(m => m.id === editingManaId ? {
        ...m,
        code: newManaCode.trim().toUpperCase(),
        num: parsedNum,
        text: newManaText.trim(),
        ref: newManaRef.trim(),
        commentary: newManaCommentary.trim()
      } : m));
      setEditingManaId(null);
      alert("Voasoratra soa aman-tsara ny fanovana momba ity Mana ity!");
    } else {
      const newM: DailyMana = {
        id: `mana-${Date.now()}`,
        churchId: activeChurchId,
        code: newManaCode.trim().toUpperCase(),
        num: parsedNum,
        text: newManaText.trim(),
        ref: newManaRef.trim(),
        commentary: newManaCommentary.trim()
      };
      setDailyManas(prev => [...prev, newM]);
      alert("Voampiditra soa aman-tsara ny Mana vaovao!");
    }

    // Auto-advance code number for typing productivity
    setNewManaCode(`J${parsedNum + 1}`);
    setNewManaText('');
    setNewManaRef('');
    setNewManaCommentary('');
  };

  const handleDeleteMana = (id: string) => {
    if (confirm("Tena te-hamafa ity Mana ity tokoa ve ianao?")) {
      setDailyManas(prev => prev.filter(m => m.id !== id));
      alert("Voafafa soa aman-tsara!");
    }
  };

  const handleEditManaClick = (m: DailyMana) => {
    setEditingManaId(m.id);
    setNewManaCode(m.code);
    setNewManaText(m.text);
    setNewManaRef(m.ref);
    setNewManaCommentary(m.commentary || '');
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
    { key: 'Jeunes', label: 'Sampana', icon: <Users className="w-5 h-5" /> },
    { key: 'Quiz', label: 'Kilalao', icon: <Award className="w-5 h-5" /> },
  ];

  // Secondary item drawer elements
  const secondaryMenuItems = [
    { key: 'Annonces', label: 'Filazana', icon: <Megaphone className="w-5 h-5" />, color: 'from-violet-500 to-purple-600' },
    { key: 'Events', label: 'Fandaharana', icon: <Calendar className="w-5 h-5" />, color: 'from-amber-400 to-orange-500' },
    { key: 'Dimes', label: 'Tahirim-bola sy Tanjona 💰', icon: <Heart className="w-5 h-5" />, color: 'from-rose-500 to-pink-605' },
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
        
        {isAppLoading ? (
          <CelestialAnimation onComplete={() => setIsAppLoading(false)} />
        ) : !loggedInMember ? (
          <LoginPage
            members={members}
            churchRoles={churchRoles}
            onLogin={setLoggedInMember}
            onRegisterAndLogin={handleRegisterAndLogin}
          />
        ) : (
          <>
            {/* UNIFIED PHONE TOP HEADER ACTION RAIL FOR ALL PAGES */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 px-4 py-3 flex flex-col gap-2 shadow-xs shrink-0 z-30">
              <div className="w-full">
                <span className="font-sans text-sm sm:text-base font-black tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent block">
                  F.P.Fi
                </span>
                <span className="font-sans text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold block leading-tight pt-0.5">
                  Fiangonana Protestanta Fifohazana
                </span>
              </div>
              
              {/* Controls on a dedicated line just below, aligned to the right */}
              <div className="flex items-center justify-end gap-2 w-full">
                {/* Total points balance badge */}
                {loggedInMember && (
                  <div 
                    id="pts-balance-val"
                    className="p-1 px-2.5 text-[9.5px] font-black tracking-wide rounded-lg bg-amber-500 text-slate-950 flex items-center gap-1 shrink-0 shadow-sm animate-scaleIn"
                    title="Isa manontolo (Quiz + Safidy)"
                  >
                    <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                    <span>Isa: {userScores[loggedInMember.id] || 0} pts</span>
                  </div>
                )}
                {/* Logout button */}
                <button
                  id="btn-logout"
                  onClick={() => {
                    if (confirm("Hivoaka ny kaontinao ve ianao?")) {
                      setLoggedInMember(null);
                    }
                  }}
                  className="p-1 px-2.5 text-[9px] font-black tracking-wide rounded-lg border border-rose-200 dark:border-rose-950 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 cursor-pointer active:scale-95 transition-all shadow-xs flex items-center justify-center shrink-0"
                  title="Hivoaka ny kaontinao"
                >
                  Hivoaka
                </button>
                {/* Elderly Friendly Toggle button */}
                <button
                  id="btn-toggle-accessibility"
                  onClick={() => setIsElderlyMode(!isElderlyMode)}
                  className={`p-1 rounded-lg border transition-all text-[8.5px] font-black cursor-pointer flex items-center justify-center gap-0.5 ${
                    isElderlyMode
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-705 shadow-xs'
                  }`}
                  title="Mora vakina be taona"
                >
                  <Accessibility className="w-3.5 h-3.5" />
                </button>

                {/* Theme switcher */}
                <button
                  id="btn-toggle-dark-mode"
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-705 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer active:scale-95 shadow-xs"
                  title="Loko maizina"
                >
                  {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-650" />}
                </button>
              </div>
            </header>

        {/* ACCESSIBLE ANNOUNCEMENT RAIL */}
        {isElderlyMode && (
          <div className="bg-amber-500 text-slate-950 py-1.5 px-3 shadow-inner text-[11px] font-black text-center flex items-center justify-center gap-1 animate-pulse shrink-0">
            <span>👵👨 Mode Be Taona : Sora-masina lehibe !</span>
          </div>
        )}

        {/* MOBILE ACTIVE TAB CONTENT DISPLAY VIEWPORT */}
        <div className={`flex-1 overflow-y-auto scrollbar-thin dark:bg-slate-950 ${activeTab === 'Accueil' ? 'p-0 pb-5' : 'p-4 space-y-4'}`}>
          
          {/* Universal Back Button for Subpages */}
          {activeTab !== 'Accueil' && (
            <button
              onClick={() => {
                setActiveTab('Accueil');
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-2 text-[10.5px] text-slate-505 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-black uppercase tracking-wider bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 py-2 px-3.5 rounded-xl cursor-pointer active:scale-95 transition-all w-fit shadow-xs shrink-0 select-none border border-slate-200/30 dark:border-slate-800/80"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-violet-605" />
              <span>Hiverina (Home / Tongasoa)</span>
            </button>
          )}
          
          {/* View Tab Selector Gate */}

          {/* 1. TONGASOA (HOME SCREEN) */}
          {activeTab === 'Accueil' && (() => {
            const madaManaInfo = getMadagascarActiveMana();
            const sortedChurchManas = [...dailyManas.filter(m => m.churchId === activeChurchId)].sort((a, b) => a.num - b.num);
            
            let displayedMana = madaManaInfo.mana;
            let displayedDayIndex = madaManaInfo.dayIndex;
            
            if (sortedChurchManas.length > 0) {
              if (selectedManaIndexOffset !== 0) {
                const activeIdx = sortedChurchManas.findIndex(m => m.id === madaManaInfo.mana?.id);
                const targetIdx = (activeIdx === -1 ? 0 : activeIdx + selectedManaIndexOffset) % sortedChurchManas.length;
                const safeIdx = (targetIdx + sortedChurchManas.length) % sortedChurchManas.length;
                displayedMana = sortedChurchManas[safeIdx];
                displayedDayIndex = displayedMana.num;
              }
            }

            return (
              <div className="space-y-4 animate-fadeIn animate-duration-300">

                {/* Home main padded container */}
                <div className="px-4 space-y-4 pt-4">

                  {/* Interactive greeting with dynamic island feel - enlarged to occupy the empty space */}
                  <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-center min-h-[180px] md:min-h-[220px]">
                    <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none select-none">
                      <BookOpen className="w-48 h-48" />
                    </div>
                    <p className={`${isElderlyMode ? 'text-2xl font-black' : 'text-base sm:text-lg md:text-xl font-extrabold leading-relaxed'} text-white text-center font-sans tracking-wide italic`}>
                      "{activeChurch.description || DEFAULT_SLOGAN}"
                    </p>
                  </div>
   
                {/* Dynamic Promise of today with robust design */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 border border-amber-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-black uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 py-0.5 px-2 rounded font-sans leading-none">
                        {displayedMana ? `Mana Isan'andro (${displayedMana.code})` : "Andininy anio"}
                      </span>
                      {displayedMana && (
                        <span className="text-[8px] font-black uppercase bg-violet-100 dark:bg-blue-950 text-violet-750 dark:text-blue-300 py-0.5 px-1.5 rounded leading-none flex items-center gap-0.5">
                          <span>⏰ 06:00 Madagascar</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {selectedManaIndexOffset !== 0 && (
                        <button
                          onClick={() => setSelectedManaIndexOffset(0)}
                          className="py-1 px-2 bg-indigo-600 border-b-[2.5px] border-indigo-805 hover:bg-indigo-705 text-white text-[8px] font-black rounded-lg cursor-pointer transition-all active:translate-y-[0.5px]"
                          title="Hiverina amin'ny androany"
                        >
                          Androany 📌
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (sortedChurchManas.length > 0) {
                            setSelectedManaIndexOffset(prev => prev + 1);
                          } else {
                            handleRandomPromise();
                          }
                        }}
                        className="py-1 px-2 bg-amber-500 border-b-[2.5px] border-amber-700 text-white text-[8px] font-black rounded-lg active:translate-y-[0.5px] cursor-pointer"
                        title="Hijery teny hafa"
                      >
                        {sortedChurchManas.length > 0 ? "J-Hafa 🔄" : "Hafa 🔄"}
                      </button>
                    </div>
                  </div>
                  
                  <blockquote className={`${isElderlyMode ? 'text-lg font-black' : 'text-xs font-semibold'} text-slate-800 dark:text-slate-100 italic font-sans leading-relaxed`}>
                    "{displayedMana ? displayedMana.text : activeVerseText}"
                  </blockquote>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                      {displayedMana ? (
                        <span>Ordre: {displayedMana.code} (Andro {displayedDayIndex})</span>
                      ) : (
                        <span>Tenin'ny Tompo</span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono font-black text-amber-700 dark:text-amber-400 text-right">
                      — {displayedMana ? displayedMana.ref : activeVerseRef}
                    </p>
                  </div>

                  {/* Elegant Commentary / Fanazavana collapsing box if present */}
                  {displayedMana?.commentary && (
                    <div className="border-t border-amber-200/50 dark:border-slate-800/80 pt-2.5 mt-2 space-y-1.5">
                      <button
                        onClick={() => setShowManaCommentary(!showManaCommentary)}
                        className="w-full flex items-center justify-between text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 hover:text-amber-900 focus:outline-none py-1 hover:bg-amber-100/30 rounded px-1 transition-colors cursor-pointer select-none"
                      >
                        <span className="flex items-center gap-1">📖 Fanazavana sy Fampiharana</span>
                        <span>{showManaCommentary ? 'Hiafina ✕' : 'Hamaky ➔'}</span>
                      </button>
                      {showManaCommentary && (
                        <div className="bg-amber-100/20 dark:bg-slate-950/40 border border-amber-100/60 dark:border-slate-800/50 p-2.5 rounded-xl text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium whitespace-pre-line animate-slideDown">
                          {displayedMana.commentary}
                        </div>
                      )}
                    </div>
                  )}
                </div>
   
                {/* Grid of latest News & Events inline preview */}
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* Expanded News preview (Annonces) utilizing empty screen space at bottom */}
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">📢</span>
                        <span className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Vaovao sy filazana</span>
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
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-350 border border-amber-200/50 dark:border-amber-805/40'
                          : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-350 border border-indigo-200/50 dark:border-indigo-800/40';
  
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
                            
                            <h4 className="text-xs font-black text-slate-800 dark:text-white leading-snug group-hover:text-violet-650 dark:group-hover:text-violet-400 transition-colors">
                              {ann.title}
                            </h4>
                            <p className="text-[11px] text-slate-605 dark:text-slate-300 leading-relaxed whitespace-pre-line">
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
            );
          })()}

          {/* 2. OVERHAULED BIBLE VIEWPORT */}
          {activeTab === 'Bible' && (
            <BiblePage isElderlyMode={isElderlyMode} />
          )}

          {/* 4. TAHIRIM-BOLA & TANJONA */}
          {activeTab === 'Dimes' && (
            <GivingPage
              churchId={activeChurchId}
              loggedInMember={loggedInMember}
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
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              isElderlyMode={isElderlyMode}
            />
          )}

          {activeTab === 'Jeunes' && (
            <YouthPage
              isElderlyMode={isElderlyMode}
              members={members}
              churchRoles={churchRoles}
              loggedInMember={loggedInMember}
              onLogout={() => setLoggedInMember(null)}
            />
          )}

          {activeTab === 'Quiz' && (
            <QuizPage 
              isElderlyMode={isElderlyMode} 
              loggedInMember={loggedInMember}
              userScore={loggedInMember ? (userScores[loggedInMember.id] || 0) : 0}
              onAddPoints={(pts) => {
                if (loggedInMember) {
                  handleUpdateScore(loggedInMember.id, pts);
                }
              }}
            />
          )}

          {activeTab === 'Settings' && (
            <div className="space-y-4">
              {/* Fitantanana ny Fiangonana Active Admin Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-805 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 py-0.5 px-2 rounded font-sans">
                      Fitantanana ny Fiangonana
                    </span>
                    <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {showChurchSetup ? 'Ampiasaina' : 'Miafina'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowChurchSetup(!showChurchSetup)}
                    className="p-1 px-2.5 bg-violet-600 hover:bg-violet-750 text-white rounded-lg flex items-center gap-1 text-[10px] font-black cursor-pointer active:scale-95 transition-all shadow-xs shrink-0 select-none"
                  >
                    <span>{showChurchSetup ? 'Hanafina Fikirana ✕' : 'Fitantanana ny Fiangonana ⚙️'}</span>
                  </button>
                </div>

                {showChurchSetup && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white leading-none mt-1">
                      Fikirana: <span className="text-violet-600 dark:text-violet-400">{activeChurch.name}</span>
                    </h3>
                    <p className="text-[10px] text-slate-400">Afaka ovaovanao eto ny anarana, teny faneva (slogan), ary ny andinin-tsoratra masina ny fiangonanao.</p>

                    <div className="space-y-3.5 mt-3">
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

                  {/* MANA ISAN'ANDRO & ANDININY AUTOMATED PUBLISHER SYSTEM */}
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3.5 mt-3.5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="block text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                          📅 Fitantanana Mana Isan'andro
                        </span>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 max-w-md leading-normal">
                          Fihodinana ho azy isan'andro amin'ny 06h00 maraina (heure de Madagascar) manaraka ny laharana J1, J2, J3...
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowManaAdmin(!showManaAdmin)}
                        className="py-1 px-2.5 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-[10px] font-black rounded-lg border border-violet-100 dark:border-violet-900/40 cursor-pointer active:scale-95 transition-all"
                      >
                        {showManaAdmin ? 'Hanidy ny tontonana ✕' : 'Hijery / Hikirakira ➔'}
                      </button>
                    </div>

                    {showManaAdmin && (
                      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3 border border-slate-205 dark:border-slate-800 space-y-4 animate-fadeIn">
                        {/* 1. SCHEDULER DATE START */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="space-y-1">
                            <span className="block text-[9.5px] font-extrabold text-slate-700 dark:text-slate-350">
                              🚀 Datin'ny J1 (Datin'ny famoahana voalohany) :
                            </span>
                            <span className="block text-[8.5px] text-slate-450 dark:text-slate-550 italic leading-none">
                              Raha voatendry ny 05 Jona, J1 no mivoaka amin'ny 05 Jona, J2 kosa amin'ny 06 Jona, sns.
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="date"
                              value={manaStartDate}
                              onChange={(e) => setManaStartDate(e.target.value)}
                              className="bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-white text-xs font-black p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* STATUS PREVIEW SUMMARY */}
                        {(() => {
                          const info = getMadagascarActiveMana();
                          return (
                            <div className="p-2.5 bg-indigo-50/50 dark:bg-blue-950/15 border border-indigo-100/50 dark:border-blue-900/40 rounded-lg flex items-center justify-between gap-2 text-[9.5px] text-indigo-900 dark:text-indigo-300">
                              <div className="space-y-1">
                                <span className="font-extrabold flex items-center gap-1">
                                  <span>ℹ️ Statitikan'ny Famoahana Androany:</span>
                                </span>
                                <div className="space-y-0.5 font-medium text-slate-500 dark:text-slate-400">
                                  <p>• Loko/Ora mada: <span className="font-mono text-slate-750 dark:text-slate-300 font-bold">{info.debugTargetTimeStr}</span></p>
                                  <p>• Andro lasa teo zao: <span className="font-bold text-slate-700 dark:text-slate-300">{info.elapsedDays} andro</span></p>
                                  <p>• Mana andrasana anio (Andro faha-{info.dayIndex}): <span className="font-bold text-violet-600 dark:text-violet-400">{info.mana ? info.mana.code : 'Tsy misy'}</span></p>
                                </div>
                              </div>
                              <div className="bg-amber-100 dark:bg-amber-950/85 text-amber-800 dark:text-amber-400 p-1 px-2 rounded font-black text-center shrink-0 border border-amber-200/40">
                                <span className="block text-[8px] uppercase tracking-wide">Aktiva Androany</span>
                                <span className="text-xs font-mono">{info.mana ? info.mana.code : 'None'}</span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 2. MANA MANAGE CONTAINER (Left: Create / Edit, Right: List) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          
                          {/* FORM PANEL */}
                          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-150 dark:border-slate-800/80 space-y-3">
                            <span className="block text-[9.5px] font-black uppercase text-violet-650 dark:text-violet-300 border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                              {editingManaId ? '✏️ Hanova ity Mana ity' : '➕ Mana Vaovao'}
                            </span>
                            
                            <form onSubmit={handleSaveMana} className="space-y-3">
                              <div>
                                <label className="block text-[8.5px] font-black text-slate-500 uppercase mb-0.5">
                                  Laharana / Laharana filaharana (ex: J1, J2, J10...)
                                </label>
                                <input
                                  type="text"
                                  value={newManaCode}
                                  onChange={(e) => setNewManaCode(e.target.value)}
                                  placeholder="J1"
                                  className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-white text-xs font-black p-1.5 rounded-lg border border-slate-205 dark:border-slate-750 focus:ring-1 focus:ring-violet-500 focus:outline-none uppercase"
                                />
                              </div>

                              <div>
                                <label className="block text-[8.5px] font-black text-slate-500 uppercase mb-0.5">
                                  Soratra Masina (Teny fampanantenana / Mana)
                                </label>
                                <textarea
                                  value={newManaText}
                                  onChange={(e) => setNewManaText(e.target.value)}
                                  placeholder="Aza matahotra na mivadi-po fa momba anao Izy..."
                                  rows={4}
                                  className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-white text-xs p-1.5 rounded-lg border border-slate-205 dark:border-slate-750 focus:ring-1 focus:ring-violet-500 focus:outline-none leading-relaxed italic"
                                />
                              </div>

                              <div>
                                <label className="block text-[8.5px] font-black text-slate-500 uppercase mb-0.5">
                                  Andalan-tsoratra (Ref)
                                </label>
                                <input
                                  type="text"
                                  value={newManaRef}
                                  onChange={(e) => setNewManaRef(e.target.value)}
                                  placeholder="Isaia 41:10"
                                  className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-white text-xs p-1.5 rounded-lg border border-slate-205 dark:border-slate-750 focus:ring-1 focus:ring-violet-500 focus:outline-none font-semibold font-mono"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-0.5">
                                  <label className="block text-[8.5px] font-black text-slate-500 uppercase">
                                    📖 Fanazavana fanampiny / Fampiharana (commentary - safidy)
                                  </label>
                                  <span className="text-[7.5px] px-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded">Ivelany</span>
                                </div>
                                <textarea
                                  value={newManaCommentary}
                                  onChange={(e) => setNewManaCommentary(e.target.value)}
                                  placeholder="Ny andininy anio dia mampatsiahy antsika ny fitiavan'Andriamanitra..."
                                  rows={3}
                                  className="w-full bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-white text-[11px] p-1.5 rounded-lg border border-slate-205 dark:border-slate-750 focus:ring-1 focus:ring-violet-500 focus:outline-none leading-relaxed"
                                />
                              </div>

                              <div className="flex items-center gap-1.5 pt-1">
                                <button
                                  type="submit"
                                  className="flex-1 py-1 px-3 bg-violet-600 border-b-[2.5px] border-violet-850 hover:bg-violet-700 text-white text-[10px] font-black rounded-lg cursor-pointer transition-all active:translate-y-[0.5px]"
                                >
                                  {editingManaId ? 'Tehirizina 💾' : 'Ampidirina 🚀'}
                                </button>
                                {editingManaId && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingManaId(null);
                                      setNewManaCode(`J${dailyManas.filter(m => m.churchId === activeChurchId).length + 1}`);
                                      setNewManaText('');
                                      setNewManaRef('');
                                      setNewManaCommentary('');
                                    }}
                                    className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg cursor-pointer"
                                  >
                                    Canselo
                                  </button>
                                )}
                              </div>
                            </form>
                          </div>

                          {/* LIST PANEL */}
                          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-150 dark:border-slate-800/80 space-y-2">
                            <span className="block text-[9.5px] font-black uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                              📋 Lisitry ny Mana (Sorted J1, J2, J3...)
                            </span>
                            
                            <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 scrollbar">
                              {dailyManas.filter(m => m.churchId === activeChurchId).length === 0 ? (
                                <p className="text-[10px] text-slate-400 text-center py-8 italic">
                                  Tsy misy Mana mbola voasoratra. Mampidira vaovao ho an'ny fiangonanao.
                                </p>
                              ) : (
                                [...dailyManas.filter(m => m.churchId === activeChurchId)]
                                  .sort((a,b)=>a.num - b.num)
                                  .map((m) => {
                                    const isActiveNow = getMadagascarActiveMana().mana?.id === m.id;
                                    return (
                                      <div
                                        key={m.id}
                                        className={`p-2 rounded-lg border text-[10px] space-y-1.5 transition-all ${
                                          isActiveNow 
                                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/50' 
                                            : 'bg-slate-50 dark:bg-slate-900/45 border-slate-200/60 dark:border-slate-800/40 hover:border-slate-350 dark:hover:border-slate-700'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-extrabold text-[10.5px] text-violet-650 dark:text-violet-400 uppercase bg-violet-100/60 dark:bg-violet-950/40 px-1.5 rounded">
                                              {m.code}
                                            </span>
                                            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                                              (Lah: {m.num})
                                            </span>
                                            {isActiveNow && (
                                              <span className="text-[8px] bg-amber-500 text-slate-950 font-black px-1 rounded animate-pulse">
                                                Androany 🔥
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              type="button"
                                              onClick={() => handleEditManaClick(m)}
                                              className="p-1 px-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-950 hover:text-violet-600 dark:hover:text-violet-400 text-slate-650 dark:text-slate-300 rounded cursor-pointer font-bold text-[9px]"
                                            >
                                              ✏️ Hanova
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteMana(m.id)}
                                              className="p-1 px-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-605 text-slate-650 dark:text-slate-300 rounded cursor-pointer font-bold text-[9px]"
                                            >
                                              ✕ Fafana
                                            </button>
                                          </div>
                                        </div>

                                        <blockquote className="text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed pl-1.5 border-l-2 border-slate-200 dark:border-slate-800">
                                          "{m.text}"
                                        </blockquote>

                                        <div className="flex items-center justify-between text-[8px] pl-1 text-slate-400 dark:text-slate-500 font-medium">
                                          <span className="truncate max-w-[160px]">
                                            {m.commentary ? "📖 Misy Fanazavana" : "✕ Tsy misy fanazavana"}
                                          </span>
                                          <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                                            — {m.ref}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })
                              )}
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    )}
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
                      <span className="block text-[10px] font-black text-slate-400 uppercase">Vaovao sy filazana ao amin'ny tongasoa</span>
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
                      className="flex-1 py-1.5 bg-violet-600 hover:bg-violet-700 font-bold text-white text-[10px] rounded-lg cursor-pointer transition-all active:translate-y-[1px]"
                    >
                      Tehirizina ny fanovana 💾
                    </button>
                    <button
                      onClick={handleDeleteActiveChurch}
                      className="py-1.5 px-3 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 font-bold text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 border border-red-200"
                      title="Hamafa ity fiangonana ity"
                    >
                      Hofafana ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

              {/* Andraikitra sy Sampana Management Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-3">
                <span className="text-[9px] font-black uppercase bg-amber-100 dark:bg-amber-955 text-amber-700 dark:text-amber-300 py-0.5 px-2 rounded font-sans">
                  Andraikitra sy Sampana
                </span>
                
                <div className="flex items-center justify-between gap-2 mt-1">
                  <h3 className="font-extrabold text-xs text-slate-850 dark:text-white leading-none">
                    Andraikitra ao amin'ny Fiangonana
                  </h3>
                  <button
                    onClick={() => {
                      setEditingRoleIndex(null);
                      setRoleInputValue('');
                      const el = document.getElementById('new-role-input');
                      if (el) el.focus();
                    }}
                    className="p-1 px-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1 text-[10px] font-black cursor-pointer active:scale-95 transition-all shadow-xs"
                    title="Hampiditra sampana vaovao"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Sampana Vaovao</span>
                  </button>
                </div>

                <p className="text-[10px] text-slate-400">
                  Azonao atao ny mampiditra andraikitra vaovao, manova, na mamafa ireo efa misy izay isafidianana amin'ny fampidirana mpikambana.
                </p>

                {/* Form to Add / Edit a Role */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl space-y-2 border border-slate-200 dark:border-slate-850">
                  <span className="block text-[9.5px] font-black text-slate-400 dark:text-slate-500 uppercase">
                    {editingRoleIndex !== null ? `Hanova ny Andraikitra faha-${editingRoleIndex + 1}` : 'Hampiditra Andraikitra Vaovao'}
                  </span>
                  <div className="flex gap-2">
                    <input
                      id="new-role-input"
                      type="text"
                      value={roleInputValue}
                      onChange={(e) => setRoleInputValue(e.target.value)}
                      placeholder="Ohatra: Sampana Dorkasy..."
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-850 dark:text-slate-100 outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                    />
                    {editingRoleIndex !== null ? (
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={saveEditedRole}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-xs rounded-lg cursor-pointer"
                        >
                          Tehirizina
                        </button>
                        <button
                          onClick={() => {
                            setEditingRoleIndex(null);
                            setRoleInputValue('');
                          }}
                          className="py-1.5 px-2 bg-slate-350 hover:bg-slate-450 font-bold text-white text-xs rounded-lg cursor-pointer"
                        >
                          Avelao
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={addNewRole}
                        className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 font-bold text-white text-xs rounded-lg cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Hampiditra</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* List of Church Roles with simple scroll */}
                <div className="max-h-60 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                  {churchRoles.map((roleName, rIdx) => (
                    <div key={roleName + rIdx} className="p-2.5 flex items-center justify-between gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] text-slate-400 font-mono">#{rIdx + 1}</span>
                        <span className="truncate">{roleName}</span>
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingRoleIndex(rIdx);
                            setRoleInputValue(roleName);
                          }}
                          className="p-1 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-[10px] text-slate-650 dark:text-slate-300 rounded cursor-pointer"
                        >
                          Ovao ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Tena ho fafanao tokoa ve ny andraikitra "${roleName}"?`)) {
                              setChurchRoles(prev => prev.filter((_, idx) => idx !== rIdx));
                              if (editingRoleIndex === rIdx) {
                                setEditingRoleIndex(null);
                                setRoleInputValue('');
                              }
                            }
                          }}
                          className="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-[10px] text-rose-600 rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Member lists nested in settings admin screen */}
              <div>
                <MembersPage
                  churchId={activeChurchId}
                  members={members}
                  churchRoles={churchRoles}
                  onAddMember={handleAddMember}
                  onUpdateMember={handleUpdateMember}
                  onDeleteMember={handleDeleteMember}
                  isElderlyMode={isElderlyMode}
                />
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

          </>
        )}

      </div>
    </div>
  );
}
