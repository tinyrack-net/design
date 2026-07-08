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

function SelectStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const appearance = controlValues.appearance ?? 'default';
  const size = controlValues.size ?? 'md';

  return (
    <select
      className={[
        'select w-80',
        `select-${tone}`,
        appearance === 'default' ? undefined : `select-${appearance}`,
        `select-${size}`,
      ]
        .filter(Boolean)
        .join(' ')}
      defaultValue="theme"
      disabled={controlValues.disabled ?? false}
    >
      <option value="theme">Theme</option>
      <option value="tokens">Tokens</option>
    </select>
  );
}

SelectStory.displayName = 'SelectStory';

const meta = {
  title: 'daisyUI/Select',
  component: SelectStory,
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
      description: 'Select appearance class.',
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
        component: 'daisyUI select themed preview',
      },
    },
  },
} satisfies Meta<typeof SelectStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
