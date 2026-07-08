import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function SkeletonStory() {
  return <Mantine.Skeleton height={40} radius="md" />;
}

SkeletonStory.displayName = 'SkeletonStory';

const meta = {
  title: 'Mantine/Skeleton',
  component: SkeletonStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Skeleton themed preview',
      },
    },
  },
} satisfies Meta<typeof SkeletonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
