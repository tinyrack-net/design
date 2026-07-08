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

const daisyButtonStyleOptions = [
  'default',
  'outline',
  'dash',
  'soft',
  'ghost',
  'link',
] as const;

const daisyButtonShapeOptions = [
  'default',
  'square',
  'circle',
  'wide',
  'block',
] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  style?: (typeof daisyButtonStyleOptions)[number];
  size?: (typeof daisySizeOptions)[number];
  shape?: (typeof daisyButtonShapeOptions)[number];
  loading?: boolean;
  active?: boolean;
  disabled?: boolean;
};

function ButtonStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const style = controlValues.style ?? 'default';
  const size = controlValues.size ?? 'md';
  const shape = controlValues.shape ?? 'default';
  const loading = controlValues.loading ?? false;

  return (
    <button
      className={[
        'btn',
        `btn-${tone}`,
        style === 'default' ? undefined : `btn-${style}`,
        `btn-${size}`,
        shape === 'default' ? undefined : `btn-${shape}`,
        (controlValues.active ?? false) ? 'btn-active' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={controlValues.disabled ?? false}
      type="button"
    >
      {loading ? <span className="loading loading-spinner" /> : null}
      {shape === 'circle' || shape === 'square' ? 'TR' : 'Apply config'}
    </button>
  );
}

ButtonStory.displayName = 'ButtonStory';

const meta = {
  title: 'daisyUI/Button',
  component: ButtonStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    style: 'default',
    size: 'md',
    shape: 'default',
    loading: false,
    active: false,
    disabled: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    style: {
      control: 'select',
      options: daisyButtonStyleOptions,
      description: 'Button treatment class.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    shape: {
      control: 'select',
      options: daisyButtonShapeOptions,
      description: 'Button shape or width class.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading-spinner inside the button.',
    },
    active: {
      control: 'boolean',
      description: 'Applies btn-active state.',
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
        component: 'daisyUI button themed preview',
      },
    },
  },
} satisfies Meta<typeof ButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
