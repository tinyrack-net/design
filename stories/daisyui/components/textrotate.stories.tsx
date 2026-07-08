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
  tone?: (typeof daisyToneOptions)[number];
  word?: 'secure' | 'quiet' | 'local';
};

function TextrotateStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';

  return (
    <span
      className={['text-rotate text-2xl font-semibold', `text-${tone}`]
        .filter(Boolean)
        .join(' ')}
    >
      {controlValues.word ?? 'secure'}
    </span>
  );
}

TextrotateStory.displayName = 'TextrotateStory';

const meta = {
  title: 'daisyUI/Textrotate',
  component: TextrotateStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    word: 'secure',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    word: {
      control: 'select',
      options: ['secure', 'quiet', 'local'],
      description: 'Visible rotating word state.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI textrotate themed preview',
      },
    },
  },
} satisfies Meta<typeof TextrotateStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
