import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySwapEffectOptions = ['rotate', 'flip'] as const;

type ComponentStoryProps = {
  effect?: (typeof daisySwapEffectOptions)[number];
  active?: boolean;
};

function SwapStory(controlValues: ComponentStoryProps) {
  const effect = controlValues.effect ?? 'rotate';

  return (
    <label
      className={[
        'swap text-3xl',
        `swap-${effect}`,
        (controlValues.active ?? true) ? 'swap-active' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input checked={controlValues.active ?? true} readOnly type="checkbox" />
      <span className="swap-on">ON</span>
      <span className="swap-off">OFF</span>
    </label>
  );
}

SwapStory.displayName = 'SwapStory';

const meta = {
  title: 'daisyUI/Swap',
  component: SwapStory,
  tags: ['autodocs'],
  args: {
    effect: 'rotate',
    active: true,
  },
  argTypes: {
    effect: {
      control: 'select',
      options: daisySwapEffectOptions,
      description: 'Swap animation class.',
    },
    active: {
      control: 'boolean',
      description: 'Applies swap-active state.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI swap themed preview',
      },
    },
  },
} satisfies Meta<typeof SwapStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
