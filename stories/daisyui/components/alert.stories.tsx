import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  tone?: 'info' | 'success' | 'warning' | 'error';
  style?: 'default' | 'soft' | 'outline' | 'dash';
  layout?: 'horizontal' | 'vertical';
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
      options: ['info', 'success', 'warning', 'error'],
      description: 'Status color modifier class.',
    },
    style: {
      control: 'select',
      options: ['default', 'soft', 'outline', 'dash'],
      description: 'Alert treatment class such as alert-soft or alert-outline.',
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Alert layout class.',
    },
  },
  parameters: {
    layout: 'centered',
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
