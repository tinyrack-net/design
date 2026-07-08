import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyStateToneOptions = ['info', 'success', 'warning', 'error'] as const;

const daisyAlertStyleOptions = ['default', 'soft', 'outline', 'dash'] as const;

const daisyOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyStateToneOptions)[number];
  style?: (typeof daisyAlertStyleOptions)[number];
  layout?: (typeof daisyOrientationOptions)[number];
};

function AlertStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'info';
  const style = controlValues.style ?? 'default';
  const layout = controlValues.layout ?? 'horizontal';

  return (
    <div
      role="alert"
      className={[
        'alert',
        `alert-${tone}`,
        style === 'default' ? undefined : `alert-${style}`,
        `alert-${layout}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>{tone} rack alert: backup-sync needs review.</span>
    </div>
  );
}

AlertStory.displayName = 'AlertStory';

const meta = {
  title: 'daisyUI/Alert',
  component: AlertStory,
  tags: ['autodocs'],
  args: {
    tone: 'info',
    style: 'default',
    layout: 'horizontal',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyStateToneOptions,
      description: 'Status color modifier class.',
    },
    style: {
      control: 'select',
      options: daisyAlertStyleOptions,
      description: 'Alert treatment class.',
    },
    layout: {
      control: 'select',
      options: daisyOrientationOptions,
      description: 'Alert layout class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI alert themed preview',
      },
    },
  },
} satisfies Meta<typeof AlertStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
