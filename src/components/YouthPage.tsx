/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { Member, SampanaPost, SampanaComment } from '../types';
import {
  Users,
  Sparkles,
  Send,
  Heart,
  Smile,
  Edit2,
  Trash2,
  MessageCircle,
  Clock,
  UserCheck,
  ChevronDown,
  HelpCircle,
  ThumbsUp,
  X,
  Plus,
  MessageSquareOff,
  Phone,
  MapPin,
  Globe,
  LogOut,
  Coins
} from 'lucide-react';

interface YouthPageProps {
  isElderlyMode: boolean;
  members: Member[];
  churchRoles: string[];
  loggedInMember: Member | null;
  onLogout: () => void;
}

// Default initial posts in case localStorage is empty
const INITIAL_SAMPANA_POSTS: SampanaPost[] = [
  {
    id: "post-init-1",
    sampanaName: "Sampana Tanora Kristiana (STK)",
    authorId: "mem-init-stk",
    authorName: "Andry Tiana",
    content: "Zava-dehibe loha-laharana ho antsika tanora ny fandalinana ny Tenin'Andriamanitra. Tonga soa avokoa isika amin'ny alahady izao amin'ny fivoriana mahazatra!",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    color: "bg-blue-50 dark:bg-blue-955/20 border-blue-200 dark:border-blue-900/40",
    likes: ["mem-init-dorkasy"],
    reactions: { "👍": ["mem-init-dorkasy"], "❤️": ["mem-init-lh"] },
    comments: [
      {
        id: "com-init-1",
        authorId: "mem-init-lh",
        authorName: "Harijaona",
        content: "Tena marina izany! Vonona tantsoroka ny SLK.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: "post-init-2",
    sampanaName: "Sampana Dorkasy",
    authorId: "mem-init-dorkasy",
    authorName: "Ramatoa Lala",
    content: "Faly miarahaba antsika mianakavy. Ny asa famonjena sy ny fiantrana fanao isantaona dia hanomboka amin'ny herinandro ho avy izao. Mandray izay fandraisan'anjara rehetra mivantana ny birao.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    color: "bg-pink-50 dark:bg-pink-955/20 border-pink-200 dark:border-pink-900/40",
    likes: ["mem-init-lh"],
    reactions: { "❤️": ["mem-init-stk"] },
    comments: []
  }
];

const PRESET_COLORS = [
  { key: 'bg-violet-50 dark:bg-violet-955/20 border-violet-200 dark:border-violet-900/30', color: 'bg-violet-500' },
  { key: 'bg-amber-50 dark:bg-amber-955/20 border-amber-200 dark:border-amber-900/30', color: 'bg-amber-500' },
  { key: 'bg-blue-50 dark:bg-blue-955/20 border-blue-200 dark:border-blue-900/30', color: 'bg-blue-500' },
  { key: 'bg-emerald-50 dark:bg-emerald-955/20 border-emerald-200 dark:border-emerald-900/30', color: 'bg-emerald-500' },
  { key: 'bg-pink-50 dark:bg-pink-955/20 border-pink-200 dark:border-pink-900/30', color: 'bg-pink-500' }
];

const EMOTICONS = [
  { emoji: '👍', label: 'Tsara' },
  { emoji: '❤️', label: 'Tia' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Toa' },
  { emoji: '😢', label: 'Malahelo' },
  { emoji: '😡', label: 'Tezitra' }
];

const getMemberAvatar = (memberId: string) => {
  const avatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80"
  ];
  let sum = 0;
  const idStr = memberId || "";
  for (let i = 0; i < idStr.length; i++) {
    sum += idStr.charCodeAt(i);
  }
  return avatars[sum % avatars.length];
};

const formattedAr = (val: number) => {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val) + " Ar";
};

export default function YouthPage({ isElderlyMode, members, churchRoles, loggedInMember, onLogout }: YouthPageProps) {
  // Posts stored in state & localStorage
  const [posts, setPosts] = useState<SampanaPost[]>(() => {
    const saved = localStorage.getItem('mifandray_sampana_posts');
    return saved ? JSON.parse(saved) : INITIAL_SAMPANA_POSTS;
  });

  // Finances state for currently viewed Sampana, persistent in localStorage
  const [finances, setFinances] = useState<Record<string, { balance: number; lastExpense: number; expenseLabel: string }>>(() => {
    const saved = localStorage.getItem('mifandray_sampana_finances_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      'Sampana Tanora Kristiana (STK)': { balance: 1250000, lastExpense: 350000, expenseLabel: 'Fitaovam-panamafisam-peo hira' },
      'Sampana Lahikambana (SLK)': { balance: 850000, lastExpense: 120000, expenseLabel: 'Fitaterana fitoriana teny' },
      'Dorkasy': { balance: 1890000, lastExpense: 450000, expenseLabel: 'Fanampiana sy fizarana sakafo' },
      'VFTM': { balance: 620500, lastExpense: 85000, expenseLabel: 'Tsakitsaky sy ranom-boankazo' },
      'Sampana SAF': { balance: 980000, lastExpense: 150000, expenseLabel: 'Fahasalamana fototra' },
      'Sampana SFL (Sampana Fiangonana sy ny Loholona)': { balance: 1500000, lastExpense: 200000, expenseLabel: 'Fivorian\'ny Loholona' }
    };
  });

  // Persist finances to localStorage
  useEffect(() => {
    localStorage.setItem('mifandray_sampana_finances_v4', JSON.stringify(finances));
  }, [finances]);

  const handleEditBalance = (samp: string) => {
    const sampKey = samp || 'Sampana Tanora Kristiana (STK)';
    const current = finances[sampKey] || { balance: 500000, lastExpense: 50000, expenseLabel: 'Fandaniana' };
    const answer = prompt(`Hanova ny Tahiry (Balance) ao amin'ny ${sampKey} (Ar) :`, current.balance.toString());
    if (answer !== null) {
      const parsed = parseFloat(answer.replace(/\s+/g, ''));
      if (!isNaN(parsed) && parsed >= 0) {
        setFinances(prev => ({
          ...prev,
          [sampKey]: { ...current, balance: parsed }
        }));
      }
    }
  };

  const handleEditExpense = (samp: string) => {
    const sampKey = samp || 'Sampana Tanora Kristiana (STK)';
    const current = finances[sampKey] || { balance: 500000, lastExpense: 50000, expenseLabel: 'Fandaniana' };
    const amountStr = prompt(`Hanova ny Fandaniana farany ao amin'ny ${sampKey} (Ar) :`, current.lastExpense.toString());
    if (amountStr !== null) {
      const parsedAmount = parseFloat(amountStr.replace(/\s+/g, ''));
      if (!isNaN(parsedAmount) && parsedAmount >= 0) {
        const desc = prompt("Inona no anton'izany fandaniana izany? (Ohatra: Fividianana fitaovana)", current.expenseLabel);
        if (desc !== null) {
          setFinances(prev => ({
            ...prev,
            [sampKey]: { ...current, lastExpense: parsedAmount, expenseLabel: desc || 'Fandaniana' }
          }));
        }
      }
    }
  };

  const activeMemberId = loggedInMember?.id || '';

  // Keep posts synced in localStorage
  useEffect(() => {
    localStorage.setItem('mifandray_sampana_posts', JSON.stringify(posts));
  }, [posts]);

  // Find active member object
  const activeUser = members.find(m => m.id === activeMemberId) || loggedInMember;

  // Parse active member's Sampana lists
  const getSimulatedUserSampana = (): string[] => {
    if (!activeUser) return [];
    // User roles might be stored in roles array or role string parsed by comma
    const list = activeUser.roles || (activeUser.role ? activeUser.role.split(', ').map(r => r.trim()).filter(Boolean) : []);
    
    // We only want to keep the ones that actually exist in available churchRoles to bypass standard static system roles if any
    return list;
  };

  const userSampanaList = getSimulatedUserSampana();

  // Active viewed Sampana room
  const [viewedSampana, setViewedSampana] = useState<string>('');

  // Auto set viewed Sampana room when activeUser changes
  useEffect(() => {
    if (userSampanaList.length > 0) {
      // If previous viewed is in the user's list, keep it, otherwise default to first
      if (!userSampanaList.includes(viewedSampana)) {
        setViewedSampana(userSampanaList[0]);
      }
    } else {
      setViewedSampana('');
    }
  }, [activeMemberId, activeUser, userSampanaList]);

  // Form write state
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].key);

  // Edit post state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Comment typing state
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  // Active reactions tray popover state
  const [reactionsTrayPostId, setReactionsTrayPostId] = useState<string | null>(null);

  // Active visible comment drawer state
  const [visibleCommentsPostId, setVisibleCommentsPostId] = useState<{ [postId: string]: boolean }>({});

  // Posting message helper
  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) {
      alert("Mifidiana mpikambana mpandefa hafatra aloha azafady!");
      return;
    }
    if (!viewedSampana) {
      alert("Tsy misy sampana azo handefasana hafatra!");
      return;
    }
    if (!text.trim()) {
      return;
    }

    const newPost: SampanaPost = {
      id: `post-${Date.now()}`,
      sampanaName: viewedSampana,
      authorId: activeUser.id,
      authorName: activeUser.name,
      content: text.trim(),
      createdAt: new Date().toISOString(),
      color: selectedColor,
      likes: [],
      reactions: {},
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setText('');
  };

  // Like logic
  const handleLikePost = (postId: string) => {
    if (!activeUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const alreadyLiked = p.likes.includes(activeUser.id);
      const updatedLikes = alreadyLiked 
        ? p.likes.filter(id => id !== activeUser.id)
        : [...p.likes, activeUser.id];
      return { ...p, likes: updatedLikes };
    }));
  };

  // Emoticon reaction logic
  const handleReactPost = (postId: string, emoji: string) => {
    if (!activeUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      
      const reactions = (p.reactions ? JSON.parse(JSON.stringify(p.reactions)) : {}) as Record<string, string[]>;
      
      // Initialize if not present
      if (!reactions[emoji]) {
        reactions[emoji] = [];
      }

      const userAlreadyReacted = reactions[emoji].includes(activeUser.id);

      // Clean other reactions of this user for this post to act like Facebook
      Object.keys(reactions).forEach(k => {
        reactions[k] = reactions[k].filter(id => id !== activeUser.id);
      });

      if (!userAlreadyReacted) {
        reactions[emoji] = [...(reactions[emoji] || []), activeUser.id];
      }

      // Filter out empty emojis lists
      const cleaned: Record<string, string[]> = {};
      Object.entries(reactions).forEach(([em, list]) => {
        const listArray = list as string[];
        if (listArray.length > 0) {
          cleaned[em] = listArray;
        }
      });

      return { ...p, reactions: cleaned };
    }));
    setReactionsTrayPostId(null);
  };

  // Comments addition
  const handleAddComment = (postId: string) => {
    const commentText = commentInputs[postId];
    if (!activeUser || !commentText || !commentText.trim()) return;

    const newComment: SampanaComment = {
      id: `comment-${Date.now()}`,
      authorId: activeUser.id,
      authorName: activeUser.name,
      content: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const currentComments = p.comments || [];
      return { ...p, comments: [...currentComments, newComment] };
    }));

    // Reset input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    // Auto open comment section
    setVisibleCommentsPostId(prev => ({ ...prev, [postId]: true }));
  };

  // Delete Comment helper
  const handleDeleteComment = (postId: string, commentId: string) => {
    if (confirm("Tena hovonoina tokoa ve ity tamberina ity?")) {
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: (p.comments || []).filter(c => c.id !== commentId)
        };
      }));
    }
  };

  // Delete Post
  const handleDeletePost = (postId: string) => {
    if (confirm("Tena ho fafanao tanteraka ve ity hafatra ity?")) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  // Editing logic toggle
  const startEditingPost = (post: SampanaPost) => {
    setEditingPostId(post.id);
    setEditingContent(post.content);
  };

  // Saving edited content
  const handleSaveEditPost = (postId: string) => {
    if (!editingContent.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, content: editingContent.trim() };
      }
      return p;
    }));
    setEditingPostId(null);
    setEditingContent('');
  };

  // Filter and sort posts in current viewed Sampana (newest first / le dernier poste s'affiche en premier en haut)
  const currentSampanaPosts = [...posts]
    .filter(p => p.sampanaName === viewedSampana)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Time formatting helper
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      // check if today
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `Vao teo (${hours}:${minutes})`;
      }
      return date.toLocaleDateString('mg-MG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Androany";
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Dynamic Sampana Room Selector at the absolute top (en haut) */}
      {activeUser && userSampanaList.length > 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-2.5 shadow-xs flex flex-col gap-1.5 animate-scaleIn">
          <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            Misafidiana Sampana ho jerena:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {userSampanaList.map((samp) => {
              const isSelected = viewedSampana === samp;
              return (
                <button
                  key={samp}
                  onClick={() => setViewedSampana(samp)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-violet-650 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-400 border border-slate-150/50 dark:border-slate-800/80'
                  }`}
                >
                  {samp}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. ULTRA HIGH FIDELITY MEMBER BUSINESS CARD & FINANCIAL BALANCE BLOCKS (CORED BY USER INTENT) */}
      {activeUser ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Member Card - Half Size Layout (Réduite à moitié) */}
          <div id="mifandray-member-card" className="bg-gradient-to-r from-[#170f4b] via-[#1f135e] to-[#2a1387] text-white p-4 rounded-2xl shadow-lg relative overflow-hidden ring-1 ring-violet-500/20 max-w-full flex flex-col justify-center min-h-[140px]">
            {/* Subtle atmosphere lights */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              {/* PORTRAIT & MINI NAME */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative w-15 h-15 rounded-full border-2 border-amber-400 shadow-md overflow-hidden bg-violet-950 flex items-center justify-center">
                  <img
                    src={getMemberAvatar(activeUser.id)}
                    alt={activeUser.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
                    }}
                  />
                  {/* Small gold crown or design emblem */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center border border-indigo-950">
                    <span className="text-[7px] font-black text-indigo-950">★</span>
                  </div>
                </div>
                {/* Yellow bold short name */}
                <span className="mt-1.5 block text-amber-400 font-extrabold text-xs uppercase tracking-wider text-center max-w-[85px] truncate">
                  {activeUser.name.split(' ')[0]}
                </span>
              </div>

              {/* CARD DETAILS */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5 border-l border-white/10 pl-3.5">
                {/* Information badge */}
                <div className="self-start text-[7.5px] font-black uppercase tracking-widest text-amber-200 bg-white/5 py-0.5 px-1.5 rounded-md border border-white/5 leading-none">
                  F.P.F.I Mpikambana
                </div>

                {/* Info Row 1: Finday */}
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-bold tracking-tight font-mono text-white/95">
                    {activeUser.phone || '033 45 678 90'}
                  </span>
                </div>

                {/* Info Row 2: Adiresy */}
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-3 h-3 text-violet-300 shrink-0" />
                  <span className="text-[10px] text-white/90 truncate leading-tight" title={activeUser.address}>
                    {activeUser.address || 'Lot 26 ter mahamasina'}
                  </span>
                </div>

                {/* Info Row 3: Sampana */}
                <div className="flex items-center gap-2 min-w-0">
                  <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[10px] font-black text-amber-300 truncate leading-tight">
                    {viewedSampana || userSampanaList[0] || 'STK'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2 Financial Cards (1 Green for Balance, 1 Blue for Expense) */}
          <div className="grid grid-cols-2 gap-3 min-h-[140px]">
            
            {/* Green Balance Block */}
            <div
              onClick={() => handleEditBalance(viewedSampana || userSampanaList[0] || 'STK')}
              title="Kitiho eto raha hanova ny tahiry (Balance)"
              className="bg-emerald-950/20 dark:bg-emerald-950/30 hover:bg-emerald-950/30 border-2 border-emerald-500/50 hover:border-emerald-400 p-3 rounded-2xl flex flex-col justify-between transition-all cursor-pointer shadow-md select-none active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-1 relative z-10">
                <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase leading-none">
                  Tahiry
                </span>
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 border border-emerald-550/20 group-hover:scale-110 transition-transform">
                  <Coins className="w-2.5 h-2.5 text-emerald-400" />
                </div>
              </div>

              <div className="mt-2.5 relative z-10">
                <span className="block text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">
                  BALANCE :
                </span>
                <span className="block text-sm sm:text-base font-black text-emerald-400 font-mono mt-1 drop-shadow-sm select-all">
                  {formattedAr(
                    (finances[viewedSampana || userSampanaList[0] || 'Sampana Tanora Kristiana (STK)'] || {
                      balance: 500000
                    }).balance
                  )}
                </span>
              </div>

              {/* Edit tip */}
              <span className="text-[7.5px] font-extrabold text-emerald-400/85 mt-2 bg-emerald-400/10 px-1 py-0.5 rounded border border-emerald-400/10 self-start leading-none">
                Hanova ✎
              </span>

              <div className="absolute -bottom-8 -right-8 w-14 h-14 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Blue Expense Block */}
            <div
              onClick={() => handleEditExpense(viewedSampana || userSampanaList[0] || 'STK')}
              title="Kitiho eto raha hanova ny fandaniana farany"
              className="bg-sky-950/20 dark:bg-sky-950/30 hover:bg-sky-950/30 border-2 border-sky-500/50 hover:border-sky-400 p-3 rounded-2xl flex flex-col justify-between transition-all cursor-pointer shadow-md select-none active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-1 relative z-10">
                <span className="text-[9px] font-black tracking-widest text-sky-400 uppercase leading-none">
                  Fandaniana
                </span>
                <div className="w-5.5 h-5.5 rounded-full bg-sky-500/15 flex items-center justify-center shrink-0 border border-sky-550/20 group-hover:scale-110 transition-transform">
                  <LogOut className="w-2.5 h-2.5 text-sky-400 -rotate-90" />
                </div>
              </div>

              <div className="mt-2.5 relative z-10 leading-tight">
                <span className="block text-[8px] font-black text-sky-400 uppercase tracking-widest leading-none">
                  FARANY :
                </span>
                <span className="block text-sm sm:text-base font-black text-sky-300 font-mono mt-0.5 drop-shadow-sm truncate select-all">
                  {formattedAr(
                    (finances[viewedSampana || userSampanaList[0] || 'Sampana Tanora Kristiana (STK)'] || {
                      lastExpense: 50000
                    }).lastExpense
                  )}
                </span>
                <span className="block text-[7px] font-extrabold text-slate-400 truncate tracking-tight leading-none mt-1" title={
                  (finances[viewedSampana || userSampanaList[0] || 'Sampana Tanora Kristiana (STK)'] || {
                    expenseLabel: 'Fandaniana'
                  }).expenseLabel
                }>
                  {(finances[viewedSampana || userSampanaList[0] || 'Sampana Tanora Kristiana (STK)'] || {
                    expenseLabel: 'Fiaraha-mientana'
                  }).expenseLabel}
                </span>
              </div>

              {/* Edit tip */}
              <span className="text-[7.5px] font-extrabold text-sky-400/85 mt-2 bg-sky-400/10 px-1 py-0.5 rounded border border-sky-400/10 self-start leading-none">
                Hanova ✎
              </span>

              <div className="absolute -bottom-8 -right-8 w-14 h-14 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
            </div>

          </div>

        </div>
      ) : null}

      {/* Elegant logout action trigger requested by user - positioned below */}
      {activeUser && (
        <div className="flex justify-end pr-1 mt-1">
          <button
            id="btn-sortir-sampana"
            onClick={() => {
              if (confirm("Hivoaka ny kaontinao ve ianao?")) {
                onLogout();
              }
            }}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-black text-[11px] uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 border-b-[3px] border-rose-800 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Hivoaka ny application (Sortir)</span>
          </button>
        </div>
      )}

      {/* 2. CORE DEPARTMENT SCREEN - MOVED ALL THE WAY UP AND DE-CLUTTERED AS REQUESTED */}
      {activeUser && userSampanaList.length === 0 && (
        <div className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-8 text-center space-y-3">
          <MessageSquareOff className="w-10 h-10 mx-auto text-rose-500" />
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Tsy mbola nahazo Sampana ianao</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Ry <strong className="text-slate-700 dark:text-slate-300">{activeUser.name}</strong>, tsy mbola manana sampana voatondro mavitrika ianao ao amin'ny rafitra. 
            Mifandraisa amin'ny Mpitantana (Admin / Fitantanana) mba hampidirana anao amin'ny Sampana na hanovanao ny andraikitrao.
          </p>
        </div>
      )}

      {activeUser && userSampanaList.length > 0 && (
        <div className="space-y-4">

          {/* Form to submit POST inside room */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-3">
            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 leading-none">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Hampandry hafatra ho an'ny {viewedSampana}</span>
            </h3>

            <form onSubmit={handlePostMessage} className="space-y-3">
              <div>
                <textarea
                  required
                  rows={2.5}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Manorata teny fampaherezana, vaovao na dinika kely eto ry ${activeUser.name}...`}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-850 dark:text-white outline-none font-semibold focus:ring-1 focus:ring-violet-500 leading-snug"
                />
              </div>

              {/* Preset selection and submit click */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-50 dark:border-slate-850 pt-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Preset Color:</span>
                  <div className="flex gap-1">
                    {PRESET_COLORS.map((p) => (
                      <button
                        type="button"
                        key={p.key}
                        onClick={() => setSelectedColor(p.key)}
                        className={`w-5 h-5 rounded-full border cursor-pointer ${p.color} ${
                          selectedColor === p.key ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-slate-900' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all self-end sm:self-auto shrink-0 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 fill-white" />
                  <span>Haparitaka (Post)</span>
                </button>
              </div>
            </form>
          </div>

          {/* LIST OF CURRENT POSTS AT THE BOTTOM - NEWEST ON TOP */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none">
                Miresaka ato amin'ny Rindrina ({currentSampanaPosts.length} post)
              </span>
            </div>

            {currentSampanaPosts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-150 dark:border-slate-800 text-center text-slate-450 space-y-1">
                <MessageCircle className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-extrabold">Mbola madio ity takelaka ity.</p>
                <p className="text-[10.5px] text-slate-400">Tongava voalohany hanoratra ho an'ny rahalahy sy anabavinao!</p>
              </div>
            ) : (
              currentSampanaPosts.map((post) => {
                const userLiked = post.likes.includes(activeUser.id);
                // Get reaction entries
                const activeReactions = (post.reactions || {}) as Record<string, string[]>;
                const userActiveReaction = Object.entries(activeReactions).find(([_, list]) => (list as string[]).includes(activeUser.id))?.[0];

                const isAuthor = post.authorId === activeUser.id;
                const isCommentsOpen = !!visibleCommentsPostId[post.id];

                return (
                  <div
                    key={post.id}
                    className={`rounded-2xl border shadow-xs relative overflow-hidden transition-all duration-300 flex flex-col p-4 sm:p-5 ${post.color}`}
                  >
                    {/* Sticky Card Author info */}
                    <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-900/10 dark:bg-white/10 text-slate-750 dark:text-violet-350 font-black flex items-center justify-center text-xs shrink-0 uppercase">
                          {post.authorName.split(' ')[0][0]}
                        </div>
                        <div className="truncate">
                          <span className="font-extrabold text-xs text-slate-850 dark:text-white block truncate leading-tight">
                            {post.authorName}
                          </span>
                          <span className="text-[8.5px] font-bold text-slate-400 dark:text-slate-450 block leading-tight pt-0.5 font-mono">
                            {formatTime(post.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Author only delete/edit */}
                      {isAuthor && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEditingPost(post)}
                            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-655 dark:text-slate-400 rounded-lg cursor-pointer transition-all"
                            title="Ovao ny hafatra"
                          >
                            <Edit2 className="w-3 h-3 text-slate-600 dark:text-slate-350" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg cursor-pointer transition-all"
                            title="Hamafa ity hafatra ity"
                          >
                            <Trash2 className="w-3 h-3 text-rose-500" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Sticky Content or Edit view overlay */}
                    {editingPostId === post.id ? (
                      <div className="space-y-2 mt-1">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-semibold text-slate-850 dark:text-white focus:outline-none"
                          rows={2.5}
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleSaveEditPost(post.id)}
                            className="py-1 px-3 bg-emerald-600 text-white font-extrabold rounded text-[10.5px] cursor-pointer"
                          >
                            Tehirizina 💾
                          </button>
                          <button
                            onClick={() => setEditingPostId(null)}
                            className="py-1 px-2.5 bg-slate-400 text-white font-extrabold rounded text-[10.5px] cursor-pointer"
                          >
                            Hanafoana
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className={`${isElderlyMode ? 'text-lg font-black' : 'text-xs font-semibold'} text-slate-800 dark:text-slate-100 leading-relaxed font-sans`}>
                        {post.content}
                      </p>
                    )}

                    {/* SOCIALS REACTIONS DISPLAY BOARD (if any are active) */}
                    {Object.keys(activeReactions).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 border-t border-black/5 dark:border-white/5 pt-2">
                        {Object.entries(activeReactions).map(([em, list]) => {
                          const listArray = list as string[];
                          const userDidReactThis = listArray.includes(activeUser.id);
                          return (
                            <button
                              key={em}
                              onClick={() => handleReactPost(post.id, em)}
                              className={`inline-flex items-center gap-1 text-[10px] font-mono font-black py-0.5 px-2 rounded-full cursor-pointer transition-all hover:scale-105 border ${
                                userDidReactThis
                                  ? 'bg-violet-100 border-violet-250 dark:bg-violet-955/35 dark:border-violet-900 text-violet-750 dark:text-violet-300'
                                  : 'bg-black/5 border-transparent text-slate-655 dark:text-slate-350'
                              }`}
                              title={`${listArray.length} mpikambana`}
                            >
                              <span>{em}</span>
                              <span>{listArray.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* FOOTER ACTIONS - LIKE, COMMENTS BUTTON AND REACTIONS TRAYS */}
                    <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 mt-3.5 pt-2.5 relative">
                      
                      {/* Left: Like & Emoticon Buttons Box */}
                      <div className="flex items-center gap-1.5">
                        
                        {/* 1. ELEGANT FACEBOOK-LIKE EMOTICON TRIGGER BUTTON */}
                        <div className="relative">
                          <button
                            onMouseEnter={() => setReactionsTrayPostId(post.id)}
                            onClick={() => setReactionsTrayPostId(prev => prev === post.id ? null : post.id)}
                            className={`flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer font-bold text-[10.5px] border ${
                              userActiveReaction
                                ? 'bg-violet-50 hover:bg-violet-100 border-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                                : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {userActiveReaction ? (
                              <span className="flex items-center gap-1">
                                <span className="text-sm">{userActiveReaction}</span>
                                <span className="capitalize">{EMOTICONS.find(e => e.emoji === userActiveReaction)?.label}</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Smile className="w-4 h-4 text-violet-650" />
                                <span className="hidden xs:inline">Haneho Emozy</span>
                              </span>
                            )}
                          </button>

                          {/* Interactive Emoticons Tray popup */}
                          {reactionsTrayPostId === post.id && (
                            <div
                              onMouseLeave={() => setReactionsTrayPostId(null)}
                              className="absolute bottom-11 left-0 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-1.5 rounded-full shadow-2xl flex items-center gap-2 z-40 animate-scaleIn shrink-0 border-b-4 border-b-violet-500"
                            >
                              {EMOTICONS.map((emObj) => (
                                <button
                                  key={emObj.emoji}
                                  onClick={() => handleReactPost(post.id, emObj.emoji)}
                                  className="w-8 h-8 rounded-full hover:bg-violet-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer hover:scale-125 focus:scale-125"
                                  title={emObj.label}
                                >
                                  <span className="text-lg">{emObj.emoji}</span>
                                </button>
                              ))}
                              <button
                                onClick={() => setReactionsTrayPostId(null)}
                                className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center cursor-pointer hover:text-slate-655"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 2. SIMPLE HEALSALA LIKE BUTTON */}
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1 py-2 px-2.5 rounded-xl transition-all font-bold text-[10.5px] cursor-pointer ${
                            userLiked
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-955/25 dark:text-rose-400 font-extrabold'
                              : 'bg-transparent text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 dark:text-slate-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${userLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-450'}`} />
                          <span>{post.likes.length}</span>
                        </button>
                      </div>

                      {/* Right: Comments triggers drawer toggles */}
                      <button
                        onClick={() => setVisibleCommentsPostId(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className={`flex items-center gap-1 p-2 rounded-xl text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 dark:text-slate-400 font-black text-[10.5px] cursor-pointer ${
                          isCommentsOpen ? 'bg-black/5 font-extrabold text-violet-650' : 'bg-transparent'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 text-violet-650" />
                        <span>({post.comments?.length || 0}) Dinika</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-all duration-300 ${isCommentsOpen ? 'rotate-180 text-violet-600' : ''}`} />
                      </button>
                    </div>

                    {/* 4. EXPANDABLE COMMENTS STREAM DRAWER */}
                    {isCommentsOpen && (
                      <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-3.5 space-y-3 bg-slate-900/5 dark:bg-black/10 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 sm:p-5">
                        <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">
                          Hevitra sy valinteny ({post.comments?.length || 0})
                        </span>

                        {/* List Comments inside frame */}
                        {post.comments && post.comments.length > 0 ? (
                          <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                            {post.comments.map((comm) => {
                              const isCommentAuthor = comm.authorId === activeUser.id;
                              return (
                                <div key={comm.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl relative group">
                                  <div className="flex items-center justify-between gap-2.5">
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="font-extrabold text-[11px] text-slate-800 dark:text-white truncate">
                                        {comm.authorName}
                                      </span>
                                      <span className="inline-block w-1 h-1 rounded-full bg-slate-350 shrink-0" />
                                      <span className="text-[8.5px] font-bold text-slate-400 font-mono shrink-0">
                                        {formatTime(comm.createdAt)}
                                      </span>
                                    </div>

                                    {isCommentAuthor && (
                                      <button
                                        onClick={() => handleDeleteComment(post.id, comm.id)}
                                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-all cursor-pointer"
                                        title="Hamafa hevitra"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap">
                                    {comm.content}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[10px] italic text-slate-400 text-center py-2">
                            Mbola tsy misy tamberina eto. Soraty eto ambany ny heviny!
                          </p>
                        )}

                        {/* Typing form inside room */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddComment(post.id);
                              }
                            }}
                            placeholder="Manorata fanehoan-kevitra, tsindrio Enter..."
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold leading-none outline-none focus:ring-1 focus:ring-violet-500 text-slate-850 dark:text-white"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-2 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5 fill-white" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
