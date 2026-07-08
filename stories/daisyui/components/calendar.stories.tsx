import type { Meta, StoryObj } from '@storybook/react-vite';

function CalendarStory() {
  return (
    <div className="mockup-code text-tinyrack-xs">
      <pre data-prefix=">">
        <code>calendar class preview</code>
      </pre>
    </div>
  );
}

CalendarStory.displayName = 'CalendarStory';

const meta = {
  title: 'daisyUI/Calendar',
  component: CalendarStory,
  tags: ['autodocs'],
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
