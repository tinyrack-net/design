import type { Meta, StoryObj } from '@storybook/react-vite';

function ProgressStory() {
  return <progress className="progress progress-primary w-56" value="70" max="100" />;
}

ProgressStory.displayName = 'ProgressStory';

const meta = {
  title: 'daisyUI/Progress',
  component: ProgressStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI progress themed preview',
      },
    },
  },
} satisfies Meta<typeof ProgressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
