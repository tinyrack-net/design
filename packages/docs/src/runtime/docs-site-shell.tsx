'use client';

import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { AppShell } from '@tinyrack/ui/components/app-shell';
import { IconButton } from '@tinyrack/ui/components/icon-button';
import { Link as UiLink } from '@tinyrack/ui/components/link';
import { Progress } from '@tinyrack/ui/components/progress';
import { ScrollArea } from '@tinyrack/ui/components/scroll-area';
import { Spinner } from '@tinyrack/ui/components/spinner';
import { MenuIcon, MoonIcon, SearchIcon, SunIcon, XIcon } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  NavLink,
  Link as RouterLink,
  useLocation,
  useNavigation,
  useNavigationType,
} from 'react-router';
import { canonicalDocumentPath } from '../config/docs-config.ts';
import { docsAssetPath, documentPathFromLocation } from './document-seo.ts';
import {
  DocumentationSearchDialog,
  DocumentationSearchTrigger,
} from './documentation-search.tsx';

type Theme = 'tinyrack-dark' | 'tinyrack-light';

function BrandLockup({ theme }: { theme: Theme }) {
  const logo =
    theme === 'tinyrack-dark'
      ? docsManifest.site.logo.dark
      : docsManifest.site.logo.light;
  return (
    <img
      alt={docsManifest.site.logo.alt}
      className="tr-docs-brand-lockup"
      height="38"
      src={docsAssetPath(logo, docsManifest)}
      width="156"
    />
  );
}

function targetIdFromHash(hash: string) {
  const id = hash.slice(1);
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

function NavigationLink({
  currentPathname,
  label,
  onNavigate,
  pendingPathname,
  to,
}: {
  currentPathname: string;
  label: string;
  onNavigate: () => void;
  pendingPathname: string | undefined;
  to: string;
}) {
  const normalizedTarget = documentPathFromLocation(to, docsManifest);
  const isActive = currentPathname === normalizedTarget;
  const isPending = !isActive && pendingPathname === normalizedTarget;
  return (
    <UiLink
      aria-current={isActive ? 'page' : undefined}
      className="tr-docs-navigation-link"
      data-active={isActive || undefined}
      onClick={onNavigate}
      render={<RouterLink to={to} />}
      underline="none"
    >
      <span>{label}</span>
      {isPending ? <Spinner decorative size="sm" variant="primary" /> : null}
    </UiLink>
  );
}

function SiteNavigation({
  currentPathname,
  onNavigate,
  onSearchOpen,
  pendingPathname,
}: {
  currentPathname: string;
  onNavigate: () => void;
  onSearchOpen: (trigger: HTMLButtonElement) => void;
  pendingPathname: string | undefined;
}) {
  return (
    <nav aria-label="Documentation" className="tr-docs-navigation">
      <DocumentationSearchTrigger onClick={onSearchOpen} />
      {docsManifest.sections.map((section) => {
        const pages = docsManifest.pages.filter((page) => page.section === section.id);
        if (pages.length === 0) return null;
        return (
          <section className="tr-docs-navigation-section" key={section.id}>
            <h2>{section.label}</h2>
            {pages.map((page) => (
              <NavigationLink
                currentPathname={currentPathname}
                key={page.id}
                label={page.sidebarLabel}
                onNavigate={onNavigate}
                pendingPathname={pendingPathname}
                to={canonicalDocumentPath(page.path)}
              />
            ))}
          </section>
        );
      })}
    </nav>
  );
}

export function DocsSiteShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigation = useNavigation();
  const navigationType = useNavigationType();
  const mainScrollPositions = useRef(new Map<string, number>());
  const mainScrollViewportRef = useRef<HTMLDivElement>(null);
  const searchReturnFocusRef = useRef<HTMLElement | null>(null);
  const [currentPathname, setCurrentPathname] = useState(() =>
    documentPathFromLocation(location.pathname, docsManifest),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(
    docsManifest.theme.default === 'light' ? 'tinyrack-light' : 'tinyrack-dark',
  );
  const pendingPathname = navigation.location
    ? documentPathFromLocation(navigation.location.pathname, docsManifest)
    : undefined;
  const isNavigating =
    pendingPathname !== undefined && pendingPathname !== currentPathname;

  useEffect(() => {
    setTheme(
      document.documentElement.dataset['theme'] === 'tinyrack-light'
        ? 'tinyrack-light'
        : 'tinyrack-dark',
    );
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: React Router navigation changes must resync the browser pathname after pushState.
  useEffect(() => {
    const syncPathname = () =>
      setCurrentPathname(
        documentPathFromLocation(window.location.pathname, docsManifest),
      );
    syncPathname();
    window.addEventListener('popstate', syncPathname);
    return () => window.removeEventListener('popstate', syncPathname);
  }, [location.pathname]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Every route transition closes the mobile navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const viewport = mainScrollViewportRef.current;
    if (viewport === null) return;
    const locationKey = location.key;
    if (location.hash.length > 1) {
      document
        .getElementById(targetIdFromHash(location.hash))
        ?.scrollIntoView({ block: 'start' });
    } else {
      viewport.scrollTop =
        navigationType === 'POP'
          ? (mainScrollPositions.current.get(locationKey) ?? 0)
          : 0;
    }
    return () => {
      mainScrollPositions.current.set(locationKey, viewport.scrollTop);
    };
  }, [location.hash, location.key, navigationType]);

  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash.length <= 1) return;
      requestAnimationFrame(() => {
        document
          .getElementById(targetIdFromHash(window.location.hash))
          ?.scrollIntoView({ block: 'start' });
      });
    };
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  function applyTheme(nextTheme: Theme) {
    document.documentElement.dataset['theme'] = nextTheme;
    document.documentElement.style.colorScheme =
      nextTheme === 'tinyrack-dark' ? 'dark' : 'light';
    localStorage.setItem('tinyrack-theme', nextTheme);
    setTheme(nextTheme);
  }

  function openSearch(trigger: HTMLElement) {
    searchReturnFocusRef.current = trigger;
    setMenuOpen(false);
    setSearchOpen(true);
  }

  return (
    <AppShell.Root
      breakpoint="lg"
      className="tr-docs-shell"
      layout="sidebar-first"
      onOpenChange={(open) => setMenuOpen(open)}
      open={menuOpen}
    >
      {isNavigating ? (
        <Progress.Root className="tr-site-navigation-progress" size="sm" value={null}>
          <Progress.Label className="sr-only">Loading page</Progress.Label>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      ) : null}
      <AppShell.Header className="tr-docs-mobile-header">
        <UiLink
          className="tr-docs-brand-link"
          data-site-brand=""
          render={<NavLink to="/" />}
          underline="none"
        >
          <BrandLockup theme={theme} />
        </UiLink>
        <div className="tr-docs-header-actions">
          <IconButton
            appearance="ghost"
            aria-keyshortcuts="Control+K Meta+K"
            aria-label="Search documentation"
            onClick={(event) => openSearch(event.currentTarget)}
            size="lg"
          >
            <SearchIcon aria-hidden="true" />
          </IconButton>
          <IconButton
            appearance="ghost"
            aria-label={`Use ${theme === 'tinyrack-dark' ? 'light' : 'dark'} theme`}
            onClick={() =>
              applyTheme(theme === 'tinyrack-dark' ? 'tinyrack-light' : 'tinyrack-dark')
            }
            size="lg"
          >
            {theme === 'tinyrack-dark' ? (
              <SunIcon aria-hidden="true" />
            ) : (
              <MoonIcon aria-hidden="true" />
            )}
          </IconButton>
          <AppShell.Trigger appearance="ghost" aria-label="Open navigation" size="lg">
            <MenuIcon aria-hidden="true" />
          </AppShell.Trigger>
        </div>
      </AppShell.Header>
      <AppShell.Sidebar aria-label="Documentation sidebar" className="tr-docs-sidebar">
        <div className="tr-docs-sidebar-inner">
          <div className="tr-docs-mobile-sidebar-heading">
            <BrandLockup theme={theme} />
            <AppShell.Close appearance="ghost" aria-label="Close navigation" size="lg">
              <XIcon aria-hidden="true" />
            </AppShell.Close>
          </div>
          <div className="tr-docs-desktop-sidebar-heading">
            <UiLink
              className="tr-docs-brand-link"
              data-site-brand=""
              render={<NavLink to="/" />}
              underline="none"
            >
              <BrandLockup theme={theme} />
            </UiLink>
            <IconButton
              appearance="ghost"
              aria-label={`Use ${theme === 'tinyrack-dark' ? 'light' : 'dark'} theme`}
              onClick={() =>
                applyTheme(
                  theme === 'tinyrack-dark' ? 'tinyrack-light' : 'tinyrack-dark',
                )
              }
            >
              {theme === 'tinyrack-dark' ? (
                <SunIcon aria-hidden="true" />
              ) : (
                <MoonIcon aria-hidden="true" />
              )}
            </IconButton>
          </div>
          <SiteNavigation
            currentPathname={currentPathname}
            onNavigate={() => setMenuOpen(false)}
            onSearchOpen={openSearch}
            pendingPathname={pendingPathname}
          />
        </div>
      </AppShell.Sidebar>
      <AppShell.Main className="tr-docs-main">
        <ScrollArea.Root className="tr-site-main-scroll-area" variant="plain">
          <ScrollArea.Viewport
            aria-label="Page content"
            className="tr-site-main-scroll-viewport"
            data-menu-open={menuOpen || undefined}
            ref={mainScrollViewportRef}
            role="region"
            style={menuOpen ? { overflow: 'hidden' } : undefined}
          >
            <ScrollArea.Content
              className="tr-docs-scroll-content"
              style={{ minWidth: '100%' }}
            >
              <div aria-busy={isNavigating || undefined} className="tr-site-content">
                {children}
              </div>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </AppShell.Main>
      <DocumentationSearchDialog
        onOpenChange={setSearchOpen}
        open={searchOpen}
        returnFocusRef={searchReturnFocusRef}
      />
    </AppShell.Root>
  );
}
