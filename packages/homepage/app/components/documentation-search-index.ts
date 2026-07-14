import { staticDocumentRoutes } from '../content/shared/static-document-routes.js';

export type DocumentationSearchSource = 'fallback' | 'pagefind';

export type DocumentationSearchResult = {
  excerpt: string;
  id: string;
  score: number;
  section?: string;
  title: string;
  url: string;
};

export type DocumentationSearchResponse = {
  results: DocumentationSearchResult[];
  source: DocumentationSearchSource;
};

type PagefindSubResult = {
  plain_excerpt?: string;
  title: string;
  url: string;
};

type PagefindResultData = {
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
    options?: Record<string, never>,
    debounceTimeout?: number,
  ) => Promise<{ results: PagefindRawResult[] } | null>;
  init: () => Promise<void> | void;
};

const maximumResults = 10;
const pagefindModulePath = '/pagefind/pagefind.js';
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

function fallbackSearch(query: string): DocumentationSearchResult[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const comparableQuery = normalizedComparable(query);

  return staticDocumentRoutes
    .filter(
      (route) =>
        route.title.toLocaleLowerCase().includes(normalizedQuery) ||
        route.path.toLocaleLowerCase().includes(normalizedQuery),
    )
    .map((route, index) => ({
      excerpt: route.path,
      id: `fallback-${route.path}`,
      score: staticDocumentRoutes.length - index,
      title: route.title,
      url: route.path,
    }))
    .sort((first, second) => {
      const firstExact = normalizedComparable(first.title) === comparableQuery;
      const secondExact = normalizedComparable(second.title) === comparableQuery;
      return Number(secondExact) - Number(firstExact) || second.score - first.score;
    })
    .slice(0, maximumResults);
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
): Promise<DocumentationSearchResponse | null> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return { results: [], source: 'fallback' };
  }

  try {
    const pagefind = await loadPagefind();
    const search = await pagefind.debouncedSearch(trimmedQuery, {}, 150);
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
        const excerpt = exactTitle
          ? cleanPageSummary(
              pageResult?.plain_excerpt ?? data.plain_excerpt ?? '',
              title,
            )
          : (section?.plain_excerpt ?? data.plain_excerpt ?? '');

        return {
          excerpt,
          id: rawResult.id,
          score: rawResult.score,
          title,
          url: section?.url ?? data.url,
          ...(section ? { section: cleanSectionTitle(section.title) } : {}),
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
    return { results: fallbackSearch(trimmedQuery), source: 'fallback' };
  }
}
