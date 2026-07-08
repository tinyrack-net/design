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
  value?: number;
};

function ProgressStory(controlValues: ComponentStoryProps) {
  return (
    <progress
      className={['progress w-80', `progress-${controlValues.tone ?? 'primary'}`]
        .filter(Boolean)
        .join(' ')}
      max={100}
      value={controlValues.value ?? 72}
    />
  );
}

ProgressStory.displayName = 'ProgressStory';

const meta = {
  title: 'daisyUI/Progress',
  component: ProgressStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    value: 72,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
      },
      description: 'Progress value.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
