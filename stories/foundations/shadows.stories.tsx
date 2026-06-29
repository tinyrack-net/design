import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackShadows } from '../../src/tokens/index.js';
import { DocsCard, DocsGrid, DocsPage, TokenTable } from '../docs-components.js';

function ShadowsPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Shadows"
      description="Shadows create separation on near-black surfaces with a subtle light edge rather than bright elevation effects."
    >
      <DocsGrid>
        {Object.entries(tinyrackShadows).map(([name, value]) => (
          <div className="tinyrack-docs-shadow" key={name} style={{ boxShadow: value }}>
            <strong>{name}</strong>
            <code>{value}</code>
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
