import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CodeSnippet,
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
} from '../docs-components.js';

function WelcomePage() {
  return (
    <DocsPage
      eyebrow="Tinyrack design system"
      title="Build quiet, durable product surfaces"
      description="Tinyrack Themes packages black-tone design tokens and adapters for application UI, marketing surfaces, and documentation sites."
    >
      <DocsGrid>
        <DocsCard title="Foundations first">
          <p>
            Start with neutral depth, measured spacing, rounded geometry, and restrained
            blue accents. Components should feel technical without becoming cold.
          </p>
        </DocsCard>
        <DocsCard title="Adapters over forks">
          <p>
            Mantine, daisyUI, Tailwind, and Astro Starlight receive the same Tinyrack
            voice through package exports instead of one-off theme copies.
          </p>
        </DocsCard>
        <DocsCard title="Static by design">
          <p>
            These Storybook pages are reference material: token samples, installation
            hints, and usage guidance that stay close to the source package.
          </p>
        </DocsCard>
      </DocsGrid>
      <DocsCard title="Package map">
        <CodeSnippet>{`@tinyrack/themes/tokens
@tinyrack/themes/mantine
@tinyrack/themes/daisyui.css
@tinyrack/themes/astro/starlight`}</CodeSnippet>
      </DocsCard>
      <DocsCard title="Design principles">
        <GuidanceList
          items={[
            'Use black and near-black surfaces as product context, not decoration.',
            'Keep brand blue for primary action, focus, and useful system information.',
            'Prefer compact, readable layouts with enough breathing room for review.',
            'Document integration paths so adapters feel like one system.',
          ]}
        />
      </DocsCard>
    </DocsPage>
  );
}

const meta = {
  title: 'Introduction/Welcome',
  component: WelcomePage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof WelcomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
