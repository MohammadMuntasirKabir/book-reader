export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  totalPages: number;
  currentPage: number;
  status: 'unread' | 'reading' | 'completed';
  dateAdded: string;
  lastRead: string | null;
  content: string;
  bookmarks: Bookmark[];
  notes: Note[];
}

export interface Bookmark {
  id: string;
  page: number;
  label: string;
  createdAt: string;
}

export interface Note {
  id: string;
  page: number;
  text: string;
  createdAt: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: string;
  endTime: string | null;
  pagesRead: number;
}

export interface ReaderSettings {
  fontSize: number;
  theme: 'light' | 'sepia' | 'dark';
  fontFamily: 'sans' | 'serif' | 'mono';
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 18,
  theme: 'light',
  fontFamily: 'serif',
};

export const COVER_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#e94560', '#f38181', '#fce38a', '#95e1d3',
  '#2d3436', '#636e72', '#b2bec3', '#dfe6e9',
  '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894',
];
