import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function HighlightStory() {
  return <Mantine.Highlight highlight="theme">Tinyrack theme system</Mantine.Highlight>;
}

HighlightStory.displayName = 'HighlightStory';

const meta = {
  title: 'Mantine/Highlight',
  component: HighlightStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Highlight themed preview',
      },
    },
  },
} satisfies Meta<typeof HighlightStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
