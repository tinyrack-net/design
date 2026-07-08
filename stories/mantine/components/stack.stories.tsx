import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function StackStory() {
  return (
    <Mantine.Stack gap="xs">
      <Mantine.Badge>Stack</Mantine.Badge>
      <Mantine.Button size="xs">Apply</Mantine.Button>
    </Mantine.Stack>
  );
}

StackStory.displayName = 'StackStory';

const meta = {
  title: 'Mantine/Stack',
  component: StackStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Stack themed preview',
      },
    },
  },
} satisfies Meta<typeof StackStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
