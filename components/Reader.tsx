"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft, ChevronRight, BookmarkPlus, StickyNote,
  Type, Sun, Moon, BookOpen, ArrowLeft, List, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBook, updateProgress, addBookmark, addNote, removeBookmark, removeNote } from "@/lib/books";
import { getPageContent } from "@/lib/parser";
import { ReaderSettings, Bookmark as BookmarkType, Note as NoteType } from "@/lib/types";
import Link from "next/link";

export default function ReaderPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<ReturnType<typeof getBook>>(undefined);
  const [page, setPage] = useState(0);
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 18,
    theme: 'light',
    fontFamily: 'serif',
  });
  const [showToc, setShowToc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const b = getBook(bookId);
    if (b) {
      setBook(b);
      setPage(b.currentPage);
    }
  }, [bookId]);

  const goToPage = useCallback((newPage: number) => {
    if (!book) return;
    const clamped = Math.max(0, Math.min(newPage, book.totalPages));
    setPage(clamped);
    updateProgress(bookId, clamped);
    setBook(getBook(bookId));
  }, [book, bookId]);

  const handleAddBookmark = () => {
    if (!book) return;
    addBookmark(bookId, page, `Page ${page}`);
    setBook(getBook(bookId));
  };

  const handleAddNote = () => {
    if (!book || !noteText.trim()) return;
    addNote(bookId, page, noteText.trim());
    setNoteText('');
    setBook(getBook(bookId));
  };

  if (!book) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto size-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Book not found</p>
          <Link href="/library" className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-all hover:bg-muted">
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const pageContent = getPageContent(book.content, page);
  const themeClasses = {
    light: 'bg-white text-gray-900',
    sepia: 'bg-amber-50 text-amber-950',
    dark: 'bg-gray-950 text-gray-100',
  };
  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  return (
    <div className={`min-h-screen transition-colors ${themeClasses[settings.theme]}`}>
      {/* Reader header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        settings.theme === 'dark' ? 'bg-gray-900/80 border-gray-800' :
        settings.theme === 'sepia' ? 'bg-amber-50/80 border-amber-200' :
        'bg-white/80 border-gray-200'
      }`}>
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
          <Link href="/library" className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
            <ArrowLeft className="size-4" />
            <span className="ml-1.5 hidden sm:inline">Library</span>
          </Link>
          <span className="text-sm font-medium truncate max-w-48">{book.title}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => setShowToc(!showToc)} aria-label="Table of contents">
              <List className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setShowNotes(!showNotes)} aria-label="Notes">
              <StickyNote className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Page content */}
        <article
          className={`mx-auto max-w-2xl leading-relaxed ${fontClasses[settings.fontFamily]}`}
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          {pageContent.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </article>

        {/* Page navigation */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 0}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {book.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page >= book.totalPages}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Floating toolbar */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border p-1 shadow-lg ${
        settings.theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Button variant="ghost" size="icon-sm" onClick={handleAddBookmark} aria-label="Bookmark">
          <BookmarkPlus className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={() => setShowNotes(!showNotes)} aria-label="Add note">
          <StickyNote className="size-4" />
        </Button>
        <div className={`w-px h-6 ${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(12, s.fontSize - 2) }))}
          aria-label="Decrease font size"
        >
          <Type className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(32, s.fontSize + 2) }))}
          aria-label="Increase font size"
        >
          <Type className="size-4" />
        </Button>
        <div className={`w-px h-6 ${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSettings(s => ({ ...s, theme: 'light' }))}
          aria-label="Light theme"
        >
          <Sun className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSettings(s => ({ ...s, theme: 'sepia' }))}
          aria-label="Sepia theme"
        >
          <BookOpen className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))}
          aria-label="Dark theme"
        >
          <Moon className="size-4" />
        </Button>
      </div>

      {/* Table of Contents panel */}
      {showToc && (
        <div className={`fixed right-0 top-12 bottom-0 w-80 border-l p-4 overflow-y-auto z-30 ${
          settings.theme === 'dark' ? 'bg-gray-900 border-gray-800' :
          settings.theme === 'sepia' ? 'bg-amber-50 border-amber-200' :
          'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Bookmarks</h3>
            <Button variant="ghost" size="icon-sm" onClick={() => setShowToc(false)}>
              <X className="size-4" />
            </Button>
          </div>
          {book.bookmarks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookmarks yet</p>
          ) : (
            <ul className="space-y-2">
              {book.bookmarks.map(bm => (
                <li key={bm.id} className="flex items-center justify-between">
                  <button
                    className="text-sm hover:underline text-left"
                    onClick={() => { goToPage(bm.page); setShowToc(false); }}
                  >
                    {bm.label}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => { removeBookmark(bookId, bm.id); setBook(getBook(bookId)); }}
                  >
                    <X className="size-3" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Notes panel */}
      {showNotes && (
        <div className={`fixed right-0 top-12 bottom-0 w-80 border-l p-4 overflow-y-auto z-30 ${
          settings.theme === 'dark' ? 'bg-gray-900 border-gray-800' :
          settings.theme === 'sepia' ? 'bg-amber-50 border-amber-200' :
          'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Notes</h3>
            <Button variant="ghost" size="icon-sm" onClick={() => setShowNotes(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder={`Add note for page ${page}...`}
              className="flex-1 rounded-md border px-3 py-1.5 text-sm"
              onKeyDown={e => e.key === 'Enter' && handleAddNote()}
            />
            <Button size="sm" onClick={handleAddNote}>Add</Button>
          </div>
          <ul className="space-y-2">
            {(book.notes || []).map((note: NoteType) => (
              <li key={note.id} className={`rounded-lg border p-2 ${
                settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <p className="text-xs text-muted-foreground mb-1">Page {note.page}</p>
                <p className="text-sm">{note.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
