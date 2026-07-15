'use client';

import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { Badge } from '@tinyrack/ui/components/badge';
import {
  type ColorScheme,
  ColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import { DocsNavigation } from '@tinyrack/ui/components/docs-navigation';
import { DocsSearch, type DocsSearchResult } from '@tinyrack/ui/components/docs-search';
import { DocsShell } from '@tinyrack/ui/components/docs-shell';
import { LanguageSelect } from '@tinyrack/ui/components/language-select';
import { Link as UiLink } from '@tinyrack/ui/components/link';
import { TableOfContents } from '@tinyrack/ui/components/table-of-contents';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  NavLink,
  Link as RouterLink,
  useLocation,
  useNavigate,
  useNavigation,
  useNavigationType,
} from 'react-router';
import type { DocsLocalizedLabel } from '../config/docs-config.ts';
import { canonicalDocumentPath } from '../config/docs-config.ts';
import {
  docsAssetPath,
  documentPathFromLocation,
  findDocsPage,
} from './document-seo.ts';
import { searchDocumentation } from './documentation-search-index.ts';

function localizedLabel(label: DocsLocalizedLabel, locale: string) {
  return typeof label === 'string'
    ? label
    : (label[locale] ?? label[docsManifest.defaultLocale] ?? '');
}

function BrandLockup({ scheme }: { scheme: ColorScheme }) {
  const logo =
    scheme === 'dark' ? docsManifest.site.logo.dark : docsManifest.site.logo.light;
  return (
    <img
      alt={docsManifest.site.logo.alt}
      height="38"
      src={docsAssetPath(logo, docsManifest)}
      width="156"
    />
  );
}

function useActiveHeading(
  headings: readonly { id: string }[] | undefined,
  hash: string,
) {
  const [activeHeading, setActiveHeading] = useState<string | undefined>(
    hash.startsWith('#') ? hash.slice(1) : undefined,
  );

  useEffect(() => {
    const hashHeading = hash.startsWith('#') ? hash.slice(1) : undefined;
    setActiveHeading(hashHeading);
    if (headings === undefined || headings.length === 0) return;
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0 || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id !== undefined) setActiveHeading(visible.target.id);
      },
      { rootMargin: '0px 0px -70% 0px' },
    );
    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [hash, headings]);

  return activeHeading;
}

export function DocsSiteShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const navigationType = useNavigationType();
  const currentPath = documentPathFromLocation(location.pathname, docsManifest);
  const pendingPath = navigation.location
    ? documentPathFromLocation(navigation.location.pathname, docsManifest)
    : undefined;
  const page = findDocsPage(location.pathname, docsManifest);
  const locale = page?.locale ?? docsManifest.defaultLocale;
  const localeConfig =
    docsManifest.locales[locale] ?? docsManifest.locales[docsManifest.defaultLocale];
  if (localeConfig === undefined)
    throw new Error('Docs manifest has no default locale');
  const activeHeading = useActiveHeading(page?.headings, location.hash);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [fallbackSearch, setFallbackSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scheme, setScheme] = useState<ColorScheme>(docsManifest.theme.default);
  const homePath =
    docsManifest.pages.find(
      (candidate) => candidate.locale === locale && candidate.contentKey === '/',
    )?.path ?? '/';

  // biome-ignore lint/correctness/useExhaustiveDependencies: each completed route transition closes the controlled mobile menu.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setScheme(
      document.documentElement.dataset['theme'] === 'tinyrack-light' ? 'light' : 'dark',
    );
  }, []);

  const applyScheme = useCallback((nextScheme: ColorScheme) => {
    const theme = `tinyrack-${nextScheme}`;
    document.documentElement.dataset['theme'] = theme;
    document.documentElement.style.colorScheme = nextScheme;
    localStorage.setItem('tinyrack-theme', theme);
    setScheme(nextScheme);
  }, []);

  const search = useCallback(
    async (query: string, signal: AbortSignal) => {
      const response = await searchDocumentation(query, locale);
      if (signal.aborted || response === null) return [];
      setFallbackSearch(response.source === 'fallback');
      return response.results satisfies readonly DocsSearchResult[];
    },
    [locale],
  );

  const selectSearchResult = useCallback(
    (result: DocsSearchResult) => {
      void navigate(result.url);
    },
    [navigate],
  );

  const localeOptions = useMemo(
    () =>
      Object.values(docsManifest.locales).map((entry) => ({
        label: entry.label,
        language: entry.language,
        value: entry.id,
      })),
    [],
  );

  function changeLocale(nextLocale: string) {
    const target = page?.alternates.find(
      (alternate) => alternate.locale === nextLocale,
    );
    const fallback = docsManifest.pages.find(
      (candidate) => candidate.locale === nextLocale && candidate.contentKey === '/',
    );
    const path = target?.path ?? fallback?.path;
    if (path !== undefined) void navigate(canonicalDocumentPath(path));
  }

  function openSearch(trigger: HTMLElement) {
    returnFocusRef.current = trigger;
    setMenuOpen(false);
    setSearchOpen(true);
  }

  return (
    <DocsShell.Root
      closeNavigationLabel={localeConfig.messages.closeNavigation}
      currentPath={currentPath}
      hash={location.hash}
      layout={page?.layout ?? 'docs'}
      loadingLabel={localeConfig.messages.loading}
      locationKey={location.key}
      navigationKind={navigationType}
      onOpenChange={setMenuOpen}
      open={menuOpen}
      openNavigationLabel={localeConfig.messages.openNavigation}
      {...(pendingPath === undefined ? {} : { pendingPath })}
    >
      <DocsShell.Header>
        <DocsShell.Brand>
          <UiLink
            data-site-brand=""
            render={<NavLink to={canonicalDocumentPath(homePath)} />}
            underline="none"
          >
            <BrandLockup scheme={scheme} />
          </UiLink>
        </DocsShell.Brand>
        <DocsShell.Actions>
          <DocsSearch.Trigger
            aria-label={localeConfig.messages.search}
            compact
            label={localeConfig.messages.search}
            onClick={(event) => openSearch(event.currentTarget)}
            size="lg"
          />
          <ColorSchemeToggle onValueChange={applyScheme} size="lg" value={scheme} />
          {localeOptions.length > 1 ? (
            <LanguageSelect
              label={localeConfig.messages.language}
              onValueChange={changeLocale}
              options={localeOptions}
              value={locale}
            />
          ) : null}
        </DocsShell.Actions>
      </DocsShell.Header>
      <DocsShell.Sidebar aria-label={localeConfig.messages.navigationSidebar}>
        <div className="tr-docs-sidebar-inner">
          <DocsShell.Brand>
            <UiLink
              data-site-brand=""
              render={<NavLink to={canonicalDocumentPath(homePath)} />}
              underline="none"
            >
              <BrandLockup scheme={scheme} />
            </UiLink>
            {docsManifest.header?.version === undefined ? null : (
              <Badge>{docsManifest.header.version}</Badge>
            )}
          </DocsShell.Brand>
          <DocsSearch.Trigger
            aria-label={localeConfig.messages.search}
            label={localeConfig.messages.search}
            onClick={(event) => openSearch(event.currentTarget)}
          />
          <DocsShell.Actions>
            <ColorSchemeToggle onValueChange={applyScheme} value={scheme} />
            {localeOptions.length > 1 ? (
              <LanguageSelect
                label={localeConfig.messages.language}
                onValueChange={changeLocale}
                options={localeOptions}
                value={locale}
              />
            ) : null}
          </DocsShell.Actions>
          <DocsNavigation
            currentPath={currentPath}
            defaultGroupsOpen
            items={docsManifest.navigation[locale] ?? []}
            label={localeConfig.messages.navigation}
            onNavigate={() => setMenuOpen(false)}
            {...(pendingPath === undefined ? {} : { pendingPath })}
            renderLink={(item) => <RouterLink to={canonicalDocumentPath(item.path)} />}
          />
          {docsManifest.header?.links?.map((link) => (
            <UiLink href={link.path} key={link.path}>
              {localizedLabel(link.label, locale)}
            </UiLink>
          ))}
        </div>
      </DocsShell.Sidebar>
      <DocsShell.Main>
        <div className="tr-docs-content-layout">
          <div className="tr-docs-content-column">{children}</div>
          {page === undefined || page.layout !== 'docs' ? null : (
            <DocsShell.Outline>
              <TableOfContents
                {...(activeHeading === undefined
                  ? {}
                  : { currentHeading: activeHeading })}
                items={page.headings}
                label={localeConfig.messages.onThisPage}
                mobileLabel={localeConfig.messages.onThisPage}
                renderLink={(item) => <RouterLink to={`#${item.id}`} />}
              />
            </DocsShell.Outline>
          )}
        </div>
      </DocsShell.Main>
      <DocsSearch.Dialog
        fallback={fallbackSearch}
        messages={{
          close: localeConfig.messages.closeSearch,
          empty: localeConfig.messages.emptySearch,
          fallback: localeConfig.messages.searchFallback,
          idle: localeConfig.messages.searchIdle,
          loading: localeConfig.messages.searchLoading,
          placeholder: localeConfig.messages.search,
          results: localeConfig.messages.searchResults,
          title: localeConfig.messages.search,
          trigger: localeConfig.messages.search,
        }}
        onOpenChange={setSearchOpen}
        onSearch={search}
        onSelect={selectSearchResult}
        open={searchOpen}
        returnFocusRef={returnFocusRef}
      />
    </DocsShell.Root>
  );
}
