export type DocsTheme = 'dark' | 'light';

export type DocsLocale = {
  language: string;
  openGraph: string;
};

export type DocsUiMessages = {
  backToMainMenu: string;
  closeNavigation: string;
  closeSearch: string;
  emptySearch: string;
  language: string;
  loading: string;
  headerNavigation: string;
  navigation: string;
  navigationSidebar: string;
  next: string;
  nextDocument: string;
  onThisPage: string;
  openNavigation: string;
  previous: string;
  previousDocument: string;
  search: string;
  searchFallback: string;
  searchIdle: string;
  searchLoading: string;
  searchResults: string;
  siteNavigation: string;
  useDarkColorScheme: string;
  useLightColorScheme: string;
};

export type DocsI18nLocaleConfig = DocsLocale & {
  label: string;
  messages?: Partial<DocsUiMessages>;
};

export type DocsI18nConfig = {
  defaultLocale: string;
  locales: Readonly<Record<string, DocsI18nLocaleConfig>>;
};

export type DocsLocalizedLabel = string | Readonly<Record<string, string>>;

export type DocsNavigationPageConfig = {
  contentKey?: string;
  label?: DocsLocalizedLabel;
  path?: string;
  type: 'page';
};

export type DocsNavigationLinkConfig = {
  external?: boolean;
  label: DocsLocalizedLabel;
  path: string;
  type: 'link';
};

export type DocsNavigationGroupConfig = {
  children: readonly DocsNavigationConfigItem[];
  label: DocsLocalizedLabel;
  type: 'group';
};

export type DocsNavigationConfigItem =
  | DocsNavigationGroupConfig
  | DocsNavigationLinkConfig
  | DocsNavigationPageConfig;

export type DocsHeaderLinkConfig = {
  label: DocsLocalizedLabel;
  path: string;
};

export type DocsHeaderConfig = {
  links?: readonly DocsHeaderLinkConfig[];
  version?: string;
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

export type DocsSectionGroupConfig = {
  id: string;
  label: DocsLocalizedLabel;
  order?: number;
};

export type DocsSectionConfig = {
  groups?: readonly DocsSectionGroupConfig[];
  id: string;
  label: DocsLocalizedLabel;
  order: number;
};

export type DocsConfig = {
  contentDir: string;
  header?: DocsHeaderConfig;
  i18n?: DocsI18nConfig;
  navigation?: readonly DocsNavigationConfigItem[];
  redirects?: Readonly<Record<string, string>>;
  sections: readonly DocsSectionConfig[];
  site: DocsSiteConfig;
  theme: {
    default: DocsTheme;
  };
};

export type DocsFrontmatter = {
  contentKey?: string;
  description: string;
  group?: string;
  headings?: readonly DocsHeading[];
  layout?: DocsPageLayout;
  navigation?: boolean;
  order?: number;
  section: string;
  sidebarLabel?: string;
  slug?: string;
  title: string;
};

export type DocsPageLayout = 'docs' | 'splash' | 'standalone';

export type DocsHeading = {
  depth: 2 | 3;
  id: string;
  label: string;
};

export type DocsAlternate = {
  language: string;
  locale: string;
  path: string;
  url: string;
};

export type DocsBreadcrumb = {
  name: string;
  url: string;
};

export type DocsPage = {
  alternates: readonly DocsAlternate[];
  breadcrumbs: readonly DocsBreadcrumb[];
  canonicalPath: string;
  canonicalUrl: string;
  contentKey: string;
  description: string;
  documentTitle: string;
  group?: string;
  headings: readonly DocsHeading[];
  id: string;
  imagePath: string;
  imageUrl: string;
  layout: DocsPageLayout;
  locale: string;
  moduleStem: string;
  navigation: boolean;
  order?: number;
  path: string;
  routeFile: string;
  section: string;
  sectionLabel: string;
  sidebarLabel: string;
  sourceFile: string;
  title: string;
};

export type DocsResolvedNavigationPage = {
  contentKey: string;
  label: string;
  path: string;
  type: 'page';
};

export type DocsResolvedNavigationLink = {
  external?: boolean;
  label: string;
  path: string;
  type: 'link';
};

export type DocsResolvedNavigationGroup = {
  children: readonly DocsResolvedNavigationItem[];
  label: string;
  type: 'group';
};

export type DocsResolvedNavigationItem =
  | DocsResolvedNavigationGroup
  | DocsResolvedNavigationLink
  | DocsResolvedNavigationPage;

export type DocsResolvedLocale = DocsI18nLocaleConfig & {
  id: string;
  messages: DocsUiMessages;
};

export type DocsSection = DocsSectionConfig;

export type ResolvedDocsSiteConfig = Omit<DocsSiteConfig, 'basePath' | 'logo'> & {
  basePath: string;
  logo: Required<DocsLogo>;
};

export type DocsManifest = {
  defaultLocale: string;
  header?: DocsHeaderConfig;
  locales: Readonly<Record<string, DocsResolvedLocale>>;
  navigation: Readonly<Record<string, readonly DocsResolvedNavigationItem[]>>;
  pages: readonly DocsPage[];
  redirects: Readonly<Record<string, string>>;
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
