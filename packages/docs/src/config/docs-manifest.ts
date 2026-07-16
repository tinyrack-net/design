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
  type DocsUiMessages,
  normalizeBasePath,
  normalizeDocumentPathname,
} from './docs-config.ts';

export type LoadDocsManifestOptions = { root?: string };

const defaultMessages: DocsUiMessages = {
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
};

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

function parseFrontmatter(source: string, sourceFile: string): DocsFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (match === null) throw new Error(`${sourceFile} must start with YAML frontmatter`);
  const value = parseYaml(match[1] ?? '') as Record<string, unknown> | null;
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new Error(`${sourceFile} frontmatter must be a YAML mapping`);
  }

  const title = value['title'];
  const description = value['description'];
  const section = value['section'];
  const order = value['order'];
  const contentKey = value['contentKey'];
  const layout = value['layout'];
  const navigation = value['navigation'];
  const sidebarLabel = value['sidebarLabel'];
  const slug = value['slug'];
  assertNonEmptyString(title, 'title', sourceFile);
  assertNonEmptyString(description, 'description', sourceFile);
  assertNonEmptyString(section, 'section', sourceFile);
  if (!Number.isInteger(order) || (order as number) < 0) {
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
    order: order as number,
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

function defaultDocumentPath(routeFile: string) {
  const withoutExtension = routeFile
    .replace(/\.mdx$/i, '')
    .replace(/\.docs$/i, '')
    .replaceAll('\\', '/');
  return normalizeDocumentPathname(
    `/${withoutExtension.replace(/(?:^|\/)index$/i, '')}`,
  );
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
          messages: defaultMessages,
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
        { ...locale, id, messages: { ...defaultMessages, ...locale.messages } },
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
  for (const section of sections) {
    assertNonEmptyString(section.id, 'section.id', 'docs.config.ts');
    assertNonEmptyString(section.label, 'section.label', 'docs.config.ts');
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
  }

  const sectionById = new Map(sections.map((section) => [section.id, section]));
  const localeOrder = new Map(
    Object.keys(locales).map((locale, index) => [locale, index]),
  );
  const pages = filesUnder(resolvedContent)
    .filter((path) => path.endsWith('.mdx'))
    .map((absoluteFile): DocsPage => {
      const source = readFileSync(absoluteFile, 'utf8');
      const routeFile = relative(resolvedContent, absoluteFile).replaceAll('\\', '/');
      const sourceFile = relative(resolvedRoot, absoluteFile).replaceAll('\\', '/');
      const frontmatter = parseFrontmatter(source, sourceFile);
      const section = sectionById.get(frontmatter.section);
      if (section === undefined) {
        throw new Error(
          `${sourceFile} references unknown docs section "${frontmatter.section}"`,
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
        headings: parseHeadings(source),
        id,
        imagePath,
        imageUrl: `${site.url}${assetPathWithBase(site.basePath, imagePath)}`,
        layout: frontmatter.layout ?? 'docs',
        locale,
        moduleStem: routeFile.replace(/^.*\//, '').replace(/\.mdx$/i, ''),
        navigation: frontmatter.navigation ?? true,
        order: frontmatter.order,
        path,
        routeFile,
        section: section.id,
        sectionLabel: section.label,
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
        first.order - second.order
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
    const orderKey = `${page.locale}:${page.section}`;
    const orders = sectionPageOrders.get(orderKey) ?? new Map<number, string>();
    const duplicateOrder = orders.get(page.order);
    if (duplicateOrder !== undefined) {
      throw new Error(
        `${page.sourceFile} and ${duplicateOrder} use duplicate order ${page.order} in section ${page.section}`,
      );
    }
    paths.set(page.path, page.sourceFile);
    ids.set(page.id, page.sourceFile);
    orders.set(page.order, page.sourceFile);
    sectionPageOrders.set(orderKey, orders);
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
                return {
                  children: sectionPages.map((page) => ({
                    contentKey: page.contentKey,
                    label: page.sidebarLabel,
                    path: page.path,
                    type: 'page' as const,
                  })),
                  label: section.label,
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
