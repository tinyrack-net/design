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

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  size?: (typeof daisySizeOptions)[number];
  vertical?: boolean;
  value?: number;
};

function RangeStory(controlValues: ComponentStoryProps) {
  return (
    <input
      aria-label="Range"
      className={[
        'range',
        `range-${controlValues.tone ?? 'primary'}`,
        `range-${controlValues.size ?? 'md'}`,
        (controlValues.vertical ?? false) ? 'range-vertical h-40' : 'w-80',
      ]
        .filter(Boolean)
        .join(' ')}
      max={100}
      min={0}
      readOnly
      type="range"
      value={controlValues.value ?? 60}
    />
  );
}

RangeStory.displayName = 'RangeStory';

const meta = {
  title: 'daisyUI/Range',
  component: RangeStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    size: 'md',
    vertical: false,
    value: 60,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    vertical: {
      control: 'boolean',
      description: 'Applies range-vertical.',
    },
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
      },
      description: 'Range value.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI range themed preview',
      },
    },
  },
} satisfies Meta<typeof RangeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
