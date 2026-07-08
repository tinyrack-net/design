import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function RatingStory() {
  return <Mantine.Rating defaultValue={4} />;
}

RatingStory.displayName = 'RatingStory';

const meta = {
  title: 'Mantine/Rating',
  component: RatingStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Rating themed preview',
      },
    },
  },
} satisfies Meta<typeof RatingStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
