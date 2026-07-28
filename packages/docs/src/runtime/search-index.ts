import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { documentPathFromLocation } from './document-seo.ts';

export type DocumentationSearchSource = 'fallback' | 'pagefind';

export type DocumentationSearchMatch = {
  end: number;
  start: number;
};

export type DocumentationSearchResult = {
  excerpt: string;
  excerptMatches: DocumentationSearchMatch[];
  id: string;
  score: number;
  section?: string;
  sectionMatches?: DocumentationSearchMatch[];
  title: string;
  titleMatches: DocumentationSearchMatch[];
  url: string;
};

export type DocumentationSearchResponse = {
  results: DocumentationSearchResult[];
  source: DocumentationSearchSource;
};

type PagefindSubResult = {
  excerpt?: string;
  plain_excerpt?: string;
  title: string;
  url: string;
};

type PagefindResultData = {
  excerpt?: string;
  meta: { title?: string };
  plain_excerpt?: string;
  sub_results?: PagefindSubResult[];
  url: string;
};

type PagefindRawResult = {
  data: () => Promise<PagefindResultData>;
  id: string;
  score: number;
};

type PagefindModule = {
  debouncedSearch: (
    query: string,
    options?: { filters?: Record<string, string> },
    debounceTimeout?: number,
  ) => Promise<{ results: PagefindRawResult[] } | null>;
  init: () => Promise<void> | void;
};

const maximumResults = 10;
const pagefindModulePath = `${docsManifest.site.basePath === '/' ? '' : docsManifest.site.basePath}/pagefind/pagefind.js`;
let pagefindModule: Promise<PagefindModule> | undefined;

function normalizedComparable(value: string) {
  return value.toLocaleLowerCase().replace(/[\s/_-]+/g, '');
}

function cleanSectionTitle(title: string) {
  return title.replace(/\s+permalink$/i, '').trim();
}

function cleanPageSummary(excerpt: string, title: string) {
  const normalizedExcerpt = excerpt.replace(/\s+/g, ' ').trim();
  const titlePrefix = `${title}.`;
  const withoutTitle = normalizedExcerpt
    .toLocaleLowerCase()
    .startsWith(titlePrefix.toLocaleLowerCase())
    ? normalizedExcerpt.slice(titlePrefix.length).trim()
    : normalizedExcerpt;
  const structuralBoundary = withoutTitle.search(
    /\s+(?:Contract|Install|Playground|Usage|Examples|API)\.\s/i,
  );
  return (
    structuralBoundary > 0 ? withoutTitle.slice(0, structuralBoundary) : withoutTitle
  ).trim();
}

function mergeMatches(matches: DocumentationSearchMatch[]) {
  const sortedMatches = matches
    .filter((match) => match.end > match.start)
    .sort((first, second) => first.start - second.start || first.end - second.end);
  const mergedMatches: DocumentationSearchMatch[] = [];

  for (const match of sortedMatches) {
    const previousMatch = mergedMatches.at(-1);
    if (previousMatch !== undefined && match.start <= previousMatch.end) {
      previousMatch.end = Math.max(previousMatch.end, match.end);
    } else {
      mergedMatches.push({ ...match });
    }
  }
  return mergedMatches;
}

function literalSearchMatches(text: string, query: string) {
  const comparableText = text.toLocaleLowerCase();
  const terms = [
    ...new Set(
      query
        .trim()
        .split(/\s+/)
        .map((term) => term.toLocaleLowerCase())
        .filter((term) => term.length > 0),
    ),
  ];
  const matches: DocumentationSearchMatch[] = [];
  for (const term of terms) {
    let searchFrom = 0;
    while (searchFrom < comparableText.length) {
      const start = comparableText.indexOf(term, searchFrom);
      if (start === -1) break;
      matches.push({ end: start + term.length, start });
      searchFrom = start + term.length;
    }
  }
  return mergeMatches(matches);
}

function pagefindExcerptMatches(
  markedExcerpt: string | undefined,
  plainExcerpt: string,
  query: string,
) {
  if (markedExcerpt === undefined) return literalSearchMatches(plainExcerpt, query);
  const matches: DocumentationSearchMatch[] = [];
  const markPattern = /<\/?mark>/g;
  let markedCursor = 0;
  let matchStart: number | undefined;
  let visibleText = '';

  for (const mark of markedExcerpt.matchAll(markPattern)) {
    visibleText += markedExcerpt.slice(markedCursor, mark.index);
    if (mark[0] === '<mark>') matchStart = visibleText.length;
    else if (matchStart !== undefined) {
      matches.push({ end: visibleText.length, start: matchStart });
      matchStart = undefined;
    }
    markedCursor = mark.index + mark[0].length;
  }
  visibleText += markedExcerpt.slice(markedCursor);
  if (matchStart !== undefined || visibleText !== plainExcerpt) {
    return literalSearchMatches(plainExcerpt, query);
  }
  const literalMatches = literalSearchMatches(plainExcerpt, query);
  return mergeMatches(
    matches.flatMap((match) => {
      const inside = literalMatches.filter(
        (candidate) => candidate.start >= match.start && candidate.end <= match.end,
      );
      return inside.length > 0 ? inside : [match];
    }),
  );
}

function matchesInsideExcerpt(
  matches: DocumentationSearchMatch[],
  sourceExcerpt: string,
  excerpt: string,
  query: string,
) {
  const excerptStart = sourceExcerpt.indexOf(excerpt);
  if (excerptStart === -1) return literalSearchMatches(excerpt, query);
  const excerptEnd = excerptStart + excerpt.length;
  return mergeMatches(
    matches
      .filter((match) => match.end > excerptStart && match.start < excerptEnd)
      .map((match) => ({
        end: Math.min(match.end, excerptEnd) - excerptStart,
        start: Math.max(match.start, excerptStart) - excerptStart,
      })),
  );
}

function focusExcerptOnFirstMatch(
  excerpt: string,
  matches: DocumentationSearchMatch[],
) {
  const firstMatch = matches[0];
  const maximumLeadingCharacters = 48;
  if (firstMatch === undefined || firstMatch.start <= maximumLeadingCharacters) {
    return { excerpt, matches };
  }
  const tentativeStart = firstMatch.start - maximumLeadingCharacters;
  const nextWordBoundary = excerpt.indexOf(' ', tentativeStart);
  const excerptStart = nextWordBoundary === -1 ? tentativeStart : nextWordBoundary + 1;
  const prefix = '… ';
  return {
    excerpt: `${prefix}${excerpt.slice(excerptStart)}`,
    matches: matches
      .filter((match) => match.end > excerptStart)
      .map((match) => ({
        end: Math.max(match.end, excerptStart) - excerptStart + prefix.length,
        start: Math.max(match.start, excerptStart) - excerptStart + prefix.length,
      })),
  };
}

function fallbackSearch(query: string, locale: string): DocumentationSearchResult[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const comparableQuery = normalizedComparable(query);
  return docsManifest.pages
    .filter((page) => page.locale === locale)
    .filter(
      (page) =>
        page.title.toLocaleLowerCase().includes(normalizedQuery) ||
        page.path.toLocaleLowerCase().includes(normalizedQuery),
    )
    .map((page, index) => ({
      excerpt: page.path,
      excerptMatches: literalSearchMatches(page.path, query),
      id: `fallback-${page.path}`,
      score: docsManifest.pages.length - index,
      title: page.title,
      titleMatches: literalSearchMatches(page.title, query),
      url: page.path,
    }))
    .sort((first, second) => {
      const firstExact = normalizedComparable(first.title) === comparableQuery;
      const secondExact = normalizedComparable(second.title) === comparableQuery;
      return Number(secondExact) - Number(firstExact) || second.score - first.score;
    })
    .slice(0, maximumResults);
}

function normalizeResultUrl(url: string) {
  const [pathname = '/', hash] = url.split('#', 2);
  const documentPath = documentPathFromLocation(pathname, docsManifest);
  return hash === undefined ? documentPath : `${documentPath}#${hash}`;
}

async function loadPagefind() {
  if (import.meta.env.DEV) {
    throw new Error('Pagefind is generated only for production documentation builds.');
  }
  pagefindModule ??= import(/* @vite-ignore */ pagefindModulePath).then(
    async (module) => {
      const pagefind = module as PagefindModule;
      await pagefind.init();
      return pagefind;
    },
  );
  return pagefindModule;
}

export async function prepareDocumentationSearch(): Promise<DocumentationSearchSource> {
  try {
    await loadPagefind();
    return 'pagefind';
  } catch {
    return 'fallback';
  }
}

export async function searchDocumentation(
  query: string,
  locale = docsManifest.defaultLocale,
): Promise<DocumentationSearchResponse | null> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) return { results: [], source: 'fallback' };

  try {
    const pagefind = await loadPagefind();
    const search = await pagefind.debouncedSearch(
      trimmedQuery,
      { filters: { locale } },
      150,
    );
    if (search === null) return null;
    const comparableQuery = normalizedComparable(trimmedQuery);
    const results = await Promise.all(
      search.results.slice(0, maximumResults).map(async (rawResult) => {
        const data = await rawResult.data();
        const title = data.meta.title?.trim() || data.url;
        const exactTitle = normalizedComparable(title) === comparableQuery;
        const pageResult = data.sub_results?.find((entry) => entry.url === data.url);
        const section = exactTitle
          ? undefined
          : data.sub_results?.find((entry) => entry.url.includes('#'));
        const excerptSource = exactTitle ? (pageResult ?? data) : (section ?? data);
        const sourceExcerpt = excerptSource.plain_excerpt ?? '';
        const excerpt = exactTitle
          ? cleanPageSummary(sourceExcerpt, title)
          : sourceExcerpt;
        const sourceMatches = pagefindExcerptMatches(
          excerptSource.excerpt,
          sourceExcerpt,
          trimmedQuery,
        );
        const focusedExcerpt = focusExcerptOnFirstMatch(
          excerpt,
          matchesInsideExcerpt(sourceMatches, sourceExcerpt, excerpt, trimmedQuery),
        );
        const sectionTitle = section ? cleanSectionTitle(section.title) : undefined;
        return {
          excerpt: focusedExcerpt.excerpt,
          excerptMatches: focusedExcerpt.matches,
          id: rawResult.id,
          score: rawResult.score,
          title,
          titleMatches: literalSearchMatches(title, trimmedQuery),
          url: normalizeResultUrl(section?.url ?? data.url),
          ...(sectionTitle
            ? {
                section: sectionTitle,
                sectionMatches: literalSearchMatches(sectionTitle, trimmedQuery),
              }
            : {}),
        } satisfies DocumentationSearchResult;
      }),
    );
    results.sort((first, second) => {
      const firstExact = normalizedComparable(first.title) === comparableQuery;
      const secondExact = normalizedComparable(second.title) === comparableQuery;
      return Number(secondExact) - Number(firstExact) || second.score - first.score;
    });
    return { results, source: 'pagefind' };
  } catch {
    return { results: fallbackSearch(trimmedQuery, locale), source: 'fallback' };
  }
}
