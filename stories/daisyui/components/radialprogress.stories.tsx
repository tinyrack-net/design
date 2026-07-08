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
  controlSize?: number;
};

function RadialprogressStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const value = controlValues.value ?? 68;
  const controlSize = controlValues.controlSize ?? 6;

  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      className={['radial-progress', `text-${tone}`].filter(Boolean).join(' ')}
      role="progressbar"
      style={
        {
          '--value': value,
          '--size': `${String(controlSize)}rem`,
        } as React.CSSProperties
      }
    >
      {value}%
    </div>
  );
}

RadialprogressStory.displayName = 'RadialprogressStory';

const meta = {
  title: 'daisyUI/Radialprogress',
  component: RadialprogressStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    value: 68,
    controlSize: 6,
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
      description: 'Radial progress value custom property.',
    },
    controlSize: {
      control: {
        type: 'range',
        min: 3,
        max: 10,
        step: 1,
      },
      description: 'Radial progress size in rem.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
