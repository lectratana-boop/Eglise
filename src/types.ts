/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Church {
  id: string;
  name: string;
  type: string; // FJKM, EKAR (Katolike), etc.
  location: string;
  logo: 'cross' | 'bible' | 'dove' | 'heart' | 'star';
  description: string;
  sharedProgramEnabled?: boolean; // synchronisé avec le programme national de la dénomination
  customVerseText?: string;
  customVerseRef?: string;
  customFivorianaTitle?: string;
  customFivorianaContent?: string;
  customFivorianaDate?: string;
  customHetsikaTitle?: string;
  customHetsikaContent?: string;
  customHetsikaDate?: string;
  customHafaTitle?: string;
  customHafaContent?: string;
  customHafaDate?: string;
}

export interface Member {
  id: string;
  churchId: string;
  name: string;
  phone: string;
  address: string;
  role: string; // e.g., Loholona, Diakra, Mpihira, Tsotra
  roles?: string[]; // Multiple roles/sampana selected by admin
}

export interface SampanaComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface SampanaPost {
  id: string;
  sampanaName: string; // which department it belongs to
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  color: string;
  likes: string[]; // member IDs who liked
  reactions?: { [emoji: string]: string[] }; // { '👍': ['mem-1'], '❤️': ['mem-2'] }
  comments?: SampanaComment[];
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
