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
  orientation?: (typeof daisyOrientationOptions)[number];
  tone?: (typeof daisyToneOptions)[number];
};

function StatStory(controlValues: ComponentStoryProps) {
  const orientation = controlValues.orientation ?? 'horizontal';
  const tone = controlValues.tone ?? 'primary';

  return (
    <div
      className={[
        'stats rounded-box bg-base-200 shadow',
        orientation === 'vertical' ? 'stats-vertical' : 'stats-horizontal',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="stat">
        <div className={['stat-title', `text-${tone}`].filter(Boolean).join(' ')}>
          Services
        </div>
        <div className="stat-value">12</div>
        <div className="stat-desc">all healthy</div>
      </div>
    </div>
  );
}

StatStory.displayName = 'StatStory';

const meta = {
  title: 'daisyUI/Stat',
  component: StatStory,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    tone: 'primary',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: daisyOrientationOptions,
      description: 'Stats orientation class.',
    },
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI stat themed preview',
      },
    },
  },
} satisfies Meta<typeof StatStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
