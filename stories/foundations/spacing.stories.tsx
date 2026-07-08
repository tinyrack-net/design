import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackSpacing } from '../../src/exports/tokens.js';
import { DocsCard, DocsPage, TokenTable } from '../docs-components.js';

const spacingPreviewClasses: Record<string, string> = {
  xs: 'w-1',
  sm: 'w-2',
  md: 'w-3',
  lg: 'w-4',
  xl: 'w-6',
  '2xl': 'w-8',
};

function SpacingPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Spacing"
      description="Spacing is intentionally compact: enough room for dense tools, enough rhythm for calm review."
    >
      <DocsCard title="Scale">
        <div className="grid gap-2">
          {Object.entries(tinyrackSpacing).map(([name, value]) => (
            <div
              className="grid min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] p-2 [grid-template-columns:auto_minmax(5rem,0.7fr)_minmax(8rem,1fr)] max-md:grid-cols-1"
              key={name}
            >
              <span
                className={`h-2 rounded bg-primary ${spacingPreviewClasses[name]}`}
              />
              <strong>{name}</strong>
              <code className="text-tinyrack-xs text-primary [overflow-wrap:anywhere]">
                {value}
              </code>
            </div>
          ))}
        </div>
      </DocsCard>
      <DocsCard title="Token values">
        <TokenTable
          items={Object.entries(tinyrackSpacing).map(([name, value]) =>
            name === 'md'
              ? { name, value, note: 'Default inline rhythm' }
              : { name, value },
          )}
        />
      </DocsCard>
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
