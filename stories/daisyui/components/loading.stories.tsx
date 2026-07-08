import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  indicator?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

function LoadingStory(controlValues: ComponentStoryProps) {
  return (
    <span
      aria-label="Loading"
      className={[
        'loading',
        `loading-${controlValues.indicator ?? 'spinner'}`,
        `loading-${controlValues.size ?? 'md'}`,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
    />
  );
}

LoadingStory.displayName = 'LoadingStory';

const meta = {
  title: 'daisyUI/Loading',
  component: LoadingStory,
  tags: ['autodocs'],
  args: {
    indicator: 'spinner',
    size: 'md',
  },
  argTypes: {
    indicator: {
      control: 'select',
      options: ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity'],
      description: 'Loading indicator class.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size modifier class from xs through xl.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI loading themed preview',
      },
    },
  },
} satisfies Meta<typeof LoadingStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
