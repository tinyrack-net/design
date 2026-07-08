import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function SemiCircleProgressStory() {
  return <Mantine.SemiCircleProgress value={72} label="72%" />;
}

SemiCircleProgressStory.displayName = 'SemiCircleProgressStory';

const meta = {
  title: 'Mantine/SemiCircleProgress',
  component: SemiCircleProgressStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core SemiCircleProgress themed preview',
      },
    },
  },
} satisfies Meta<typeof SemiCircleProgressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
