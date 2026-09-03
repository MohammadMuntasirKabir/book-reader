"use client";

import Link from "next/link";
import { BookOpen, Library, Upload, BarChart3 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <BookOpen className="size-5 text-primary" />
          <span>BookReader</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/library" className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
            <Library className="size-4" />
            <span className="ml-1.5 hidden sm:inline">Library</span>
          </Link>
          <Link href="/upload" className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
            <Upload className="size-4" />
            <span className="ml-1.5 hidden sm:inline">Add Book</span>
          </Link>
          <Link href="/stats" className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
            <BarChart3 className="size-4" />
            <span className="ml-1.5 hidden sm:inline">Stats</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
