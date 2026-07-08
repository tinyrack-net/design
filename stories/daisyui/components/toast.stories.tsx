import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyStateToneOptions = ['info', 'success', 'warning', 'error'] as const;

const daisyInlinePlacementOptions = ['start', 'center', 'end'] as const;

const daisyBlockPlacementOptions = ['top', 'middle', 'bottom'] as const;

type ComponentStoryProps = {
  inline?: 'start' | 'center' | 'end';
  block?: 'top' | 'middle' | 'bottom';
  tone?: (typeof daisyStateToneOptions)[number];
};

function ToastStory(controlValues: ComponentStoryProps) {
  const inline = controlValues.inline ?? 'end';
  const block = controlValues.block ?? 'top';
  const tone = controlValues.tone ?? 'info';

  return (
    <div
      className={['toast static', `toast-${inline}`, `toast-${block}`]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['alert', `alert-${tone}`].filter(Boolean).join(' ')}>
        Backup finished.
      </div>
    </div>
  );
}

ToastStory.displayName = 'ToastStory';

const meta = {
  title: 'daisyUI/Toast',
  component: ToastStory,
  tags: ['autodocs'],
  args: {
    inline: 'end',
    block: 'top',
    tone: 'info',
  },
  argTypes: {
    inline: {
      control: 'select',
      options: daisyInlinePlacementOptions,
      description: 'Toast inline placement.',
    },
    block: {
      control: 'select',
      options: daisyBlockPlacementOptions,
      description: 'Toast block placement.',
    },
    tone: {
      control: 'select',
      options: daisyStateToneOptions,
      description: 'Status color modifier class.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI toast themed preview',
      },
    },
  },
} satisfies Meta<typeof ToastStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
