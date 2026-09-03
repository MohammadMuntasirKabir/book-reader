import { BookOpen, Library, Upload, BarChart3, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStats } from "@/lib/books";

export default function Home() {
  const stats = getStats();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="size-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Personal
            <span className="text-primary"> Book Reader</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Upload your books, customize your reading experience, and track your progress.
            Simple, beautiful, and entirely in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/upload" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80">
              <Upload className="size-4" />
              <span className="ml-2">Add Your First Book</span>
            </Link>
            <Link href="/library" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-all hover:bg-muted">
              <Library className="size-4" />
              <span className="ml-2">View Library</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold">Everything you need to read</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Upload className="size-5" />}
              title="Easy Import"
              description="Paste text or upload .txt and .md files. Auto-detects chapters and structure."
            />
            <FeatureCard
              icon={<Sparkles className="size-5" />}
              title="Beautiful Reading"
              description="Customizable fonts, sizes, and themes (light, sepia, dark). Page-by-page navigation."
            />
            <FeatureCard
              icon={<BookOpen className="size-5" />}
              title="Bookmarks & Notes"
              description="Mark important passages and add personal notes. Never lose your place."
            />
            <FeatureCard
              icon={<BarChart3 className="size-5" />}
              title="Reading Stats"
              description="Track pages read, books completed, and total reading time."
            />
            <FeatureCard
              icon={<Library className="size-5" />}
              title="Personal Library"
              description="Your books live in your browser. Private, persistent, and always accessible."
            />
            <FeatureCard
              icon={<BookOpen className="size-5" />}
              title="Progress Tracking"
              description="Automatically saves your reading position. Pick up right where you left off."
            />
          </div>
        </div>
      </section>

      {/* Stats preview */}
      {(stats.totalBooks > 0) && (
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-semibold">Your Reading Journey</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Books" value={stats.totalBooks} />
              <StatCard label="Reading" value={stats.booksReading} />
              <StatCard label="Completed" value={stats.booksCompleted} />
              <StatCard label="Pages Read" value={stats.totalPagesRead} />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8">
        <p className="text-center text-sm text-muted-foreground">
          BookReader — Read anywhere, anytime.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
