import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { tinyrackPalettes, tinyrackSemanticColors } from '../../src/exports/tokens.js';
import {
  CodeSnippet,
  DocsCallout,
  DocsCard,
  DocsGrid,
  DocsPage,
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

type TokenDecision = {
  need: string;
  use: SemanticTokenName | `${SemanticTokenName} + ${SemanticTokenName}`;
  avoid: string;
  example: string;
};

type PaletteGuidance = {
  purpose: string;
  note: string;
};

const semanticTokenCssVariables: Record<SemanticTokenName, string> = {
  canvas: '--tinyrack-canvas',
  background: '--tinyrack-background',
  surface: '--tinyrack-surface',
  surfaceRaised: '--tinyrack-surface-raised',
  surfaceMuted: '--tinyrack-surface-muted',
  surfaceInset: '--tinyrack-surface-inset',
  text: '--tinyrack-text',
  textMuted: '--tinyrack-text-muted',
  borderSubtle: '--tinyrack-border-subtle',
  border: '--tinyrack-border',
  borderStrong: '--tinyrack-border-strong',
  focus: '--tinyrack-focus',
  primary: '--tinyrack-primary',
  primaryContent: '--tinyrack-primary-contrast',
  secondary: '--tinyrack-secondary',
  secondaryContent: '--tinyrack-secondary-contrast',
  accent: '--tinyrack-accent',
  accentContent: '--tinyrack-accent-contrast',
  success: '--tinyrack-success',
  successContent: '--tinyrack-success-contrast',
  warning: '--tinyrack-warning',
  warningContent: '--tinyrack-warning-contrast',
  error: '--tinyrack-error',
  errorContent: '--tinyrack-error-contrast',
  info: '--tinyrack-info',
  infoContent: '--tinyrack-info-contrast',
};

const tokenDecisions: TokenDecision[] = [
  {
    need: 'Page, app shell, or full-screen frame',
    use: 'canvas',
    avoid: 'surface or a raw near-black value',
    example: 'Root layout background',
  },
  {
    need: 'Default card, table, sidebar, or repeated panel',
    use: 'surface',
    avoid: 'canvas for nested panels',
    example: 'Resource card or table shell',
  },
  {
    need: 'Selected panel, active row, popover, or raised layer',
    use: 'surfaceRaised',
    avoid: 'box-shadow as the only depth cue',
    example: 'Selected node row',
  },
  {
    need: 'Quiet grouping, track, separator zone, or disabled region',
    use: 'surfaceMuted',
    avoid: 'secondary action color',
    example: 'Filter strip or progress track',
  },
  {
    need: 'Code, logs, dense data, or input interior',
    use: 'surfaceInset',
    avoid: 'another arbitrary black step',
    example: 'Terminal output or config block',
  },
  {
    need: 'Primary reading text or data values',
    use: 'text',
    avoid: 'primary action color',
    example: 'Service name and metric value',
  },
  {
    need: 'Metadata, timestamps, helper text, or secondary labels',
    use: 'textMuted',
    avoid: 'reduced opacity on arbitrary text',
    example: 'Last backup time',
  },
  {
    need: 'Visible keyboard focus',
    use: 'focus',
    avoid: 'color-only hover treatment',
    example: 'Input and menu focus ring',
  },
  {
    need: 'Healthy, warning, error, or informational state',
    use: 'warning + warningContent',
    avoid: 'status hue without text',
    example: 'Guarded deploy badge',
  },
];

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

const paletteGuidance: Record<keyof typeof tinyrackPalettes, PaletteGuidance> = {
  neutral: {
    purpose: 'base neutral scale',
    note: 'Use through semantic surface, text, and border tokens instead of choosing steps directly.',
  },
  brand: {
    purpose: 'Tinyrack identity neutrals',
    note: 'The brand stays quiet and rack-console-like; operational state colors carry the high-signal moments.',
  },
  accent: {
    purpose: 'local emphasis ingredients',
    note: 'Reserved for small emphasis surfaces that should not look like success, warning, or error.',
  },
  violet: {
    purpose: 'adapter compatibility scale',
    note: 'Kept restrained so framework color APIs do not introduce a separate purple product language.',
  },
  success: {
    purpose: 'healthy operational state',
    note: 'Use only for completed, live, signed, passing, or recovered states.',
  },
  warning: {
    purpose: 'attention-needed state',
    note: 'Use for guarded deploys, stale backups, pending reviews, or risk that still has a path forward.',
  },
  error: {
    purpose: 'blocking failure state',
    note: 'Use for failed, invalid, denied, destructive, or unrecoverable states.',
  },
  info: {
    purpose: 'neutral system notice',
    note: 'Use for route changes, notices, and informational alerts that should not imply health or risk.',
  },
};

function hexToRgb(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);

  if (!match) {
    throw new Error(`Unsupported color value: ${hex}`);
  }

  const [, red, green, blue] = match;

  if (!red || !green || !blue) {
    throw new Error(`Unsupported color value: ${hex}`);
  }

  return [
    Number.parseInt(red, 16) / 255,
    Number.parseInt(green, 16) / 255,
    Number.parseInt(blue, 16) / 255,
  ];
}

function relativeLuminance(hex: string) {
  const [red, green, blue] = hexToRgb(hex);
  const linearRed = red <= 0.03928 ? red / 12.92 : ((red + 0.055) / 1.055) ** 2.4;
  const linearGreen =
    green <= 0.03928 ? green / 12.92 : ((green + 0.055) / 1.055) ** 2.4;
  const linearBlue = blue <= 0.03928 ? blue / 12.92 : ((blue + 0.055) / 1.055) ** 2.4;

  return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
}

function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const light = Math.max(foregroundLuminance, backgroundLuminance);
  const dark = Math.min(foregroundLuminance, backgroundLuminance);

  return (light + 0.05) / (dark + 0.05);
}

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
        <strong className="text-tinyrack-xs leading-tinyrack-xs">{mode}</strong>
        <code className="text-tinyrack-2xs text-base-content/70 [overflow-wrap:anywhere]">
          {value}
        </code>
      </span>
    </span>
  );
}

function InlineToken({
  children,
}: {
  children: SemanticTokenName | `${SemanticTokenName} + ${SemanticTokenName}`;
}) {
  return (
    <code className="rounded border border-base-300 bg-base-100 px-1.5 py-0.5 text-tinyrack-xs text-base-content">
      {children}
    </code>
  );
}

function DecisionMatrix() {
  return (
    <DocsCard title="Choose a token">
      <p>
        Start here when you know the UI job but not the token name. The detailed
        sections below explain each token after the first decision is made.
      </p>
      <div className="overflow-auto rounded-lg border border-base-300 max-md:hidden">
        <table className="w-full min-w-[54rem] border-collapse">
          <thead>
            <tr>
              {['Need', 'Use', 'Avoid', 'Example'].map((column) => (
                <th
                  className="border-b border-base-300 bg-base-200/90 px-2.5 py-2 text-left align-top text-tinyrack-xs text-base-content uppercase"
                  key={column}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokenDecisions.map((decision) => (
              <tr key={decision.need}>
                <td className="border-b border-base-300 px-2.5 py-2 align-top leading-tinyrack-md text-base-content">
                  {decision.need}
                </td>
                <td className="border-b border-base-300 px-2.5 py-2 align-top">
                  <InlineToken>{decision.use}</InlineToken>
                </td>
                <td className="border-b border-base-300 px-2.5 py-2 align-top leading-tinyrack-md text-base-content/70">
                  {decision.avoid}
                </td>
                <td className="border-b border-base-300 px-2.5 py-2 align-top leading-tinyrack-md text-base-content/70">
                  {decision.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hidden gap-2 max-md:grid">
        {tokenDecisions.map((decision) => (
          <article
            className="grid gap-2 rounded-md border border-base-300 bg-base-100 p-3"
            key={decision.need}
          >
            <strong className="leading-tinyrack-sm">{decision.need}</strong>
            <dl className="m-0 grid gap-1.5 text-tinyrack-sm leading-tinyrack-md">
              <div className="grid gap-1">
                <dt className="font-semibold text-base-content/60 uppercase">Use</dt>
                <dd className="m-0">
                  <InlineToken>{decision.use}</InlineToken>
                </dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-semibold text-base-content/60 uppercase">Avoid</dt>
                <dd className="m-0 text-base-content/75">{decision.avoid}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-semibold text-base-content/60 uppercase">
                  Example
                </dt>
                <dd className="m-0 text-base-content/75">{decision.example}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </DocsCard>
  );
}

function SemanticTokenCard({ token }: { token: SemanticToken }) {
  return (
    <article className="grid min-w-0 gap-2 rounded-md border border-base-300 bg-base-100 p-3">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="m-0 text-tinyrack-md leading-tinyrack-sm">{token.name}</h3>
          <p className="m-0 text-tinyrack-sm leading-tinyrack-sm text-base-content/70">
            {token.intent}
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap gap-1.5">
          <TokenChip mode="dark" name={token.name} />
          <TokenChip mode="light" name={token.name} />
        </div>
      </div>
      <p className="m-0 text-tinyrack-sm leading-tinyrack-md text-base-content/75">
        {token.use}
      </p>
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
  const ratio = contrastRatio(color, background);

  return (
    <span className="grid min-w-24 gap-1 rounded-md border border-base-300 bg-base-100 p-1.5">
      <span
        className="inline-flex min-h-8 items-center justify-center rounded px-2.5 py-1 text-tinyrack-xs font-bold"
        style={{ backgroundColor: background, color }}
      >
        {tone}
      </span>
      <span className="text-center text-tinyrack-2xs font-semibold text-base-content/70">
        AA {ratio.toFixed(1)}:1
      </span>
    </span>
  );
}

function SemanticComparison() {
  return (
    <DocsCard title="Light and dark semantic map">
      <p>
        Use the CSS variable in product code and adapter output. The swatches show the
        resolved token value in the default dark mode and the light override.
      </p>
      <div className="overflow-auto rounded-lg border border-base-300">
        <table className="w-full min-w-[58rem] border-collapse">
          <thead>
            <tr>
              {['Token', 'Purpose', 'CSS variable', 'Dark', 'Light'].map((column) => (
                <th
                  className="border-b border-base-300 bg-base-200/90 px-2.5 py-2 text-left align-top text-tinyrack-xs text-base-content uppercase"
                  key={column}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semanticGroups.flatMap((group) =>
              group.tokens.map((token) => (
                <tr key={token.name}>
                  <td className="border-b border-base-300 px-2.5 py-2 align-top text-base-content">
                    {token.name}
                  </td>
                  <td className="border-b border-base-300 px-2.5 py-2 align-top leading-tinyrack-md text-base-content/70">
                    {token.intent}
                  </td>
                  <td className="border-b border-base-300 px-2.5 py-2 align-top">
                    <code className="text-tinyrack-xs text-primary [overflow-wrap:anywhere]">
                      {semanticTokenCssVariables[token.name]}
                    </code>
                  </td>
                  {(['dark', 'light'] as const).map((mode) => {
                    const value = tinyrackSemanticColors[mode][token.name];

                    return (
                      <td
                        className="border-b border-base-300 px-2.5 py-2 align-top"
                        key={`${token.name}-${mode}`}
                      >
                        <span className="inline-flex min-w-36 items-center gap-2">
                          <TokenSwatch value={value} />
                          <code className="text-tinyrack-xs text-base-content/70">
                            {value}
                          </code>
                        </span>
                      </td>
                    );
                  })}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </DocsCard>
  );
}

function ContentPairs() {
  return (
    <DocsCard title="Fill and content pairs">
      <p>
        Filled action and status surfaces should always use their paired content token.
        The badge under each chip is the calculated contrast ratio for that pair.
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {(['dark', 'light'] as const).map((mode) => (
          <section
            className="grid gap-2 rounded-md border border-base-300 bg-base-100 p-3"
            key={mode}
          >
            <h3 className="m-0 text-tinyrack-md capitalize">{mode}</h3>
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

function AppliedExamplePanel({ mode }: { mode: ColorMode }) {
  const colors = tinyrackSemanticColors[mode];
  const shellStyle: CSSProperties = {
    backgroundColor: colors.canvas,
    borderColor: colors.border,
    color: colors.text,
  };
  const panelStyle: CSSProperties = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  };
  const raisedStyle: CSSProperties = {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.borderStrong,
  };
  const insetStyle: CSSProperties = {
    backgroundColor: colors.surfaceInset,
    borderColor: colors.border,
  };
  const mutedStyle: CSSProperties = {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderSubtle,
    color: colors.textMuted,
  };
  const focusStyle: CSSProperties = {
    backgroundColor: colors.surfaceInset,
    borderColor: colors.focus,
    boxShadow: `0 0 0 2px ${colors.focus}`,
    color: colors.text,
  };
  const warningStyle: CSSProperties = {
    backgroundColor: colors.warning,
    color: colors.warningContent,
  };
  const successStyle: CSSProperties = {
    backgroundColor: colors.success,
    color: colors.successContent,
  };

  return (
    <section className="grid gap-3 rounded-md border p-3" style={shellStyle}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="m-0 text-tinyrack-md capitalize">{mode} application</h3>
          <p className="m-0 text-tinyrack-xs" style={{ color: colors.textMuted }}>
            canvas, surface, raised, inset, border, focus, and status tokens together
          </p>
        </div>
        <span
          className="rounded px-2 py-1 text-tinyrack-xs font-bold"
          style={successStyle}
        >
          backup passing
        </span>
      </div>
      <div className="grid gap-2 rounded-md border p-3" style={panelStyle}>
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div>
            <strong className="block">rack-control</strong>
            <span className="text-tinyrack-xs" style={{ color: colors.textMuted }}>
              node-01 / reverse-proxy / nas-01
            </span>
          </div>
          <span
            className="rounded px-2 py-1 text-tinyrack-xs font-bold"
            style={warningStyle}
          >
            review deploy
          </span>
        </div>
        <div className="grid gap-2 rounded-md border p-2" style={raisedStyle}>
          <div className="grid gap-1 rounded border p-2" style={insetStyle}>
            <span className="text-tinyrack-xs" style={{ color: colors.textMuted }}>
              focused route
            </span>
            <span
              className="rounded border px-2 py-1 text-tinyrack-sm"
              style={focusStyle}
            >
              /services/reverse-proxy
            </span>
          </div>
          <div
            className="flex min-w-0 flex-wrap justify-between gap-2 rounded border px-2 py-1.5 text-tinyrack-sm"
            style={mutedStyle}
          >
            <span>selected row</span>
            <span>surfaceRaised + borderStrong</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AppliedExamples() {
  return (
    <DocsCard title="Applied light and dark examples">
      <p>
        These examples show how tokens combine in real Tinyrack surfaces instead of
        treating color values as isolated swatches.
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        {(['dark', 'light'] as const).map((mode) => (
          <AppliedExamplePanel key={mode} mode={mode} />
        ))}
      </div>
    </DocsCard>
  );
}

function UsageExamples() {
  return (
    <DocsGrid>
      <DocsCard title="Do">
        <ul className="m-0 grid gap-2 pl-4 leading-tinyrack-md text-base-content/75">
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
        <ul className="m-0 grid gap-2 pl-4 leading-tinyrack-md text-base-content/75">
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
      <summary className="cursor-pointer text-tinyrack-md font-semibold">
        Raw palette appendix
      </summary>
      <p className="mt-3 mb-0 leading-tinyrack-md text-base-content/70">
        These scales are implementation ingredients. Prefer semantic tokens in product
        surfaces, component examples, and application code.
      </p>
      <DocsGrid>
        {Object.entries(tinyrackPalettes).map(([paletteName, scale]) => {
          const typedPaletteName = paletteName as keyof typeof tinyrackPalettes;
          const guidance = paletteGuidance[typedPaletteName];

          return (
            <DocsCard key={paletteName} title={paletteName}>
              <p>
                <strong>{guidance.purpose}.</strong> {guidance.note}
              </p>
              <div className="grid gap-2">
                {Object.entries(scale).map(([step, value]) => (
                  <div
                    className="grid min-w-0 items-center gap-2 rounded-md border border-base-300 bg-base-100 p-2 [grid-template-columns:auto_minmax(5rem,0.7fr)_minmax(8rem,1fr)] max-md:grid-cols-1"
                    key={step}
                  >
                    <TokenSwatch value={value} />
                    <strong>{step}</strong>
                    <code className="text-tinyrack-xs text-base-content/70 [overflow-wrap:anywhere]">
                      {value}
                    </code>
                  </div>
                ))}
              </div>
            </DocsCard>
          );
        })}
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
      <DocsCallout title="Palette rationale">
        Tinyrack uses a quiet, low-chroma operational palette so racks, services, logs,
        and status states stay readable. Brand and accent values are restrained on
        purpose; success, warning, error, and info carry the high-signal moments.
      </DocsCallout>
      <DecisionMatrix />
      <AppliedExamples />
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
