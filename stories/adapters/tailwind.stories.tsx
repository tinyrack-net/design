import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CodeSnippet,
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
} from '../docs-components.js';

function TailwindPage() {
  return (
    <DocsPage
      eyebrow="Adapters"
      title="Tailwind"
      description="Use the Tailwind CSS export as the base token bridge for product sites and framework adapters."
    >
      <DocsGrid>
        <DocsCard title="Install">
          <CodeSnippet>{`pnpm add @tinyrack/themes

@import '@tinyrack/themes/tailwind.css';`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Use for">
          <GuidanceList
            items={[
              'Shared CSS custom properties for Tinyrack color and rhythm.',
              'A stable base before applying daisyUI or app-specific utilities.',
              'Dark-first surfaces with light mode aliases available through theme data.',
            ]}
          />
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

const meta = {
  title: 'Adapters/Tailwind',
  component: TailwindPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TailwindPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
