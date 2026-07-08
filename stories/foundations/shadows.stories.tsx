import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackShadows } from '../../src/exports/tokens.js';
import {
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
  TokenTable,
} from '../docs-components.js';

const shadowScale = [
  {
    name: 'sm',
    value: tinyrackShadows.sm,
    className: 'shadow-[0_1px_2px_rgb(0_0_0_/_0.18)]',
    role: 'Raised surface',
    use: 'A subtle lift for compact cards and movable rows.',
  },
  {
    name: 'md',
    value: tinyrackShadows.md,
    className: 'shadow-[0_8px_20px_rgb(0_0_0_/_0.22)]',
    role: 'Floating layer',
    use: 'Dropdowns, popovers, command panels, hover cards.',
  },
  {
    name: 'lg',
    value: tinyrackShadows.lg,
    className: 'shadow-[0_16px_40px_rgb(0_0_0_/_0.28)]',
    role: 'Overlay layer',
    use: 'Modals, drawers, blocking panels, dragged surfaces.',
  },
  {
    name: 'focus',
    value: tinyrackShadows.focus,
    className: 'shadow-[0_0_0_2px_rgb(163_163_163_/_0.42)]',
    role: 'Keyboard focus',
    use: 'Visible focus ring for custom interactive elements.',
  },
] as const;

function ShadowsPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Shadows"
      description="Tinyrack shadows separate dark surfaces only when border, spacing, and surface color are not enough."
    >
      <DocsGrid>
        <DocsCard title="Principle">
          <p>
            Shadows are layer cues, not default decoration. Start with surface color,
            border, and spacing. Add shadow when an element floats above the normal
            document flow or needs a focus affordance.
          </p>
          <GuidanceList
            items={[
              'Use borders and whitespace for ordinary grouping.',
              'Use sm for slightly raised operational surfaces.',
              'Use md-lg for floating UI that covers or escapes its parent.',
              'Treat focus as a state token, not as elevation.',
            ]}
          />
        </DocsCard>
        <DocsCard title="Layer scale">
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(9rem,1fr))]">
            {shadowScale.map((token) => (
              <div
                className={`grid min-h-24 min-w-0 content-between gap-3 rounded-lg border border-base-300 bg-base-100 p-3 ${token.className}`}
                key={token.name}
              >
                <strong>{token.name}</strong>
                <span className="text-tinyrack-sm text-base-content/70">
                  {token.role}
                </span>
              </div>
            ))}
          </div>
        </DocsCard>
      </DocsGrid>

      <DocsCard title="Usage map">
        <div className="grid gap-2">
          {shadowScale.map((token) => (
            <div
              className="grid min-w-0 gap-2 rounded-md border border-white/10 bg-base-100/50 p-2.5 [grid-template-columns:minmax(4rem,0.25fr)_minmax(8rem,0.45fr)_minmax(0,1fr)] max-md:grid-cols-1"
              key={token.name}
            >
              <strong>{token.name}</strong>
              <span className="text-primary">{token.role}</span>
              <span className="leading-tinyrack-md text-base-content/70">
                {token.use}
              </span>
            </div>
          ))}
        </div>
      </DocsCard>

      <DocsCard title="Applied elevation stack">
        <div className="relative grid min-h-[22rem] overflow-hidden rounded-lg border border-base-300 bg-base-100 p-4">
          <div className="grid max-w-[34rem] content-start gap-3">
            <div className="rounded-lg border border-base-300 bg-base-200/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="grid gap-1">
                  <strong>Node workload</strong>
                  <span className="text-tinyrack-sm text-base-content/70">
                    Base surfaces stay flat and rely on borders.
                  </span>
                </div>
                <span className="rounded-full bg-primary/15 px-2 py-1 text-tinyrack-xs text-primary">
                  live
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-200/80 p-3 shadow-[0_1px_2px_rgb(0_0_0_/_0.18)]">
              <strong>Raised card</strong>
              <p className="text-tinyrack-sm">
                Use sm only when the surface needs a small amount of separation.
              </p>
            </div>
          </div>
          <div className="absolute right-4 top-16 w-[min(20rem,calc(100%-2rem))] rounded-lg border border-base-300 bg-base-200 p-3 shadow-[0_8px_20px_rgb(0_0_0_/_0.22)]">
            <div className="grid gap-2">
              <strong>Command menu</strong>
              {['Restart service', 'Drain node', 'Open logs'].map((item) => (
                <button
                  className="rounded-md px-2 py-1.5 text-left text-tinyrack-sm hover:bg-base-300"
                  key={item}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="absolute bottom-4 right-8 w-[min(24rem,calc(100%-4rem))] rounded-xl border border-base-300 bg-base-200 p-4 shadow-[0_16px_40px_rgb(0_0_0_/_0.28)]">
            <div className="grid gap-2">
              <strong>Overlay panel</strong>
              <p className="text-tinyrack-sm">
                Use lg for layers that interrupt the current surface hierarchy.
              </p>
            </div>
          </div>
        </div>
      </DocsCard>

      <DocsGrid>
        <DocsCard title="Token values">
          <TokenTable
            items={shadowScale.map((token) => ({
              name: token.name,
              value: token.value,
              note: token.role,
            }))}
          />
        </DocsCard>
        <DocsCard title="Adapter guidance">
          <TokenTable
            items={[
              {
                name: 'Menu',
                value: 'shadow md',
                note: 'Floating choice surfaces should separate from the trigger.',
              },
              {
                name: 'Overlay',
                value: '--tinyrack-overlay-shadow',
                note: 'Reserved for dialogs, drawers, and blocking panels.',
              },
              {
                name: 'Focus',
                value: 'focus',
                note: 'Use for keyboard state, not visual elevation.',
              },
            ]}
          />
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

const meta = {
  title: 'Foundations/Shadows',
  component: ShadowsPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ShadowsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
