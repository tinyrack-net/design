import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function MarqueeStory() {
  return (
    <Mantine.Marquee>Theme tokens · Mantine · daisyUI · Starlight</Mantine.Marquee>
  );
}

MarqueeStory.displayName = 'MarqueeStory';

const meta = {
  title: 'Mantine/Marquee',
  component: MarqueeStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Marquee themed preview',
      },
    },
  },
} satisfies Meta<typeof MarqueeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
