import { readdirSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  canonicalDocumentPath,
  type DocsConfig,
  type DocsFrontmatter,
  type DocsManifest,
  type DocsPage,
  type DocsSection,
  normalizeBasePath,
  normalizeDocumentPathname,
} from './docs-config.ts';

export type LoadDocsManifestOptions = {
  root?: string;
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

  assertNonEmptyString(value['title'], 'title', sourceFile);
  assertNonEmptyString(value['description'], 'description', sourceFile);
  assertNonEmptyString(value['section'], 'section', sourceFile);
  if (!Number.isInteger(value['order']) || (value['order'] as number) < 0) {
    throw new Error(
      `${sourceFile} frontmatter field "order" must be a non-negative integer`,
    );
  }
  if (value['slug'] !== undefined)
    assertNonEmptyString(value['slug'], 'slug', sourceFile);
  if (value['sidebarLabel'] !== undefined) {
    assertNonEmptyString(value['sidebarLabel'], 'sidebarLabel', sourceFile);
  }

  return {
    description: value['description'].trim(),
    order: value['order'] as number,
    section: value['section'].trim(),
    title: value['title'].trim(),
    ...(value['sidebarLabel'] === undefined
      ? {}
      : { sidebarLabel: value['sidebarLabel'].trim() }),
    ...(value['slug'] === undefined ? {} : { slug: value['slug'].trim() }),
  };
}

function defaultDocumentPath(routeFile: string) {
  const withoutExtension = routeFile
    .replace(/\.mdx$/i, '')
    .replace(/\.docs$/i, '')
    .replaceAll('\\', '/');
  const withoutIndex = withoutExtension.replace(/(?:^|\/)index$/i, '');
  return normalizeDocumentPathname(`/${withoutIndex}`);
}

function normalizeSlug(slug: string, sourceFile: string) {
  if (/[?#]/.test(slug)) {
    throw new Error(`${sourceFile} frontmatter slug must not contain a query or hash`);
  }
  return normalizeDocumentPathname(slug.startsWith('/') ? slug : `/${slug}`);
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
    logo: {
      ...config.site.logo,
      alt: config.site.logo.alt ?? config.site.title,
    },
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
  const pages = filesUnder(resolvedContent)
    .filter((path) => path.endsWith('.mdx'))
    .map((absoluteFile): DocsPage => {
      const routeFile = relative(resolvedContent, absoluteFile).replaceAll('\\', '/');
      const sourceFile = relative(resolvedRoot, absoluteFile).replaceAll('\\', '/');
      const frontmatter = parseFrontmatter(
        readFileSync(absoluteFile, 'utf8'),
        sourceFile,
      );
      const section = sectionById.get(frontmatter.section);
      if (section === undefined) {
        throw new Error(
          `${sourceFile} references unknown docs section "${frontmatter.section}"`,
        );
      }
      const path = frontmatter.slug
        ? normalizeSlug(frontmatter.slug, sourceFile)
        : defaultDocumentPath(routeFile);
      const canonicalPath = pathWithBase(site.basePath, path);
      const canonicalUrl = `${site.url}${canonicalPath}`;
      const imagePath = socialImagePath(path);
      const imageCanonicalPath = assetPathWithBase(site.basePath, imagePath);
      const id = path === '/' ? 'home' : path.slice(1).replaceAll('/', '-');
      const moduleStem = routeFile.replace(/^.*\//, '').replace(/\.mdx$/i, '');

      return {
        breadcrumbs: [],
        canonicalPath,
        canonicalUrl,
        description: frontmatter.description,
        documentTitle:
          path === '/' ? site.title : `${frontmatter.title} · ${site.title}`,
        id,
        imagePath,
        imageUrl: `${site.url}${imageCanonicalPath}`,
        moduleStem,
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
      return firstSection.order - secondSection.order || first.order - second.order;
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
    const orders = sectionPageOrders.get(page.section) ?? new Map<number, string>();
    const duplicateOrder = orders.get(page.order);
    if (duplicateOrder !== undefined) {
      throw new Error(
        `${page.sourceFile} and ${duplicateOrder} use duplicate order ${page.order} in section ${page.section}`,
      );
    }
    paths.set(page.path, page.sourceFile);
    ids.set(page.id, page.sourceFile);
    orders.set(page.order, page.sourceFile);
    sectionPageOrders.set(page.section, orders);
  }

  const homeUrl = `${site.url}${pathWithBase(site.basePath, '/')}`;
  const pagesWithBreadcrumbs = pages.map((page): DocsPage => {
    if (page.path === '/') return page;
    const sectionLanding = pages.find(
      (candidate) =>
        candidate.section === page.section &&
        candidate.path === normalizeDocumentPathname(`/${page.section}`),
    );
    return {
      ...page,
      breadcrumbs: [
        { name: site.title, url: homeUrl },
        ...(sectionLanding === undefined || sectionLanding.path === page.path
          ? []
          : [{ name: page.sectionLabel, url: sectionLanding.canonicalUrl }]),
        { name: page.title, url: page.canonicalUrl },
      ],
    };
  });

  if (!pagesWithBreadcrumbs.some((page) => page.path === '/')) {
    throw new Error('Docs content must define one homepage with slug "/"');
  }

  return {
    pages: pagesWithBreadcrumbs,
    sections,
    site,
    theme: config.theme,
  };
}
