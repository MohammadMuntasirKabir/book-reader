"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBook } from "@/lib/books";
import { parseText } from "@/lib/parser";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'paste' | 'file'>('paste');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);
      // Try to extract title from filename
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt.replace(/[_-]/g, ' '));
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    const parsed = parseText(content, title, author);
    const book = createBook(parsed.title, parsed.author, content, parsed.totalPages);
    router.push(`/reader/${book.id}`);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 250));

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Upload className="size-6 text-primary" />
          Add a Book
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste your text or upload a file to add it to your library
        </p>

        {/* Mode toggle */}
        <div className="mt-6 flex gap-2">
          <Button
            variant={mode === 'paste' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('paste')}
          >
            <Type className="size-4" />
            <span className="ml-1.5">Paste Text</span>
          </Button>
          <Button
            variant={mode === 'file' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('file')}
          >
            <FileText className="size-4" />
            <span className="ml-1.5">Upload File</span>
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {/* Title & Author */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Book title"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Author</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Content input */}
          {mode === 'paste' ? (
            <div>
              <label className="mb-1 block text-sm font-medium">Book Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste your book text here...&#10;&#10;Chapters will be automatically detected. You can use markdown-style headers (# Chapter Title) or plain text."
                className="h-80 w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium">Upload File</label>
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                <FileText className="size-8 text-muted-foreground" />
                {fileName ? (
                  <p className="mt-2 text-sm font-medium">{fileName}</p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drop a .txt or .md file here, or click to browse
                  </p>
                )}
                <input
                  type="file"
                  accept=".txt,.md,.text"
                  onChange={handleFileUpload}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            </div>
          )}

          {/* Stats */}
          {content && (
            <div className="flex gap-4 rounded-lg bg-muted p-3 text-sm">
              <span><strong>{wordCount.toLocaleString()}</strong> words</span>
              <span><strong>~{estimatedPages}</strong> pages</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!content.trim()}>
              Add to Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
