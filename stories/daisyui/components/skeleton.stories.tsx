import type { Meta, StoryObj } from '@storybook/react-vite';

function SkeletonStory() {
  return <div className="skeleton h-12 w-full" />;
}

SkeletonStory.displayName = 'SkeletonStory';

const meta = {
  title: 'daisyUI/Skeleton',
  component: SkeletonStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI skeleton themed preview',
      },
    },
  },
} satisfies Meta<typeof SkeletonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
