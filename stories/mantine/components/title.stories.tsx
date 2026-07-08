import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function TitleStory() {
  return <Mantine.Title order={3}>Title</Mantine.Title>;
}

TitleStory.displayName = 'TitleStory';

const meta = {
  title: 'Mantine/Title',
  component: TitleStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Title themed preview',
      },
    },
  },
} satisfies Meta<typeof TitleStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
