import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function PillStory() {
  return <Mantine.Pill>Theme</Mantine.Pill>;
}

PillStory.displayName = 'PillStory';

const meta = {
  title: 'Mantine/Pill',
  component: PillStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Pill themed preview',
      },
    },
  },
} satisfies Meta<typeof PillStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
