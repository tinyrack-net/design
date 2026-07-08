import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function TimelineStory() {
  return (
    <Mantine.Timeline active={1}>
      <Mantine.Timeline.Item title="Discover">Nodes found</Mantine.Timeline.Item>
      <Mantine.Timeline.Item title="Verify">Backups checked</Mantine.Timeline.Item>
    </Mantine.Timeline>
  );
}

TimelineStory.displayName = 'TimelineStory';

const meta = {
  title: 'Mantine/Timeline',
  component: TimelineStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Timeline themed preview',
      },
    },
  },
} satisfies Meta<typeof TimelineStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
