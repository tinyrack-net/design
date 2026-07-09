import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CodeSnippet,
  DocsCallout,
  DocsCard,
  DocsGrid,
  DocsPage,
  DocsSection,
  DocsTable,
  GuidanceList,
} from '../docs-components.js';

function TailwindPage() {
  return (
    <DocsPage
      eyebrow="Adapters"
      title="Tailwind"
      description="Use the Tailwind CSS export as the base token bridge for product sites and framework adapters."
    >
      <DocsSection title="Use this when">
        <DocsTable
          columns={['Environment', 'CSS entry', 'Notes']}
          rows={[
            [
              'Tailwind CSS 4 only',
              '@tinyrack/themes/tailwind.css',
              'Generates Tinyrack token utilities without component-library assumptions.',
            ],
            [
              'Tailwind CSS 4 + daisyUI',
              '@tinyrack/themes/tailwind/daisyui.css',
              'Preferred combined entry when daisyUI owns component classes.',
            ],
            [
              'Tailwind CSS 4 + Mantine',
              '@tinyrack/themes/tailwind/mantine.css',
              'Shares Tinyrack variables around Mantine surfaces; Mantine still needs a provider.',
            ],
          ]}
        />
      </DocsSection>

      <DocsGrid>
        <DocsCard title="Token-only CSS entry">
          <CodeSnippet>{`pnpm add @tinyrack/themes

@import "tailwindcss";
@import '@tinyrack/themes/tailwind.css';`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Available utility examples">
          <CodeSnippet>{`<section
  data-theme="tinyrack-dark"
  class="bg-tinyrack-surface text-tinyrack-text rounded-tinyrack-box"
>
  <h1 class="font-tinyrack-heading text-tinyrack-primary">
    Tinyrack
  </h1>
</section>`}</CodeSnippet>
        </DocsCard>
      </DocsGrid>

      <DocsGrid>
        <DocsCard title="Use for">
          <GuidanceList
            items={[
              'Shared CSS custom properties for Tinyrack color and rhythm.',
              'A stable base before applying daisyUI or app-specific utilities.',
              'Explicit tinyrack-dark or tinyrack-light surfaces through data-theme.',
            ]}
          />
        </DocsCard>
        <DocsCard title="Verify">
          <GuidanceList
            items={[
              'Confirm Tailwind generates bg-tinyrack-surface, text-tinyrack-primary, and rounded-tinyrack-box.',
              'Confirm app-local overrides load after Tinyrack theme CSS.',
              'Use foundations and component pages for token density and contrast review.',
            ]}
          />
        </DocsCard>
      </DocsGrid>

      <DocsCallout title="Composition rule">
        Do not import multiple combined presets in the same CSS file. If an app needs
        Tailwind utilities, daisyUI, and Mantine together, use explicit composition from
        the daisyUI adapter guide.
      </DocsCallout>
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
