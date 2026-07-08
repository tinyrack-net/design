import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function GridStory() {
  return (
    <Mantine.Grid>
      <Mantine.Grid.Col span={6}>
        <Mantine.Paper p="xs">A</Mantine.Paper>
      </Mantine.Grid.Col>
      <Mantine.Grid.Col span={6}>
        <Mantine.Paper p="xs">B</Mantine.Paper>
      </Mantine.Grid.Col>
    </Mantine.Grid>
  );
}

GridStory.displayName = 'GridStory';

const meta = {
  title: 'Mantine/Grid',
  component: GridStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Grid themed preview',
      },
    },
  },
} satisfies Meta<typeof GridStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
