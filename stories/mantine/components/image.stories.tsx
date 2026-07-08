import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ImageStory() {
  return (
    <Mantine.Image
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E%3Crect width='160' height='90' fill='%23d9edff'/%3E%3Ctext x='80' y='50' text-anchor='middle' font-size='16'%3EImage%3C/text%3E%3C/svg%3E"
      alt="Theme placeholder"
      radius="md"
    />
  );
}

ImageStory.displayName = 'ImageStory';

const meta = {
  title: 'Mantine/Image',
  component: ImageStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Image themed preview',
      },
    },
  },
} satisfies Meta<typeof ImageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
