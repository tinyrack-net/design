import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackSpacing } from '../../src/core/index.js';
import {
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
  TokenTable,
} from '../docs-components.js';

const spacingScale = [
  {
    name: 'xs',
    value: tinyrackSpacing.xs,
    barClassName: 'w-1',
    range: 'Detail',
    use: 'Status dots, icon-to-label gaps, keyboard hint padding.',
  },
  {
    name: 'sm',
    value: tinyrackSpacing.sm,
    barClassName: 'w-2',
    range: 'Compact',
    use: 'Toolbar controls, table cells, repeated inline actions.',
  },
  {
    name: 'md',
    value: tinyrackSpacing.md,
    barClassName: 'w-3',
    range: 'Default',
    use: 'Default row rhythm, card internals, field groups.',
  },
  {
    name: 'lg',
    value: tinyrackSpacing.lg,
    barClassName: 'w-4',
    range: 'Component',
    use: 'Panel padding, form blocks, larger action areas.',
  },
  {
    name: 'xl',
    value: tinyrackSpacing.xl,
    barClassName: 'w-6',
    range: 'Section',
    use: 'Related card groups and scan-friendly section breaks.',
  },
  {
    name: '2xl',
    value: tinyrackSpacing['2xl'],
    barClassName: 'w-8',
    range: 'Layout',
    use: 'Page-level separation and major content changes.',
  },
] as const;

const spacingModes = [
  {
    title: 'Dense row',
    className: 'gap-1 p-2',
    note: 'Use xs-sm when items repeat and scanning speed matters.',
  },
  {
    title: 'Default group',
    className: 'gap-3 p-3',
    note: 'Use md-lg for normal controls and compact cards.',
  },
  {
    title: 'Section break',
    className: 'gap-6 p-4',
    note: 'Use xl-2xl only when the relationship changes.',
  },
] as const;

function SpacingPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Spacing"
      description="Tinyrack spacing keeps operational screens compact while making relationships easy to scan."
    >
      <DocsGrid>
        <DocsCard title="Principle">
          <p>
            Space should explain relationship before it decorates the page. Keep
            repeated operational UI tight, then add larger stops only when the user
            moves to a different task, section, or layer.
          </p>
          <GuidanceList
            items={[
              'Use smaller stops for repeated controls and machine-status rows.',
              'Use medium stops for the default rhythm inside cards and forms.',
              'Use larger stops to separate sections, not every individual block.',
            ]}
          />
        </DocsCard>
        <DocsCard title="Relationship ranges">
          <div className="grid gap-2">
            {spacingScale.map((token) => (
              <div
                className="grid min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] p-2 [grid-template-columns:minmax(4rem,0.35fr)_auto_minmax(6rem,0.5fr)_minmax(0,1fr)] max-md:grid-cols-1"
                key={token.name}
              >
                <strong>{token.name}</strong>
                <span
                  className={`h-2 rounded-full bg-tinyrack-primary ${token.barClassName}`}
                />
                <code className="text-tinyrack-xs text-tinyrack-primary">
                  {token.value}
                </code>
                <span className="text-tinyrack-text/70">{token.range}</span>
              </div>
            ))}
          </div>
        </DocsCard>
      </DocsGrid>

      <DocsCard title="Usage map">
        <div className="grid gap-2">
          {spacingScale.map((token) => (
            <div
              className="grid min-w-0 gap-2 rounded-md border border-white/10 bg-tinyrack-surface/50 p-2.5 [grid-template-columns:minmax(4rem,0.25fr)_minmax(8rem,0.45fr)_minmax(0,1fr)] max-md:grid-cols-1"
              key={token.name}
            >
              <strong>{token.name}</strong>
              <span className="text-tinyrack-primary">{token.range}</span>
              <span className="leading-tinyrack-md text-tinyrack-text/70">
                {token.use}
              </span>
            </div>
          ))}
        </div>
      </DocsCard>

      <DocsCard title="Density examples">
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))]">
          {spacingModes.map((mode) => (
            <div
              className={`grid rounded-md border border-white/10 bg-tinyrack-surface/60 ${mode.className}`}
              key={mode.title}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-tinyrack-primary" />
                <strong>{mode.title}</strong>
              </div>
              <div className="grid gap-1.5">
                <div className="h-2 rounded-full bg-tinyrack-surface-muted" />
                <div className="h-2 w-3/4 rounded-full bg-tinyrack-surface-muted" />
              </div>
              <p className="text-tinyrack-sm">{mode.note}</p>
            </div>
          ))}
        </div>
      </DocsCard>

      <DocsCard title="Applied console rhythm">
        <div className="grid gap-4 rounded-lg border border-tinyrack-border bg-tinyrack-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="grid gap-1">
              <strong>Rack cluster</strong>
              <span className="text-tinyrack-sm text-tinyrack-text/70">
                Compact rows, clear groups, sparse section breaks.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-tinyrack-primary/15 px-2 py-1 text-tinyrack-xs text-tinyrack-primary">
                healthy
              </span>
              <span className="rounded-sm border border-tinyrack-border px-2 py-1 text-tinyrack-xs">
                sync
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            {['node-01', 'node-02', 'node-03'].map((node, index) => (
              <div
                className="grid min-w-0 items-center gap-3 rounded-md border border-tinyrack-border bg-tinyrack-surface-muted/80 p-3 [grid-template-columns:auto_minmax(0,1fr)_auto] max-md:grid-cols-1"
                key={node}
              >
                <span className="h-2 w-2 rounded-full bg-tinyrack-primary" />
                <div className="grid gap-1">
                  <strong>{node}</strong>
                  <span className="text-tinyrack-xs text-tinyrack-text/70">
                    {index === 1 ? 'waiting for disk scrub' : 'services nominal'}
                  </span>
                </div>
                <span className="text-tinyrack-xs text-tinyrack-text/70">
                  {index === 1 ? '12 min' : 'now'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DocsCard>

      <DocsGrid>
        <DocsCard title="Token values">
          <TokenTable
            items={spacingScale.map((token) => ({
              name: token.name,
              value: token.value,
              note: token.range,
            }))}
          />
        </DocsCard>
        <DocsCard title="Component guidance">
          <TokenTable
            items={[
              {
                name: 'Button sm',
                value: 'h-8 px-3 gap-1.5',
                note: 'Uses Tailwind default scale values.',
              },
              {
                name: 'Button md',
                value: 'h-10 px-4 gap-2',
                note: 'Default control density for product actions.',
              },
              {
                name: 'Button lg',
                value: 'h-12 px-5 gap-2.5',
                note: 'Use for prominent but still compact actions.',
              },
            ]}
          />
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

const meta = {
  title: 'Foundations/Spacing',
  component: SpacingPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SpacingPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
