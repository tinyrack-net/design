import { TRBadge } from '@tinyrack/ui/components/badge';
import { TRCode } from '@tinyrack/ui/components/code';
import {
  type TRColorScheme,
  TRColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import {
  TRDocsNavigation,
  type TRDocsNavigationItem,
} from '@tinyrack/ui/components/docs-navigation';
import { TRDocsSearch } from '@tinyrack/ui/components/docs-search';
import {
  TRDocsShell,
  type TRDocsShellLayout,
} from '@tinyrack/ui/components/docs-shell';
import { TRLanguageSelect } from '@tinyrack/ui/components/language-select';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRTableOfContents } from '@tinyrack/ui/components/table-of-contents';
import { type CSSProperties, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { layout: TRDocsShellLayout };
export function DocsShellPreview({
  layout,
  pending = false,
}: {
  layout: TRDocsShellLayout;
  pending?: boolean;
}) {
  return (
    <div className="h-96 w-full overflow-hidden">
      <TRDocsShell.Root
        {...(pending ? { pendingPath: '/next' } : {})}
        currentPath="/guide"
        layout={layout}
        locationKey="demo"
        style={{ '--tr-docs-shell-block-size': '100%' } as CSSProperties}
      >
        <TRDocsShell.Header>
          <TRDocsShell.Brand>Tinyrack</TRDocsShell.Brand>
        </TRDocsShell.Header>
        <TRDocsShell.Sidebar aria-label="Documentation">Navigation</TRDocsShell.Sidebar>
        <TRDocsShell.Main render={<div />}>
          <article className="p-6">
            <h2>Documentation</h2>
            <p>Router-neutral documentation shell.</p>
          </article>
        </TRDocsShell.Main>
      </TRDocsShell.Root>
    </div>
  );
}

const navigationItems: readonly TRDocsNavigationItem[] = [
  {
    children: [
      { label: 'Installation', path: '/install', type: 'page' },
      { label: 'Configuration', path: '/configure', type: 'page' },
    ],
    label: 'Getting started',
    type: 'group',
  },
  {
    children: [
      { label: 'TRButton', path: '/components/button', type: 'page' },
      { label: 'Docs Shell', path: '/components/docs-shell', type: 'page' },
    ],
    label: 'Components',
    type: 'group',
  },
];

const tableOfContentsItems = [
  { depth: 2 as const, id: 'contract', label: 'Contract' },
  { depth: 2 as const, id: 'composition', label: 'Composition' },
  { depth: 2 as const, id: 'api', label: 'API' },
];

export const docsShellCompositionSource = `import '@tinyrack/ui/components/button.css';
import { TRButton } from '@tinyrack/ui/components/button';
import '@tinyrack/ui/components/docs-shell.css';
import { TRDocsShell } from '@tinyrack/ui/components/docs-shell';
import '@tinyrack/ui/components/link.css';
import { TRLink } from '@tinyrack/ui/components/link';
import type { ReactNode } from 'react';

export function DocumentationShell({ children }: { children: ReactNode }) {
  return (
    <TRDocsShell.Root
      currentPath="/guide"
      hash=""
      layout="docs"
      locationKey="guide"
      navigationKind="PUSH"
    >
      <TRDocsShell.Header>
        <TRDocsShell.Brand>
          <TRLink href="/" underline="none">Acme Docs</TRLink>
        </TRDocsShell.Brand>
        <TRDocsShell.Actions>
          <TRButton type="button" variant="secondary">Search</TRButton>
        </TRDocsShell.Actions>
      </TRDocsShell.Header>
      <TRDocsShell.Sidebar aria-label="Documentation navigation">
        <nav aria-label="Guides">
          <TRLink aria-current="page" href="/guide">Guide</TRLink>
          <TRLink href="/api">API</TRLink>
        </nav>
      </TRDocsShell.Sidebar>
      <TRDocsShell.Main viewportLabel="Documentation page">
        <article>{children}</article>
        <TRDocsShell.Outline aria-label="On this page">
          <TRLink href="#overview">Overview</TRLink>
        </TRDocsShell.Outline>
      </TRDocsShell.Main>
    </TRDocsShell.Root>
  );
}`;

export const docsShellLayoutsSource = `import '@tinyrack/ui/components/docs-shell.css';
import { TRDocsShell } from '@tinyrack/ui/components/docs-shell';

export function LandingPage() {
  return (
    <TRDocsShell.Root currentPath="/" layout="splash" locationKey="home">
      <TRDocsShell.Header>
        <TRDocsShell.Brand>Acme</TRDocsShell.Brand>
      </TRDocsShell.Header>
      <TRDocsShell.Main><h1>Build faster</h1></TRDocsShell.Main>
    </TRDocsShell.Root>
  );
}

export function ApiReference() {
  return (
    <TRDocsShell.Root
      currentPath="/api"
      layout="standalone"
      locationKey="api"
    >
      <TRDocsShell.Main contentClassName="api-reference" viewportLabel="API reference">
        <h1>API reference</h1>
      </TRDocsShell.Main>
    </TRDocsShell.Root>
  );
}`;

export function DocsShellDocsPreview() {
  const [scheme, setScheme] = useState<TRColorScheme>('light');
  return (
    <div className="h-[34rem] w-full overflow-hidden">
      <TRDocsShell.Root
        currentPath="/components/docs-shell"
        layout="docs"
        locationKey="docs-shell-composition"
        style={{ '--tr-docs-shell-block-size': '100%' } as CSSProperties}
      >
        <TRDocsShell.Header>
          <TRDocsShell.Brand>
            <TRLink href="/" underline="none">
              <span className="text-lg font-semibold">Tinyrack</span>
            </TRLink>
            <TRBadge>v0.4</TRBadge>
          </TRDocsShell.Brand>
          <nav
            aria-label="Site navigation"
            className="hidden min-w-0 flex-1 items-center gap-6 lg:flex"
          >
            <TRLink href="/docs" underline="none">
              Docs
            </TRLink>
            <TRLink href="/components" underline="none">
              Components
            </TRLink>
            <TRLink href="/github" underline="none">
              GitHub
            </TRLink>
          </nav>
          <TRDocsShell.Actions>
            <TRLanguageSelect
              label="Language"
              onValueChange={() => undefined}
              options={[
                { label: 'English', value: 'en' },
                { label: '한국어', value: 'ko' },
              ]}
              uiSize="sm"
              value="en"
            />
            <TRDocsSearch.Trigger
              aria-label="Search documentation"
              compact
              label="Search"
              uiSize="sm"
            />
            <TRColorSchemeToggle onValueChange={setScheme} uiSize="sm" value={scheme} />
          </TRDocsShell.Actions>
        </TRDocsShell.Header>
        <TRDocsShell.Sidebar aria-label="Documentation navigation">
          <div className="flex min-h-full flex-col gap-6 p-4">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="font-semibold">Tinyrack</span>
              <TRBadge>v0.4</TRBadge>
            </div>
            <TRDocsNavigation
              currentPath="/components/docs-shell"
              defaultGroupsOpen
              items={navigationItems}
              label="Documentation"
            />
            <TRLanguageSelect
              label="Language"
              onValueChange={() => undefined}
              options={[
                { label: 'English', value: 'en' },
                { label: '한국어', value: 'ko' },
              ]}
              uiSize="sm"
              value="en"
            />
          </div>
        </TRDocsShell.Sidebar>
        <TRDocsShell.Main render={<div />}>
          <div className="tr-docs-content-layout">
            <div className="tr-docs-content-column">
              <article className="mx-auto max-w-4xl space-y-8 p-6 lg:p-10">
                <header className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TRBadge variant="info">Components</TRBadge>
                    <span className="text-sm text-[var(--tinyrack-text-muted)]">
                      Layout
                    </span>
                  </div>
                  <h2 id="contract" className="text-3xl font-semibold">
                    Docs Shell
                  </h2>
                  <p className="text-lg text-[var(--tinyrack-text-muted)]">
                    Responsive documentation chrome for navigation, search, and page
                    context.
                  </p>
                </header>
                <section className="space-y-3">
                  <h3 id="composition" className="text-xl font-semibold">
                    Composition
                  </h3>
                  <p>
                    Bring together navigation, actions, content, and an outline without
                    owning responsive shell state.
                  </p>
                  <div className="rounded-lg border border-[var(--tinyrack-border)] p-4">
                    <TRCode className="text-sm">
                      Root → Header + Sidebar + Main → Outline
                    </TRCode>
                  </div>
                </section>
                <section className="space-y-3">
                  <h3 id="api" className="text-xl font-semibold">
                    API
                  </h3>
                  <p>
                    Router state stays at the edge while the shell handles mobile
                    disclosure and scroll restoration.
                  </p>
                </section>
              </article>
            </div>
            <TRDocsShell.Outline>
              <TRTableOfContents
                currentHeading="composition"
                items={tableOfContentsItems}
              />
            </TRDocsShell.Outline>
          </div>
        </TRDocsShell.Main>
      </TRDocsShell.Root>
    </div>
  );
}
const meta = {
  args: { layout: 'docs' },
  argTypes: {
    layout: { control: 'radio', options: ['docs', 'splash', 'standalone'] },
  },
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered', playgroundLayout: 'fill' },
  render: DocsShellPreview,
  title: 'Components/DocsShell',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
