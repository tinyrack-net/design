import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ChipStory() {
  return <Mantine.Chip defaultChecked>NAS</Mantine.Chip>;
}

ChipStory.displayName = 'ChipStory';

const meta = {
  title: 'Mantine/Chip',
  component: ChipStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Chip themed preview',
      },
    },
  },
} satisfies Meta<typeof ChipStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
