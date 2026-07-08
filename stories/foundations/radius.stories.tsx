import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackRadii } from '../../src/exports/tokens.js';
import { DocsCard, DocsGrid, DocsPage, TokenTable } from '../docs-components.js';

const radiusPreviewClasses: Record<string, string> = {
  xs: 'rounded-[0.125rem]',
  sm: 'rounded-[0.25rem]',
  md: 'rounded-[0.375rem]',
  lg: 'rounded-[0.5rem]',
  xl: 'rounded-[0.75rem]',
  full: 'rounded-full',
};

function RadiusPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Radius"
      description="Radius tokens keep dark interfaces angular, compact, and close to native shadcn density."
    >
      <DocsGrid>
        {Object.entries(tinyrackRadii).map(([name, value]) => (
          <div
            className={`grid min-h-24 min-w-0 items-start gap-3 border border-base-300 bg-base-200/80 p-3.5 shadow-sm ${
              radiusPreviewClasses[name]
            }`}
            key={name}
          >
            <strong>{name}</strong>
            <code className="text-tinyrack-xs text-primary [overflow-wrap:anywhere]">
              {value}
            </code>
          </div>
        ))}
      </DocsGrid>
      <DocsCard title="Token values">
        <TokenTable
          items={Object.entries(tinyrackRadii).map(([name, value]) => ({
            name,
            value,
          }))}
        />
      </DocsCard>
    </DocsPage>
  );
}

const meta = {
  title: 'Foundations/Radius',
  component: RadiusPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof RadiusPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
