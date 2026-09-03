"use client";

import { useState, useEffect } from "react";
import { LibraryBig, Search, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/books";
import BookCard from "@/components/BookCard";
import { Book } from "@/lib/types";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'reading' | 'completed' | 'unread'>('all');

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const filteredBooks = books
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b =>
      search === '' ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <LibraryBig className="size-6 text-primary" />
                My Library
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {books.length} book{books.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
            <Link href="/upload" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80">
              <Plus className="size-4" />
              <span className="ml-1.5">Add Book</span>
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search books..."
                className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'reading', 'completed', 'unread'] as const).map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Book grid */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <LibraryBig className="size-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">
              {books.length === 0 ? 'No books yet' : 'No books match your search'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {books.length === 0
                ? 'Add your first book to get started'
                : 'Try a different search term or filter'}
            </p>
            {books.length === 0 && (
              <Link href="/upload" className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80">
                <Plus className="size-4" />
                <span className="ml-1.5">Add Book</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
