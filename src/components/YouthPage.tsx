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
  Globe
} from 'lucide-react';

interface YouthPageProps {
  isElderlyMode: boolean;
  members: Member[];
  churchRoles: string[];
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

export default function YouthPage({ isElderlyMode, members, churchRoles }: YouthPageProps) {
  // Posts stored in state & localStorage
  const [posts, setPosts] = useState<SampanaPost[]>(() => {
    const saved = localStorage.getItem('mifandray_sampana_posts');
    return saved ? JSON.parse(saved) : INITIAL_SAMPANA_POSTS;
  });

  // Current session dynamic simulation
  const [activeMemberId, setActiveMemberId] = useState<string>(() => {
    // Default to first member in church or some demo
    return members[0]?.id || '';
  });

  // Keep posts synced in localStorage
  useEffect(() => {
    localStorage.setItem('mifandray_sampana_posts', JSON.stringify(posts));
  }, [posts]);

  // Find active member object
  const activeUser = members.find(m => m.id === activeMemberId);

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

  // Filter posts in current viewed Sampana
  const currentSampanaPosts = posts.filter(p => p.sampanaName === viewedSampana);

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
    <div className="space-y-4">
      {/* 1. SECTOR FOR SIMULATED SESSION IDENTITY */}
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-slate-800 dark:text-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-violet-600 rounded-full animate-ping shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Fidiana Mpikambana Mpizahatany (Simulated Member Session)
          </span>
        </div>
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <label htmlFor="user-identity-select" className="text-[10px] font-extrabold uppercase text-slate-500 pointer-events-none shrink-0">
            SOKAFY NY MPIKAMBANA:
          </label>
          <select
            id="user-identity-select"
            value={activeMemberId}
            onChange={(e) => setActiveMemberId(e.target.value)}
            className="w-full md:w-56 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-extrabold outline-none cursor-pointer focus:ring-1 focus:ring-violet-500"
          >
            <option value="">-- Mifidiana Mpitsapa --</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role || 'Mpikambana tsotra'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. HIGH FIDELITY PROFESSIONAL MEMBER BUSINESS CARD (CARTE DE VISITE AS SHOWN IN PHOTO) */}
      {activeUser && (
        <div id="mifandray-member-card" className="bg-gradient-to-r from-[#1e155c] via-[#231570] to-[#2c138d] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden ring-1 ring-violet-500/20 max-w-full">
          {/* Subtle light reflections */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* LEFT PORTRAIT ELEMENT */}
            <div className="flex flex-col items-center shrink-0 w-full sm:w-1/3 border-b sm:border-b-0 pb-4 sm:pb-0 border-white/5">
              <div className="relative w-28 h-28 rounded-full border-2 border-white shadow-lg overflow-hidden bg-violet-950 flex items-center justify-center shrink-0">
                <img
                  src={getMemberAvatar(activeUser.id)}
                  alt={activeUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              
              {/* Yellow bold name below avatar */}
              <div className="mt-3 text-center">
                {activeUser.name.split(' ').map((part, index) => (
                  <span
                    key={part + index}
                    className={`block text-[#f9c21b] font-black leading-tight text-center tracking-wide ${
                      index === 0 ? 'text-lg uppercase' : 'text-base font-semibold opacity-95 text-amber-200 mt-0.5'
                    }`}
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>

            {/* VERTICAL SEPARATOR LINE */}
            <div className="hidden sm:block border-r border-white/10 h-32 mx-1 self-center" />

            {/* RIGHT INFORMATION FIELDS */}
            <div className="flex-1 flex flex-col justify-center gap-3.5 w-full min-w-0">
              
              {/* ROW 1: PHONE */}
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#170e4b]/60 border border-violet-500/30 flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-sm font-bold tracking-wider font-mono text-white/95">
                  {activeUser.phone || '033 45 678 90'}
                </span>
              </div>

              {/* HORIZONTAL SEPARATOR */}
              <div className="border-t border-white/10" />

              {/* ROW 2: ADDRESS */}
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#170e4b]/60 border border-violet-500/30 flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[8px] font-black text-violet-300 uppercase tracking-widest leading-none mb-1">
                    ADRESSE:
                  </span>
                  <span className="block text-xs font-bold text-white/95 truncate">
                    {activeUser.address || 'Lot 26 ter mahamasina'}
                  </span>
                </div>
              </div>

              {/* HORIZONTAL SEPARATOR */}
              <div className="border-t border-white/10" />

              {/* ROW 3: SAMPANA BADGES */}
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#170e4b]/60 border border-violet-500/30 flex items-center justify-center shrink-0 shadow-sm">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-wrap gap-1.5 min-w-0">
                  <div className="inline-flex items-center gap-1.5 bg-[#170e4b]/60 border border-violet-500/40 px-3.5 py-1.5 rounded-lg min-w-0 max-w-full">
                    <span className="text-[8.5px] font-black text-violet-200 tracking-wider">SAMPANA:</span>
                    <span className="text-[10px] font-black text-[#f9c21b] truncate">
                      {userSampanaList.length > 0 ? userSampanaList.join(', ') : (activeUser.role || 'Mpitahiry vola')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. SAMPANA TAB SELECTORS AT THE TOP */}
      {activeUser && userSampanaList.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
          <div className="text-[9.5px] font-black text-slate-450 dark:text-slate-500 uppercase px-2 pb-1.5 pt-1">
            Ny Sampanao (Mifidiana izay ho jerena ao amin'ny safidy ambony):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {userSampanaList.map((samp) => {
              const isSelected = viewedSampana === samp;
              return (
                <button
                  key={samp}
                  onClick={() => setViewedSampana(samp)}
                  className={`px-3 py-2 text-xs font-black rounded-lg cursor-pointer transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-655 dark:text-slate-300'
                  }`}
                >
                  {samp}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CORE DEPARTMENT SCREEN */}
      {!activeUser ? (
        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <HelpCircle className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300">Tsy misy mpikambana tester voafidy</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Azafady mifidiana mpikambana iray ao amin'ny menu eo ambony (Simulated User Session) mba handefasanao hafatra, hanaovana fanehoan-kevitra, na hifidianana ny sampana mifanaraka aminy.
          </p>
        </div>
      ) : userSampanaList.length === 0 ? (
        <div className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-8 text-center space-y-3">
          <MessageSquareOff className="w-10 h-10 mx-auto text-rose-500" />
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Tsy mahazo miditra amin'ny Sampana ianao</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Ity mpikambana mipika ity (<strong className="text-slate-700 dark:text-slate-300">{activeUser.name}</strong>) dia tsy mbola misy sampana voaray. 
            Mankanesa any amin'ny pejy fahatelo <strong>"Fitantanana"</strong>, ovao ny mombamomba azy na ny andraikiny ary asio sampana (ohatra: STK, SLK, Dorkasy).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header indicator inside Room */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-205 dark:border-slate-850 shadow-xs flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] font-extrabold py-0.5 px-2 bg-violet-100 dark:bg-violet-950 text-violet-750 dark:text-violet-300 rounded-full uppercase tracking-wider">
                Resaka ao an-tokantrano
              </span>
              <h2 className={`${isElderlyMode ? 'text-2xl' : 'text-base'} font-black text-slate-850 dark:text-slate-100 mt-1 flex items-center gap-1.5`}>
                <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span>{viewedSampana}</span>
              </h2>
            </div>
            <div className="text-[10px] font-mono font-bold bg-violet-50 dark:bg-violet-950/40 border border-violet-150 dark:border-violet-850/80 p-2 rounded-xl text-violet-750 dark:text-violet-350 shrink-0">
              ⚡ Space Mavitrika
            </div>
          </div>

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
