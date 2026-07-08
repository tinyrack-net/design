import type { Meta, StoryObj } from '@storybook/react-vite';

function StackStory() {
  return (
    <div className="stack">
      <div className="card bg-primary text-primary-content p-4">1</div>
      <div className="card bg-secondary text-secondary-content p-4">2</div>
    </div>
  );
}

StackStory.displayName = 'StackStory';

const meta = {
  title: 'daisyUI/Stack',
  component: StackStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI stack themed preview',
      },
    },
  },
} satisfies Meta<typeof StackStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
