import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CodeSnippet,
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
} from '../docs-components.js';

function MantinePage() {
  return (
    <DocsPage
      eyebrow="Adapters"
      title="Mantine"
      description="Use the Mantine adapter for application surfaces that need accessible primitives and Tinyrack defaults."
    >
      <DocsGrid>
        <DocsCard title="Provider">
          <CodeSnippet>{`import { TinyrackMantineProvider } from '@tinyrack/themes/mantine';
import '@tinyrack/themes/mantine.css';

<TinyrackMantineProvider>{children}</TinyrackMantineProvider>`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="Guidance">
          <GuidanceList
            items={[
              'Keep forms compact and explicit; labels should explain the input contract.',
              'Use cards and alerts for operational context, not decorative panels.',
              'Match Storybook component pages before introducing per-product overrides.',
            ]}
          />
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

const meta = {
  title: 'Adapters/Mantine',
  component: MantinePage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MantinePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
