export interface ParsedBook {
  title: string;
  author: string;
  chapters: Chapter[];
  totalPages: number;
}

export interface Chapter {
  title: string;
  content: string;
  startPage: number;
}

const WORDS_PER_PAGE = 250;
const MIN_CHAPTER_LENGTH = 100;

export function parseText(content: string, title?: string, author?: string): ParsedBook {
  const cleanContent = content.trim();
  const lines = cleanContent.split('\n');

  let bookTitle = title || 'Untitled';
  let bookAuthor = author || 'Unknown Author';

  // Try to extract title from first line if it looks like a title
  if (lines[0] && lines[0].length < 100 && lines[1]?.trim() === '') {
    bookTitle = lines[0].trim();
    lines.splice(0, 2);
  }

  // Try to extract author from next line if it starts with "by"
  if (lines[0]?.toLowerCase().startsWith('by ')) {
    bookAuthor = lines[0].trim().substring(3);
    lines.splice(0, 1);
  }

  // Detect chapters
  const chapters = detectChapters(lines.join('\n'));

  // Calculate pages
  const totalWords = cleanContent.split(/\s+/).length;
  const totalPages = Math.max(1, Math.ceil(totalWords / WORDS_PER_PAGE));

  // Assign page numbers to chapters
  let currentPage = 1;
  for (const chapter of chapters) {
    chapter.startPage = currentPage;
    const chapterWords = chapter.content.split(/\s+/).length;
    const chapterPages = Math.max(1, Math.ceil(chapterWords / WORDS_PER_PAGE));
    currentPage += chapterPages;
  }

  return {
    title: bookTitle,
    author: bookAuthor,
    chapters,
    totalPages,
  };
}

function detectChapters(content: string): Chapter[] {
  const chapterPatterns: RegExp[] = [
    /^#{1,3}\s+(.+)$/,
    /^chapter\s+\d+[:\s]*(.*)$/i,
    /^part\s+\d+[:\s]*(.*)$/i,
    /^section\s+\d+[:\s]*(.*)$/i,
    /^\d+\.\s+(.+)$/,
  ];

  const lines = content.split('\n');
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;
  let chapterContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let isChapterStart = false;
    let chapterTitle = '';

    for (const pattern of chapterPatterns) {
      const match = line.trim().match(pattern);
      if (match) {
        isChapterStart = true;
        chapterTitle = match[1]?.trim() || line.trim();
        break;
      }
    }

    // Also detect if line is short, centered, and followed by blank line
    if (!isChapterStart && line.trim().length > 0 && line.trim().length < 60) {
      const nextLine = lines[i + 1]?.trim();
      if (nextLine === '' || nextLine === undefined) {
        // Check if it looks like a title (no period at end, not a sentence)
        if (!line.trim().endsWith('.') && !line.trim().endsWith(',')) {
          isChapterStart = true;
          chapterTitle = line.trim();
        }
      }
    }

    if (isChapterStart) {
      // Save previous chapter
      if (currentChapter) {
        currentChapter.content = chapterContent.join('\n').trim();
        if (currentChapter.content.length > MIN_CHAPTER_LENGTH) {
          chapters.push(currentChapter);
        }
      }
      currentChapter = {
        title: chapterTitle || `Chapter ${chapters.length + 1}`,
        content: '',
        startPage: 0,
      };
      chapterContent = [];
    } else {
      chapterContent.push(line);
    }
  }

  // Save last chapter
  if (currentChapter) {
    currentChapter.content = chapterContent.join('\n').trim();
    if (currentChapter.content.length > MIN_CHAPTER_LENGTH) {
      chapters.push(currentChapter);
    }
  }

  // If no chapters detected, create one from the whole content
  if (chapters.length === 0) {
    chapters.push({
      title: 'Full Text',
      content: content.trim(),
      startPage: 1,
    });
  }

  return chapters;
}

export function getPageContent(content: string, page: number, wordsPerPage: number = WORDS_PER_PAGE): string {
  const words = content.split(/\s+/);
  const startWord = (page - 1) * wordsPerPage;
  const endWord = startWord + wordsPerPage;
  return words.slice(startWord, endWord).join(' ');
}

export function getPageFromPosition(content: string, position: number, wordsPerPage: number = WORDS_PER_PAGE): number {
  const words = content.split(/\s+/);
  let charCount = 0;
  for (let i = 0; i < words.length; i++) {
    charCount += words[i].length + 1;
    if (charCount > position) {
      return Math.floor(i / wordsPerPage) + 1;
    }
  }
  return 1;
}
