import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function PaperStory() {
  return (
    <Mantine.Paper p="md" shadow="sm" withBorder>
      Paper
    </Mantine.Paper>
  );
}

PaperStory.displayName = 'PaperStory';

const meta = {
  title: 'Mantine/Paper',
  component: PaperStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Paper themed preview',
      },
    },
  },
} satisfies Meta<typeof PaperStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
