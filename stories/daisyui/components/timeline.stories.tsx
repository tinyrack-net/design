import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  orientation?: (typeof daisyOrientationOptions)[number];
  compact?: boolean;
  snapIcon?: boolean;
};

function TimelineStory(controlValues: ComponentStoryProps) {
  const orientation = controlValues.orientation ?? 'vertical';

  return (
    <ul
      className={[
        'timeline',
        `timeline-${orientation}`,
        (controlValues.compact ?? false) ? 'timeline-compact' : undefined,
        (controlValues.snapIcon ?? true) ? 'timeline-snap-icon' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {['Deploy', 'Backup', 'Audit'].map((title, index) => (
        <li key={title}>
          <div className="timeline-start">{title}</div>
          <div className="timeline-middle">
            <span
              className={['status', index === 1 ? 'status-primary' : 'status-neutral']
                .filter(Boolean)
                .join(' ')}
            />
          </div>
          <div className="timeline-end timeline-box">
            {index === 1 ? 'running' : 'done'}
          </div>
        </li>
      ))}
    </ul>
  );
}

TimelineStory.displayName = 'TimelineStory';

const meta = {
  title: 'daisyUI/Timeline',
  component: TimelineStory,
  tags: ['autodocs'],
  args: {
    orientation: 'vertical',
    compact: false,
    snapIcon: true,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: daisyOrientationOptions,
      description: 'Timeline orientation class.',
    },
    compact: {
      control: 'boolean',
      description: 'Applies timeline-compact.',
    },
    snapIcon: {
      control: 'boolean',
      description: 'Applies timeline-snap-icon.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI timeline themed preview',
      },
    },
  },
} satisfies Meta<typeof TimelineStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
