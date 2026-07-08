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

function TextareaStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const appearance = controlValues.appearance ?? 'default';
  const size = controlValues.size ?? 'md';

  return (
    <textarea
      className={[
        'textarea w-80',
        `textarea-${tone}`,
        appearance === 'default' ? undefined : `textarea-${appearance}`,
        `textarea-${size}`,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={controlValues.disabled ?? false}
      defaultValue="Restart service after backup."
    />
  );
}

TextareaStory.displayName = 'TextareaStory';

const meta = {
  title: 'daisyUI/Textarea',
  component: TextareaStory,
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
      description: 'Textarea appearance class.',
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
        component: 'daisyUI textarea themed preview',
      },
    },
  },
} satisfies Meta<typeof TextareaStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
