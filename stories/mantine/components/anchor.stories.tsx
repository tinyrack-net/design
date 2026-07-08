import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function AnchorStory() {
  return <Mantine.Anchor href="#mantine-anchor">Anchor link</Mantine.Anchor>;
}

AnchorStory.displayName = 'AnchorStory';

const meta = {
  title: 'Mantine/Anchor',
  component: AnchorStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Anchor themed preview',
      },
    },
  },
} satisfies Meta<typeof AnchorStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
