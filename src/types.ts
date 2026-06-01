/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Church {
  id: string;
  name: string;
  type: string; // e.g., FJKM, EKAR, FLM, Hafa
  location: string;
  logo: 'cross' | 'bible' | 'dove' | 'heart' | 'star';
  description: string;
}

export interface Member {
  id: string;
  churchId: string;
  name: string;
  phone: string;
  address: string;
  role: string; // e.g., Loholona, Diakra, Mpihira, Tsotra
}

export interface Announcement {
  id: string;
  churchId: string;
  title: string;
  date: string;
  category: 'fivoriana' | 'hetsika' | 'hafa';
  content: string;
}

export interface ChurchEvent {
  id: string;
  churchId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
}

export interface Sermon {
  id: string;
  churchId: string;
  title: string;
  preacher: string;
  date: string;
  type: 'audio' | 'video';
  duration: string;
  url: string; // simulated
}

export interface Donation {
  id: string;
  churchId: string;
  type: 'Dimy' | 'Fanatitra' | 'Fanampiny';
  amount: number;
  date: string;
  donor: string;
  method: 'MVola' | 'Orange Money' | 'Airtel Money' | 'Volan-tanana';
}

export interface Song {
  id: string;
  number: number;
  title: string;
  lyrics: string;
  category?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
}
