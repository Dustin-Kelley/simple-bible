import kjv from '@/data/kjv.json';

export type Book = {
  name: string;
  abbrev: string;
  chapters: string[][];
};

export const BIBLE = kjv as Book[];

export const TRANSLATION_NAME = 'King James Version';
export const TRANSLATION_ABBREV = 'KJV';

export type VerseRef = {
  book: number; // index into BIBLE
  chapter: number; // 1-based
  verse: number; // 1-based
};

export function bookName(book: number) {
  return BIBLE[book].name;
}

export function chapterCount(book: number) {
  return BIBLE[book].chapters.length;
}

export function getChapter(book: number, chapter: number): string[] {
  return BIBLE[book].chapters[chapter - 1] ?? [];
}

export function getVerse(ref: VerseRef): string {
  return getChapter(ref.book, ref.chapter)[ref.verse - 1] ?? '';
}

export function refLabel(ref: VerseRef) {
  return `${bookName(ref.book)} ${ref.chapter}:${ref.verse}`;
}

export function chapterLabel(book: number, chapter: number) {
  return `${bookName(book)} ${chapter}`;
}

/** The chapter before book/chapter, wrapping across books (Genesis 1 wraps to Revelation 22). */
export function prevChapter(book: number, chapter: number): { book: number; chapter: number } {
  if (chapter > 1) return { book, chapter: chapter - 1 };
  const prevBook = book > 0 ? book - 1 : BIBLE.length - 1;
  return { book: prevBook, chapter: chapterCount(prevBook) };
}

/** The chapter after book/chapter, wrapping across books (Revelation 22 wraps to Genesis 1). */
export function nextChapter(book: number, chapter: number): { book: number; chapter: number } {
  if (chapter < chapterCount(book)) return { book, chapter: chapter + 1 };
  return { book: book < BIBLE.length - 1 ? book + 1 : 0, chapter: 1 };
}

export type SearchResult = VerseRef & { text: string };

/** Case-insensitive substring search across all verses. */
export function searchVerses(query: string, limit = 50): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  const results: SearchResult[] = [];
  for (let b = 0; b < BIBLE.length; b++) {
    const chapters = BIBLE[b].chapters;
    for (let c = 0; c < chapters.length; c++) {
      const verses = chapters[c];
      for (let v = 0; v < verses.length; v++) {
        if (verses[v].toLowerCase().includes(q)) {
          results.push({ book: b, chapter: c + 1, verse: v + 1, text: verses[v] });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}

/** Parse queries like "john 3", "1 john 4", or "psalms 23" into a chapter reference. */
export function parseReference(query: string): { book: number; chapter: number } | null {
  const m = query.trim().match(/^([1-3]?\s?[a-z]+(?:\s(?:of\s)?[a-z]+)*?)\s*(\d{1,3})?$/i);
  if (!m) return null;
  const name = m[1].replace(/\s+/g, ' ').trim().toLowerCase();
  if (name.length < 3) return null;
  const book = BIBLE.findIndex((b) => b.name.toLowerCase().startsWith(name));
  if (book === -1) return null;
  const chapter = m[2] ? parseInt(m[2], 10) : 1;
  if (chapter < 1 || chapter > chapterCount(book)) return null;
  return { book, chapter };
}

// Well-known verses, rotated one per day. References are resolved by book name
// so a data change that reorders books fails loudly in resolveDailyVerse.
const DAILY_VERSES: [string, number, number][] = [
  ['John', 3, 16],
  ['Psalms', 23, 1],
  ['Isaiah', 40, 31],
  ['Philippians', 4, 13],
  ['Jeremiah', 29, 11],
  ['Proverbs', 3, 5],
  ['Romans', 8, 28],
  ['Joshua', 1, 9],
  ['Psalms', 46, 10],
  ['Matthew', 11, 28],
  ['2 Timothy', 1, 7],
  ['1 Corinthians', 13, 4],
  ['Psalms', 119, 105],
  ['Galatians', 5, 22],
  ['Ephesians', 2, 8],
  ['Romans', 12, 2],
  ['Isaiah', 41, 10],
  ['Psalms', 27, 1],
  ['John', 14, 6],
  ['Matthew', 6, 33],
  ['Hebrews', 11, 1],
  ['James', 1, 5],
  ['1 Peter', 5, 7],
  ['Psalms', 121, 1],
  ['Micah', 6, 8],
  ['Zephaniah', 3, 17],
  ['Lamentations', 3, 22],
  ['John', 1, 1],
  ['Genesis', 1, 1],
  ['Romans', 5, 8],
  ['Colossians', 3, 23],
  ['Psalms', 118, 24],
  ['Matthew', 5, 14],
  ['John', 8, 12],
  ['1 John', 4, 19],
  ['Deuteronomy', 31, 6],
  ['Psalms', 34, 8],
  ['Proverbs', 16, 3],
  ['Romans', 15, 13],
  ['Revelation', 21, 4],
];

export function verseOfTheDay(date: Date): SearchResult {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const [name, chapter, verse] = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
  const book = BIBLE.findIndex((b) => b.name === name);
  return { book, chapter, verse, text: getVerse({ book, chapter, verse }) };
}
