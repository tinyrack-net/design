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

function RadioStory(controlValues: ComponentStoryProps) {
  return (
    <input
      aria-label="Radio"
      checked={controlValues.checked ?? true}
      className={[
        'radio',
        `radio-${controlValues.tone ?? 'primary'}`,
        `radio-${controlValues.size ?? 'md'}`,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={controlValues.disabled ?? false}
      readOnly
      type="radio"
    />
  );
}

RadioStory.displayName = 'RadioStory';

const meta = {
  title: 'daisyUI/Radio',
  component: RadioStory,
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
        component: 'daisyUI radio themed preview',
      },
    },
  },
} satisfies Meta<typeof RadioStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
