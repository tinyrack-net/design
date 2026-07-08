import type { Meta, StoryObj } from '@storybook/react-vite';

function RangeStory() {
  return (
    <input
      aria-label="Range"
      type="range"
      min="0"
      max="100"
      defaultValue="60"
      className="range range-primary"
    />
  );
}

RangeStory.displayName = 'RangeStory';

const meta = {
  title: 'daisyUI/Range',
  component: RangeStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI range themed preview',
      },
    },
  },
} satisfies Meta<typeof RangeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
