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
  style?: 'default' | 'outline' | 'dash' | 'soft' | 'ghost';
  size?: (typeof daisySizeOptions)[number];
};

function BadgeStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const style = controlValues.style ?? 'default';
  const size = controlValues.size ?? 'md';

  return (
    <span
      className={[
        'badge',
        `badge-${tone}`,
        style === 'default' ? undefined : `badge-${style}`,
        `badge-${size}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      Healthy
    </span>
  );
}

BadgeStory.displayName = 'BadgeStory';

const meta = {
  title: 'daisyUI/Badge',
  component: BadgeStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    style: 'default',
    size: 'md',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    style: {
      control: 'select',
      options: ['default', 'outline', 'dash', 'soft', 'ghost'],
      description: 'Badge treatment class.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI badge themed preview',
      },
    },
  },
} satisfies Meta<typeof BadgeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
