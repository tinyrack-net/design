import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackPalettes, tinyrackSemanticColors } from '../../src/tokens/index.js';
import { DocsCard, DocsGrid, DocsPage, TokenTable } from '../docs-components.js';

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
            <div className="tinyrack-docs-swatches">
              {Object.entries(scale).map(([step, value]) => (
                <div className="tinyrack-docs-swatch" key={step}>
                  <span style={{ background: value }} />
                  <strong>{step}</strong>
                  <code>{value}</code>
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
