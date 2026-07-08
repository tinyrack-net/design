import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function PaginationStory() {
  return <Mantine.Pagination total={6} value={2} />;
}

PaginationStory.displayName = 'PaginationStory';

const meta = {
  title: 'Mantine/Pagination',
  component: PaginationStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Pagination themed preview',
      },
    },
  },
} satisfies Meta<typeof PaginationStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
