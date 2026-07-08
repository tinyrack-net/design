import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackTypography } from '../../src/exports/tokens.js';
import {
  CodeSnippet,
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
  TokenTable,
} from '../docs-components.js';

const fontImportExample = `@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto-sans.woff2") format("woff2");
  font-display: swap;
}`;

const adapterExamples = [
  {
    name: 'Tailwind CSS',
    value:
      'font-tinyrack-body text-tinyrack-md leading-tinyrack-md tracking-tinyrack-none',
    note: 'Uses prefixed utilities generated from @tinyrack/themes/tailwind.css.',
  },
  {
    name: 'daisyUI',
    value: 'card bg-base-100 text-base-content text-tinyrack-md leading-tinyrack-md',
    note: 'Keep daisyUI component classes and add Tinyrack typography utilities.',
  },
  {
    name: 'Mantine',
    value: 'Text size="md" lh="md" / Title order={2}',
    note: 'Mapped through createTinyrackMantineTheme fontSizes and lineHeights.',
  },
  {
    name: 'Astro Starlight',
    value: '@tinyrack/themes/astro/starlight.css',
    note: 'Overrides Starlight font, text, heading, and line-height variables.',
  },
];

const languageSamples = [
  {
    lang: 'en',
    label: 'English',
    className: 'font-tinyrack-body',
    copy: 'Operate small systems with clear status, compact controls, and durable defaults.',
  },
  {
    lang: 'ko',
    label: 'Korean',
    className: 'font-tinyrack-body',
    copy: '작은 랙의 상태를 빠르게 확인하고, 필요한 조치만 정확하게 실행합니다.',
  },
  {
    lang: 'ja',
    label: 'Japanese',
    className: 'font-tinyrack-body',
    copy: '小さなラックの状態を素早く確認し、必要な操作だけを正確に実行します。',
  },
];

function tokenEntries(tokens: Record<string, string>, prefix: string) {
  return Object.entries(tokens).map(([name, value]) => ({
    name,
    value,
    note: `${prefix}-tinyrack-${name}`,
  }));
}

function textStyleEntries() {
  return Object.entries(tinyrackTypography.textStyle).map(([name, style]) => ({
    name,
    value: `text ${style.fontSize} / leading ${style.lineHeight} / tracking ${style.letterSpacing}`,
  }));
}

function TypographyPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Typography"
      description="Tinyrack typography uses one Noto Sans stack with named type scales across product surfaces."
    >
      <DocsGrid>
        <DocsCard title="Font strategy">
          <div className="grid gap-3">
            <p className="text-tinyrack-sm leading-tinyrack-md">
              Load Noto Sans before rendering the application. Tinyrack exposes one
              stack for body, heading, mono, Korean, and Japanese font utilities, and
              every glyph range should resolve through that same family name.
            </p>
            <CodeSnippet>{fontImportExample}</CodeSnippet>
            <GuidanceList
              items={[
                'Use lang attributes for document semantics, not font switching.',
                'Self-host every required glyph range under the same Noto Sans family name.',
                'Keep body, heading, mono, Korean, and Japanese utilities aligned through the exported tokens.',
              ]}
            />
          </div>
        </DocsCard>
        <DocsCard title="Font families">
          <TokenTable
            items={Object.entries(tinyrackTypography.fontFamily).map(
              ([name, value]) => ({
                name,
                value,
              }),
            )}
          />
        </DocsCard>
      </DocsGrid>

      <DocsCard title="Multilingual samples">
        <div className="grid gap-2">
          {languageSamples.map((sample) => (
            <div
              className={`grid min-w-0 gap-1 rounded-md border border-white/10 bg-white/[0.035] p-3 ${sample.className}`}
              key={sample.lang}
              lang={sample.lang}
            >
              <strong className="text-tinyrack-xs leading-tinyrack-xs tracking-tinyrack-lg text-primary uppercase">
                {sample.label}
              </strong>
              <p className="m-0 text-tinyrack-lg leading-tinyrack-md text-base-content">
                {sample.copy}
              </p>
            </div>
          ))}
        </div>
      </DocsCard>

      <DocsGrid>
        <DocsCard title="Font size">
          <TokenTable items={tokenEntries(tinyrackTypography.fontSize, 'text')} />
        </DocsCard>
        <DocsCard title="Line height">
          <TokenTable items={tokenEntries(tinyrackTypography.lineHeight, 'leading')} />
        </DocsCard>
        <DocsCard title="Letter spacing">
          <TokenTable
            items={tokenEntries(tinyrackTypography.letterSpacing, 'tracking')}
          />
        </DocsCard>
      </DocsGrid>

      <DocsGrid>
        <DocsCard title="Text styles">
          <TokenTable items={textStyleEntries()} />
        </DocsCard>
        <DocsCard title="Adapter usage">
          <TokenTable items={adapterExamples} />
        </DocsCard>
      </DocsGrid>
    </DocsPage>
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
