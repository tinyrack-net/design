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

const daisyPlacementOptions = [
  'top',
  'bottom',
  'left',
  'right',
  'start',
  'center',
  'end',
] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  placement?: (typeof daisyPlacementOptions)[number];
  open?: boolean;
};

function TooltipStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const placement = controlValues.placement ?? 'top';

  return (
    <div
      className={[
        'tooltip',
        `tooltip-${tone}`,
        `tooltip-${placement}`,
        (controlValues.open ?? true) ? 'tooltip-open' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
      data-tip="Node logs"
    >
      <button className="btn btn-primary" type="button">
        Hover
      </button>
    </div>
  );
}

TooltipStory.displayName = 'TooltipStory';

const meta = {
  title: 'daisyUI/Tooltip',
  component: TooltipStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    placement: 'top',
    open: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    placement: {
      control: 'select',
      options: daisyPlacementOptions,
      description: 'Tooltip placement class.',
    },
    open: {
      control: 'boolean',
      description: 'Applies tooltip-open state.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI tooltip themed preview',
      },
    },
  },
} satisfies Meta<typeof TooltipStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
