import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function BoxStory() {
  return (
    <Mantine.Box p="md" bg="tinyrack.0" c="dark.9">
      Box
    </Mantine.Box>
  );
}

BoxStory.displayName = 'BoxStory';

const meta = {
  title: 'Mantine/Box',
  component: BoxStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Box themed preview',
      },
    },
  },
} satisfies Meta<typeof BoxStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
