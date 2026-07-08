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

const daisyFieldStyleOptions = ['default', 'ghost'] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  appearance?: (typeof daisyFieldStyleOptions)[number];
  size?: (typeof daisySizeOptions)[number];
  disabled?: boolean;
};

function InputStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const appearance = controlValues.appearance ?? 'default';
  const size = controlValues.size ?? 'md';

  return (
    <label className="grid w-80 gap-2">
      <span className="label-text">Local domain</span>
      <input
        className={[
          'input w-full',
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
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    appearance: {
      control: 'select',
      options: daisyFieldStyleOptions,
      description: 'Input appearance class.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
