import { Badge } from '@tinyrack/ui/components/badge';
import { Code } from '@tinyrack/ui/components/code';
import {
  type ColorScheme,
  ColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import {
  DocsNavigation,
  type DocsNavigationItem,
} from '@tinyrack/ui/components/docs-navigation';
import { DocsSearch } from '@tinyrack/ui/components/docs-search';
import { DocsShell, type DocsShellLayout } from '@tinyrack/ui/components/docs-shell';
import { LanguageSelect } from '@tinyrack/ui/components/language-select';
import { Link } from '@tinyrack/ui/components/link';
import { TableOfContents } from '@tinyrack/ui/components/table-of-contents';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { layout: DocsShellLayout };
export function DocsShellPreview({ layout }: Args) {
  return (
    <div className="h-96 w-full overflow-hidden">
      <DocsShell.Root currentPath="/guide" layout={layout} locationKey="demo">
        <DocsShell.Header>
          <DocsShell.Brand>Tinyrack</DocsShell.Brand>
        </DocsShell.Header>
        <DocsShell.Sidebar aria-label="Documentation">Navigation</DocsShell.Sidebar>
        <DocsShell.Main render={<div />}>
          <article className="p-6">
            <h2>Documentation</h2>
            <p>Router-neutral documentation shell.</p>
          </article>
        </DocsShell.Main>
      </DocsShell.Root>
    </div>
  );
}

const navigationItems: readonly DocsNavigationItem[] = [
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
      { label: 'Button', path: '/components/button', type: 'page' },
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

export function DocsShellDocsPreview() {
  const [scheme, setScheme] = useState<ColorScheme>('light');
  return (
    <div className="h-[34rem] w-full overflow-hidden">
      <DocsShell.Root
        currentPath="/components/docs-shell"
        layout="docs"
        locationKey="docs-shell-composition"
      >
        <DocsShell.Header>
          <DocsShell.Brand>
            <Link href="/" underline="none">
              <span className="text-lg font-semibold">Tinyrack</span>
            </Link>
            <Badge>v0.4</Badge>
          </DocsShell.Brand>
          <nav
            aria-label="Site navigation"
            className="hidden min-w-0 flex-1 items-center gap-6 lg:flex"
          >
            <Link href="/docs" underline="none">
              Docs
            </Link>
            <Link href="/components" underline="none">
              Components
            </Link>
            <Link href="/github" underline="none">
              GitHub
            </Link>
          </nav>
          <DocsShell.Actions>
            <LanguageSelect
              label="Language"
              onValueChange={() => undefined}
              options={[
                { label: 'English', value: 'en' },
                { label: '한국어', value: 'ko' },
              ]}
              uiSize="sm"
              value="en"
            />
            <DocsSearch.Trigger
              aria-label="Search documentation"
              compact
              label="Search"
              uiSize="sm"
            />
            <ColorSchemeToggle onValueChange={setScheme} uiSize="sm" value={scheme} />
          </DocsShell.Actions>
        </DocsShell.Header>
        <DocsShell.Sidebar aria-label="Documentation navigation">
          <div className="flex min-h-full flex-col gap-6 p-4">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="font-semibold">Tinyrack</span>
              <Badge>v0.4</Badge>
            </div>
            <DocsNavigation
              currentPath="/components/docs-shell"
              defaultGroupsOpen
              items={navigationItems}
              label="Documentation"
            />
            <LanguageSelect
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
        </DocsShell.Sidebar>
        <DocsShell.Main render={<div />}>
          <div className="tr-docs-content-layout">
            <div className="tr-docs-content-column">
              <article className="mx-auto max-w-4xl space-y-8 p-6 lg:p-10">
                <header className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">Components</Badge>
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
                    <Code className="text-sm">
                      Root → Header + Sidebar + Main → Outline
                    </Code>
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
            <DocsShell.Outline>
              <TableOfContents
                currentHeading="composition"
                items={tableOfContentsItems}
              />
            </DocsShell.Outline>
          </div>
        </DocsShell.Main>
      </DocsShell.Root>
    </div>
  );
}
const meta = {
  args: { layout: 'docs' },
  argTypes: {
    layout: { control: 'select', options: ['docs', 'splash', 'standalone'] },
  },
  parameters: { layout: 'fullscreen' },
  render: DocsShellPreview,
  title: 'Components/DocsShell',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
