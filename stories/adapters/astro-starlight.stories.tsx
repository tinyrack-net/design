import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CodeSnippet,
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
} from '../docs-components.js';

function AstroStarlightPage() {
  return (
    <DocsPage
      eyebrow="Adapters"
      title="Astro Starlight"
      description="The Starlight adapter brings Tinyrack tone to documentation while preserving Starlight navigation and content conventions."
    >
      <DocsGrid>
        <DocsCard title="Theme CSS">
          <CodeSnippet>{`// astro.config.mjs
import '@tinyrack/themes/astro/starlight.css';`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Guidance">
          <GuidanceList
            items={[
              'Keep docs pages direct: explain what to install, when to use it, and why.',
              'Use code blocks sparingly and keep snippets short enough to scan.',
              'Let Starlight own navigation; let Tinyrack own color, type, and rhythm.',
            ]}
          />
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

const meta = {
  title: 'Adapters/Astro Starlight',
  component: AstroStarlightPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AstroStarlightPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
