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
};

function StatusStory(controlValues: ComponentStoryProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={[
          'status',
          `status-${controlValues.tone ?? 'primary'}`,
          `status-${controlValues.size ?? 'md'}`,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      Healthy
    </span>
  );
}

StatusStory.displayName = 'StatusStory';

const meta = {
  title: 'daisyUI/Status',
  component: StatusStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    size: 'md',
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
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI status themed preview',
      },
    },
  },
} satisfies Meta<typeof StatusStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
