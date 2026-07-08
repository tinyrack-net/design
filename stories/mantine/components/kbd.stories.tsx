import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function KbdStory() {
  return <Mantine.Kbd>Ctrl K</Mantine.Kbd>;
}

KbdStory.displayName = 'KbdStory';

const meta = {
  title: 'Mantine/Kbd',
  component: KbdStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Kbd themed preview',
      },
    },
  },
} satisfies Meta<typeof KbdStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
