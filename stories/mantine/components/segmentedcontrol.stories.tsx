import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function SegmentedControlStory() {
  return <Mantine.SegmentedControl data={['React', 'Astro']} />;
}

SegmentedControlStory.displayName = 'SegmentedControlStory';

const meta = {
  title: 'Mantine/SegmentedControl',
  component: SegmentedControlStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core SegmentedControl themed preview',
      },
    },
  },
} satisfies Meta<typeof SegmentedControlStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
