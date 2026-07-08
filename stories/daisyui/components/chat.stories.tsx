import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyToneOptions = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
] as const;

type ComponentStoryProps = {
  side?: 'start' | 'end';
  tone?: (typeof daisyToneOptions)[number];
};

function ChatStory(controlValues: ComponentStoryProps) {
  const side = controlValues.side ?? 'start';
  const tone = controlValues.tone ?? 'primary';

  return (
    <div className={['chat', `chat-${side}`].filter(Boolean).join(' ')}>
      <div className="chat-header">rack-agent</div>
      <div className={['chat-bubble', `chat-bubble-${tone}`].filter(Boolean).join(' ')}>
        nas-01 backup finished.
      </div>
      <div className="chat-footer opacity-70">now</div>
    </div>
  );
}

ChatStory.displayName = 'ChatStory';

const meta = {
  title: 'daisyUI/Chat',
  component: ChatStory,
  tags: ['autodocs'],
  args: {
    side: 'start',
    tone: 'primary',
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Chat alignment class.',
    },
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
