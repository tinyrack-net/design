import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackSemanticColors } from '../../src/tokens/index.js';

function ColorGrid() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {Object.entries(tinyrackSemanticColors).map(([mode, colors]) => (
        <section key={mode}>
          <h2>{mode}</h2>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
          >
            {Object.entries(colors).map(([name, value]) => (
              <div
                key={name}
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <div style={{ height: 72, background: value }} />
                <div style={{ padding: 8 }}>
                  <strong>{name}</strong>
                  <br />
                  <code>{value}</code>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Tokens/Colors',
  component: ColorGrid,
} satisfies Meta<typeof ColorGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colors: Story = {};
