import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackShadows } from '../../src/tokens/index.js';
import { DocsCard, DocsGrid, DocsPage, TokenTable } from '../docs-components.js';

const shadowPreviewClasses: Record<string, string> = {
  sm: 'shadow-[0_1px_2px_rgb(0_0_0_/_0.18)]',
  md: 'shadow-[0_8px_20px_rgb(0_0_0_/_0.22)]',
  lg: 'shadow-[0_16px_40px_rgb(0_0_0_/_0.28)]',
  focus: 'shadow-[0_0_0_2px_rgb(163_163_163_/_0.42)]',
};

function ShadowsPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Shadows"
      description="Shadows create separation on near-black surfaces with a subtle light edge rather than bright elevation effects."
    >
      <DocsGrid>
        {Object.entries(tinyrackShadows).map(([name, value]) => (
          <div
            className={`grid min-h-24 min-w-0 items-start gap-3 rounded-lg border border-base-300 bg-base-200/80 p-3.5 ${
              shadowPreviewClasses[name]
            }`}
            key={name}
          >
            <strong>{name}</strong>
            <code className="text-[0.78rem] text-primary [overflow-wrap:anywhere]">
              {value}
            </code>
          </div>
        ))}
      </DocsGrid>
      <DocsCard title="Token values">
        <TokenTable
          items={Object.entries(tinyrackShadows).map(([name, value]) => ({
            name,
            value,
          }))}
        />
      </DocsCard>
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
