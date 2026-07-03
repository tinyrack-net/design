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

function DaisyUiPage() {
  return (
    <DocsPage
      eyebrow="Adapters"
      title="daisyUI"
      description="The daisyUI adapter gives Tailwind product surfaces a Tinyrack theme without changing component markup."
    >
      <DocsSection title="Choose the right entry">
        <DocsTable
          columns={['Situation', 'Recommended setup', 'Why']}
          rows={[
            [
              'A normal Tailwind + daisyUI app',
              '@tinyrack/themes/tailwind/daisyui.css',
              'Imports Tailwind tokens, Tinyrack daisyUI themes, and daisyUI plugin registration together.',
            ],
            [
              'The app owns daisyUI plugin ordering',
              'tailwind.css + daisyui.css + app-local @plugin',
              'Use explicit composition when plugin order or theme registration must stay local.',
            ],
            [
              'A mixed daisyUI + Mantine app',
              'tailwind.css + daisyui.css + mantine.css',
              'Avoid importing both combined presets because they duplicate Tailwind token setup.',
            ],
          ]}
        />
      </DocsSection>

      <DocsGrid>
        <DocsCard title="Recommended CSS entry">
          <CodeSnippet>{`@import "tailwindcss";
@import "@tinyrack/themes/tailwind/daisyui.css";

<html data-theme="tinyrack-dark">`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Explicit composition">
          <CodeSnippet>{`@import "tailwindcss";
@import "@tinyrack/themes/tailwind.css";
@import "@tinyrack/themes/daisyui.css";

@plugin "daisyui" {
  themes:
    tinyrack-light,
    tinyrack-dark --default --prefersdark;
}`}</CodeSnippet>
        </DocsCard>
      </DocsGrid>

      <DocsGrid>
        <DocsCard title="Guidance">
          <GuidanceList
            items={[
              'Prefer semantic daisyUI classes before adding custom utilities.',
              'Reserve primary buttons for the one action that advances the workflow.',
              'Use neutral cards and borders for dense tools; let content carry hierarchy.',
            ]}
          />
        </DocsCard>
        <DocsCard title="Verify">
          <GuidanceList
            items={[
              'Confirm btn btn-primary uses the achromatic Tinyrack primary on tinyrack-dark.',
              'Confirm data-theme switches between tinyrack-dark and tinyrack-light.',
              'Confirm app CSS does not register @plugin "daisyui" twice when using the combined preset.',
            ]}
          />
        </DocsCard>
      </DocsGrid>

      <DocsCallout title="Most common mistake">
        The combined daisyUI entry already registers the daisyUI plugin themes. Add a
        local @plugin block only when you intentionally choose explicit composition.
      </DocsCallout>
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
