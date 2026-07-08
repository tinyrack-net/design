import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function UnstyledButtonStory() {
  return <Mantine.UnstyledButton p="xs">Unstyled button</Mantine.UnstyledButton>;
}

UnstyledButtonStory.displayName = 'UnstyledButtonStory';

const meta = {
  title: 'Mantine/UnstyledButton',
  component: UnstyledButtonStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core UnstyledButton themed preview',
      },
    },
  },
} satisfies Meta<typeof UnstyledButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
