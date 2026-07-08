import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ProgressStory() {
  return <Mantine.Progress value={68} />;
}

ProgressStory.displayName = 'ProgressStory';

const meta = {
  title: 'Mantine/Progress',
  component: ProgressStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Progress themed preview',
      },
    },
  },
} satisfies Meta<typeof ProgressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
