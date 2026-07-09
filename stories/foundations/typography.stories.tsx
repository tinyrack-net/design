import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackTypography } from '../../src/core/index.js';
import { CodeSnippet, DocsCard, DocsGrid, DocsPage } from '../docs-components.js';

type TypographyRole = keyof typeof tinyrackTypography.textStyle;
type FontSizeName = keyof typeof tinyrackTypography.fontSize;
type LineHeightName = keyof typeof tinyrackTypography.lineHeight;
type LetterSpacingName = keyof typeof tinyrackTypography.letterSpacing;

type RoleSpec = {
  label: string;
  sample: string;
  use: string;
  className: string;
};

const roleOrder: TypographyRole[] = [
  'display',
  'headingLg',
  'headingMd',
  'headingSm',
  'body',
  'bodySm',
  'caption',
  'label',
  'code',
];

const roleSpecs: Record<TypographyRole, RoleSpec> = {
  display: {
    label: 'Display',
    sample: 'Rack overview',
    use: 'One major page title or high-level docs entry point.',
    className: 'text-tinyrack-5xl leading-tinyrack-sm font-semibold',
  },
  headingLg: {
    label: 'Heading large',
    sample: 'Release command center',
    use: 'Top-level product sections and dense dashboard groups.',
    className: 'text-tinyrack-3xl leading-tinyrack-sm font-semibold',
  },
  headingMd: {
    label: 'Heading medium',
    sample: 'Service health',
    use: 'Card titles, settings groups, and docs subsections.',
    className: 'text-tinyrack-2xl leading-tinyrack-sm font-semibold',
  },
  headingSm: {
    label: 'Heading small',
    sample: 'Node activity',
    use: 'Compact panel headings where the surrounding UI is already dense.',
    className: 'text-tinyrack-lg leading-tinyrack-sm font-semibold',
  },
  body: {
    label: 'Body',
    sample: 'The deployment window is open and all nodes are reporting normally.',
    use: 'Default reading text, form copy, and operational explanations.',
    className: 'text-tinyrack-md leading-tinyrack-md',
  },
  bodySm: {
    label: 'Body small',
    sample: 'Last backup completed at 03:18 KST with no skipped volumes.',
    use: 'Dense panels, table cells, helper text, and secondary summaries.',
    className: 'text-tinyrack-sm leading-tinyrack-md',
  },
  caption: {
    label: 'Caption',
    sample: 'Updated 18 seconds ago',
    use: 'Timestamps, minor metadata, and low-emphasis supporting details.',
    className: 'text-tinyrack-xs leading-tinyrack-sm',
  },
  label: {
    label: 'Label',
    sample: 'ACTIVE NODES',
    use: 'Short uppercase labels, status eyebrows, and compact field labels.',
    className:
      'text-tinyrack-xs leading-tinyrack-xs font-extrabold tracking-tinyrack-lg text-tinyrack-primary uppercase',
  },
  code: {
    label: 'Code',
    sample: 'pnpm verify:release --filter @tinyrack/ui',
    use: 'Commands, log fragments, package names, and terse config values.',
    className:
      'font-tinyrack-mono text-tinyrack-sm leading-tinyrack-lg text-tinyrack-text',
  },
};

const scaleUses: Partial<Record<FontSizeName, string>> = {
  '2xs': 'micro labels, tiny badges',
  xs: 'caption, label',
  sm: 'dense body, table text',
  md: 'default body',
  lg: 'small heading',
  xl: 'inline emphasis',
  '2xl': 'medium heading',
  '3xl': 'large heading',
  '4xl': 'docs hero title',
  '5xl': 'display title',
};

const lineHeightUses: Record<LineHeightName, string> = {
  xs: 'single-line labels',
  sm: 'headings',
  md: 'default reading',
  lg: 'code and narrow columns',
  xl: 'long-form prose',
};

const trackingUses: Record<LetterSpacingName, string> = {
  none: 'body and headings',
  sm: 'small metadata',
  md: 'quiet uppercase labels',
  lg: 'primary labels',
  xl: 'eyebrows and navigation markers',
};

const languageSamples = [
  {
    lang: 'en',
    label: 'English',
    copy: 'Operate small systems with clear status, compact controls, and durable defaults.',
  },
  {
    lang: 'ko',
    label: 'Korean',
    copy: '작은 랙의 상태를 빠르게 확인하고, 필요한 조치만 정확하게 실행합니다.',
  },
  {
    lang: 'ja',
    label: 'Japanese',
    copy: '小さなラックの状態を素早く確認し、必要な操作だけを正確に実行します。',
  },
];

const adapterExamples = [
  {
    title: 'Tailwind CSS',
    code: '<p className="font-tinyrack-body text-tinyrack-md leading-tinyrack-md tracking-tinyrack-none" />',
  },
  {
    title: 'Button CSS',
    code: '<button className="tr-btn" data-size="md" data-variant="primary" data-appearance="solid" />',
  },
  {
    title: 'React Button',
    code: 'import { Button } from "@tinyrack/ui/components/button/react";',
  },
];

const fontImportExample = `@font-face {
  font-family: "IBM Plex Sans";
  src: url("/fonts/ibm-plex-sans.woff2") format("woff2");
  font-display: swap;
}`;

function roleRecipe(role: TypographyRole) {
  const style = tinyrackTypography.textStyle[role];

  return `${style.fontSize} / ${style.lineHeight} / ${style.letterSpacing}`;
}

function TypographyPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Typography"
      description="Tinyrack typography keeps dense homelab interfaces readable with one IBM Plex Sans stack and named text roles."
    >
      <section className="grid gap-3 rounded-lg border border-tinyrack-border bg-tinyrack-surface-muted/80 p-3.5 shadow-sm">
        <div className="grid gap-2 md:grid-cols-[minmax(0,0.85fr)_minmax(18rem,0.5fr)] md:items-end">
          <div className="grid gap-2">
            <p className={roleSpecs.label.className}>TYPE ROLES</p>
            <h2 className="m-0 text-tinyrack-3xl leading-tinyrack-sm font-semibold text-balance">
              Use roles first, raw values last.
            </h2>
            <p className="m-0 max-w-[46rem] text-tinyrack-md leading-tinyrack-md text-tinyrack-text/70">
              The role names describe intent in the interface. The scale values remain
              available for adapters and one-off composition, but product surfaces
              should start from these role pairings.
            </p>
          </div>
          <div className="grid gap-1 rounded-md border border-white/10 bg-white/[0.035] p-3">
            <span className="text-tinyrack-xs leading-tinyrack-sm text-tinyrack-text/60">
              Base stack
            </span>
            <strong className="text-tinyrack-lg leading-tinyrack-sm">
              IBM Plex Sans
            </strong>
            <code className="text-tinyrack-xs leading-tinyrack-md text-tinyrack-primary [overflow-wrap:anywhere]">
              font-tinyrack-body / heading / mono
            </code>
          </div>
        </div>

        <div className="grid gap-2">
          {roleOrder.map((role) => {
            const spec = roleSpecs[role];

            return (
              <div
                className="grid min-w-0 gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3 [grid-template-columns:minmax(9rem,0.34fr)_minmax(14rem,0.8fr)_minmax(16rem,1fr)] max-lg:grid-cols-1"
                key={role}
              >
                <div className="grid content-start gap-1">
                  <strong className="text-tinyrack-sm leading-tinyrack-sm">
                    {spec.label}
                  </strong>
                  <code className="text-tinyrack-2xs leading-tinyrack-md text-tinyrack-primary [overflow-wrap:anywhere]">
                    {roleRecipe(role)}
                  </code>
                </div>
                <p className={`m-0 min-w-0 [overflow-wrap:anywhere] ${spec.className}`}>
                  {spec.sample}
                </p>
                <p className="m-0 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text/70">
                  {spec.use}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <DocsCard title="Interface rhythm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)]">
          <section className="grid min-w-0 gap-3 rounded-md border border-white/10 bg-tinyrack-surface p-3">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className={roleSpecs.label.className}>RACK A</p>
                <h3 className="m-0 text-tinyrack-2xl leading-tinyrack-sm font-semibold">
                  Service health
                </h3>
                <p className="m-0 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text/65">
                  Compact status should scan before it asks the operator to read.
                </p>
              </div>
              <span className="rounded-md border border-tinyrack-primary/40 bg-tinyrack-primary/10 px-2 py-1 text-tinyrack-xs leading-tinyrack-xs font-bold text-tinyrack-primary">
                nominal
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ['Nodes', '12', 'all online'],
                ['Load', '41%', 'steady'],
                ['Backups', '03:18', 'last complete'],
              ].map(([label, value, note]) => (
                <div
                  className="grid min-w-0 gap-1 rounded-md border border-white/10 bg-white/[0.035] p-2.5"
                  key={label}
                >
                  <span className="text-tinyrack-xs leading-tinyrack-xs font-extrabold tracking-tinyrack-lg text-tinyrack-text/55 uppercase">
                    {label}
                  </span>
                  <strong className="text-tinyrack-3xl leading-tinyrack-sm font-semibold">
                    {value}
                  </strong>
                  <span className="text-tinyrack-xs leading-tinyrack-sm text-tinyrack-text/60">
                    {note}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid gap-2 rounded-md border border-white/10 bg-tinyrack-surface-muted p-3">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                <strong className="text-tinyrack-sm leading-tinyrack-sm">
                  Activity
                </strong>
                <span className="text-tinyrack-xs leading-tinyrack-sm text-tinyrack-text/55">
                  18 seconds ago
                </span>
              </div>
              <code className="font-tinyrack-mono text-tinyrack-sm leading-tinyrack-lg text-tinyrack-text/80 [overflow-wrap:anywhere]">
                deploy:edge accepted --target rack-a --window guarded
              </code>
            </div>
          </section>

          <div className="grid content-start gap-2">
            <h3 className="m-0 text-tinyrack-lg leading-tinyrack-sm font-semibold">
              Reading order
            </h3>
            {[
              'Use label for terse context, then heading for the object being inspected.',
              'Keep body text at md/1.5 when it carries meaning, sm/1.5 when it supports dense controls.',
              'Use large numerals sparingly; the status word and muted caption should carry the rest of the story.',
            ].map((item) => (
              <p
                className="m-0 rounded-md border border-white/10 bg-white/[0.035] p-2.5 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text/70"
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </DocsCard>

      <DocsCard title="Scale reference">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.56fr)]">
          <div className="overflow-auto rounded-md border border-tinyrack-border">
            <table className="w-full min-w-[44rem] border-collapse">
              <thead>
                <tr>
                  {['Token', 'Value', 'Utility', 'Primary use'].map((column) => (
                    <th
                      className="border-b border-tinyrack-border bg-tinyrack-surface-muted px-2.5 py-2 text-left text-tinyrack-xs leading-tinyrack-xs font-extrabold tracking-tinyrack-md text-tinyrack-text/65 uppercase"
                      key={column}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(tinyrackTypography.fontSize).map(([name, value]) => {
                  const tokenName = name as FontSizeName;

                  return (
                    <tr key={name}>
                      <td className="border-b border-tinyrack-border px-2.5 py-2 text-tinyrack-sm leading-tinyrack-md font-semibold">
                        {name}
                      </td>
                      <td className="border-b border-tinyrack-border px-2.5 py-2 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text/70">
                        {value}
                      </td>
                      <td className="border-b border-tinyrack-border px-2.5 py-2">
                        <code className="text-tinyrack-xs leading-tinyrack-md text-tinyrack-primary">
                          text-tinyrack-{name}
                        </code>
                      </td>
                      <td className="border-b border-tinyrack-border px-2.5 py-2 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text/70">
                        {scaleUses[tokenName]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-2">
            <ScaleMiniTable
              heading="Line height"
              items={Object.entries(tinyrackTypography.lineHeight).map(
                ([name, value]) => ({
                  name,
                  value,
                  utility: `leading-tinyrack-${name}`,
                  use: lineHeightUses[name as LineHeightName],
                }),
              )}
            />
            <ScaleMiniTable
              heading="Letter spacing"
              items={Object.entries(tinyrackTypography.letterSpacing).map(
                ([name, value]) => ({
                  name,
                  value,
                  utility: `tracking-tinyrack-${name}`,
                  use: trackingUses[name as LetterSpacingName],
                }),
              )}
            />
          </div>
        </div>
      </DocsCard>

      <DocsGrid>
        <DocsCard title="Multilingual fit">
          <div className="grid gap-2">
            {languageSamples.map((sample) => (
              <div
                className="grid min-w-0 gap-1 rounded-md border border-white/10 bg-white/[0.035] p-3 font-tinyrack-body"
                key={sample.lang}
                lang={sample.lang}
              >
                <strong className="text-tinyrack-xs leading-tinyrack-xs font-extrabold tracking-tinyrack-lg text-tinyrack-primary uppercase">
                  {sample.label}
                </strong>
                <p className="m-0 text-tinyrack-md leading-tinyrack-md text-tinyrack-text [overflow-wrap:anywhere]">
                  {sample.copy}
                </p>
              </div>
            ))}
            <p className="m-0 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text/70">
              Use <code>lang</code> for document semantics. Keep glyph coverage under
              the same IBM Plex Sans family name so language changes do not change the
              interface voice.
            </p>
          </div>
        </DocsCard>

        <DocsCard title="Implementation">
          <div className="grid gap-3">
            <CodeSnippet>{fontImportExample}</CodeSnippet>
            <div className="grid gap-2">
              {adapterExamples.map((example) => (
                <div
                  className="grid gap-1 rounded-md border border-white/10 bg-white/[0.035] p-2.5"
                  key={example.title}
                >
                  <strong className="text-tinyrack-sm leading-tinyrack-sm">
                    {example.title}
                  </strong>
                  <code className="text-tinyrack-xs leading-tinyrack-md text-tinyrack-primary [overflow-wrap:anywhere]">
                    {example.code}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

function ScaleMiniTable({
  heading,
  items,
}: {
  heading: string;
  items: Array<{ name: string; value: string; utility: string; use: string }>;
}) {
  return (
    <section className="grid gap-2 rounded-md border border-white/10 bg-white/[0.035] p-3">
      <h3 className="m-0 text-tinyrack-sm leading-tinyrack-sm font-semibold">
        {heading}
      </h3>
      <div className="grid gap-1.5">
        {items.map((item) => (
          <div
            className="grid min-w-0 gap-1 rounded border border-white/10 bg-tinyrack-surface/45 p-2"
            key={item.name}
          >
            <div className="flex min-w-0 flex-wrap items-baseline gap-2">
              <strong className="text-tinyrack-sm leading-tinyrack-sm">
                {item.name}
              </strong>
              <span className="text-tinyrack-xs leading-tinyrack-sm text-tinyrack-text/55">
                {item.value}
              </span>
            </div>
            <code className="text-tinyrack-2xs leading-tinyrack-md text-tinyrack-primary [overflow-wrap:anywhere]">
              {item.utility}
            </code>
            <span className="text-tinyrack-xs leading-tinyrack-sm text-tinyrack-text/65">
              {item.use}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: 'Foundations/Typography',
  component: TypographyPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TypographyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
