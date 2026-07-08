import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function EmptyStateStory() {
  return (
    <Mantine.EmptyState>
      <Mantine.EmptyState.Indicator>TR</Mantine.EmptyState.Indicator>
      <Mantine.EmptyState.Title>No alerts</Mantine.EmptyState.Title>
      <Mantine.EmptyState.Description>
        Rack checks are clear for this view.
      </Mantine.EmptyState.Description>
    </Mantine.EmptyState>
  );
}

EmptyStateStory.displayName = 'EmptyStateStory';

const meta = {
  title: 'Mantine/EmptyState',
  component: EmptyStateStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core EmptyState themed preview',
      },
    },
  },
} satisfies Meta<typeof EmptyStateStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
