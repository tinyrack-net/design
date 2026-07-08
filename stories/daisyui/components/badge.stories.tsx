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
  style?: 'default' | 'outline' | 'dash' | 'soft' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
      options: ['default', 'outline', 'dash', 'soft', 'ghost'],
      description: 'Badge treatment class such as badge-outline or badge-soft.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size modifier class from xs through xl.',
    },
  },
  parameters: {
    layout: 'centered',
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
