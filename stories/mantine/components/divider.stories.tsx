import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function DividerStory() {
  return <Mantine.Divider label="Divider" labelPosition="center" />;
}

DividerStory.displayName = 'DividerStory';

const meta = {
  title: 'Mantine/Divider',
  component: DividerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Divider themed preview',
      },
    },
  },
} satisfies Meta<typeof DividerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
