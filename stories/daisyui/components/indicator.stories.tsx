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

const daisyInlinePlacementOptions = ['start', 'center', 'end'] as const;

const daisyBlockPlacementOptions = ['top', 'middle', 'bottom'] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  inline?: 'start' | 'center' | 'end';
  block?: 'top' | 'middle' | 'bottom';
};

function IndicatorStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const inline = controlValues.inline ?? 'end';
  const block = controlValues.block ?? 'top';

  return (
    <div className="indicator">
      <span
        className={[
          'indicator-item badge',
          `badge-${tone}`,
          `indicator-${inline}`,
          `indicator-${block}`,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        3
      </span>
      <div className="grid h-24 w-32 place-content-center rounded-box bg-base-200">
        Alerts
      </div>
    </div>
  );
}

IndicatorStory.displayName = 'IndicatorStory';

const meta = {
  title: 'daisyUI/Indicator',
  component: IndicatorStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    inline: 'end',
    block: 'top',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    inline: {
      control: 'select',
      options: daisyInlinePlacementOptions,
      description: 'Inline indicator placement.',
    },
    block: {
      control: 'select',
      options: daisyBlockPlacementOptions,
      description: 'Block indicator placement.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI indicator themed preview',
      },
    },
  },
} satisfies Meta<typeof IndicatorStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
