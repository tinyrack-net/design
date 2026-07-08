import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function BackgroundImageStory() {
  return (
    <Mantine.BackgroundImage
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 80'%3E%3Crect width='160' height='80' fill='%23d9edff'/%3E%3Ccircle cx='40' cy='40' r='24' fill='%233297f0'/%3E%3C/svg%3E"
      radius="md"
    >
      <Mantine.Center h={80}>Background</Mantine.Center>
    </Mantine.BackgroundImage>
  );
}

BackgroundImageStory.displayName = 'BackgroundImageStory';

const meta = {
  title: 'Mantine/BackgroundImage',
  component: BackgroundImageStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core BackgroundImage themed preview',
      },
    },
  },
} satisfies Meta<typeof BackgroundImageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
