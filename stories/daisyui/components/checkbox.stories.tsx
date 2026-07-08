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

function CheckboxStory(controlValues: ComponentStoryProps) {
  return (
    <input
      aria-label="Checkbox"
      type="checkbox"
      checked={controlValues.checked ?? true}
      className={[
        'checkbox',
        `checkbox-${controlValues.tone ?? 'primary'}`,
        `checkbox-${controlValues.size ?? 'md'}`,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={controlValues.disabled ?? false}
      readOnly
    />
  );
}

CheckboxStory.displayName = 'CheckboxStory';

const meta = {
  title: 'daisyUI/Checkbox',
  component: CheckboxStory,
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
        component: 'daisyUI checkbox themed preview',
      },
    },
  },
} satisfies Meta<typeof CheckboxStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
