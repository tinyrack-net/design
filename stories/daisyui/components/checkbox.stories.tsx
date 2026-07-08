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

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  size?: (typeof daisySizeOptions)[number];
  checked?: boolean;
  disabled?: boolean;
};

function CheckboxStory(controlValues: ComponentStoryProps) {
  return (
    <label className="flex items-center gap-3">
      <input
        className={[
          'checkbox',
          `checkbox-${controlValues.tone ?? 'primary'}`,
          `checkbox-${controlValues.size ?? 'md'}`,
        ]
          .filter(Boolean)
          .join(' ')}
        checked={controlValues.checked ?? true}
        disabled={controlValues.disabled ?? false}
        readOnly
        type="checkbox"
      />
      <span>Enable backup alerts</span>
    </label>
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
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
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
