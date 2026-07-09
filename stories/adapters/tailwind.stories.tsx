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
      eyebrow="CSS"
      title="Tailwind"
      description="Use the Tailwind CSS export as the base token bridge for Tinyrack product surfaces."
    >
      <DocsSection title="Use this when">
        <DocsTable
          columns={['Need', 'CSS entry', 'Notes']}
          rows={[
            [
              'Tailwind token utilities only',
              '@tinyrack/ui/core/core.css',
              'Generates Tinyrack token utilities without component CSS.',
            ],
            [
              'Button component CSS',
              '@tinyrack/ui/components/button/button.css',
              'Adds only the Button contract; import after the core token base.',
            ],
          ]}
        />
      </DocsSection>

      <DocsGrid>
        <DocsCard title="Token-only CSS entry">
          <CodeSnippet>{`pnpm add @tinyrack/ui

@import "tailwindcss";
@import '@tinyrack/ui/core/core.css';`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Button CSS composition">
          <CodeSnippet>{`@import '@tinyrack/ui/core/core.css';
@import '@tinyrack/ui/components/button/button.css';

<button class="tr-btn" data-size="md" data-variant="primary" data-appearance="solid">
  Deploy
</button>`}</CodeSnippet>
        </DocsCard>
      </DocsGrid>

      <DocsGrid>
        <DocsCard title="Use for">
          <GuidanceList
            items={[
              'Shared CSS custom properties for Tinyrack color and rhythm.',
              'Stable token utilities for SSR, SSG, and app surfaces.',
              'Explicit tinyrack-dark or tinyrack-light surfaces through data-theme.',
              'Component CSS composed only when the consuming app imports it.',
            ]}
          />
        </DocsCard>
        <DocsCard title="Verify">
          <GuidanceList
            items={[
              'Confirm Tailwind generates bg-tinyrack-surface, text-tinyrack-primary, and rounded-tinyrack-box.',
              'Confirm component CSS imports load after Tinyrack core CSS.',
              'Confirm Button variants render through tr-btn data attributes.',
            ]}
          />
        </DocsCard>
      </DocsGrid>

      <DocsCallout title="Composition rule">
        The core token base does not include component CSS. Import each component domain
        explicitly so application assembly stays visible.
      </DocsCallout>
    </DocsPage>
  );
}

const meta = {
  title: 'CSS/Tailwind',
  component: TailwindPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TailwindPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
