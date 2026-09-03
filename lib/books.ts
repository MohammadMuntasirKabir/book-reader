import { Book, Bookmark, Note, ReadingSession, COVER_COLORS } from './types';

const BOOKS_KEY = 'bookreader:books';
const SESSIONS_KEY = 'bookreader:sessions';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function randomColor(): string {
  return COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];
}

export function getBooks(): Book[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getBook(id: string): Book | undefined {
  return getBooks().find(b => b.id === id);
}

export function saveBook(book: Book): void {
  const books = getBooks();
  const index = books.findIndex(b => b.id === book.id);
  if (index >= 0) {
    books[index] = book;
  } else {
    books.push(book);
  }
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function deleteBook(id: string): void {
  const books = getBooks().filter(b => b.id !== id);
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function createBook(title: string, author: string, content: string, pageCount: number): Book {
  const book: Book = {
    id: generateId(),
    title,
    author,
    coverColor: randomColor(),
    totalPages: pageCount,
    currentPage: 0,
    status: 'unread',
    dateAdded: new Date().toISOString(),
    lastRead: null,
    content,
    bookmarks: [],
    notes: [],
  };
  saveBook(book);
  return book;
}

export function updateProgress(bookId: string, page: number): void {
  const book = getBook(bookId);
  if (!book) return;
  book.currentPage = page;
  book.lastRead = new Date().toISOString();
  if (page > 0 && book.status === 'unread') {
    book.status = 'reading';
  }
  if (page >= book.totalPages) {
    book.status = 'completed';
  }
  saveBook(book);
}

export function addBookmark(bookId: string, page: number, label: string): void {
  const book = getBook(bookId);
  if (!book) return;
  const bookmark: Bookmark = {
    id: generateId(),
    page,
    label,
    createdAt: new Date().toISOString(),
  };
  book.bookmarks.push(bookmark);
  saveBook(book);
}

export function removeBookmark(bookId: string, bookmarkId: string): void {
  const book = getBook(bookId);
  if (!book) return;
  book.bookmarks = book.bookmarks.filter(b => b.id !== bookmarkId);
  saveBook(book);
}

export function addNote(bookId: string, page: number, text: string): void {
  const book = getBook(bookId);
  if (!book) return;
  const note: Note = {
    id: generateId(),
    page,
    text,
    createdAt: new Date().toISOString(),
  };
  book.notes.push(note);
  saveBook(book);
}

export function removeNote(bookId: string, noteId: string): void {
  const book = getBook(bookId);
  if (!book) return;
  book.notes = book.notes.filter(n => n.id !== noteId);
  saveBook(book);
}

export function getSessions(): ReadingSession[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function startSession(bookId: string): ReadingSession {
  const session: ReadingSession = {
    id: generateId(),
    bookId,
    startTime: new Date().toISOString(),
    endTime: null,
    pagesRead: 0,
  };
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  return session;
}

export function endSession(sessionId: string, pagesRead: number): void {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.endTime = new Date().toISOString();
    session.pagesRead = pagesRead;
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }
}

export function getStats() {
  const books = getBooks();
  const sessions = getSessions();
  return {
    totalBooks: books.length,
    booksReading: books.filter(b => b.status === 'reading').length,
    booksCompleted: books.filter(b => b.status === 'completed').length,
    totalPagesRead: sessions.reduce((sum, s) => sum + s.pagesRead, 0),
    totalReadingTime: sessions.reduce((sum, s) => {
      if (!s.endTime) return sum;
      return sum + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime());
    }, 0),
  };
}
