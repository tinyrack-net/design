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
      title="Tinyrack Themes"
      description="Shared brand tokens and framework adapters for compact homelab consoles, runbooks, and Storybook review surfaces."
    >
      <section data-storybook-welcome="true">
        <DocsGrid>
          <DocsCard title="What this package is">
            <GuidanceList
              items={[
                'Design tokens for color, typography, spacing, radius, shadow, and motion.',
                'Thin adapters for Tailwind CSS 4, daisyUI 5, Mantine 9, and Astro Starlight.',
                'A visual review surface for checking dense node, service, and runbook screens.',
              ]}
            />
          </DocsCard>
          <DocsCard title="What this package is not">
            <GuidanceList
              items={[
                'It is not a Tinyrack component library.',
                'It does not replace Mantine, daisyUI, Tailwind, or Starlight documentation.',
                'It should not hide product-specific UX decisions behind theme overrides.',
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
              'A homelab console built with Mantine',
              'Adapters / Mantine',
              'Demo / Mantine Product App and selected Mantine component pages',
            ],
            [
              'A Tailwind container surface with daisyUI classes',
              'Adapters / daisyUI',
              'Demo / daisyUI Product App and selected daisyUI component pages',
            ],
            [
              'A documentation site with Starlight',
              'Adapters / Astro Starlight',
              'Demo / Starlight Docs Site',
            ],
            [
              'Raw token inspection',
              'Foundations',
              'Colors, Typography, Spacing, Radius, and Shadows',
            ],
          ]}
        />
      </DocsSection>

      <DocsGrid>
        <DocsCard title="Install">
          <CodeSnippet>{`pnpm add @tinyrack/themes`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Review locally">
          <CodeSnippet>{`pnpm storybook
pnpm storybook:build
pnpm storybook:audit`}</CodeSnippet>
        </DocsCard>
      </DocsGrid>

      <DocsCallout title="Decision rule">
        Pick one combined preset for simple apps. Use explicit composition only when an
        app intentionally combines Tailwind utilities, daisyUI themes, and Mantine
        provider setup in the same surface.
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
