import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function MarkStory() {
  return <Mantine.Mark>Marked text</Mantine.Mark>;
}

MarkStory.displayName = 'MarkStory';

const meta = {
  title: 'Mantine/Mark',
  component: MarkStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Mark themed preview',
      },
    },
  },
} satisfies Meta<typeof MarkStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
