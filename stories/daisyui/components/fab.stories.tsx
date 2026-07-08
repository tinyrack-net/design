import type { Meta, StoryObj } from '@storybook/react-vite';

function FabStory() {
  return (
    <button
      className="btn btn-circle btn-primary"
      type="button"
      aria-label="Floating action"
    >
      +
    </button>
  );
}

FabStory.displayName = 'FabStory';

const meta = {
  title: 'daisyUI/Fab',
  component: FabStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI fab themed preview',
      },
    },
  },
} satisfies Meta<typeof FabStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
