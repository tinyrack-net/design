import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function SpaceStory() {
  return (
    <Mantine.Box>
      <Mantine.Text>Before</Mantine.Text>
      <Mantine.Space h="sm" />
      <Mantine.Text>After</Mantine.Text>
    </Mantine.Box>
  );
}

SpaceStory.displayName = 'SpaceStory';

const meta = {
  title: 'Mantine/Space',
  component: SpaceStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Space themed preview',
      },
    },
  },
} satisfies Meta<typeof SpaceStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
