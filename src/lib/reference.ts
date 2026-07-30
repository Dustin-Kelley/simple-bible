/**
 * Compact USFM book metadata for reference parsing (names/aliases only — no scripture text).
 */
type BookMeta = {
  id: string;
  name: string;
  aliases: string[];
};

const BOOKS: BookMeta[] = [
  { id: 'GEN', name: 'Genesis', aliases: ['gen', 'ge', 'gn'] },
  { id: 'EXO', name: 'Exodus', aliases: ['exo', 'ex', 'exod'] },
  { id: 'LEV', name: 'Leviticus', aliases: ['lev', 'le', 'lv'] },
  { id: 'NUM', name: 'Numbers', aliases: ['num', 'nu', 'nm', 'nb'] },
  { id: 'DEU', name: 'Deuteronomy', aliases: ['deu', 'dt', 'deut'] },
  { id: 'JOS', name: 'Joshua', aliases: ['jos', 'josh'] },
  { id: 'JDG', name: 'Judges', aliases: ['jdg', 'judg', 'jg'] },
  { id: 'RUT', name: 'Ruth', aliases: ['rut', 'ru'] },
  { id: '1SA', name: '1 Samuel', aliases: ['1sa', '1 sam', '1samuel', '1sm'] },
  { id: '2SA', name: '2 Samuel', aliases: ['2sa', '2 sam', '2samuel', '2sm'] },
  { id: '1KI', name: '1 Kings', aliases: ['1ki', '1 kgs', '1kings', '1kg'] },
  { id: '2KI', name: '2 Kings', aliases: ['2ki', '2 kgs', '2kings', '2kg'] },
  { id: '1CH', name: '1 Chronicles', aliases: ['1ch', '1 chr', '1chronicles', '1chron'] },
  { id: '2CH', name: '2 Chronicles', aliases: ['2ch', '2 chr', '2chronicles', '2chron'] },
  { id: 'EZR', name: 'Ezra', aliases: ['ezr', 'ezra'] },
  { id: 'NEH', name: 'Nehemiah', aliases: ['neh', 'ne'] },
  { id: 'EST', name: 'Esther', aliases: ['est', 'es', 'esth'] },
  { id: 'JOB', name: 'Job', aliases: ['job', 'jb'] },
  { id: 'PSA', name: 'Psalms', aliases: ['psa', 'ps', 'psalm', 'psalms'] },
  { id: 'PRO', name: 'Proverbs', aliases: ['pro', 'prv', 'prov', 'pr'] },
  { id: 'ECC', name: 'Ecclesiastes', aliases: ['ecc', 'ec', 'eccl'] },
  { id: 'SNG', name: 'Song of Solomon', aliases: ['sng', 'sos', 'song', 'so', 'canticle'] },
  { id: 'ISA', name: 'Isaiah', aliases: ['isa', 'is'] },
  { id: 'JER', name: 'Jeremiah', aliases: ['jer', 'je'] },
  { id: 'LAM', name: 'Lamentations', aliases: ['lam', 'la'] },
  { id: 'EZK', name: 'Ezekiel', aliases: ['ezk', 'eze', 'ezek'] },
  { id: 'DAN', name: 'Daniel', aliases: ['dan', 'da', 'dn'] },
  { id: 'HOS', name: 'Hosea', aliases: ['hos', 'ho'] },
  { id: 'JOL', name: 'Joel', aliases: ['jol', 'joe', 'jl'] },
  { id: 'AMO', name: 'Amos', aliases: ['amo', 'am'] },
  { id: 'OBA', name: 'Obadiah', aliases: ['oba', 'ob'] },
  { id: 'JON', name: 'Jonah', aliases: ['jon', 'jnh'] },
  { id: 'MIC', name: 'Micah', aliases: ['mic', 'mi'] },
  { id: 'NAM', name: 'Nahum', aliases: ['nam', 'na', 'nah'] },
  { id: 'HAB', name: 'Habakkuk', aliases: ['hab', 'hb'] },
  { id: 'ZEP', name: 'Zephaniah', aliases: ['zep', 'zp', 'zeph'] },
  { id: 'HAG', name: 'Haggai', aliases: ['hag', 'hg'] },
  { id: 'ZEC', name: 'Zechariah', aliases: ['zec', 'zc', 'zech'] },
  { id: 'MAL', name: 'Malachi', aliases: ['mal', 'ml'] },
  { id: 'MAT', name: 'Matthew', aliases: ['mat', 'mt', 'matt'] },
  { id: 'MRK', name: 'Mark', aliases: ['mrk', 'mk', 'mar'] },
  { id: 'LUK', name: 'Luke', aliases: ['luk', 'lk', 'lu'] },
  { id: 'JHN', name: 'John', aliases: ['jhn', 'jn', 'joh'] },
  { id: 'ACT', name: 'Acts', aliases: ['act', 'ac'] },
  { id: 'ROM', name: 'Romans', aliases: ['rom', 'ro', 'rm'] },
  { id: '1CO', name: '1 Corinthians', aliases: ['1co', '1 cor', '1corinthians', '1cor'] },
  { id: '2CO', name: '2 Corinthians', aliases: ['2co', '2 cor', '2corinthians', '2cor'] },
  { id: 'GAL', name: 'Galatians', aliases: ['gal', 'ga'] },
  { id: 'EPH', name: 'Ephesians', aliases: ['eph', 'ep'] },
  { id: 'PHP', name: 'Philippians', aliases: ['php', 'phil', 'pp'] },
  { id: 'COL', name: 'Colossians', aliases: ['col', 'co'] },
  { id: '1TH', name: '1 Thessalonians', aliases: ['1th', '1 thess', '1thessalonians', '1thess'] },
  { id: '2TH', name: '2 Thessalonians', aliases: ['2th', '2 thess', '2thessalonians', '2thess'] },
  { id: '1TI', name: '1 Timothy', aliases: ['1ti', '1 tim', '1timothy', '1tm'] },
  { id: '2TI', name: '2 Timothy', aliases: ['2ti', '2 tim', '2timothy', '2tm'] },
  { id: 'TIT', name: 'Titus', aliases: ['tit', 'ti'] },
  { id: 'PHM', name: 'Philemon', aliases: ['phm', 'phlm', 'philem'] },
  { id: 'HEB', name: 'Hebrews', aliases: ['heb', 'he'] },
  { id: 'JAS', name: 'James', aliases: ['jas', 'jm', 'jam'] },
  { id: '1PE', name: '1 Peter', aliases: ['1pe', '1 pet', '1peter', '1pt'] },
  { id: '2PE', name: '2 Peter', aliases: ['2pe', '2 pet', '2peter', '2pt'] },
  { id: '1JN', name: '1 John', aliases: ['1jn', '1 jn', '1john', '1jo'] },
  { id: '2JN', name: '2 John', aliases: ['2jn', '2 jn', '2john', '2jo'] },
  { id: '3JN', name: '3 John', aliases: ['3jn', '3 jn', '3john', '3jo'] },
  { id: 'JUD', name: 'Jude', aliases: ['jud', 'jde'] },
  { id: 'REV', name: 'Revelation', aliases: ['rev', 're', 'rv', 'revelation'] },
];

export type ParsedReference = {
  book: string;
  chapter: string;
  verse?: string;
  label: string;
};

function normalize(input: string) {
  return input.trim().toLowerCase().replace(/\./g, ' ').replace(/\s+/g, ' ');
}

function findBook(nameOrId: string): BookMeta | null {
  const key = normalize(nameOrId).replace(/\s+/g, '');
  const spaced = normalize(nameOrId);

  for (const book of BOOKS) {
    if (book.id.toLowerCase() === key) return book;
    if (normalize(book.name).replace(/\s+/g, '') === key) return book;
    if (book.aliases.some((a) => a.replace(/\s+/g, '') === key || a === spaced)) return book;
    if (normalize(book.name).startsWith(spaced) && spaced.length >= 3) return book;
  }
  return null;
}

/**
 * Parse common Bible references into USFM book + chapter (+ optional verse).
 * Supports: "John 3:16", "Jn 3:16", "JHN.3.16", "Psalms 23", "1 John 4".
 */
export function parseReference(query: string): ParsedReference | null {
  const raw = query.trim();
  if (!raw) return null;

  // USFM dotted form: JHN.3.16 or JHN.3
  const usfm = raw.match(/^([1-3]?[A-Za-z]{2,3})\.(\d{1,3})(?:\.(\d{1,3}))?$/);
  if (usfm) {
    const book = findBook(usfm[1]);
    if (!book) return null;
    const chapter = usfm[2];
    const verse = usfm[3];
    return {
      book: book.id,
      chapter,
      verse,
      label: verse ? `${book.name} ${chapter}:${verse}` : `${book.name} ${chapter}`,
    };
  }

  // Human form: "1 John 3:16", "John 3", "Ps 23:1"
  const human = raw.match(
    /^([1-3]?\s*[A-Za-z]+(?:\s+(?:of\s+)?[A-Za-z]+)?)\s+(\d{1,3})(?:\s*[:.]\s*(\d{1,3}))?\s*$/i
  );
  if (!human) return null;

  const book = findBook(human[1]);
  if (!book) return null;
  const chapter = human[2];
  const verse = human[3];
  return {
    book: book.id,
    chapter,
    verse,
    label: verse ? `${book.name} ${chapter}:${verse}` : `${book.name} ${chapter}`,
  };
}

export function bookDisplayName(bookId: string): string {
  return BOOKS.find((b) => b.id === bookId)?.name ?? bookId;
}

export function chapterLabel(book: string, chapter: string): string {
  return `${bookDisplayName(book)} ${chapter}`;
}

/** Best-effort parse of share/reference strings like "John 3:16 NIV". */
export function parseLabelReference(label: string): ParsedReference | null {
  const cleaned = label.replace(/\s+[A-Z]{2,10}\s*$/, '').trim();
  return parseReference(cleaned);
}
