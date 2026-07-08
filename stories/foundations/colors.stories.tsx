import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { tinyrackPalettes, tinyrackSemanticColors } from '../../src/tokens/index.js';
import {
  CodeSnippet,
  DocsCallout,
  DocsCard,
  DocsGrid,
  DocsPage,
  DocsTable,
} from '../docs-components.js';

type ColorMode = keyof typeof tinyrackSemanticColors;
type SemanticTokenName = keyof typeof tinyrackSemanticColors.light;

type SemanticToken = {
  name: SemanticTokenName;
  intent: string;
  use: string;
};

type SemanticGroup = {
  title: string;
  description: string;
  tokens: SemanticToken[];
};

const semanticGroups: SemanticGroup[] = [
  {
    title: 'Canvas and surfaces',
    description: 'Use these tokens to create depth before adding borders or shadows.',
    tokens: [
      {
        name: 'canvas',
        intent: 'outer app shell',
        use: 'The page frame, docs shell, and full-screen console background.',
      },
      {
        name: 'surface',
        intent: 'default panel',
        use: 'Cards, tables, sidebars, and repeated operational panels.',
      },
      {
        name: 'surfaceRaised',
        intent: 'active panel',
        use: 'Selected navigation, elevated panels, popovers, and active rows.',
      },
      {
        name: 'surfaceMuted',
        intent: 'quiet grouping',
        use: 'Subtle strips, inactive containers, progress tracks, and separators.',
      },
      {
        name: 'surfaceInset',
        intent: 'recessed content',
        use: 'Code blocks, log panes, dense table regions, and input interiors.',
      },
    ],
  },
  {
    title: 'Content and structure',
    description:
      'Use these tokens for readable hierarchy and non-color-only structure.',
    tokens: [
      {
        name: 'text',
        intent: 'primary content',
        use: 'Body copy, headings, data values, labels, and table text.',
      },
      {
        name: 'textMuted',
        intent: 'secondary content',
        use: 'Helper text, metadata, timestamps, captions, and secondary nav labels.',
      },
      {
        name: 'borderSubtle',
        intent: 'low-emphasis edge',
        use: 'Large layout dividers and nested surface boundaries.',
      },
      {
        name: 'border',
        intent: 'standard edge',
        use: 'Card, table, input, menu, and command-surface borders.',
      },
      {
        name: 'borderStrong',
        intent: 'high-emphasis edge',
        use: 'Focused panels, selected rows, drag targets, and strong separation.',
      },
      {
        name: 'focus',
        intent: 'keyboard focus',
        use: 'Focus rings and visible interaction outlines.',
      },
    ],
  },
  {
    title: 'Actions and signals',
    description: 'Use action tokens sparingly; status tokens should carry meaning.',
    tokens: [
      {
        name: 'primary',
        intent: 'primary action',
        use: 'The one main action in a view, selected tabs, and confirmed progress.',
      },
      {
        name: 'secondary',
        intent: 'secondary action',
        use: 'Support actions, neutral controls, and alternate button surfaces.',
      },
      {
        name: 'accent',
        intent: 'local emphasis',
        use: 'Small highlights that should not read as success, warning, or error.',
      },
      {
        name: 'info',
        intent: 'neutral signal',
        use: 'System notices, route updates, and informational alert surfaces.',
      },
      {
        name: 'success',
        intent: 'healthy result',
        use: 'Passing checks, live services, signed artifacts, and completed steps.',
      },
      {
        name: 'warning',
        intent: 'attention needed',
        use: 'Guarded deploys, pending reviews, delayed backups, and risk states.',
      },
      {
        name: 'error',
        intent: 'blocking failure',
        use: 'Failed backups, denied actions, invalid fields, and destructive states.',
      },
    ],
  },
];

const contentPairs = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const;

function swatchStyle(value: string): CSSProperties {
  return { backgroundColor: value };
}

function TokenSwatch({ value }: { value: string }) {
  return (
    <span
      className="inline-block h-7 w-7 rounded border border-base-300 shadow-sm"
      style={swatchStyle(value)}
    />
  );
}

function TokenChip({ mode, name }: { mode: ColorMode; name: SemanticTokenName }) {
  const value = tinyrackSemanticColors[mode][name];

  return (
    <span className="inline-flex min-w-0 items-center gap-2 rounded-md border border-base-300 bg-base-100 px-2 py-1.5">
      <TokenSwatch value={value} />
      <span className="grid min-w-0 gap-0.5">
        <strong className="text-[0.75rem] leading-none">{mode}</strong>
        <code className="text-[0.72rem] text-base-content/70 [overflow-wrap:anywhere]">
          {value}
        </code>
      </span>
    </span>
  );
}

function SemanticTokenCard({ token }: { token: SemanticToken }) {
  return (
    <article className="grid min-w-0 gap-2 rounded-md border border-base-300 bg-base-100 p-3">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="m-0 text-[0.95rem] leading-snug">{token.name}</h3>
          <p className="m-0 text-sm leading-5 text-base-content/70">{token.intent}</p>
        </div>
        <div className="flex min-w-0 flex-wrap gap-1.5">
          <TokenChip mode="dark" name={token.name} />
          <TokenChip mode="light" name={token.name} />
        </div>
      </div>
      <p className="m-0 text-sm leading-6 text-base-content/75">{token.use}</p>
    </article>
  );
}

function SemanticGroupSection({ group }: { group: SemanticGroup }) {
  return (
    <DocsCard title={group.title}>
      <p>{group.description}</p>
      <div className="grid gap-2">
        {group.tokens.map((token) => (
          <SemanticTokenCard key={token.name} token={token} />
        ))}
      </div>
    </DocsCard>
  );
}

function PairPreview({
  mode,
  tone,
}: {
  mode: ColorMode;
  tone: (typeof contentPairs)[number];
}) {
  const colors = tinyrackSemanticColors[mode];
  const background = colors[tone];
  const color = colors[`${tone}Content`];

  return (
    <span
      className="inline-flex min-h-8 items-center rounded-md border border-base-300 px-2.5 py-1 text-[0.78rem] font-bold"
      style={{ backgroundColor: background, color }}
    >
      {tone}
    </span>
  );
}

function SemanticComparison() {
  return (
    <DocsCard title="Light and dark semantic map">
      <DocsTable
        columns={['Token', 'Purpose', 'Dark', 'Light']}
        rows={semanticGroups.flatMap((group) =>
          group.tokens.map((token) => [
            token.name,
            token.intent,
            tinyrackSemanticColors.dark[token.name],
            tinyrackSemanticColors.light[token.name],
          ]),
        )}
      />
    </DocsCard>
  );
}

function ContentPairs() {
  return (
    <DocsCard title="Fill and content pairs">
      <p>
        Filled action and status surfaces should always use their paired content token.
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {(['dark', 'light'] as const).map((mode) => (
          <section
            className="grid gap-2 rounded-md border border-base-300 bg-base-100 p-3"
            key={mode}
          >
            <h3 className="m-0 text-[0.95rem] capitalize">{mode}</h3>
            <div className="flex flex-wrap gap-2">
              {contentPairs.map((tone) => (
                <PairPreview key={`${mode}-${tone}`} mode={mode} tone={tone} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocsCard>
  );
}

function UsageExamples() {
  return (
    <DocsGrid>
      <DocsCard title="Do">
        <ul className="m-0 grid gap-2 pl-4 leading-6 text-base-content/75">
          <li>Use surface tokens before reaching for a new gray value.</li>
          <li>
            Use status tokens only when the state changes user attention or action.
          </li>
          <li>Pair filled status colors with their matching content tokens.</li>
          <li>Label status with text or icons, not color alone.</li>
        </ul>
        <CodeSnippet>{`<span className="badge badge-warning">Review</span>
<button className="btn btn-primary">Apply config</button>
<section className="border border-base-300 bg-base-100">...</section>`}</CodeSnippet>
      </DocsCard>
      <DocsCard title="Do not">
        <ul className="m-0 grid gap-2 pl-4 leading-6 text-base-content/75">
          <li>Do not use raw hex values in reusable demo surfaces.</li>
          <li>Do not use library color names as user-facing design language.</li>
          <li>Do not use warning or error colors for decorative emphasis.</li>
          <li>Do not add another near-black step when a surface token already fits.</li>
        </ul>
        <CodeSnippet>{`<Mantine.Badge color="yellow">Review</Mantine.Badge>
<div className="bg-[#171717] text-[#fafafa]">...</div>
<span className="text-red-500">status without label</span>`}</CodeSnippet>
      </DocsCard>
    </DocsGrid>
  );
}

function PaletteAppendix() {
  return (
    <details className="grid gap-3 rounded-lg border border-base-300 bg-base-200/80 p-3.5 shadow-sm">
      <summary className="cursor-pointer text-[0.95rem] font-semibold">
        Raw palette appendix
      </summary>
      <p className="mt-3 mb-0 leading-6 text-base-content/70">
        These scales are implementation ingredients. Prefer semantic tokens in product
        surfaces, component examples, and application code.
      </p>
      <DocsGrid>
        {Object.entries(tinyrackPalettes).map(([paletteName, scale]) => (
          <DocsCard key={paletteName} title={paletteName}>
            <div className="grid gap-2">
              {Object.entries(scale).map(([step, value]) => (
                <div
                  className="grid min-w-0 items-center gap-2 rounded-md border border-base-300 bg-base-100 p-2 [grid-template-columns:auto_minmax(5rem,0.7fr)_minmax(8rem,1fr)] max-md:grid-cols-1"
                  key={step}
                >
                  <TokenSwatch value={value} />
                  <strong>{step}</strong>
                  <code className="text-[0.78rem] text-base-content/70 [overflow-wrap:anywhere]">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          </DocsCard>
        ))}
      </DocsGrid>
    </details>
  );
}

function ColorsPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Colors"
      description="Start with semantic intent, then inspect raw palette values only when building adapters or debugging generated CSS."
    >
      <DocsCallout title="Decision rule">
        Product surfaces should choose from semantic tokens first. Raw palette values
        are reserved for framework adapters, generated CSS, and low-level token work.
      </DocsCallout>
      <div className="grid gap-3">
        {semanticGroups.map((group) => (
          <SemanticGroupSection group={group} key={group.title} />
        ))}
      </div>
      <SemanticComparison />
      <ContentPairs />
      <UsageExamples />
      <PaletteAppendix />
    </DocsPage>
  );
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorsPage,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta<typeof ColorsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
