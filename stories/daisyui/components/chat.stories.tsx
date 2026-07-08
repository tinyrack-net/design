import type { Meta, StoryObj } from '@storybook/react-vite';

function ChatStory() {
  return (
    <div className="chat chat-start">
      <div className="chat-bubble chat-bubble-primary">Chat bubble</div>
    </div>
  );
}

ChatStory.displayName = 'ChatStory';

const meta = {
  title: 'daisyUI/Chat',
  component: ChatStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI chat themed preview',
      },
    },
  },
} satisfies Meta<typeof ChatStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
