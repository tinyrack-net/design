import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function GroupStory() {
  return (
    <Mantine.Group>
      <Mantine.Button size="xs">Logs</Mantine.Button>
      <Mantine.Button size="xs" variant="light">
        Config
      </Mantine.Button>
    </Mantine.Group>
  );
}

GroupStory.displayName = 'GroupStory';

const meta = {
  title: 'Mantine/Group',
  component: GroupStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Group themed preview',
      },
    },
  },
} satisfies Meta<typeof GroupStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
