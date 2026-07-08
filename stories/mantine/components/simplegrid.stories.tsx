import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function SimpleGridStory() {
  return (
    <Mantine.SimpleGrid cols={2}>
      <Mantine.Paper p="xs">A</Mantine.Paper>
      <Mantine.Paper p="xs">B</Mantine.Paper>
    </Mantine.SimpleGrid>
  );
}

SimpleGridStory.displayName = 'SimpleGridStory';

const meta = {
  title: 'Mantine/SimpleGrid',
  component: SimpleGridStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core SimpleGrid themed preview',
      },
    },
  },
} satisfies Meta<typeof SimpleGridStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
