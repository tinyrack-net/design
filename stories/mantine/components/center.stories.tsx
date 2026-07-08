import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function CenterStory() {
  return (
    <Mantine.Center h={64} bg="tinyrack.0" c="dark.9">
      Centered
    </Mantine.Center>
  );
}

CenterStory.displayName = 'CenterStory';

const meta = {
  title: 'Mantine/Center',
  component: CenterStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Center themed preview',
      },
    },
  },
} satisfies Meta<typeof CenterStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
