import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ListStory() {
  return (
    <Mantine.List>
      <Mantine.List.Item>Tokens</Mantine.List.Item>
      <Mantine.List.Item>Adapters</Mantine.List.Item>
    </Mantine.List>
  );
}

ListStory.displayName = 'ListStory';

const meta = {
  title: 'Mantine/List',
  component: ListStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core List themed preview',
      },
    },
  },
} satisfies Meta<typeof ListStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
