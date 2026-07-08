import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function NumberFormatterStory() {
  return <Mantine.NumberFormatter value={12345.67} thousandSeparator prefix="$" />;
}

NumberFormatterStory.displayName = 'NumberFormatterStory';

const meta = {
  title: 'Mantine/NumberFormatter',
  component: NumberFormatterStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core NumberFormatter themed preview',
      },
    },
  },
} satisfies Meta<typeof NumberFormatterStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
