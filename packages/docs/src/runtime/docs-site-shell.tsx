'use client';

import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { TRBadge } from '@tinyrack/ui/components/badge';
import {
  type TRColorScheme,
  TRColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import { TRDocsNavigation } from '@tinyrack/ui/components/docs-navigation';
import {
  TRDocsSearch,
  type TRDocsSearchResult,
} from '@tinyrack/ui/components/docs-search';
import { TRDocsShell } from '@tinyrack/ui/components/docs-shell';
import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { TRLanguageSelect } from '@tinyrack/ui/components/language-select';
import { TRLink as UiLink } from '@tinyrack/ui/components/link';
import { TRTableOfContents } from '@tinyrack/ui/components/table-of-contents';
import { Search } from 'lucide-react';
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

function HeaderLinks({
  className,
  label,
  linkClassName,
  locale,
}: {
  className: string;
  label: string;
  linkClassName?: string;
  locale: string;
}) {
  const links = docsManifest.header?.links;
  if (links === undefined || links.length === 0) return null;
  return (
    <nav aria-label={label} className={className}>
      {links.map((link) => {
        const content = localizedLabel(link.label, locale);
        const path = link.path
          .replaceAll('{locale}', locale)
          .replaceAll(':locale', locale);
        return path.startsWith('/') ? (
          <UiLink
            className={linkClassName}
            key={link.path}
            render={<RouterLink to={canonicalDocumentPath(path)} />}
            underline="none"
          >
            {content}
          </UiLink>
        ) : (
          <UiLink
            className={linkClassName}
            href={path}
            key={link.path}
            underline="none"
          >
            {content}
          </UiLink>
        );
      })}
    </nav>
  );
}

function BrandLockup({ scheme }: { scheme: TRColorScheme }) {
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
    if (elements.length === 0) return;
    const viewport = document.querySelector<HTMLElement>(
      '.tr-docs-shell-scroll-viewport',
    );
    const scrollTarget: HTMLElement | Window = viewport ?? window;
    let hasUserScrolled = false;
    const headingOffset = Math.min(
      240,
      (viewport?.clientHeight ?? window.innerHeight) * 0.35,
    );
    const updateActiveHeading = () => {
      if (hashHeading !== undefined && !hasUserScrolled) return;
      const viewportTop = viewport?.getBoundingClientRect().top ?? 0;
      const current =
        elements
          .filter(
            (element) =>
              element.getBoundingClientRect().top <= viewportTop + headingOffset,
          )
          .at(-1) ?? elements[0];
      if (current !== undefined) setActiveHeading(current.id);
    };
    const handleScroll = () => {
      hasUserScrolled = true;
      updateActiveHeading();
    };
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    if (scrollTarget !== window) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(updateActiveHeading, {
            root: viewport,
            rootMargin: `-${headingOffset}px 0px -60% 0px`,
          })
        : undefined;
    for (const element of elements) observer?.observe(element);
    if (hashHeading === undefined) updateActiveHeading();
    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (scrollTarget !== window) {
        window.removeEventListener('scroll', handleScroll);
      }
      observer?.disconnect();
    };
  }, [hash, headings]);

  return activeHeading;
}

export function TRDocsSiteShell({ children }: { children: ReactNode }) {
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
  const [mobileMenuView, setMobileMenuView] = useState<'main' | 'site'>('main');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scheme, setScheme] = useState<TRColorScheme>(docsManifest.theme.default);
  const homePath =
    docsManifest.pages.find(
      (candidate) => candidate.locale === locale && candidate.contentKey === '/',
    )?.path ?? '/';
  const hasHeaderLinks = (docsManifest.header?.links?.length ?? 0) > 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: each completed route transition closes the controlled mobile menu.
  useEffect(() => {
    setMenuOpen(false);
    setMobileMenuView('main');
  }, [location.pathname]);

  useEffect(() => {
    setScheme(
      document.documentElement.dataset['theme'] === 'tinyrack-light' ? 'light' : 'dark',
    );
  }, []);

  const applyScheme = useCallback((nextScheme: TRColorScheme) => {
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
      return response.results satisfies readonly TRDocsSearchResult[];
    },
    [locale],
  );

  const selectSearchResult = useCallback(
    (result: TRDocsSearchResult) => {
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
    setMobileMenuView('main');
    setSearchOpen(true);
  }

  function handleMenuOpenChange(open: boolean) {
    setMenuOpen(open);
    if (!open) setMobileMenuView('main');
  }

  return (
    <TRDocsShell.Root
      closeNavigationLabel={localeConfig.messages.closeNavigation}
      currentPath={currentPath}
      hash={location.hash}
      layout={page?.layout ?? 'docs'}
      loadingLabel={localeConfig.messages.loading}
      locationKey={location.key}
      navigationKind={navigationType}
      onOpenChange={handleMenuOpenChange}
      open={menuOpen}
      openNavigationLabel={localeConfig.messages.openNavigation}
      {...(pendingPath === undefined ? {} : { pendingPath })}
    >
      <TRDocsShell.Header>
        <TRDocsShell.Brand>
          <UiLink
            data-site-brand=""
            render={<NavLink to={canonicalDocumentPath(homePath)} />}
            underline="none"
          >
            <BrandLockup scheme={scheme} />
          </UiLink>
          {docsManifest.header?.version === undefined ? null : (
            <TRBadge className="tr-docs-header-version">
              {docsManifest.header.version}
            </TRBadge>
          )}
        </TRDocsShell.Brand>
        <HeaderLinks
          className="tr-docs-header-navigation"
          label={localeConfig.messages.headerNavigation}
          locale={locale}
        />
        <TRDocsShell.Actions>
          {localeOptions.length > 1 ? (
            <TRLanguageSelect
              label={localeConfig.messages.language}
              onValueChange={changeLocale}
              options={localeOptions}
              uiSize="sm"
              value={locale}
            />
          ) : null}
          <TRIconButton
            aria-label={localeConfig.messages.search}
            appearance="ghost"
            onClick={(event) => openSearch(event.currentTarget)}
            uiSize="sm"
          >
            <Search aria-hidden="true" />
          </TRIconButton>
          <TRColorSchemeToggle
            darkLabel={localeConfig.messages.useDarkColorScheme}
            lightLabel={localeConfig.messages.useLightColorScheme}
            onValueChange={applyScheme}
            uiSize="sm"
            value={scheme}
          />
        </TRDocsShell.Actions>
      </TRDocsShell.Header>
      <TRDocsShell.Sidebar aria-label={localeConfig.messages.navigationSidebar}>
        <div className="tr-docs-sidebar-inner" data-mobile-menu-view={mobileMenuView}>
          <TRDocsShell.Brand>
            <UiLink
              data-site-brand=""
              render={<NavLink to={canonicalDocumentPath(homePath)} />}
              underline="none"
            >
              <BrandLockup scheme={scheme} />
            </UiLink>
            {docsManifest.header?.version === undefined ? null : (
              <TRBadge>{docsManifest.header.version}</TRBadge>
            )}
          </TRDocsShell.Brand>
          {mobileMenuView === 'site' ? (
            <button
              className="tr-docs-mobile-menu-back tr-docs-navigation-link"
              onClick={() => setMobileMenuView('main')}
              type="button"
            >
              {localeConfig.messages.backToMainMenu}
            </button>
          ) : (
            <>
              {hasHeaderLinks ? (
                <button
                  className="tr-docs-mobile-menu-trigger tr-docs-navigation-link"
                  onClick={() => setMobileMenuView('site')}
                  type="button"
                >
                  {localeConfig.messages.siteNavigation}
                </button>
              ) : null}
              <TRDocsNavigation
                currentPath={currentPath}
                defaultGroupsOpen
                items={docsManifest.navigation[locale] ?? []}
                label={localeConfig.messages.navigation}
                onNavigate={() => handleMenuOpenChange(false)}
                {...(pendingPath === undefined ? {} : { pendingPath })}
                renderLink={(item) => (
                  <RouterLink to={canonicalDocumentPath(item.path)} />
                )}
              />
            </>
          )}
          <HeaderLinks
            className="tr-docs-sidebar-header-navigation"
            label={localeConfig.messages.headerNavigation}
            linkClassName="tr-docs-navigation-link"
            locale={locale}
          />
          <TRDocsShell.Actions>
            {localeOptions.length > 1 ? (
              <TRLanguageSelect
                label={localeConfig.messages.language}
                onValueChange={changeLocale}
                options={localeOptions}
                uiSize="sm"
                value={locale}
              />
            ) : null}
          </TRDocsShell.Actions>
        </div>
      </TRDocsShell.Sidebar>
      <TRDocsShell.Main>
        <div className="tr-docs-content-layout">
          <div className="tr-docs-content-column">{children}</div>
          {page === undefined || page.layout !== 'docs' ? null : (
            <TRDocsShell.Outline>
              <TRTableOfContents
                {...(activeHeading === undefined
                  ? {}
                  : { currentHeading: activeHeading })}
                items={page.headings}
                label={localeConfig.messages.onThisPage}
                mobileLabel={localeConfig.messages.onThisPage}
                onNavigate={(item) => void navigate({ hash: `#${item.id}` })}
                renderLink={(item) => <RouterLink to={`#${item.id}`} />}
              />
            </TRDocsShell.Outline>
          )}
        </div>
      </TRDocsShell.Main>
      <TRDocsSearch.Dialog
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
    </TRDocsShell.Root>
  );
}
