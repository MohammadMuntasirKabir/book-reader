"use client";

import { useState } from "react";
import { BarChart3, BookOpen, Clock, CheckCircle2, BookMarked } from "lucide-react";
import { getStats } from "@/lib/books";

function formatTime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function StatsPage() {
  const [stats] = useState(() => getStats());

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <BarChart3 className="size-6 text-primary" />
          Reading Statistics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your reading habits and progress
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<BookOpen className="size-5 text-blue-500" />}
            label="Total Books"
            value={stats.totalBooks}
            bg="bg-blue-500/10"
          />
          <StatCard
            icon={<BookMarked className="size-5 text-amber-500" />}
            label="Currently Reading"
            value={stats.booksReading}
            bg="bg-amber-500/10"
          />
          <StatCard
            icon={<CheckCircle2 className="size-5 text-green-500" />}
            label="Books Completed"
            value={stats.booksCompleted}
            bg="bg-green-500/10"
          />
          <StatCard
            icon={<BarChart3 className="size-5 text-purple-500" />}
            label="Pages Read"
            value={stats.totalPagesRead}
            bg="bg-purple-500/10"
          />
          <StatCard
            icon={<Clock className="size-5 text-rose-500" />}
            label="Reading Time"
            value={formatTime(stats.totalReadingTime)}
            bg="bg-rose-500/10"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: number | string; bg: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className={`mb-3 flex size-10 items-center justify-center rounded-lg ${bg}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
