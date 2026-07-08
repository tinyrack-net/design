import type { Meta, StoryObj } from '@storybook/react-vite';

function TimelineStory() {
  return (
    <ul className="timeline">
      <li>
        <div className="timeline-start">Discover</div>
        <div className="timeline-middle">ok</div>
        <div className="timeline-end">Verify</div>
      </li>
    </ul>
  );
}

TimelineStory.displayName = 'TimelineStory';

const meta = {
  title: 'daisyUI/Timeline',
  component: TimelineStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
