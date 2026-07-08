import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function BlockquoteStory() {
  return (
    <Mantine.Blockquote cite="Tinyrack">Theme-first design system</Mantine.Blockquote>
  );
}

BlockquoteStory.displayName = 'BlockquoteStory';

const meta = {
  title: 'Mantine/Blockquote',
  component: BlockquoteStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Blockquote themed preview',
      },
    },
  },
} satisfies Meta<typeof BlockquoteStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
