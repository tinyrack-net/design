import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useState } from 'react';
import '../../src/astro/starlight/theme.css';

const navItems = [
  ['#start', 'Start here'],
  ['#install', 'Install'],
  ['#configure', 'Configure'],
  ['#content', 'Write content'],
  ['#structure', 'Project files'],
  ['#release', 'Release check'],
] as const;

const cards = [
  ['Adapter config', 'Load Tinyrack CSS before site overrides.'],
  ['Content blocks', 'Use cards, asides, links, and badges in real prose.'],
  ['Release checks', 'Build the fixture before publishing.'],
] as const;

const installCommands = {
  pnpm: 'pnpm add @tinyrack/themes @astrojs/starlight astro',
  npm: 'npm install @tinyrack/themes @astrojs/starlight astro',
  yarn: 'yarn add @tinyrack/themes @astrojs/starlight astro',
} as const;

type InstallTool = keyof typeof installCommands;

const installTools = Object.keys(installCommands) as InstallTool[];

const releaseSteps = [
  ['Build the package', 'Generate CSS and type declarations before fixture checks.'],
  [
    'Build the Astro fixture',
    'Confirm Starlight resolves the adapter and all content components.',
  ],
  [
    'Review Storybook',
    'Check sidebar, content width, cards, links, callouts, and code blocks.',
  ],
] as const;

const configCode = `import starlight from '@astrojs/starlight';
import { withTinyrackStarlightTheme } from '@tinyrack/themes/astro/starlight';

starlight(
  withTinyrackStarlightTheme({
    title: 'Rack Runbook',
    customCss: ['./src/styles/global.css'],
  }),
);`;

function DemoUse({
  children,
  className,
  id,
  inline = false,
}: {
  children: ReactNode;
  className?: string;
  id: string;
  inline?: boolean;
}) {
  const Element = inline ? 'span' : 'div';

  return (
    <Element className={className} data-demo-component={id}>
      {children}
    </Element>
  );
}

function StarlightDocsSite() {
  const [installTool, setInstallTool] = useState<InstallTool>('pnpm');

  return (
    <main
      className="box-border h-screen min-h-screen overflow-y-auto bg-[var(--sl-color-black)] p-2 font-[var(--sl-font)] text-[var(--sl-color-white)]"
      data-demo-starlight="true"
    >
      <div className="mx-auto grid min-h-[calc(100vh-1rem)] max-w-[90rem] grid-cols-1 overflow-visible rounded-lg border border-[var(--sl-color-gray-5)] lg:grid-cols-[minmax(12rem,14rem)_minmax(0,1fr)] lg:overflow-clip xl:grid-cols-[minmax(12rem,14rem)_minmax(0,1fr)_minmax(10rem,12rem)]">
        <aside className="min-w-0 border-b border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-4 lg:border-r lg:border-b-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded bg-[var(--sl-color-accent)] text-xs font-extrabold text-[var(--sl-color-black)]">
              TR
            </span>
            <div className="min-w-0">
              <strong className="block break-words">Rack Runbook</strong>
              <span className="block break-words text-[var(--sl-color-gray-3)]">
                Docs adapter
              </span>
            </div>
          </div>
          <details className="mt-4 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-accent-low)] px-3 py-2 font-semibold text-[var(--sl-color-white)]">
              Sections
              <span aria-hidden="true">+</span>
            </summary>
            <nav className="mt-2 grid gap-2" aria-label="Mobile docs navigation">
              {navItems.map(([href, label], index) => (
                <a
                  aria-current={index === 0 ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2.5 text-[var(--sl-color-gray-2)] no-underline ${
                    index === 0
                      ? 'bg-[var(--sl-color-accent-low)] text-[var(--sl-color-white)]'
                      : ''
                  }`}
                  href={href}
                  key={href}
                >
                  {label}
                </a>
              ))}
            </nav>
          </details>
          <nav className="mt-4 hidden gap-1.5 lg:grid" aria-label="Docs navigation">
            {navItems.map(([href, label], index) => (
              <a
                aria-current={index === 0 ? 'page' : undefined}
                className={`rounded-lg px-2.5 py-2 text-[var(--sl-color-gray-2)] no-underline ${
                  index === 0
                    ? 'bg-[var(--sl-color-accent-low)] text-[var(--sl-color-white)]'
                    : ''
                }`}
                href={href}
                key={href}
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="grid min-w-0 gap-4 p-3 sm:p-5">
          <header className="flex min-w-0 flex-col items-start gap-3 border-b border-[var(--sl-color-gray-5)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="break-words text-[var(--sl-color-gray-3)]">
              Docs / Adapters / Starlight
            </span>
            <label className="sr-only" htmlFor="starlight-demo-search">
              Search docs
            </label>
            <input
              className="w-full min-w-0 rounded-md border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-accent-low)] px-3 py-2 text-[var(--sl-color-gray-2)] placeholder:text-[var(--sl-color-gray-3)] sm:w-[min(18rem,100%)] lg:max-w-72"
              id="starlight-demo-search"
              placeholder="Search docs..."
              type="search"
            />
          </header>

          <section className="grid min-w-0 gap-3 pt-2 pb-1" id="start">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <DemoUse id="starlight-badge" inline>
                <span className="inline-flex min-h-6 items-center rounded border border-[var(--sl-color-accent)] bg-[var(--sl-color-accent)] px-2 py-1 font-[var(--sl-font-mono)] text-xs leading-none font-extrabold text-[var(--sl-color-black)]">
                  Starlight 0.40
                </span>
              </DemoUse>
              <span className="inline-flex min-h-6 items-center rounded border border-[var(--sl-color-accent)] bg-transparent px-2 py-1 font-[var(--sl-font-mono)] text-xs leading-none font-extrabold text-[var(--sl-color-white)]">
                Theme adapter
              </span>
            </div>
            <h1 className="m-0 text-balance text-3xl leading-[1.08] tracking-normal break-words sm:text-4xl lg:text-[2.8rem]">
              Build Tinyrack docs with Astro Starlight
            </h1>
            <p className="m-0 max-w-3xl break-words text-[1.05rem] leading-7 text-[var(--sl-color-gray-2)]">
              Use this guide to install the adapter, wire it into Starlight, and verify
              that real documentation components inherit the Tinyrack type, surfaces,
              borders, and contrast.
            </p>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <DemoUse id="starlight-link-button" inline>
                <a
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--sl-color-accent)] bg-[var(--sl-color-accent)] px-4 py-2 text-sm font-extrabold text-[var(--sl-color-black)] no-underline"
                  href="#install"
                >
                  Start setup
                </a>
              </DemoUse>
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--sl-color-accent)] bg-transparent px-4 py-2 text-sm font-extrabold text-[var(--sl-color-white)] no-underline"
                href="#release"
              >
                Review checklist
              </a>
            </div>
          </section>

          <DemoUse
            id="starlight-aside"
            className="grid min-w-0 gap-2 rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-4 text-[var(--sl-color-white)]"
          >
            <strong>Before shipping</strong>
            <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
              Keep the adapter thin. Starlight owns navigation and content behavior;
              Tinyrack only supplies the visual language for docs surfaces.
            </p>
          </DemoUse>

          <section className="grid min-w-0 gap-3" id="install">
            <div className="grid min-w-0 gap-2">
              <h2 className="m-0 text-base font-semibold">Choose an install path</h2>
              <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
                The same docs page should stay readable whether teams install through
                pnpm, npm, or yarn.
              </p>
            </div>
            <DemoUse
              id="starlight-tabs"
              className="grid min-w-0 gap-3 rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-3"
            >
              <div
                className="flex min-w-0 flex-wrap items-center gap-2 border-b border-[var(--sl-color-gray-5)] pb-3"
                role="tablist"
                aria-label="Install command tabs"
              >
                {installTools.map((tool) => {
                  const selected = installTool === tool;

                  return (
                    <button
                      aria-controls="starlight-install-panel"
                      aria-selected={selected}
                      className={`min-h-10 cursor-pointer rounded-md border px-3 py-2 text-sm ${
                        selected
                          ? 'border-[var(--sl-color-gray-5)] bg-[var(--sl-color-accent-low)] text-[var(--sl-color-white)]'
                          : 'border-transparent bg-transparent text-[var(--sl-color-gray-2)]'
                      }`}
                      id={`starlight-install-tab-${tool}`}
                      key={tool}
                      onClick={() => setInstallTool(tool)}
                      role="tab"
                      type="button"
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
              <DemoUse id="starlight-tab-item" className="grid min-w-0 gap-3">
                <DemoUse id="starlight-code" className="min-w-0">
                  <pre
                    aria-labelledby={`starlight-install-tab-${installTool}`}
                    className="m-0 box-border w-full max-w-full overflow-auto rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-4 font-[var(--sl-font-mono)] text-[0.85rem] leading-[1.65] whitespace-pre-wrap break-words text-[var(--sl-color-white)]"
                    id="starlight-install-panel"
                    role="tabpanel"
                  >
                    {installCommands[installTool]}
                  </pre>
                </DemoUse>
              </DemoUse>
            </DemoUse>
          </section>

          <section className="grid min-w-0 gap-3" id="configure">
            <div className="grid min-w-0 gap-2">
              <h2 className="m-0 text-base font-semibold">Configure the adapter</h2>
              <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
                Wrap the Starlight config so packaged CSS is loaded before local
                overrides.
              </p>
            </div>
            <DemoUse id="starlight-code" className="min-w-0">
              <pre className="m-0 box-border w-full max-w-full overflow-auto rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-4 font-[var(--sl-font-mono)] text-[0.85rem] leading-[1.65] whitespace-pre-wrap break-words text-[var(--sl-color-white)]">
                {configCode}
              </pre>
            </DemoUse>
          </section>

          <section className="grid min-w-0 gap-3" id="content">
            <div className="grid min-w-0 gap-2">
              <h2 className="m-0 text-base font-semibold">Write useful docs pages</h2>
              <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
                These examples cover the Starlight authoring components that should
                inherit the Tinyrack docs theme.
              </p>
            </div>
            <DemoUse
              id="starlight-card-grid"
              className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-2.5"
            >
              {cards.map(([title, copy]) => (
                <DemoUse
                  id="starlight-card"
                  className="grid min-w-0 gap-3 rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-3"
                  key={title}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <DemoUse
                      id="starlight-icon"
                      inline
                      className="inline-flex h-6 w-6 flex-none items-center leading-none"
                    >
                      <span
                        className='relative inline-block h-6 w-6 flex-none rounded border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-accent-low)] after:absolute after:top-1/2 after:left-1/2 after:h-[0.45rem] after:w-[0.45rem] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[var(--sl-color-accent)] after:content-[""]'
                        aria-hidden="true"
                      />
                    </DemoUse>
                    <h3 className="m-0 text-[0.95rem] font-semibold">{title}</h3>
                  </div>
                  <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
                    {copy}
                  </p>
                </DemoUse>
              ))}
            </DemoUse>

            <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-2.5">
              <DemoUse
                id="starlight-link-card"
                className="grid min-w-0 gap-1.5 rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-3"
              >
                <a
                  className="font-extrabold text-[var(--sl-color-white)] no-underline"
                  href="#configure"
                >
                  Adapter reference
                </a>
                <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
                  Config, CSS fallback, and token boundaries.
                </p>
              </DemoUse>
              <div className="grid min-w-0 gap-1.5 rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-3">
                <a
                  className="font-extrabold text-[var(--sl-color-white)] no-underline"
                  href="#release"
                >
                  Release checklist
                </a>
                <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
                  What to inspect before the package is published.
                </p>
              </div>
            </div>
          </section>

          <section className="grid min-w-0 gap-3" id="structure">
            <div className="grid min-w-0 gap-2">
              <h2 className="m-0 text-base font-semibold">Project structure</h2>
              <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
                The fixture mirrors a small Starlight site so imports, content, and
                local CSS overrides are tested together.
              </p>
            </div>
            <DemoUse
              id="starlight-file-tree"
              className="grid min-w-0 gap-2 rounded-lg border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-3 font-[var(--sl-font-mono)] text-[0.78rem]"
            >
              {[
                'astro.config.mjs',
                'src/content/docs/index.mdx',
                'src/styles/global.css',
                'package.json',
              ].map((file, index) => (
                <span
                  className={`break-words text-[var(--sl-color-gray-2)] ${index > 0 ? 'pl-3' : ''}`}
                  key={file}
                >
                  {file}
                </span>
              ))}
            </DemoUse>
          </section>

          <section className="grid min-w-0 gap-3" id="release">
            <div className="grid min-w-0 gap-2">
              <h2 className="m-0 text-base font-semibold">Release checklist</h2>
              <p className="m-0 max-w-3xl break-words leading-7 text-[var(--sl-color-gray-2)]">
                Steps should read as instructions, not as component samples, while still
                exposing the full theme surface.
              </p>
            </div>
            <DemoUse id="starlight-steps" className="min-w-0">
              <ol className="grid min-w-0 list-none gap-2 p-0">
                {releaseSteps.map(([title, copy], index) => (
                  <li
                    className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 gap-y-1"
                    key={title}
                  >
                    <span className="inline-flex h-[1.35rem] w-[1.35rem] items-center justify-center rounded bg-[var(--sl-color-accent)] text-[0.72rem] font-extrabold text-[var(--sl-color-black)]">
                      {index + 1}
                    </span>
                    <strong>{title}</strong>
                    <span className="col-start-2 leading-6 text-[var(--sl-color-gray-2)]">
                      {copy}
                    </span>
                  </li>
                ))}
              </ol>
            </DemoUse>
          </section>
        </article>

        <aside className="hidden min-w-0 border-l border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-4 xl:block">
          <h2 className="m-0 text-base font-semibold">On this page</h2>
          <nav className="mt-4 grid gap-1.5" aria-label="Table of contents">
            {navItems.map(([href, label]) => (
              <a
                className="rounded-lg px-2.5 py-2 text-[var(--sl-color-gray-2)] no-underline"
                href={href}
                key={href}
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}

const meta = {
  title: 'Demo/Starlight Docs Site',
  component: StarlightDocsSite,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StarlightDocsSite>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
