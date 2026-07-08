import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ThemeIconStory() {
  return <Mantine.ThemeIcon>TR</Mantine.ThemeIcon>;
}

ThemeIconStory.displayName = 'ThemeIconStory';

const meta = {
  title: 'Mantine/ThemeIcon',
  component: ThemeIconStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core ThemeIcon themed preview',
      },
    },
  },
} satisfies Meta<typeof ThemeIconStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
