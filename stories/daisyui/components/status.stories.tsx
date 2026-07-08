import type { Meta, StoryObj } from '@storybook/react-vite';

function StatusStory() {
  return (
    <div className="flex items-center gap-2">
      <span className="status status-success" /> Ready
    </div>
  );
}

StatusStory.displayName = 'StatusStory';

const meta = {
  title: 'daisyUI/Status',
  component: StatusStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI status themed preview',
      },
    },
  },
} satisfies Meta<typeof StatusStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
