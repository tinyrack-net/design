import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackPalettes, tinyrackSemanticColors } from '../../src/tokens/index.js';
import { DocsCard, DocsGrid, DocsPage, TokenTable } from '../docs-components.js';

const colorSwatchClasses: Record<string, string> = {
  '#ffffff': 'bg-[#ffffff]',
  '#fafafa': 'bg-[#fafafa]',
  '#f5f5f5': 'bg-[#f5f5f5]',
  '#e5e5e5': 'bg-[#e5e5e5]',
  '#d4d4d4': 'bg-[#d4d4d4]',
  '#a3a3a3': 'bg-[#a3a3a3]',
  '#737373': 'bg-[#737373]',
  '#525252': 'bg-[#525252]',
  '#404040': 'bg-[#404040]',
  '#262626': 'bg-[#262626]',
  '#171717': 'bg-[#171717]',
  '#0a0a0a': 'bg-[#0a0a0a]',
  '#030303': 'bg-[#030303]',
  '#f4f4f5': 'bg-[#f4f4f5]',
  '#e4e4e7': 'bg-[#e4e4e7]',
  '#d4d4d8': 'bg-[#d4d4d8]',
  '#a1a1aa': 'bg-[#a1a1aa]',
  '#71717a': 'bg-[#71717a]',
  '#52525b': 'bg-[#52525b]',
  '#3f3f46': 'bg-[#3f3f46]',
  '#27272a': 'bg-[#27272a]',
  '#18181b': 'bg-[#18181b]',
  '#09090b': 'bg-[#09090b]',
  '#22c55e': 'bg-[#22c55e]',
  '#15803d': 'bg-[#15803d]',
  '#eab308': 'bg-[#eab308]',
  '#a16207': 'bg-[#a16207]',
  '#f87171': 'bg-[#f87171]',
  '#dc2626': 'bg-[#dc2626]',
};

function ColorsPage() {
  const semanticItems = Object.entries(tinyrackSemanticColors.dark).map(
    ([name, value]) => ({ name, value }),
  );

  return (
    <DocsPage
      eyebrow="Foundations"
      title="Colors"
      description="Tinyrack color is anchored in black neutral surfaces, achromatic primary actions, and sparse semantic accents."
    >
      <DocsGrid>
        {Object.entries(tinyrackPalettes).map(([paletteName, scale]) => (
          <DocsCard key={paletteName} title={paletteName}>
            <div className="grid gap-2">
              {Object.entries(scale).map(([step, value]) => (
                <div
                  className="grid min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] p-2 [grid-template-columns:auto_minmax(5rem,0.7fr)_minmax(8rem,1fr)] max-md:grid-cols-1"
                  key={step}
                >
                  <span
                    className={`h-7 w-7 rounded border border-white/20 ${
                      colorSwatchClasses[value]
                    }`}
                  />
                  <strong>{step}</strong>
                  <code className="text-[0.78rem] text-primary [overflow-wrap:anywhere]">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          </DocsCard>
        ))}
      </DocsGrid>
      <DocsCard title="Dark semantic aliases">
        <TokenTable items={semanticItems} />
      </DocsCard>
    </DocsPage>
  );
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorsPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColorsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
