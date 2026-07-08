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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  checked?: boolean;
  disabled?: boolean;
};

function ToggleStory(controlValues: ComponentStoryProps) {
  return (
    <input
      aria-label="Toggle"
      type="checkbox"
      checked={controlValues.checked ?? true}
      className={[
        'toggle',
        `toggle-${controlValues.tone ?? 'primary'}`,
        `toggle-${controlValues.size ?? 'md'}`,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={controlValues.disabled ?? false}
      readOnly
    />
  );
}

ToggleStory.displayName = 'ToggleStory';

const meta = {
  title: 'daisyUI/Toggle',
  component: ToggleStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    size: 'md',
    checked: true,
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
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size modifier class from xs through xl.',
    },
    checked: { control: 'boolean', description: 'Checked state.' },
    disabled: { control: 'boolean', description: 'Disabled state.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI toggle themed preview',
      },
    },
  },
} satisfies Meta<typeof ToggleStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
