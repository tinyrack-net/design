import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackSpacing } from '../../src/tokens/index.js';
import { DocsCard, DocsPage, TokenTable } from '../docs-components.js';

function SpacingPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Spacing"
      description="Spacing is intentionally compact: enough room for dense tools, enough rhythm for calm review."
    >
      <DocsCard title="Scale">
        <div className="tinyrack-docs-scale">
          {Object.entries(tinyrackSpacing).map(([name, value]) => (
            <div key={name}>
              <span style={{ width: value }} />
              <strong>{name}</strong>
              <code>{value}</code>
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
