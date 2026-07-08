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

const daisyOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  orientation?: (typeof daisyOrientationOptions)[number];
  placement?: 'default' | 'start' | 'end';
};

function DividerStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const orientation = controlValues.orientation ?? 'horizontal';
  const placement = controlValues.placement ?? 'default';

  return (
    <div className={orientation === 'vertical' ? 'flex h-40' : 'w-80'}>
      <div
        className={[
          'divider',
          `divider-${tone}`,
          `divider-${orientation}`,
          placement === 'default' ? undefined : `divider-${placement}`,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        rack
      </div>
    </div>
  );
}

DividerStory.displayName = 'DividerStory';

const meta = {
  title: 'daisyUI/Divider',
  component: DividerStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    orientation: 'horizontal',
    placement: 'default',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    orientation: {
      control: 'select',
      options: daisyOrientationOptions,
      description: 'Divider orientation class.',
    },
    placement: {
      control: 'select',
      options: ['default', 'start', 'end'],
      description: 'Divider content placement class.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI divider themed preview',
      },
    },
  },
} satisfies Meta<typeof DividerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
