'use client';

import { AppShell } from '@tinyrack/ui/components/app-shell';
import { IconButton } from '@tinyrack/ui/components/icon-button';
import { Input } from '@tinyrack/ui/components/input';
import { Link as UiLink } from '@tinyrack/ui/components/link';
import { Progress } from '@tinyrack/ui/components/progress';
import { Spinner } from '@tinyrack/ui/components/spinner';
import { MenuIcon, MoonIcon, SearchIcon, SunIcon, XIcon } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { NavLink, Link as RouterLink, useLocation, useNavigation } from 'react-router';
import { componentDocsManifest } from '../content/shared/component-docs-manifest.js';

const foundationLinks = [
  { label: 'Overview', to: '/foundations' },
  { label: 'Colors', to: '/foundations/colors' },
  { label: 'Typography', to: '/foundations/typography' },
  { label: 'Spacing', to: '/foundations/spacing' },
  { label: 'Radius', to: '/foundations/radius' },
  { label: 'Controls', to: '/foundations/controls' },
  { label: 'Motion', to: '/foundations/motion' },
  { label: 'Elevation', to: '/foundations/elevation' },
] as const;

const integrationLinks = [
  { label: 'Base UI providers', to: '/integrations/base-ui-providers' },
  { label: 'MDX renderer', to: '/integrations/mdx-renderer' },
] as const;

type Theme = 'tinyrack-dark' | 'tinyrack-light';

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized.length === 0 ? '/' : normalized;
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
  const isActive = currentPathname === to;
  const isPending = !isActive && pendingPathname === to;

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
  pendingPathname,
}: {
  currentPathname: string;
  onNavigate: () => void;
  pendingPathname: string | undefined;
}) {
  const [query, setQuery] = useState('');
  const componentLinks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return componentDocsManifest.filter(
      (entry) =>
        normalizedQuery.length === 0 ||
        entry.id.includes(normalizedQuery) ||
        entry.title.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <nav aria-label="Documentation" className="grid gap-6">
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-tinyrack-text-muted"
        />
        <Input
          aria-label="Filter components"
          className="tr-site-search-input w-full"
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Filter components"
          type="search"
          value={query}
        />
      </div>
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
        {componentLinks.length > 0 ? (
          componentLinks.map((entry) => (
            <NavigationLink
              currentPathname={currentPathname}
              key={entry.id}
              label={entry.title}
              onNavigate={onNavigate}
              pendingPathname={pendingPathname}
              to={`/components/${entry.id}`}
            />
          ))
        ) : (
          <p className="m-0 px-3 py-2 text-tinyrack-sm text-tinyrack-text-muted">
            No components found.
          </p>
        )}
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
  const [currentPathname, setCurrentPathname] = useState(() =>
    normalizePathname(location.pathname),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('tinyrack-dark');
  const pendingPathname = navigation.location
    ? normalizePathname(navigation.location.pathname)
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
      setCurrentPathname(normalizePathname(window.location.pathname));
    syncPathname();
    window.addEventListener('popstate', syncPathname);
    return () => window.removeEventListener('popstate', syncPathname);
  }, [location.pathname]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Every route transition closes the mobile navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function applyTheme(nextTheme: Theme) {
    document.documentElement.dataset['theme'] = nextTheme;
    document.documentElement.style.colorScheme =
      nextTheme === 'tinyrack-dark' ? 'dark' : 'light';
    localStorage.setItem('tinyrack-theme', nextTheme);
    setTheme(nextTheme);
  }

  return (
    <AppShell.Root
      breakpoint="lg"
      className="min-h-screen bg-tinyrack-surface text-tinyrack-text"
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
          className="font-semibold text-inherit"
          render={<NavLink to="/" />}
          underline="none"
        >
          Tinyrack UI
        </UiLink>
        <div className="flex items-center gap-2">
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
        className="bg-tinyrack-surface p-4"
      >
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <strong>Tinyrack UI</strong>
          <AppShell.Close appearance="ghost" aria-label="Close navigation" size="lg">
            <XIcon aria-hidden="true" />
          </AppShell.Close>
        </div>
        <div className="mb-6 hidden items-center justify-between gap-3 lg:flex">
          <UiLink
            className="text-tinyrack-lg font-semibold text-inherit"
            render={<NavLink to="/" />}
            underline="none"
          >
            Tinyrack UI
          </UiLink>
          <IconButton
            appearance="ghost"
            aria-label={`Use ${theme === 'tinyrack-dark' ? 'light' : 'dark'} theme`}
            onClick={() =>
              applyTheme(theme === 'tinyrack-dark' ? 'tinyrack-light' : 'tinyrack-dark')
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
          pendingPathname={pendingPathname}
        />
      </AppShell.Sidebar>
      <AppShell.Main>
        <div
          aria-busy={isNavigating || undefined}
          className="tr-site-content mx-auto w-full max-w-5xl min-w-0 p-4 sm:p-8 lg:p-10"
        >
          {children}
        </div>
      </AppShell.Main>
    </AppShell.Root>
  );
}
