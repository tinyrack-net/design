import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackRadii } from '../../src/tokens/index.js';
import { DocsCard, DocsGrid, DocsPage, TokenTable } from '../docs-components.js';

function RadiusPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Radius"
      description="Radius tokens soften dark interfaces without making controls feel playful or inflated."
    >
      <DocsGrid>
        {Object.entries(tinyrackRadii).map(([name, value]) => (
          <div
            className="tinyrack-docs-radius"
            key={name}
            style={{ borderRadius: value }}
          >
            <strong>{name}</strong>
            <code>{value}</code>
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
