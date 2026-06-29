import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackTypography } from '../../src/tokens/index.js';
import { DocsCard, DocsGrid, DocsPage, TokenTable } from '../docs-components.js';

function TypographyPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Typography"
      description="Typography favors system reliability, crisp headings, readable body copy, and a dependable mono stack for code-heavy products."
    >
      <DocsGrid>
        <DocsCard title="Voice sample">
          <div className="tinyrack-docs-type-sample">
            <h2>Operate small systems with confidence.</h2>
            <p>
              Use direct labels, compact paragraphs, and restrained hierarchy. The UI
              should read like infrastructure: precise, calm, and easy to scan.
            </p>
            <code>pnpm add @tinyrack/themes</code>
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
      <DocsGrid>
        <DocsCard title="Line height">
          <TokenTable
            items={Object.entries(tinyrackTypography.lineHeight).map(
              ([name, value]) => ({
                name,
                value,
              }),
            )}
          />
        </DocsCard>
        <DocsCard title="Letter spacing">
          <TokenTable
            items={Object.entries(tinyrackTypography.letterSpacing).map(
              ([name, value]) => ({ name, value }),
            )}
          />
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
