import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  tone?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  appearance?: 'default' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
};

function InputStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const appearance = controlValues.appearance ?? 'default';
  const size = controlValues.size ?? 'md';

  return (
    <div className="grid w-[min(100%,28rem)] max-w-full min-w-0 box-border gap-3">
      <label className="grid min-w-0 gap-2 [&_.input]:w-full">
        <span className="label-text">Local domain</span>
        <input
          className={[
            'input',
            `input-${tone}`,
            appearance === 'default' ? undefined : `input-${appearance}`,
            `input-${size}`,
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={controlValues.disabled ?? false}
          placeholder="rack.local"
        />
      </label>
      <label className="grid min-w-0 gap-2 [&_.input]:w-full">
        <span className="label-text">Route target</span>
        <input
          className={[
            'input input-error',
            appearance === 'default' ? undefined : `input-${appearance}`,
            `input-${size}`,
          ]
            .filter(Boolean)
            .join(' ')}
          placeholder="Use a LAN IP"
        />
      </label>
      <label className="grid min-w-0 gap-2 [&_.input]:w-full">
        <span className="label-text">DHCP lease</span>
        <input
          className={[
            'input',
            `input-${tone}`,
            appearance === 'default' ? undefined : `input-${appearance}`,
            `input-${size}`,
          ]
            .filter(Boolean)
            .join(' ')}
          disabled
          placeholder="Managed by router"
        />
      </label>
    </div>
  );
}

InputStory.displayName = 'InputStory';

const meta = {
  title: 'daisyUI/Input',
  component: InputStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    appearance: 'default',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'accent',
        'neutral',
        'info',
        'success',
        'warning',
        'error',
      ],
      description: 'Color modifier class such as primary, success, or error.',
    },
    appearance: {
      control: 'select',
      options: ['default', 'ghost'],
      description: 'Input appearance class.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size modifier class from xs through xl.',
    },
    disabled: { control: 'boolean', description: 'Applies the disabled input state.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI input themed preview',
      },
    },
  },
} satisfies Meta<typeof InputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
