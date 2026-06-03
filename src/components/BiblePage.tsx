/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BIBLE_DATA } from '../data';
import { BIBLE_BOOKS, generateVersesOffline } from '../bibleBooks';
import { Search, Volume2, VolumeX, BookOpen, AlertCircle, Sparkles, Smile, ArrowLeft, ChevronRight } from 'lucide-react';

interface BiblePageProps {
  isElderlyMode: boolean;
}

// Map common Malagasy variants and short codes to official names
function normalizeBookName(name: string): string {
  const norm = name.toLowerCase().trim();
  if (norm === "romanina" || norm === "rom") return "romana";
  if (norm === "apokalipsy" || norm === "apok") return "apokalypsy";
  if (norm === "salamo" || norm === "sal") return "salamo";
  if (norm === "ohabolana" || norm === "ohab") return "ohabolana";
  if (norm === "genesisy" || norm === "gen") return "genesisy";
  if (norm === "eksodosy" || norm === "eks") return "eksodosy";
  if (norm === "levitikosy" || norm === "lev") return "levitikosy";
  if (norm === "nomery" || norm === "nom") return "nomery";
  if (norm === "deoteronomia" || norm === "deot") return "deoteronomia";
  if (norm === "josoa" || norm === "jos") return "josoa";
  if (norm === "mpitsara" || norm === "mpit") return "mpitsara";
  if (norm === "rota" || norm === "rot") return "rota";
  if (norm === "matio" || norm === "mat") return "matio";
  if (norm === "marka" || norm === "mar") return "marka";
  if (norm === "lioka" || norm === "lio") return "lioka";
  if (norm === "jaona" || norm === "jao") return "jaona";
  if (norm === "isaia" || norm === "isa") return "isaia";
  if (norm === "jeremia" || norm === "jer") return "jeremia";
  return norm;
}

const CATHOLIC_DEUTEROCANONICAL = [
  { name: "Tobia", englishName: "Tobit", chapters: 14, testament: "Taloha" as const, category: "Tantara" },
  { name: "Jodita", englishName: "Judith", chapters: 16, testament: "Taloha" as const, category: "Tantara" },
  { name: "Fahendrena", englishName: "Wisdom", chapters: 19, testament: "Taloha" as const, category: "Poeta" },
  { name: "Sirasida", englishName: "Sirach", chapters: 51, testament: "Taloha" as const, category: "Poeta" },
  { name: "Baroka", englishName: "Baruch", chapters: 6, testament: "Taloha" as const, category: "Mpaminany" },
  { name: "1 Makabeo", englishName: "1 Maccabees", chapters: 16, testament: "Taloha" as const, category: "Tantara" },
  { name: "2 Makabeo", englishName: "2 Maccabees", chapters: 15, testament: "Taloha" as const, category: "Tantara" },
];

// Try parsing reference e.g., "peter 1 toko 3 andiny 5 hatr@ 10" or "Jaona 3:16"
function parseBibleReference(query: string, bibleVersion: 'FJKM' | 'Katolika') {
  const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
  if (!normalized) return null;

  const booksList = bibleVersion === 'Katolika' 
    ? [...BIBLE_BOOKS, ...CATHOLIC_DEUTEROCANONICAL] 
    : BIBLE_BOOKS;

  let matchedBook = null;
  let bookCleanedQuery = normalized;

  // Search if the query contains any of the book names or English names
  for (const b of booksList) {
    const bNameLower = b.name.toLowerCase();
    const engNameLower = b.englishName.toLowerCase();

    if (normalized.startsWith(bNameLower)) {
      matchedBook = b;
      bookCleanedQuery = normalized.substring(bNameLower.length).trim();
      break;
    } else if (normalized.startsWith(engNameLower)) {
      matchedBook = b;
      bookCleanedQuery = normalized.substring(engNameLower.length).trim();
      break;
    }
  }

  // Fallback for custom Malagasy phrasing like "peter 1" instead of "1 petera"
  if (!matchedBook) {
    const aliases: { [key: string]: string } = {
      "petera": "Petera", "peter": "Petera", "pe": "Petera",
      "korintiana": "Korintiana", "corinthians": "Korintiana", "kor": "Korintiana",
      "tesaloniana": "Tesaloniana", "thessalonians": "Tesaloniana", "tes": "Tesaloniana",
      "timoty": "Timoty", "timothy": "Timoty", "tim": "Timoty",
      "mpanjaka": "Mpanjaka", "kings": "Mpanjaka",
      "kronika": "Kronika", "chronicles": "Kronika", "kro": "Kronika",
      "samoela": "Samoela", "samuel": "Samoela", "sam": "Samoela",
      "jaona": "Jaona", "john": "Jaona", "jao": "Jaona",
      "matio": "Matio", "matthew": "Matio", "mat": "Matio",
      "marka": "Marka", "mark": "Marka", "mar": "Marka",
      "lioka": "Lioka", "luke": "Lioka", "lio": "Lioka",
      "genesisy": "Genesisy", "genesis": "Genesisy", "gen": "Genesisy",
      "eksodosy": "Eksodosy", "exodus": "Eksodosy", "eks": "Eksodosy",
      "salamo": "Salamo", "psalms": "Salamo", "sal": "Salamo",
      "ohabolana": "Ohabolana", "proverbs": "Ohabolana", "ohab": "Ohabolana",
      "apokalypsy": "Apokalypsy", "revelation": "Apokalypsy", "apok": "Apokalypsy",
      "romana": "Romana", "romans": "Romana", "rom": "Romana",
      "hebreo": "Hebreo", "hebrews": "Hebreo", "heb": "Hebreo"
    };

    for (const [kw, official] of Object.entries(aliases)) {
      if (normalized.includes(kw)) {
        let numPrefix = "";
        if (normalized.includes("1") || normalized.includes("voalohany") || normalized.includes("i ")) {
          numPrefix = "1 ";
        } else if (normalized.includes("2") || normalized.includes("faharoa") || normalized.includes("ii ")) {
          numPrefix = "2 ";
        } else if (normalized.includes("3") || normalized.includes("fahatelo") || normalized.includes("iii ")) {
          numPrefix = "3 ";
        }

        const targetName = (numPrefix + official).trim().toLowerCase();
        const found = booksList.find(b => b.name.toLowerCase() === targetName || b.name.toLowerCase().includes(targetName));
        if (found) {
          matchedBook = found;
          bookCleanedQuery = normalized
            .replace(kw, '')
            .replace(/1|2|3|voalohany|faharoa|fahatelo|i |ii |iii/g, '')
            .trim();
          break;
        }
      }
    }
  }

  // Exact matching anything remaining
  if (!matchedBook) {
    for (const b of booksList) {
      if (normalized.includes(b.name.toLowerCase())) {
        matchedBook = b;
        bookCleanedQuery = normalized.replace(b.name.toLowerCase(), '').trim();
        break;
      }
    }
  }

  if (!matchedBook) return null;

  // Clean and prepare values
  // Replace words with markers to parse easily
  let prep = bookCleanedQuery
    .replace(/(toko|tk|chapter|ch)/g, 'C')
    .replace(/(andininy|andiny|and|verse|v)/g, 'V')
    .replace(/(hatr@|hatramin|hatra|ka hatramin'ny|to|-)/g, 'H');

  let chapterVal: number | undefined = undefined;
  let verseStartVal: number | undefined = undefined;
  let verseEndVal: number | undefined = undefined;

  const allDigits = prep.match(/\d+/g);
  if (allDigits && allDigits.length > 0) {
    chapterVal = parseInt(allDigits[0], 10);
    if (allDigits.length > 1) {
      verseStartVal = parseInt(allDigits[1], 10);
    }
    if (allDigits.length > 2) {
      verseEndVal = parseInt(allDigits[2], 10);
    }
  }

  return {
    book: matchedBook,
    chapter: chapterVal,
    verseStart: verseStartVal,
    verseEnd: verseEndVal
  };
}

export default function BiblePage({ isElderlyMode }: BiblePageProps) {
  const [bibleVersion, setBibleVersion] = useState<'FJKM' | 'Katolika'>('FJKM');
  const [selectedBook, setSelectedBook] = useState('Salamo');
  const [selectedChapter, setSelectedChapter] = useState(23);
  const [testamentTab, setTestamentTab] = useState<'Taloha' | 'Vaovao'>('Taloha');
  const [showSelector, setShowSelector] = useState(true);
  
  // Book search filter
  const [bookQuery, setBookQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [textSize, setTextSize] = useState(isElderlyMode ? 24 : 18);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeVerseNum, setActiveVerseNum] = useState<number | null>(null);

  // States to persist custom user requested range from search reference
  const [verseStart, setVerseStart] = useState<number | null>(null);
  const [verseEnd, setVerseEnd] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const booksList = bibleVersion === 'Katolika' 
    ? [...BIBLE_BOOKS, ...CATHOLIC_DEUTEROCANONICAL] 
    : BIBLE_BOOKS;

  // Set testamentTab automatically when selected book changes
  useEffect(() => {
    const bookMeta = booksList.find(b => b.name === selectedBook);
    if (bookMeta) {
      setTestamentTab(bookMeta.testament);
    }
  }, [selectedBook, bibleVersion]);

  // Sync elderly mode size
  useEffect(() => {
    if (isElderlyMode) {
      setTextSize(24);
    } else {
      setTextSize(18);
    }
  }, [isElderlyMode]);

  // Clear verse ranges when book or chapter changes
  useEffect(() => {
    setVerseStart(null);
    setVerseEnd(null);
  }, [selectedBook, selectedChapter]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Retrieve chapter verses (checking real first, then fallback to generator)
  const getChapterVerses = (bookName: string, chapNum: number) => {
    const realChapter = BIBLE_DATA.find(
      b => b.book.toLowerCase() === bookName.toLowerCase() && b.chapter === chapNum
    );
    if (realChapter) {
      return realChapter.verses;
    }
    return generateVersesOffline(bookName, chapNum);
  };

  const currentVerses = getChapterVerses(selectedBook, selectedChapter);

  // Apply user requested boundaries (e.g. Peter 1 Toko 3 Andiny 5 hatr@ 10)
  // If no verse was requested: show ALL verses from 1 to the end (empty range)
  const displayedVerses = currentVerses.filter(v => {
    if (verseStart !== null) {
      if (verseEnd !== null) {
        return v.number >= verseStart && v.number <= verseEnd;
      }
      return v.number === verseStart;
    }
    return true; // show all
  });

  // Audio text synthesis with phonetic Malagasy optimization for multilingual TTS
  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = displayedVerses
        .map(v => `Andininy faha ${v.number}: ${v.text}`)
        .join('. ');

      const fullText = `${selectedBook} toko faha ${selectedChapter}. ${textToRead}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        
        // 1. Look for native Malagasy voice ('mg')
        let selectedVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith('mg') || 
          v.name.toLowerCase().includes('malagasy')
        );
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          // 2. Look for clear female French voice as perfect Malagasy phonetic proxy
          const frenchVoices = voices.filter(v => v.lang.toLowerCase().startsWith('fr'));
          const femaleFrench = frenchVoices.find(v => 
            v.name.toLowerCase().includes('hortense') || 
            v.name.toLowerCase().includes('julie') || 
            v.name.toLowerCase().includes('aurelie') || 
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('female')
          );
          
          selectedVoice = femaleFrench || frenchVoices[0];
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
            
            // Malagasy letters pronunciation rules for French TTS:
            // "o" is always pronounced "ou"
            // "y" is always pronounced "i"
            // "j" is pronounced "dz" or "di"
            let phoneticText = fullText
              .replace(/o/g, 'ou')
              .replace(/ouou/g, 'ou')
              .replace(/y/g, 'i')
              .replace(/j/g, 'dz');
              
            utterance.text = phoneticText;
          }
        }
      }

      utterance.rate = isElderlyMode ? 0.75 : 0.85; // slower for perfect clear articulation
      utterance.pitch = 1.05; // sweet, graceful female tone

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Perform search across both pre-stored and dynamically structured content
  const handleSearch = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    const results: { book: string; chapter: number; verseNumber: number; text: string }[] = [];
    const maxResults = 80;

    // 1. Try to parse as reference search (e.g. "Jaona 3:16", "Salamo 23")
    const parsedRef = parseBibleReference(searchQuery, bibleVersion);
    if (parsedRef) {
      const bookObj = parsedRef.book;
      const targetChapter = parsedRef.chapter || 1;
      
      if (targetChapter > 0 && targetChapter <= bookObj.chapters) {
        const verses = getChapterVerses(bookObj.name, targetChapter);
        
        if (parsedRef.verseStart) {
          const vStart = parsedRef.verseStart;
          const vEnd = parsedRef.verseEnd || vStart;
          
          const matchingVerses = verses.filter(v => v.number >= vStart && v.number <= vEnd);
          matchingVerses.forEach(v => {
            results.push({
              book: bookObj.name,
              chapter: targetChapter,
              verseNumber: v.number,
              text: v.text
            });
          });
        } else {
          // Show all verses from 1 to the end
          verses.forEach(v => {
            results.push({
              book: bookObj.name,
              chapter: targetChapter,
              verseNumber: v.number,
              text: v.text
            });
          });
        }
      }
    }

    // 2. Perform text-based keyphrase search across all chapters (only for queries > 2 letters to keep it extremely fast)
    if (query.length >= 3) {
      for (const b of booksList) {
        if (results.length >= maxResults) break;
        for (let ch = 1; ch <= b.chapters; ch++) {
          if (results.length >= maxResults) break;
          const verses = getChapterVerses(b.name, ch);
          for (const v of verses) {
            if (v.text.toLowerCase().includes(query)) {
              const alreadyExists = results.some(
                r => r.book === b.name && r.chapter === ch && r.verseNumber === v.number
              );
              if (!alreadyExists) {
                results.push({
                  book: b.name,
                  chapter: ch,
                  verseNumber: v.number,
                  text: v.text
                });
              }
              if (results.length >= maxResults) break;
            }
          }
        }
      }
    }

    // 3. Suggest books matching the name
    booksList.forEach(b => {
      if (results.length < maxResults && b.name.toLowerCase().includes(query)) {
        const verses = getChapterVerses(b.name, 1);
        if (verses.length > 0) {
          const alreadyExists = results.some(r => r.book === b.name && r.chapter === 1 && r.verseNumber === 1);
          if (!alreadyExists) {
            results.push({
              book: b.name,
              chapter: 1,
              verseNumber: 1,
              text: `Hanomboka hamaky ny bokin'i ${b.name} : Toko voalohany`
            });
          }
        }
      }
    });

    return results;
  };

  const searchResults = handleSearch();

  // Filter books list
  const filteredBooks = booksList.filter(b => {
    const matchesTab = b.testament === testamentTab;
    const matchesQuery = b.name.toLowerCase().includes(bookQuery.toLowerCase()) || 
                         b.englishName.toLowerCase().includes(bookQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const activeBookMeta = booksList.find(b => b.name === selectedBook) || booksList[0];

  // Helper for 3D buttons coloring
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Lalàna': return 'btn-3d-amber';      // warm amber
      case 'Tantara': return 'btn-3d-orange';    // energetic orange
      case 'Poeta': return 'btn-3d-emerald';     // deep green psalm/proverbs
      case 'Mpaminany': return 'btn-3d-rose';    // bold rose
      case 'Filazantsara': return 'btn-3d-violet'; // spiritual violet
      case 'Epistily': return 'btn-3d-blue';     // serene blue
      default: return 'btn-3d-violet';
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      
      {/* Dynamic tactile header */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md font-bold text-lg">
            📖
          </div>
          <div>
            <h2 className={`${isElderlyMode ? 'text-xl' : 'text-sm'} font-extrabold text-slate-850 dark:text-slate-150`}>
              Baiboly Masina
            </h2>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold leading-none mt-0.5">
              Katolika sy Protestanta • 66 Boki
            </p>
          </div>
        </div>

        {/* Text sizer bar */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 py-1 px-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase hidden sm:inline">Habon'ny soratra:</span>
          <input
            type="range"
            min="14"
            max="30"
            value={textSize}
            onChange={(e) => setTextSize(Number(e.target.value))}
            className="w-16 sm:w-20 accent-violet-600 h-1 bg-slate-200 rounded-lg appearance-auto cursor-pointer"
          />
          <span className="text-[10px] font-mono font-extrabold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded shrink-0">
            {textSize}px
          </span>
        </div>
      </div>

      {/* Main interface layout */}
      <div className="space-y-4">
        
        {/* Book Selector pane (Full-Width view) */}
        {showSelector && (
          <div className="w-full space-y-3">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm space-y-3.5">
            
            {/* Main Bible Search */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hitady andininy (Ohatra: finoana)..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500 font-semibold"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-300 py-0.5 px-1.5 rounded hover:bg-slate-300"
                  >
                    Fafao
                  </button>
                )}
              </div>
            </div>

            {/* Bible translation version toggle (Protestanta vs Katolika) */}
            <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl gap-1 border border-slate-150 dark:border-slate-800">
              <button
                onClick={() => {
                  setBibleVersion('FJKM');
                  setSelectedBook('Salamo');
                  setSelectedChapter(23);
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-center text-[10px] font-bold transition-all cursor-pointer ${
                  bibleVersion === 'FJKM'
                    ? 'bg-gradient-to-r from-violet-605 to-indigo-600 text-white shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                📖 PROTESTANTA (FJKM)
              </button>
              <button
                onClick={() => {
                  setBibleVersion('Katolika');
                  setSelectedBook('Salamo');
                  setSelectedChapter(23);
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-center text-[10px] font-bold transition-all cursor-pointer ${
                  bibleVersion === 'Katolika'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                ✝️ KATOLIKA (DIEM/EKAR)
              </button>
            </div>

            {/* If searching, only display results. Else, display books and chapters directory */}
            {searchQuery.trim() === '' ? (
              <>
                {/* Testament Tabs with 3D elements */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <button
                    id="btn-tab-testament-taloha"
                    onClick={() => {
                      setTestamentTab('Taloha');
                      setBookQuery('');
                    }}
                    className={`py-2 px-1 text-xs font-black rounded-xl transition-all cursor-pointer select-none ${
                      testamentTab === 'Taloha'
                        ? 'bg-amber-600 text-white border-b-[4px] border-amber-800 translate-y-[1px]'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-150 dark:border-slate-800 border-b-[3px] hover:bg-slate-100'
                    }`}
                  >
                    📜 Tes. T (39)
                  </button>
                  <button
                    id="btn-tab-testament-vaovao"
                    onClick={() => {
                      setTestamentTab('Vaovao');
                      setBookQuery('');
                    }}
                    className={`py-2 px-1 text-xs font-black rounded-xl transition-all cursor-pointer select-none ${
                      testamentTab === 'Vaovao'
                        ? 'bg-violet-600 text-white border-b-[4px] border-violet-800 translate-y-[1px]'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-150 dark:border-slate-800 border-b-[3px] hover:bg-slate-100'
                    }`}
                  >
                    ✝️ Tes. V (27)
                  </button>
                </div>

                {/* Filter books search */}
                <div className="relative">
                  <input
                    type="text"
                    value={bookQuery}
                    onChange={(e) => setBookQuery(e.target.value)}
                    placeholder="Sivana boki (Ohatra: Jaona)..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg py-1.5 pl-7 pr-3 text-[11px] text-slate-800 dark:text-slate-200 outline-none font-semibold focus:ring-1 focus:ring-violet-400"
                  />
                  <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Books Scrolling directory */}
                <div className="h-[210px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                  {filteredBooks.length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center py-8 font-mono">Tsy misy boki mifanaraka.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      {filteredBooks.map((b) => {
                        const isSelected = selectedBook === b.name;
                        const catBtnClass = getCategoryColor(b.category);
                        return (
                          <button
                            id={`btn-book-${b.name}`}
                            key={b.name}
                            onClick={() => {
                              setSelectedBook(b.name);
                              setSelectedChapter(1);
                              setActiveVerseNum(null);
                            }}
                            className={`p-2 rounded-xl text-left transition-all text-[11px] font-black cursor-pointer shadow-sm relative ${
                              isSelected
                                ? `${catBtnClass} text-white translate-y-[2px]`
                                : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-b-[3px]'
                            }`}
                          >
                            <span className="block truncate">{b.name}</span>
                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none block mt-0.5">
                              {b.chapters} toko
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Chapter list panel */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Toko ao amin'ny {selectedBook} ({activeBookMeta.chapters}):
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto pr-1 pb-1">
                    {Array.from({ length: activeBookMeta.chapters }, (_, i) => i + 1).map((chap) => {
                      const isSelected = selectedChapter === chap;
                      return (
                        <button
                          key={chap}
                          onClick={() => {
                            setSelectedChapter(chap);
                            setActiveVerseNum(null);
                            setShowSelector(false); // Hide selector to showcase scripture full width
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 border-b-[4px] border-amber-700 text-white translate-y-[1px]'
                              : 'bg-slate-50 dark:bg-slate-950 text-slate-705 dark:text-slate-300 border border-slate-150 dark:border-slate-800 border-b-[3px] hover:bg-slate-150'
                          }`}
                        >
                          {chap}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* If search active, hide original navigation so user isn't bogged down */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Vokatry ny fikarohana ({searchResults.length})</span>
                  <button onClick={() => setSearchQuery('')} className="text-[10px] font-extrabold text-violet-605">Hanafoana ✕</button>
                </div>

                <div className="h-[430px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-4">
                        Tsy nisy andininy mifanaraka tamin'ilay teni.
                      </p>
                    </div>
                  ) : (
                    searchResults.map((res, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedBook(res.book);
                          setSelectedChapter(res.chapter);
                          
                          // Auto parse search query to apply direct verse-level boundaries
                          const parsedRef = parseBibleReference(searchQuery, bibleVersion);
                          if (parsedRef && parsedRef.verseStart) {
                            setVerseStart(parsedRef.verseStart);
                            setVerseEnd(parsedRef.verseEnd || parsedRef.verseStart);
                          } else {
                            setVerseStart(null);
                            setVerseEnd(null);
                          }
                          
                          setActiveVerseNum(res.verseNumber);
                          setSearchQuery('');
                          setShowSelector(false); // Hide selector to showcase match full-width
                        }}
                        className="w-full text-left p-3 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-5/50 dark:bg-slate-950 hover:border-violet-400 transition-all cursor-pointer block border-b-[3px]"
                      >
                        <div className="font-extrabold text-violet-600 dark:text-violet-400 text-xs flex justify-between items-center">
                          <span>{res.book} {res.chapter}:{res.verseNumber}</span>
                          <span className="text-[8px] bg-violet-100 dark:bg-violet-900 px-1 py-0.5 rounded text-violet-800 dark:text-white font-mono uppercase">Vakio</span>
                        </div>
                        <p className="text-[11px] mt-1 text-slate-600 dark:text-slate-350 italic line-clamp-2">
                          "{res.text}"
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reading screen pane (Full-Width exclusive view) */}
      {!showSelector && (
        <div className="w-full">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
            
            {/* Title / Audio header area */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {!showSelector && (
                  <button
                    onClick={() => setShowSelector(true)}
                    className="p-1 px-2.5 text-[10px] font-black bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 hover:from-violet-700 hover:to-indigo-750 text-white rounded-lg transition-all flex items-center gap-1 active:scale-95 cursor-pointer shrink-0 shadow-xs border-b-[2px] border-indigo-800"
                    title="Miverina hifidy toko hafa"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Mifidy toko</span>
                  </button>
                )}
                <span className="text-2xl shrink-0">📖</span>
                <div>
                  <h3 className={`${isElderlyMode ? 'text-2xl' : 'text-base'} font-black text-slate-800 dark:text-slate-100`}>
                    {selectedBook} {selectedChapter}
                  </h3>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono font-bold leading-none mt-0.5">
                    Baiboly Malagasy • Protestanta / Katolika
                  </p>
                </div>
              </div>


            </div>

            {/* Verses Scroll list */}
            <div className="p-4 sm:p-5 flex-1 bg-gradient-to-b from-slate-50/40 to-white dark:from-slate-950/20 dark:to-slate-900 overflow-y-auto max-h-[460px] scrollbar-thin">
              {isPlayingAudio && (
                <div className="mb-3 bg-emerald-50/90 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 p-2.5 rounded-lg text-[9px] text-emerald-700 dark:text-emerald-405 font-black uppercase tracking-wider flex items-center gap-2 animate-pulse justify-center">
                  <span>🔊</span>
                  <span>Mihaino ny Tenin'Andriamanitra vakina mafy...</span>
                </div>
              )}

              <div 
                className="space-y-4 leading-relaxed select-text"
                style={{ fontSize: `${textSize}px` }}
              >
                {displayedVerses.map((verse) => {
                  const isHighlighted = activeVerseNum === verse.number;
                  return (
                    <div 
                      key={verse.number} 
                      onClick={() => setActiveVerseNum(isHighlighted ? null : verse.number)}
                      className={`flex items-start gap-2.5 py-2 px-3 transition-all rounded-xl cursor-default select-text ${
                        isHighlighted 
                          ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900 scale-[1.01]' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="text-violet-600 dark:text-violet-400 font-extrabold font-mono text-xs select-none shrink-0" style={{ fontSize: `${Math.max(12, textSize - 5)}px` }}>
                        {verse.number}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-sans tracking-wide">
                        {verse.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic stamp indicating generator status */}
              <div className="mt-8 pt-4 border-t border-dashed border-slate-150 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>© Fiangonana Malagasy 2026</span>
                <span className="uppercase text-[8px] bg-slate-100 dark:bg-slate-900 py-0.5 px-2 rounded font-extrabold text-slate-500">
                  Full browsable offline mode
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      </div>
    </div>
  );
}
