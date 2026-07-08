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
  style?: 'default' | 'outline' | 'dash' | 'soft' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'default' | 'square' | 'circle' | 'wide' | 'block';
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
  const active = controlValues.active ?? false;
  const disabled = controlValues.disabled ?? false;

  return (
    <div className="grid w-[min(100%,42rem)] max-w-full min-w-0 box-border gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <button
          className={[
            'btn',
            `btn-${tone}`,
            style === 'default' ? undefined : `btn-${style}`,
            `btn-${size}`,
            shape === 'default' ? undefined : `btn-${shape}`,
            active && 'btn-active',
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={disabled}
          type="button"
        >
          {loading ? <span className="loading loading-spinner" /> : null}
          {shape === 'circle' || shape === 'square' ? 'TR' : 'Apply config'}
        </button>
        <button
          className={['btn', `btn-${tone}`, 'btn-outline', `btn-${size}`]
            .filter(Boolean)
            .join(' ')}
          type="button"
        >
          Open logs
        </button>
        <button
          className={[
            'btn',
            `btn-${tone}`,
            style === 'default' ? undefined : `btn-${style}`,
            `btn-${size}`,
          ]
            .filter(Boolean)
            .join(' ')}
          disabled
          type="button"
        >
          Paused
        </button>
        <button
          className={[
            'btn',
            `btn-${tone}`,
            style === 'default' ? undefined : `btn-${style}`,
            `btn-${size}`,
          ]
            .filter(Boolean)
            .join(' ')}
          type="button"
        >
          <span className="loading loading-spinner" />
          Applying
        </button>
      </div>
    </div>
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
    style: {
      control: 'select',
      options: ['default', 'outline', 'dash', 'soft', 'ghost', 'link'],
      description: 'Button treatment class such as btn-outline or btn-ghost.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size modifier class from xs through xl.',
    },
    shape: {
      control: 'select',
      options: ['default', 'square', 'circle', 'wide', 'block'],
      description: 'Button shape or width class.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading-spinner inside the button.',
    },
    active: { control: 'boolean', description: 'Applies the btn-active state class.' },
    disabled: { control: 'boolean', description: 'Applies the disabled button state.' },
  },
  parameters: {
    layout: 'centered',
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
