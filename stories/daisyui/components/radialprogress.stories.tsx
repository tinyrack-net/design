import type { Meta, StoryObj } from '@storybook/react-vite';

function RadialprogressStory() {
  return (
    <div
      className="radial-progress text-primary [--value:70]"
      aria-valuenow={70}
      role="progressbar"
    >
      70%
    </div>
  );
}

RadialprogressStory.displayName = 'RadialprogressStory';

const meta = {
  title: 'daisyUI/Radialprogress',
  component: RadialprogressStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI radialprogress themed preview',
      },
    },
  },
} satisfies Meta<typeof RadialprogressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
