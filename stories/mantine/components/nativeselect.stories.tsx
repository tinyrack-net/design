import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function NativeSelectStory() {
  return (
    <Mantine.NativeSelect label="Node" data={['node-01', 'nas-01', 'edge-proxy']} />
  );
}

NativeSelectStory.displayName = 'NativeSelectStory';

const meta = {
  title: 'Mantine/NativeSelect',
  component: NativeSelectStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core NativeSelect themed preview',
      },
    },
  },
} satisfies Meta<typeof NativeSelectStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
