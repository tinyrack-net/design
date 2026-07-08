import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function LoaderStory() {
  return <Mantine.Loader />;
}

LoaderStory.displayName = 'LoaderStory';

const meta = {
  title: 'Mantine/Loader',
  component: LoaderStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Loader themed preview',
      },
    },
  },
} satisfies Meta<typeof LoaderStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
