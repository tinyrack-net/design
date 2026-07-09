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
} from './docs-components.js';

function WelcomePage() {
  return (
    <DocsPage
      eyebrow="Start here"
      title="Tinyrack UI"
      description="CSS-first tokens and directly owned components for compact Tinyrack product surfaces."
    >
      <section data-storybook-welcome="true">
        <DocsGrid>
          <DocsCard title="What this package is">
            <GuidanceList
              items={[
                'Design tokens for color, typography, spacing, and radius.',
                'Tailwind CSS 4 token utilities for product surfaces.',
                'A small component contract starting with Button.',
              ]}
            />
          </DocsCard>
          <DocsCard title="What this package is not">
            <GuidanceList
              items={[
                'It is not a wrapper around another component system.',
                'It does not ship framework adapter galleries.',
                'It does not expose React components from the root package export.',
              ]}
            />
          </DocsCard>
        </DocsGrid>
      </section>

      <DocsSection title="Recommended route">
        <DocsTable
          columns={['Need', 'Start with', 'Then verify']}
          rows={[
            [
              'CSS-only product surface',
              '@tinyrack/ui/core/core.css + component CSS',
              'data-theme plus tr-btn markup',
            ],
            [
              'React Button',
              '@tinyrack/ui/components/button/react',
              'Components / Button',
            ],
            [
              'Raw token inspection',
              '@tinyrack/ui/core',
              'Colors, Typography, Spacing, Radius, and Shadows',
            ],
          ]}
        />
      </DocsSection>

      <DocsGrid>
        <DocsCard title="Install">
          <CodeSnippet>{`pnpm add @tinyrack/ui`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Review locally">
          <CodeSnippet>{`pnpm storybook
pnpm storybook:build`}</CodeSnippet>
        </DocsCard>
      </DocsGrid>

      <DocsCallout title="Decision rule">
        Compose CSS explicitly. Core tokens come from `@tinyrack/ui/core/core.css`;
        Button styles come from `@tinyrack/ui/components/button/button.css`.
      </DocsCallout>
    </DocsPage>
  );
}

const meta = {
  title: 'Welcome/Start Here',
  component: WelcomePage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof WelcomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
