"use client";

import Link from "next/link";
import { Book } from "@/lib/types";
import { BookOpen, Bookmark } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const progress = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;

  return (
    <Link
      href={`/reader/${book.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
    >
      {/* Book cover */}
      <div
        className="flex h-48 items-center justify-center p-4"
        style={{ backgroundColor: book.coverColor }}
      >
        <div className="text-center text-white">
          <BookOpen className="mx-auto mb-2 size-8 opacity-80" />
          <p className="px-2 text-sm font-medium line-clamp-3">{book.title}</p>
          <p className="mt-1 text-xs opacity-70">{book.author}</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-medium text-sm line-clamp-1">{book.title}</h3>
        <p className="text-xs text-muted-foreground">{book.author}</p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{progress}%</span>
            <span>{book.currentPage}/{book.totalPages}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status & bookmarks */}
        <div className="mt-2 flex items-center justify-between">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            book.status === 'completed'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : book.status === 'reading'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-muted text-muted-foreground'
          }`}>
            {book.status === 'completed' ? 'Completed' : book.status === 'reading' ? 'Reading' : 'Unread'}
          </span>
          {book.bookmarks.length > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Bookmark className="size-3" />
              {book.bookmarks.length}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
