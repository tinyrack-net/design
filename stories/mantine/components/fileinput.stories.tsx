import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function FileInputStory() {
  return <Mantine.FileInput label="Restore archive" placeholder="Select backup file" />;
}

FileInputStory.displayName = 'FileInputStory';

const meta = {
  title: 'Mantine/FileInput',
  component: FileInputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core FileInput themed preview',
      },
    },
  },
} satisfies Meta<typeof FileInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
