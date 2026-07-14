'use client';

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
import {
  canonicalDocumentPath,
  normalizeDocumentPathname,
  staticDocumentRoutes,
} from '../content/shared/static-document-routes.js';
import { DocumentPagination } from './document-pagination.js';
import {
  DocumentationSearchDialog,
  DocumentationSearchTrigger,
} from './documentation-search.js';

const foundationLinks = staticDocumentRoutes
  .filter((entry) => entry.section === 'foundations')
  .map((entry) => ({
    label: entry.navLabel,
    to: canonicalDocumentPath(entry.path),
  }));

const componentLinks = staticDocumentRoutes.filter(
  (entry) => entry.section === 'components',
);

const integrationLinks = staticDocumentRoutes
  .filter((entry) => entry.section === 'integrations')
  .map((entry) => ({
    label: entry.navLabel,
    to: canonicalDocumentPath(entry.path),
  }));

type Theme = 'tinyrack-dark' | 'tinyrack-light';

function BrandLockup({ className, theme }: { className: string; theme: Theme }) {
  return (
    <img
      alt="Tinyrack"
      className={className}
      height="38"
      src={
        theme === 'tinyrack-dark'
          ? '/brand/tinyrack-lockup-inverse.svg'
          : '/brand/tinyrack-lockup.svg'
      }
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
  const normalizedTarget = normalizeDocumentPathname(to);
  const isActive = currentPathname === normalizedTarget;
  const isPending = !isActive && pendingPathname === normalizedTarget;

  return (
    <UiLink
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center justify-between gap-2 border-l-2 px-3 py-1.5 text-tinyrack-sm no-underline transition-colors ${
        isActive
          ? 'border-tinyrack-primary bg-tinyrack-surface-hover text-tinyrack-text'
          : 'border-transparent text-tinyrack-text-muted hover:bg-tinyrack-surface-hover hover:text-tinyrack-text'
      }`}
      onClick={onNavigate}
      render={<RouterLink to={to} />}
      underline="none"
    >
      <span className="min-w-0">{label}</span>
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
    <nav aria-label="Documentation" className="grid gap-6">
      <DocumentationSearchTrigger onClick={onSearchOpen} />
      <section className="grid gap-1">
        <h2 className="m-0 px-3 text-tinyrack-xs font-semibold uppercase tracking-tinyrack-wide text-tinyrack-text-muted">
          Start
        </h2>
        <NavigationLink
          currentPathname={currentPathname}
          label="Tinyrack UI"
          onNavigate={onNavigate}
          pendingPathname={pendingPathname}
          to="/"
        />
      </section>
      <section className="grid gap-1">
        <h2 className="m-0 px-3 text-tinyrack-xs font-semibold uppercase tracking-tinyrack-wide text-tinyrack-text-muted">
          Foundations
        </h2>
        {foundationLinks.map((link) => (
          <NavigationLink
            currentPathname={currentPathname}
            key={link.to}
            onNavigate={onNavigate}
            pendingPathname={pendingPathname}
            {...link}
          />
        ))}
      </section>
      <section className="grid gap-1">
        <h2 className="m-0 px-3 text-tinyrack-xs font-semibold uppercase tracking-tinyrack-wide text-tinyrack-text-muted">
          Components
        </h2>
        {componentLinks.map((entry) => (
          <NavigationLink
            currentPathname={currentPathname}
            key={entry.path}
            label={entry.navLabel}
            onNavigate={onNavigate}
            pendingPathname={pendingPathname}
            to={canonicalDocumentPath(entry.path)}
          />
        ))}
      </section>
      <section className="grid gap-1">
        <h2 className="m-0 px-3 text-tinyrack-xs font-semibold uppercase tracking-tinyrack-wide text-tinyrack-text-muted">
          Integrations
        </h2>
        {integrationLinks.map((link) => (
          <NavigationLink
            currentPathname={currentPathname}
            key={link.to}
            onNavigate={onNavigate}
            pendingPathname={pendingPathname}
            {...link}
          />
        ))}
      </section>
    </nav>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigation = useNavigation();
  const navigationType = useNavigationType();
  const mainScrollPositions = useRef(new Map<string, number>());
  const mainScrollViewportRef = useRef<HTMLDivElement>(null);
  const searchReturnFocusRef = useRef<HTMLElement | null>(null);
  const [currentPathname, setCurrentPathname] = useState(() =>
    normalizeDocumentPathname(location.pathname),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('tinyrack-dark');
  const pendingPathname = navigation.location
    ? normalizeDocumentPathname(navigation.location.pathname)
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
      setCurrentPathname(normalizeDocumentPathname(window.location.pathname));
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
      className="h-dvh min-h-0 overflow-hidden bg-tinyrack-surface text-tinyrack-text"
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
      <AppShell.Header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-tinyrack-border bg-tinyrack-surface px-4 lg:hidden">
        <UiLink
          className="text-inherit"
          data-site-brand=""
          render={<NavLink to="/" />}
          underline="none"
        >
          <BrandLockup className="h-6 w-auto" theme={theme} />
        </UiLink>
        <div className="flex items-center gap-2">
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
      <AppShell.Sidebar
        aria-label="Documentation sidebar"
        className="bg-tinyrack-surface"
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <BrandLockup className="h-6 w-auto" theme={theme} />
            <AppShell.Close appearance="ghost" aria-label="Close navigation" size="lg">
              <XIcon aria-hidden="true" />
            </AppShell.Close>
          </div>
          <div className="mb-6 hidden items-center justify-between gap-3 lg:flex">
            <UiLink
              className="text-inherit"
              data-site-brand=""
              render={<NavLink to="/" />}
              underline="none"
            >
              <BrandLockup className="h-6 w-auto" theme={theme} />
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
      <AppShell.Main className="min-h-0 overflow-hidden">
        <ScrollArea.Root className="tr-site-main-scroll-area h-full" variant="plain">
          <ScrollArea.Viewport
            aria-label="Page content"
            className={`tr-site-main-scroll-viewport overscroll-contain ${
              menuOpen ? '!overflow-hidden' : ''
            }`}
            ref={mainScrollViewportRef}
            role="region"
          >
            <ScrollArea.Content className="min-h-full" style={{ minWidth: '100%' }}>
              <div
                aria-busy={isNavigating || undefined}
                className="tr-site-content mx-auto w-full max-w-5xl min-w-0 p-4 sm:p-8 lg:p-10"
              >
                {children}
                <DocumentPagination pathname={location.pathname} />
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
