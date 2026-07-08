import type { Meta, StoryObj } from '@storybook/react-vite';

function MaskStory() {
  return <div className="mask mask-squircle bg-primary w-16 h-16" />;
}

MaskStory.displayName = 'MaskStory';

const meta = {
  title: 'daisyUI/Mask',
  component: MaskStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI mask themed preview',
      },
    },
  },
} satisfies Meta<typeof MaskStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
