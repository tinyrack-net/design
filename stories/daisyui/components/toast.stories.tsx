import type { Meta, StoryObj } from '@storybook/react-vite';

function ToastStory() {
  return (
    <div className="toast toast-start relative">
      <div className="alert alert-success">
        <span>Config saved</span>
      </div>
    </div>
  );
}

ToastStory.displayName = 'ToastStory';

const meta = {
  title: 'daisyUI/Toast',
  component: ToastStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI toast themed preview',
      },
    },
  },
} satisfies Meta<typeof ToastStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
