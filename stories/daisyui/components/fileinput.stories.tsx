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

function FileinputStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const appearance = controlValues.appearance ?? 'default';
  const size = controlValues.size ?? 'md';

  return (
    <input
      aria-label="Upload config"
      className={[
        'file-input',
        `file-input-${tone}`,
        appearance === 'default' ? undefined : `file-input-${appearance}`,
        `file-input-${size}`,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={controlValues.disabled ?? false}
      type="file"
    />
  );
}

FileinputStory.displayName = 'FileinputStory';

const meta = {
  title: 'daisyUI/Fileinput',
  component: FileinputStory,
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
      description: 'File input appearance class.',
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
        component: 'daisyUI fileinput themed preview',
      },
    },
  },
} satisfies Meta<typeof FileinputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
