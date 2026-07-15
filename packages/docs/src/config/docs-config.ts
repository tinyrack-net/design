export type DocsTheme = 'dark' | 'light';

export type DocsLocale = {
  language: string;
  openGraph: string;
};

export type DocsLogo = {
  alt?: string;
  dark: string;
  light: string;
};

export type DocsSiteConfig = {
  basePath?: string;
  description: string;
  favicon: string;
  locale: DocsLocale;
  logo: DocsLogo;
  title: string;
  url: string;
};

export type DocsSectionConfig = {
  id: string;
  label: string;
  order: number;
};

export type DocsConfig = {
  contentDir: string;
  sections: readonly DocsSectionConfig[];
  site: DocsSiteConfig;
  theme: {
    default: DocsTheme;
  };
};

export type DocsFrontmatter = {
  description: string;
  order: number;
  section: string;
  sidebarLabel?: string;
  slug?: string;
  title: string;
};

export type DocsBreadcrumb = {
  name: string;
  url: string;
};

export type DocsPage = {
  breadcrumbs: readonly DocsBreadcrumb[];
  canonicalPath: string;
  canonicalUrl: string;
  description: string;
  documentTitle: string;
  id: string;
  imagePath: string;
  imageUrl: string;
  moduleStem: string;
  order: number;
  path: string;
  routeFile: string;
  section: string;
  sectionLabel: string;
  sidebarLabel: string;
  sourceFile: string;
  title: string;
};

export type DocsSection = DocsSectionConfig;

export type ResolvedDocsSiteConfig = Omit<DocsSiteConfig, 'basePath' | 'logo'> & {
  basePath: string;
  logo: Required<DocsLogo>;
};

export type DocsManifest = {
  pages: readonly DocsPage[];
  sections: readonly DocsSection[];
  site: ResolvedDocsSiteConfig;
  theme: DocsConfig['theme'];
};

export function defineDocsConfig(config: DocsConfig) {
  return config;
}

export function normalizeDocumentPathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized.length === 0 ? '/' : normalized;
}

export function canonicalDocumentPath(pathname: string) {
  const normalized = normalizeDocumentPathname(pathname);
  return normalized === '/' ? '/' : `${normalized}/`;
}

export function normalizeBasePath(basePath = '/') {
  const normalized = normalizeDocumentPathname(
    basePath.startsWith('/') ? basePath : `/${basePath}`,
  );
  return normalized === '/' ? '/' : normalized;
}
