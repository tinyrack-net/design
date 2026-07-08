import type { Meta, StoryObj } from '@storybook/react-vite';

function SwapStory() {
  return (
    <label className="swap swap-rotate">
      <input type="checkbox" defaultChecked />
      <span className="swap-on">ON</span>
      <span className="swap-off">OFF</span>
    </label>
  );
}

SwapStory.displayName = 'SwapStory';

const meta = {
  title: 'daisyUI/Swap',
  component: SwapStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI swap themed preview',
      },
    },
  },
} satisfies Meta<typeof SwapStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
