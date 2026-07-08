import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { tinyrackPalettes, tinyrackSemanticColors } from '../../src/exports/tokens.js';
import { DocsCard, DocsGrid, DocsPage } from '../docs-components.js';

type ColorMode = keyof typeof tinyrackSemanticColors;
type SemanticTokenName = keyof typeof tinyrackSemanticColors.light;
type ToneName = Extract<
  SemanticTokenName,
  'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
>;
type CoreTokenName = Extract<
  SemanticTokenName,
  | 'surface'
  | 'surfaceRaised'
  | 'surfaceMuted'
  | 'surfaceInset'
  | 'text'
  | 'textMuted'
  | 'border'
  | 'borderSubtle'
  | 'borderStrong'
  | 'focus'
  | 'primary'
  | 'primaryContent'
>;

type SemanticToken = {
  name: CoreTokenName;
  purpose: string;
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

const coreTokens: SemanticToken[] = [
  { name: 'surface', purpose: 'Default cards, tables, and panels' },
  { name: 'surfaceMuted', purpose: 'Quiet groups, tracks, and inactive areas' },
  { name: 'surfaceRaised', purpose: 'Selected, elevated, or active layers' },
  { name: 'surfaceInset', purpose: 'Code, logs, forms, and recessed areas' },
  { name: 'text', purpose: 'Primary text and data values' },
  { name: 'textMuted', purpose: 'Metadata, helper text, and secondary labels' },
  { name: 'border', purpose: 'Default component and panel edges' },
  { name: 'borderSubtle', purpose: 'Large dividers and soft boundaries' },
  { name: 'borderStrong', purpose: 'Selected rows, drag targets, and strong edges' },
  { name: 'focus', purpose: 'Keyboard focus ring and active outline' },
  { name: 'primary', purpose: 'Main action, selected control, or active mark' },
  { name: 'primaryContent', purpose: 'Text or icon on primary fill' },
];

const surfaceStack = [
  'canvas',
  'surface',
  'surfaceRaised',
  'surfaceMuted',
  'surfaceInset',
] as const;

const contentPairs = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies readonly ToneName[];

const signalTones = ['success', 'warning', 'error', 'info'] as const;
const exportedSemanticTokens = Object.keys(
  tinyrackSemanticColors.light,
) as SemanticTokenName[];

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

function readableTextColor(background: string) {
  return contrastRatio('#0a0a0a', background) >= 4.5 ? '#0a0a0a' : '#ffffff';
}

function swatchStyle(value: string): CSSProperties {
  return { backgroundColor: value };
}

function TokenSwatch({ value }: { value: string }) {
  return (
    <span
      className="inline-block h-7 w-7 shrink-0 rounded border border-base-300 shadow-sm"
      style={swatchStyle(value)}
    />
  );
}

function ColorValue({ value }: { value: string }) {
  return (
    <span className="inline-flex min-w-32 items-center gap-2">
      <TokenSwatch value={value} />
      <code className="text-tinyrack-xs text-base-content/70">{value}</code>
    </span>
  );
}

function PaletteCell({
  step,
  value,
  large = false,
}: {
  step: string;
  value: string;
  large?: boolean;
}) {
  return (
    <div
      className={`grid content-between border-base-300 border-r p-2 last:border-r-0 ${
        large ? 'min-h-28' : 'min-h-14'
      }`}
      style={{ backgroundColor: value, color: readableTextColor(value) }}
    >
      <strong className="text-tinyrack-xs leading-tinyrack-xs">{step}</strong>
      <code className="text-tinyrack-2xs opacity-80">{value}</code>
    </div>
  );
}

function PaletteStrip({
  large = false,
  scale,
}: {
  large?: boolean;
  scale: Record<string, string>;
}) {
  return (
    <div
      className={`grid min-w-[46rem] overflow-hidden rounded-md border border-base-300 ${
        large ? '[grid-template-columns:repeat(12,minmax(3.5rem,1fr))]' : ''
      }`}
      style={
        large
          ? undefined
          : {
              gridTemplateColumns: `repeat(${Object.keys(scale).length}, minmax(3rem, 1fr))`,
            }
      }
    >
      {Object.entries(scale).map(([step, value]) => (
        <PaletteCell key={step} large={large} step={step} value={value} />
      ))}
    </div>
  );
}

function PaletteOverview() {
  return (
    <DocsCard title="Rack neutral palette">
      <p>
        Tinyrack is intentionally neutral first. This ramp carries the shell, panels,
        borders, text, and framework adapter output.
      </p>
      <div className="overflow-auto pb-1">
        <PaletteStrip large scale={tinyrackPalettes.neutral} />
      </div>
      <dl className="m-0 grid gap-3 md:grid-cols-3">
        {[
          {
            term: 'Light UI',
            detail: 'Use the 0-300 range for surfaces and structure.',
          },
          {
            term: 'Dark UI',
            detail: 'Use the 800-950 range for shell, panels, and depth.',
          },
          {
            term: 'Readable contrast',
            detail: 'Use semantic roles for text and borders instead of raw steps.',
          },
        ].map((item) => (
          <div
            className="grid gap-1 border-base-300 md:border-l md:pl-3"
            key={item.term}
          >
            <dt className="font-semibold text-base-content">{item.term}</dt>
            <dd className="m-0 text-tinyrack-sm leading-tinyrack-md text-base-content/70">
              {item.detail}
            </dd>
          </div>
        ))}
      </dl>
    </DocsCard>
  );
}

function SurfaceLayer({
  mode,
  name,
}: {
  mode: ColorMode;
  name: (typeof surfaceStack)[number];
}) {
  const colors = tinyrackSemanticColors[mode];

  return (
    <div
      className="grid min-h-20 content-between border-base-300 border-r p-2.5 last:border-r-0"
      style={{
        backgroundColor: colors[name],
        color: colors.text,
      }}
    >
      <span className="text-tinyrack-xs font-semibold">{name}</span>
      <code className="text-tinyrack-2xs" style={{ color: colors.textMuted }}>
        {colors[name]}
      </code>
    </div>
  );
}

function InterfacePalette() {
  return (
    <DocsCard title="Interface palette">
      <p>
        The same roles resolve differently in each mode. Read this as a surface ladder,
        not as a list of separate gray choices.
      </p>
      <div className="grid gap-3">
        {(['light', 'dark'] as const).map((mode) => (
          <section className="grid gap-2" key={mode}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0 text-tinyrack-sm font-semibold capitalize text-base-content">
                {mode}
              </h3>
              <span className="text-tinyrack-xs text-base-content/60">
                canvas to inset
              </span>
            </div>
            <div className="overflow-auto pb-1">
              <div className="grid overflow-hidden rounded-md border border-base-300 [grid-template-columns:repeat(5,minmax(0,1fr))] max-md:min-w-[42rem]">
                {surfaceStack.map((name) => (
                  <SurfaceLayer key={`${mode}-${name}`} mode={mode} name={name} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </DocsCard>
  );
}

function SignalTile({ tone }: { tone: (typeof signalTones)[number] }) {
  const light = tinyrackSemanticColors.light;
  const dark = tinyrackSemanticColors.dark;
  const lightContent = light[`${tone}Content`];
  const darkContent = dark[`${tone}Content`];

  return (
    <section className="grid min-w-0 gap-2 rounded-md border border-base-300 bg-base-100 p-3">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <h3 className="m-0 text-tinyrack-sm font-semibold capitalize text-base-content">
          {tone}
        </h3>
        <code className="text-tinyrack-2xs text-base-content/60">
          {semanticTokenCssVariables[tone]}
        </code>
      </div>
      <div className="grid grid-cols-2 overflow-hidden rounded-md border border-base-300">
        {(
          [
            ['light', light[tone], lightContent],
            ['dark', dark[tone], darkContent],
          ] as const
        ).map(([mode, background, color]) => (
          <div
            className="grid min-h-24 content-between border-base-300 border-r p-2.5 last:border-r-0"
            key={mode}
            style={{ backgroundColor: background, color }}
          >
            <strong className="text-tinyrack-xs capitalize">{mode}</strong>
            <span className="text-tinyrack-2xs font-semibold">
              {contrastRatio(color, background).toFixed(1)}:1
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SignalPalette() {
  return (
    <DocsCard title="Signal palette">
      <p>
        Status colors are sparse on purpose. They should label operational state, not
        decorate neutral surfaces.
      </p>
      <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
        {signalTones.map((tone) => (
          <SignalTile key={tone} tone={tone} />
        ))}
      </div>
    </DocsCard>
  );
}

function TonePair({ mode, tone }: { mode: ColorMode; tone: ToneName }) {
  const colors = tinyrackSemanticColors[mode];
  const background = colors[tone];
  const content = colors[`${tone}Content`];
  const ratio = contrastRatio(content, background);

  return (
    <div className="grid min-w-0 gap-1.5 rounded-md border border-base-300 bg-base-100 p-2">
      <span
        className="inline-flex min-h-9 items-center justify-center rounded px-2 text-tinyrack-xs font-bold"
        style={{ backgroundColor: background, color: content }}
      >
        {tone}
      </span>
      <span className="text-center text-tinyrack-2xs font-semibold text-base-content/70">
        {ratio.toFixed(1)}:1
      </span>
    </div>
  );
}

function RoleMap() {
  return (
    <details className="rounded-lg border border-base-300 bg-base-200/80 p-3.5 shadow-sm">
      <summary className="cursor-pointer text-tinyrack-md font-semibold">
        Core role map
      </summary>
      <p className="mt-3 mb-3 leading-tinyrack-md text-base-content/70">
        Use these roles in product examples and custom surfaces. They keep the palette
        stable when the active theme changes.
      </p>
      <div className="overflow-auto rounded-lg border border-base-300">
        <table className="w-full min-w-[44rem] border-collapse">
          <thead>
            <tr>
              {['Role', 'Use for', 'Variable'].map((column) => (
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
            {coreTokens.map((token) => (
              <tr key={token.name}>
                <td className="border-b border-base-300 px-2.5 py-2 align-top">
                  <code className="text-base-content">{token.name}</code>
                </td>
                <td className="border-b border-base-300 px-2.5 py-2 align-top leading-tinyrack-md text-base-content/70">
                  {token.purpose}
                </td>
                <td className="border-b border-base-300 px-2.5 py-2 align-top">
                  <code className="text-tinyrack-xs text-primary [overflow-wrap:anywhere]">
                    {semanticTokenCssVariables[token.name]}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function AdapterPairs() {
  return (
    <details className="rounded-lg border border-base-300 bg-base-200/80 p-3.5 shadow-sm">
      <summary className="cursor-pointer text-tinyrack-md font-semibold">
        Adapter fill/content pairs
      </summary>
      <p className="mt-3 mb-3 leading-tinyrack-md text-base-content/70">
        daisyUI and Mantine need paired colors for filled tones. These are useful for
        component adapters, not as the main product palette.
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        {(['light', 'dark'] as const).map((mode) => (
          <section className="grid gap-2" key={mode}>
            <h3 className="m-0 text-tinyrack-sm font-semibold capitalize text-base-content">
              {mode}
            </h3>
            <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(6.75rem,1fr))]">
              {contentPairs.map((tone) => (
                <TonePair key={`${mode}-${tone}`} mode={mode} tone={tone} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}

function ExportedSemanticVariables() {
  return (
    <details className="rounded-lg border border-base-300 bg-base-200/80 p-3.5 shadow-sm">
      <summary className="cursor-pointer text-tinyrack-md font-semibold">
        All exported semantic variables
      </summary>
      <p className="mt-3 mb-3 leading-tinyrack-md text-base-content/70">
        This is the generated CSS/API surface. It includes core roles, adapter pairs,
        surface helpers, and a background alias.
      </p>
      <div className="overflow-auto rounded-lg border border-base-300">
        <table className="w-full min-w-[48rem] border-collapse">
          <thead>
            <tr>
              {['Token', 'CSS variable', 'Light', 'Dark'].map((column) => (
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
            {exportedSemanticTokens.map((name) => (
              <tr key={name}>
                <td className="border-b border-base-300 px-2.5 py-2 align-top">
                  <code className="text-base-content">{name}</code>
                </td>
                <td className="border-b border-base-300 px-2.5 py-2 align-top">
                  <code className="text-tinyrack-xs text-primary [overflow-wrap:anywhere]">
                    {semanticTokenCssVariables[name]}
                  </code>
                </td>
                <td className="border-b border-base-300 px-2.5 py-2 align-top">
                  <ColorValue value={tinyrackSemanticColors.light[name]} />
                </td>
                <td className="border-b border-base-300 px-2.5 py-2 align-top">
                  <ColorValue value={tinyrackSemanticColors.dark[name]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function RawPaletteAppendix() {
  return (
    <details className="rounded-lg border border-base-300 bg-base-200/80 p-3.5 shadow-sm">
      <summary className="cursor-pointer text-tinyrack-md font-semibold">
        Raw palette appendix
      </summary>
      <p className="mt-3 mb-3 leading-tinyrack-md text-base-content/70">
        Raw palettes are source ingredients for adapters and generated CSS. Product UI
        should start from semantic roles instead.
      </p>
      <div className="grid gap-4">
        {Object.entries(tinyrackPalettes).map(([name, scale]) => (
          <section className="grid gap-2" key={name}>
            <div className="flex min-w-0 items-center justify-between gap-2">
              <strong className="text-base-content">{name}</strong>
              <span className="text-tinyrack-xs text-base-content/60">
                {Object.keys(scale).length} steps
              </span>
            </div>
            <div className="overflow-auto pb-1">
              <PaletteStrip scale={scale} />
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}

function ImplementationAppendix() {
  return (
    <div className="grid gap-3">
      <RoleMap />
      <AdapterPairs />
      <ExportedSemanticVariables />
      <RawPaletteAppendix />
    </div>
  );
}

function ColorsPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Colors"
      description="A compact palette reference for Tinyrack's quiet neutral interface and sparse operational signals."
    >
      <PaletteOverview />
      <DocsGrid>
        <InterfacePalette />
        <SignalPalette />
      </DocsGrid>
      <ImplementationAppendix />
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
