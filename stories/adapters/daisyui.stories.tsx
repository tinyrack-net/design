import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CodeSnippet,
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
} from '../docs-components.js';

function DaisyUiPage() {
  return (
    <DocsPage
      eyebrow="Adapters"
      title="daisyUI"
      description="The daisyUI adapter gives Tailwind product surfaces a Tinyrack theme without changing component markup."
    >
      <DocsGrid>
        <DocsCard title="Install">
          <CodeSnippet>{`@import '@tinyrack/themes/tailwind.css';
@import '@tinyrack/themes/daisyui.css';

<html data-theme="tinyrack-dark">`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Guidance">
          <GuidanceList
            items={[
              'Prefer semantic daisyUI classes before adding custom utilities.',
              'Reserve primary buttons for the one action that advances the workflow.',
              'Use neutral cards and borders for dense tools; let content carry hierarchy.',
            ]}
          />
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

const meta = {
  title: 'Adapters/daisyUI',
  component: DaisyUiPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DaisyUiPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
