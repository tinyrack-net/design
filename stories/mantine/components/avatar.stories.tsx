import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function AvatarStory() {
  return (
    <Mantine.Avatar color="tinyrack" radius="xl">
      TR
    </Mantine.Avatar>
  );
}

AvatarStory.displayName = 'AvatarStory';

const meta = {
  title: 'Mantine/Avatar',
  component: AvatarStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Avatar themed preview',
      },
    },
  },
} satisfies Meta<typeof AvatarStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
