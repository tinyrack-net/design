import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function TextareaStory() {
  return (
    <Mantine.Textarea
      label="Runbook note"
      defaultValue="Check backup-sync before restarting nas-01."
    />
  );
}

TextareaStory.displayName = 'TextareaStory';

const meta = {
  title: 'Mantine/Textarea',
  component: TextareaStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Textarea themed preview',
      },
    },
  },
} satisfies Meta<typeof TextareaStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
