import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function RingProgressStory() {
  return (
    <Mantine.RingProgress
      sections={[{ value: 70, color: 'tinyrack' }]}
      label={<Mantine.Text ta="center">70%</Mantine.Text>}
    />
  );
}

RingProgressStory.displayName = 'RingProgressStory';

const meta = {
  title: 'Mantine/RingProgress',
  component: RingProgressStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core RingProgress themed preview',
      },
    },
  },
} satisfies Meta<typeof RingProgressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
