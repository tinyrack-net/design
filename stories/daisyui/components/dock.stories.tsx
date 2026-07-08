import type { Meta, StoryObj } from '@storybook/react-vite';

function DockStory() {
  return (
    <div className="dock dock-xs relative">
      <button type="button">⌂</button>
      <button type="button" className="dock-active">
        TR
      </button>
    </div>
  );
}

DockStory.displayName = 'DockStory';

const meta = {
  title: 'daisyUI/Dock',
  component: DockStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI dock themed preview',
      },
    },
  },
} satisfies Meta<typeof DockStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
