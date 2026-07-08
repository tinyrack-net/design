import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  tone?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  open?: boolean;
};

function TooltipStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'default';
  const placement = controlValues.placement ?? 'top';
  const open = controlValues.open ?? true;

  return (
    <div
      className={[
        'tooltip',
        open && 'tooltip-open',
        tone === 'default' ? undefined : `tooltip-${tone}`,
        `tooltip-${placement}`,
      ]
        .filter(Boolean)
        .join(' ')}
      data-tip="Open service logs"
    >
      <button className="btn" type="button">
        Logs
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
    tone: 'default',
    placement: 'top',
    open: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'accent',
        'info',
        'success',
        'warning',
        'error',
      ],
      description: 'Tooltip color modifier class.',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Tooltip placement class.',
    },
    open: { control: 'boolean', description: 'Applies the tooltip-open state class.' },
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
