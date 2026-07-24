import { readdirSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  canonicalDocumentPath,
  type DocsConfig,
  type DocsFrontmatter,
  type DocsHeading,
  type DocsLocalizedLabel,
  type DocsManifest,
  type DocsNavigationConfigItem,
  type DocsPage,
  type DocsResolvedLocale,
  type DocsResolvedNavigationItem,
  type DocsSection,
  type DocsSectionGroupConfig,
  type DocsUiMessages,
  normalizeBasePath,
  normalizeDocumentPathname,
} from './docs-config.ts';
import {
  docsPageModuleStem,
  docsPagePathStem,
  isDocsPageFile,
  isDocsTsxPageFile,
} from './docs-page-file.ts';
import { parseDocsTsxPage } from './docs-tsx-page.ts';

export type LoadDocsManifestOptions = { root?: string };

const englishMessages: DocsUiMessages = {
  backToMainMenu: 'Back to docs menu',
  closeNavigation: 'Close navigation',
  closeSearch: 'Close search',
  emptySearch: 'No documentation found.',
  language: 'Language',
  loading: 'Loading page',
  headerNavigation: 'Primary navigation',
  navigation: 'Documentation',
  navigationSidebar: 'Documentation sidebar',
  next: 'Next',
  nextDocument: 'Next document',
  onThisPage: 'On this page',
  openNavigation: 'Open navigation',
  previous: 'Previous',
  previousDocument: 'Previous document',
  search: 'Search documentation',
  searchFallback: 'Search is using the bundled fallback index.',
  searchIdle: 'Type to search documentation.',
  searchLoading: 'Searching documentation',
  searchResults: 'Search results',
  siteNavigation: 'Main menu',
  useDarkColorScheme: 'Use dark color scheme',
  useLightColorScheme: 'Use light color scheme',
};

const localizedMessages: Readonly<Record<string, DocsUiMessages>> = {
  en: englishMessages,
  ko: {
    backToMainMenu: '문서 메뉴로 돌아가기',
    closeNavigation: '탐색 닫기',
    closeSearch: '검색 닫기',
    emptySearch: '문서를 찾지 못했어요.',
    language: '언어',
    loading: '페이지 로드 중',
    headerNavigation: '주요 탐색',
    navigation: '문서',
    navigationSidebar: '문서 사이드바',
    next: '다음',
    nextDocument: '다음 문서',
    onThisPage: '이 페이지에서',
    openNavigation: '탐색 열기',
    previous: '이전',
    previousDocument: '이전 문서',
    search: '문서 검색',
    searchFallback: '기본 검색 색인을 사용하고 있어요.',
    searchIdle: '문서를 검색하세요.',
    searchLoading: '문서 검색 중',
    searchResults: '검색 결과',
    siteNavigation: '메인 메뉴',
    useDarkColorScheme: '어두운 색상 모드로 전환',
    useLightColorScheme: '밝은 색상 모드로 전환',
  },
  ja: {
    backToMainMenu: 'ドキュメントメニューに戻る',
    closeNavigation: 'ナビゲーションを閉じる',
    closeSearch: '検索を閉じる',
    emptySearch: 'ドキュメントが見つかりません。',
    language: '言語',
    loading: 'ページを読み込み中',
    headerNavigation: 'メインナビゲーション',
    navigation: 'ドキュメント',
    navigationSidebar: 'ドキュメントサイドバー',
    next: '次へ',
    nextDocument: '次のドキュメント',
    onThisPage: 'このページの内容',
    openNavigation: 'ナビゲーションを開く',
    previous: '前へ',
    previousDocument: '前のドキュメント',
    search: 'ドキュメントを検索',
    searchFallback: '組み込みの検索インデックスを使用しています。',
    searchIdle: 'ドキュメントを検索してください。',
    searchLoading: 'ドキュメントを検索中',
    searchResults: '検索結果',
    siteNavigation: 'メインメニュー',
    useDarkColorScheme: 'ダークカラースキームに切り替え',
    useLightColorScheme: 'ライトカラースキームに切り替え',
  },
};

function defaultMessagesForLocale(id: string, language: string) {
  return (
    localizedMessages[id] ??
    localizedMessages[language.split('-')[0] ?? ''] ??
    englishMessages
  );
}

function filesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

function assertNonEmptyString(
  value: unknown,
  field: string,
  sourceFile: string,
): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${sourceFile} frontmatter field "${field}" must be a string`);
  }
}

function validateFrontmatter(value: unknown, sourceFile: string): DocsFrontmatter {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new Error(`${sourceFile} frontmatter must be an object`);
  }
  const fields = value as Record<string, unknown>;

  const title = fields['title'];
  const description = fields['description'];
  const section = fields['section'];
  const group = fields['group'];
  const order = fields['order'];
  const contentKey = fields['contentKey'];
  const headings = fields['headings'];
  const layout = fields['layout'];
  const navigation = fields['navigation'];
  const sidebarLabel = fields['sidebarLabel'];
  const slug = fields['slug'];
  assertNonEmptyString(title, 'title', sourceFile);
  assertNonEmptyString(description, 'description', sourceFile);
  assertNonEmptyString(section, 'section', sourceFile);
  if (group !== undefined) assertNonEmptyString(group, 'group', sourceFile);
  if (order !== undefined && (!Number.isInteger(order) || (order as number) < 0)) {
    throw new Error(
      `${sourceFile} frontmatter field "order" must be a non-negative integer`,
    );
  }
  if (contentKey !== undefined)
    assertNonEmptyString(contentKey, 'contentKey', sourceFile);
  if (sidebarLabel !== undefined)
    assertNonEmptyString(sidebarLabel, 'sidebarLabel', sourceFile);
  if (slug !== undefined) assertNonEmptyString(slug, 'slug', sourceFile);
  if (
    layout !== undefined &&
    !['docs', 'splash', 'standalone'].includes(String(layout))
  ) {
    throw new Error(
      `${sourceFile} frontmatter field "layout" must be docs, splash, or standalone`,
    );
  }
  if (navigation !== undefined && typeof navigation !== 'boolean') {
    throw new Error(`${sourceFile} frontmatter field "navigation" must be a boolean`);
  }

  return {
    description: description.trim(),
    ...(group === undefined ? {} : { group: group.trim() }),
    ...(headings === undefined
      ? {}
      : { headings: validateHeadings(headings, sourceFile) }),
    ...(order === undefined ? {} : { order: order as number }),
    section: section.trim(),
    title: title.trim(),
    ...(contentKey === undefined ? {} : { contentKey: contentKey.trim() }),
    ...(layout === undefined
      ? {}
      : { layout: layout as 'docs' | 'splash' | 'standalone' }),
    ...(navigation === undefined ? {} : { navigation }),
    ...(sidebarLabel === undefined ? {} : { sidebarLabel: sidebarLabel.trim() }),
    ...(slug === undefined ? {} : { slug: slug.trim() }),
  };
}

function parseFrontmatter(source: string, sourceFile: string): DocsFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (match === null) throw new Error(`${sourceFile} must start with YAML frontmatter`);
  const value = parseYaml(match[1] ?? '') as unknown;
  return validateFrontmatter(value, sourceFile);
}

function defaultDocumentPath(routeFile: string) {
  const withoutExtension = docsPagePathStem(routeFile);
  return normalizeDocumentPathname(
    `/${withoutExtension.replace(/(?:^|\/)index$/i, '')}`,
  );
}

function validateHeadings(value: unknown, sourceFile: string): DocsHeading[] {
  if (!Array.isArray(value)) throw new Error(`${sourceFile} headings must be an array`);
  const ids = new Set<string>();
  return value.map((heading, index) => {
    if (heading === null || Array.isArray(heading) || typeof heading !== 'object') {
      throw new Error(`${sourceFile} heading ${index + 1} must be an object`);
    }
    const fields = heading as Record<string, unknown>;
    const depth = fields['depth'];
    const id = fields['id'];
    const label = fields['label'];
    if (depth !== 2 && depth !== 3) {
      throw new Error(`${sourceFile} heading field "depth" must be 2 or 3`);
    }
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error(`${sourceFile} heading field "id" must be a string`);
    }
    if (typeof label !== 'string' || label.trim().length === 0) {
      throw new Error(`${sourceFile} heading field "label" must be a string`);
    }
    const normalizedId = id.trim();
    if (ids.has(normalizedId)) {
      throw new Error(`${sourceFile} has duplicate heading id "${normalizedId}"`);
    }
    ids.add(normalizedId);
    return { depth, id: normalizedId, label: label.trim() };
  });
}

function normalizeSlug(slug: string, sourceFile: string) {
  if (/[?#]/.test(slug)) {
    throw new Error(`${sourceFile} frontmatter slug must not contain a query or hash`);
  }
  return normalizeDocumentPathname(slug.startsWith('/') ? slug : `/${slug}`);
}

function slugifyHeading(label: string) {
  const slug = label
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[`*_~[\](){}<>]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
  return slug.length === 0 ? 'section' : slug;
}

function parseHeadings(source: string): DocsHeading[] {
  const headings: DocsHeading[] = [];
  const ids = new Map<string, number>();
  let fenced = false;
  for (const line of source.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const match = /^\s*(##|###)\s+(.+?)\s*#*\s*$/.exec(line);
    if (match === null) continue;
    const label = (match[2] ?? '').replace(/<[^>]+>/g, '').trim();
    const baseId = slugifyHeading(label);
    const count = ids.get(baseId) ?? 0;
    ids.set(baseId, count + 1);
    headings.push({
      depth: match[1] === '##' ? 2 : 3,
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
      label,
    });
  }
  return headings;
}

function socialImagePath(pathname: string) {
  return pathname === '/' ? '/og/home.png' : `/og${pathname}.png`;
}

function pathWithBase(basePath: string, pathname: string) {
  if (basePath === '/') return canonicalDocumentPath(pathname);
  if (pathname === '/') return `${basePath}/`;
  return `${basePath}${canonicalDocumentPath(pathname)}`;
}

function assetPathWithBase(basePath: string, pathname: string) {
  return basePath === '/' ? pathname : `${basePath}${pathname}`;
}

function resolvedSite(config: DocsConfig) {
  const basePath = normalizeBasePath(config.site.basePath);
  const siteUrl = config.site.url.replace(/\/+$/, '');
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(siteUrl);
  } catch {
    throw new Error(`Docs site URL must be absolute: ${config.site.url}`);
  }
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error(`Docs site URL must use http or https: ${config.site.url}`);
  }
  return {
    ...config.site,
    basePath,
    logo: { ...config.site.logo, alt: config.site.logo.alt ?? config.site.title },
    url: siteUrl,
  };
}

function ensureContentDirectory(root: string, contentDir: string) {
  const resolvedRoot = resolve(root);
  const resolvedContent = resolve(resolvedRoot, contentDir);
  const relativeContent = relative(resolvedRoot, resolvedContent);
  if (
    isAbsolute(relativeContent) ||
    relativeContent === '..' ||
    relativeContent.startsWith(`..${sep}`)
  ) {
    throw new Error(
      `Docs content directory must stay inside the project root: ${contentDir}`,
    );
  }
  return { resolvedContent, resolvedRoot };
}

function resolveLocales(config: DocsConfig) {
  if (config.i18n === undefined) {
    const id = config.site.locale.language;
    return {
      defaultLocale: id,
      locales: {
        [id]: {
          ...config.site.locale,
          id,
          label: id,
          messages: defaultMessagesForLocale(id, config.site.locale.language),
        },
      } satisfies Record<string, DocsResolvedLocale>,
    };
  }
  const localeEntries = Object.entries(config.i18n.locales);
  if (localeEntries.length === 0) throw new Error('Docs i18n must define locales');
  if (config.i18n.locales[config.i18n.defaultLocale] === undefined) {
    throw new Error(`Unknown default docs locale: ${config.i18n.defaultLocale}`);
  }
  const locales = Object.fromEntries(
    localeEntries.map(([id, locale]) => {
      assertNonEmptyString(id, 'i18n.locale.id', 'docs.config.ts');
      assertNonEmptyString(locale.label, 'i18n.locale.label', 'docs.config.ts');
      return [
        id,
        {
          ...locale,
          id,
          messages: {
            ...defaultMessagesForLocale(id, locale.language),
            ...locale.messages,
          },
        },
      ];
    }),
  ) as Record<string, DocsResolvedLocale>;
  return { defaultLocale: config.i18n.defaultLocale, locales };
}

function pageLocale(
  path: string,
  config: DocsConfig,
  defaultLocale: string,
  locales: Readonly<Record<string, DocsResolvedLocale>>,
) {
  if (config.i18n === undefined) return defaultLocale;
  const candidate = path.split('/').filter(Boolean)[0];
  if (candidate === undefined || locales[candidate] === undefined) {
    throw new Error(`Localized docs path must start with a configured locale: ${path}`);
  }
  return candidate;
}

function pageContentKey(path: string, locale: string, localized: boolean) {
  if (!localized) return path;
  const localePath = `/${locale}`;
  if (path === localePath) return '/';
  return normalizeDocumentPathname(path.slice(localePath.length));
}

function localizedLabel(
  label: DocsLocalizedLabel,
  locale: string,
  defaultLocale: string,
) {
  if (typeof label === 'string') return label;
  const value = label[locale] ?? label[defaultLocale];
  if (value === undefined) {
    throw new Error(`Missing navigation label for locale ${locale}`);
  }
  return value;
}

function localizedPath(path: string, locale: string, localized: boolean) {
  const replaced = path.replaceAll('{locale}', locale).replaceAll(':locale', locale);
  if (!localized || /^(?:[a-z]+:)?\/\//i.test(replaced)) return replaced;
  const normalized = normalizeDocumentPathname(
    replaced.startsWith('/') ? replaced : `/${replaced}`,
  );
  return normalized === `/${locale}` || normalized.startsWith(`/${locale}/`)
    ? normalized
    : normalizeDocumentPathname(`/${locale}${normalized}`);
}

function resolveNavigationItems(
  items: readonly DocsNavigationConfigItem[],
  locale: string,
  defaultLocale: string,
  pages: readonly DocsPage[],
  localized: boolean,
): readonly DocsResolvedNavigationItem[] {
  return items.map((item): DocsResolvedNavigationItem => {
    if (item.type === 'group') {
      return {
        children: resolveNavigationItems(
          item.children,
          locale,
          defaultLocale,
          pages,
          localized,
        ),
        label: localizedLabel(item.label, locale, defaultLocale),
        type: 'group',
      };
    }
    if (item.type === 'link') {
      return {
        ...(item.external === undefined ? {} : { external: item.external }),
        label: localizedLabel(item.label, locale, defaultLocale),
        path: localizedPath(item.path, locale, localized),
        type: 'link',
      };
    }
    const path =
      item.path === undefined
        ? pages.find(
            (page) =>
              page.locale === locale && page.contentKey === (item.contentKey ?? '/'),
          )?.path
        : localizedPath(item.path, locale, localized);
    const page = pages.find(
      (candidate) => candidate.locale === locale && candidate.path === path,
    );
    if (page === undefined) {
      throw new Error(
        `Navigation page was not found for locale ${locale}: ${item.contentKey ?? item.path ?? '/'}`,
      );
    }
    return {
      contentKey: page.contentKey,
      label:
        item.label === undefined
          ? page.sidebarLabel
          : localizedLabel(item.label, locale, defaultLocale),
      path: page.path,
      type: 'page',
    };
  });
}

export function loadDocsManifest(
  config: DocsConfig,
  options: LoadDocsManifestOptions = {},
): DocsManifest {
  const root = options.root ?? process.cwd();
  const { resolvedContent, resolvedRoot } = ensureContentDirectory(
    root,
    config.contentDir,
  );
  const site = resolvedSite(config);
  const { defaultLocale, locales } = resolveLocales(config);
  const sections = [...config.sections].sort(
    (first, second) => first.order - second.order,
  );
  const sectionIds = new Set<string>();
  const sectionOrders = new Set<number>();
  const sectionGroups = new Map<string, readonly DocsSectionGroupConfig[]>();
  const sectionGroupRank = new Map<string, Map<string, number>>();
  for (const section of sections) {
    assertNonEmptyString(section.id, 'section.id', 'docs.config.ts');
    if (typeof section.label === 'string') {
      assertNonEmptyString(section.label, 'section.label', 'docs.config.ts');
    } else {
      for (const [locale, label] of Object.entries(section.label)) {
        assertNonEmptyString(label, `section.label.${locale}`, 'docs.config.ts');
      }
    }
    if (!Number.isInteger(section.order) || section.order < 0) {
      throw new Error(
        `Docs section "${section.id}" order must be a non-negative integer`,
      );
    }
    if (sectionIds.has(section.id))
      throw new Error(`Duplicate docs section id: ${section.id}`);
    if (sectionOrders.has(section.order)) {
      throw new Error(`Duplicate docs section order: ${section.order}`);
    }
    sectionIds.add(section.id);
    sectionOrders.add(section.order);

    const groupIds = new Set<string>();
    const groupOrders = new Set<number>();
    for (const group of section.groups ?? []) {
      assertNonEmptyString(
        group.id,
        `section.${section.id}.group.id`,
        'docs.config.ts',
      );
      if (typeof group.label === 'string') {
        assertNonEmptyString(
          group.label,
          `section.${section.id}.group.label`,
          'docs.config.ts',
        );
      } else {
        for (const [locale, label] of Object.entries(group.label)) {
          assertNonEmptyString(
            label,
            `section.${section.id}.group.label.${locale}`,
            'docs.config.ts',
          );
        }
      }
      if (
        group.order !== undefined &&
        (!Number.isInteger(group.order) || group.order < 0)
      ) {
        throw new Error(
          `Docs group "${group.id}" in section "${section.id}" order must be a non-negative integer`,
        );
      }
      if (groupIds.has(group.id)) {
        throw new Error(
          `Duplicate docs group id "${group.id}" in section "${section.id}"`,
        );
      }
      if (group.order !== undefined && groupOrders.has(group.order)) {
        throw new Error(
          `Duplicate docs group order ${group.order} in section "${section.id}"`,
        );
      }
      groupIds.add(group.id);
      if (group.order !== undefined) groupOrders.add(group.order);
    }
    const orderedGroups = [...(section.groups ?? [])].sort((first, second) => {
      if (first.order !== undefined && second.order !== undefined) {
        return first.order - second.order;
      }
      if (first.order !== undefined) return -1;
      if (second.order !== undefined) return 1;
      return 0;
    });
    sectionGroups.set(section.id, orderedGroups);
    sectionGroupRank.set(
      section.id,
      new Map(orderedGroups.map((group, index) => [group.id, index])),
    );
  }

  const sectionById = new Map(sections.map((section) => [section.id, section]));
  const localeOrder = new Map(
    Object.keys(locales).map((locale, index) => [locale, index]),
  );
  const localeCollators = new Map(
    Object.entries(locales).map(([id, locale]) => [
      id,
      new Intl.Collator(locale.language, { numeric: true, sensitivity: 'base' }),
    ]),
  );
  const fallbackCollator = new Intl.Collator('en', {
    numeric: true,
    sensitivity: 'base',
  });
  const pageGroupRank = (page: DocsPage) =>
    page.group === undefined
      ? -1
      : (sectionGroupRank.get(page.section)?.get(page.group) ?? -1);
  const compareWithinBucket = (first: DocsPage, second: DocsPage) => {
    const collator = localeCollators.get(first.locale) ?? fallbackCollator;
    if (first.order !== undefined && second.order !== undefined) {
      return first.order - second.order || collator.compare(first.path, second.path);
    }
    if (first.order !== undefined) return -1;
    if (second.order !== undefined) return 1;
    return (
      collator.compare(first.sidebarLabel, second.sidebarLabel) ||
      collator.compare(first.path, second.path)
    );
  };
  const pages = filesUnder(resolvedContent)
    .filter(isDocsPageFile)
    .map((absoluteFile): DocsPage => {
      const source = readFileSync(absoluteFile, 'utf8');
      const routeFile = relative(resolvedContent, absoluteFile).replaceAll('\\', '/');
      const sourceFile = relative(resolvedRoot, absoluteFile).replaceAll('\\', '/');
      const tsxPage = isDocsTsxPageFile(routeFile)
        ? parseDocsTsxPage(source, sourceFile)
        : undefined;
      const frontmatter =
        tsxPage === undefined
          ? parseFrontmatter(source, sourceFile)
          : validateFrontmatter(tsxPage.frontmatter, sourceFile);
      const section = sectionById.get(frontmatter.section);
      if (section === undefined) {
        throw new Error(
          `${sourceFile} references unknown docs section "${frontmatter.section}"`,
        );
      }
      if (
        frontmatter.group !== undefined &&
        !sectionGroupRank.get(section.id)?.has(frontmatter.group)
      ) {
        throw new Error(
          `${sourceFile} references unknown docs group "${frontmatter.group}" in section "${section.id}"`,
        );
      }
      const path = frontmatter.slug
        ? normalizeSlug(frontmatter.slug, sourceFile)
        : defaultDocumentPath(routeFile);
      const locale = pageLocale(path, config, defaultLocale, locales);
      const contentKey =
        frontmatter.contentKey ??
        pageContentKey(path, locale, config.i18n !== undefined);
      const canonicalPath = pathWithBase(site.basePath, path);
      const imagePath = socialImagePath(path);
      const id = path === '/' ? 'home' : path.slice(1).replaceAll('/', '-');
      return {
        alternates: [],
        breadcrumbs: [],
        canonicalPath,
        canonicalUrl: `${site.url}${canonicalPath}`,
        contentKey,
        description: frontmatter.description,
        documentTitle:
          contentKey === '/' ? site.title : `${frontmatter.title} · ${site.title}`,
        ...(frontmatter.group === undefined ? {} : { group: frontmatter.group }),
        headings:
          tsxPage === undefined
            ? (frontmatter.headings ?? parseHeadings(source))
            : validateHeadings(tsxPage.headings, sourceFile),
        id,
        imagePath,
        imageUrl: `${site.url}${assetPathWithBase(site.basePath, imagePath)}`,
        layout: frontmatter.layout ?? 'docs',
        locale,
        moduleStem: docsPageModuleStem(routeFile),
        navigation: frontmatter.navigation ?? true,
        ...(frontmatter.order === undefined ? {} : { order: frontmatter.order }),
        path,
        routeFile,
        section: section.id,
        sectionLabel: localizedLabel(section.label, locale, defaultLocale),
        sidebarLabel: frontmatter.sidebarLabel ?? frontmatter.title,
        sourceFile,
        title: frontmatter.title,
      };
    })
    .sort((first, second) => {
      const firstSection = sectionById.get(first.section) as DocsSection;
      const secondSection = sectionById.get(second.section) as DocsSection;
      return (
        (localeOrder.get(first.locale) ?? 0) - (localeOrder.get(second.locale) ?? 0) ||
        firstSection.order - secondSection.order ||
        pageGroupRank(first) - pageGroupRank(second) ||
        compareWithinBucket(first, second)
      );
    });

  const paths = new Map<string, string>();
  const ids = new Map<string, string>();
  const sectionPageOrders = new Map<string, Map<number, string>>();
  for (const page of pages) {
    const duplicatePath = paths.get(page.path);
    if (duplicatePath !== undefined) {
      throw new Error(
        `${page.sourceFile} and ${duplicatePath} use duplicate slug ${page.path}`,
      );
    }
    const duplicateId = ids.get(page.id);
    if (duplicateId !== undefined) {
      throw new Error(
        `${page.sourceFile} and ${duplicateId} generate duplicate id ${page.id}`,
      );
    }
    paths.set(page.path, page.sourceFile);
    ids.set(page.id, page.sourceFile);
    if (page.order !== undefined) {
      const orderKey = `${page.locale}:${page.section}:${page.group ?? ''}`;
      const orders = sectionPageOrders.get(orderKey) ?? new Map<number, string>();
      const duplicateOrder = orders.get(page.order);
      if (duplicateOrder !== undefined) {
        throw new Error(
          `${page.sourceFile} and ${duplicateOrder} use duplicate order ${page.order} in section ${page.section}`,
        );
      }
      orders.set(page.order, page.sourceFile);
      sectionPageOrders.set(orderKey, orders);
    }
  }

  for (const locale of Object.keys(locales)) {
    const homePath = config.i18n === undefined ? '/' : `/${locale}`;
    if (!pages.some((page) => page.path === homePath)) {
      throw new Error(`Docs content must define a homepage for locale ${locale}`);
    }
  }

  const pagesWithMetadata = pages.map((page): DocsPage => {
    const alternates = pages
      .filter((candidate) => candidate.contentKey === page.contentKey)
      .map((candidate) => ({
        language: locales[candidate.locale]?.language ?? candidate.locale,
        locale: candidate.locale,
        path: candidate.path,
        url: candidate.canonicalUrl,
      }));
    const home = pages.find(
      (candidate) => candidate.locale === page.locale && candidate.contentKey === '/',
    );
    const sectionLanding = pages.find(
      (candidate) =>
        candidate.locale === page.locale &&
        candidate.section === page.section &&
        candidate.contentKey === normalizeDocumentPathname(`/${page.section}`),
    );
    return {
      ...page,
      alternates,
      breadcrumbs:
        page.contentKey === '/'
          ? []
          : [
              { name: site.title, url: home?.canonicalUrl ?? `${site.url}/` },
              ...(sectionLanding === undefined || sectionLanding.path === page.path
                ? []
                : [{ name: page.sectionLabel, url: sectionLanding.canonicalUrl }]),
              { name: page.title, url: page.canonicalUrl },
            ],
    };
  });

  const navigation = Object.fromEntries(
    Object.keys(locales).map((locale) => {
      const items =
        config.navigation === undefined
          ? sections
              .map((section): DocsResolvedNavigationItem | undefined => {
                const sectionPages = pagesWithMetadata.filter(
                  (page) =>
                    page.locale === locale &&
                    page.section === section.id &&
                    page.navigation,
                );
                if (sectionPages.length === 0) return undefined;
                const pageItem = (page: DocsPage) => ({
                  contentKey: page.contentKey,
                  label: page.sidebarLabel,
                  path: page.path,
                  type: 'page' as const,
                });
                const ungrouped = sectionPages
                  .filter((page) => page.group === undefined)
                  .map(pageItem);
                const groupItems = (sectionGroups.get(section.id) ?? [])
                  .map((group): DocsResolvedNavigationItem | undefined => {
                    const children = sectionPages
                      .filter((page) => page.group === group.id)
                      .map(pageItem);
                    if (children.length === 0) return undefined;
                    return {
                      children,
                      label: localizedLabel(group.label, locale, defaultLocale),
                      type: 'group' as const,
                    };
                  })
                  .filter(
                    (item): item is DocsResolvedNavigationItem => item !== undefined,
                  );
                return {
                  children: [...ungrouped, ...groupItems],
                  label: localizedLabel(section.label, locale, defaultLocale),
                  type: 'group' as const,
                };
              })
              .filter((item): item is DocsResolvedNavigationItem => item !== undefined)
          : resolveNavigationItems(
              config.navigation,
              locale,
              defaultLocale,
              pagesWithMetadata,
              config.i18n !== undefined,
            );
      return [locale, items];
    }),
  );

  return {
    defaultLocale,
    ...(config.header === undefined ? {} : { header: config.header }),
    locales,
    navigation,
    pages: pagesWithMetadata,
    redirects: { ...(config.redirects ?? {}) },
    sections,
    site,
    theme: config.theme,
  };
}
