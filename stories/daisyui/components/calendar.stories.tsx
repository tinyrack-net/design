import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  selectedDay?: 'none' | '15' | '16' | '17';
  size?: (typeof daisySizeOptions)[number];
};

function CalendarStory(controlValues: ComponentStoryProps) {
  const selectedDay = controlValues.selectedDay ?? '16';
  const size = controlValues.size ?? 'md';
  const days = ['15', '16', '17'];

  return (
    <div className="calendar grid gap-2 rounded-box border border-base-300 bg-base-100 p-3">
      <div className="grid grid-cols-3 gap-1 text-center text-xs text-base-content/60">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {days.map((day) => (
          <button
            className={[
              'btn',
              `btn-${size}`,
              selectedDay === day ? 'btn-primary' : 'btn-ghost',
            ]
              .filter(Boolean)
              .join(' ')}
            key={day}
            type="button"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

CalendarStory.displayName = 'CalendarStory';

const meta = {
  title: 'daisyUI/Calendar',
  component: CalendarStory,
  tags: ['autodocs'],
  args: {
    selectedDay: '16',
    size: 'md',
  },
  argTypes: {
    selectedDay: {
      control: 'select',
      options: ['none', '15', '16', '17'],
      description: 'Selected day state in the calendar grid.',
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
        component: 'daisyUI calendar themed preview',
      },
    },
  },
} satisfies Meta<typeof CalendarStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
