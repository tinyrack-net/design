import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function TextStory() {
  return <Mantine.Text>Text component</Mantine.Text>;
}

TextStory.displayName = 'TextStory';

const meta = {
  title: 'Mantine/Text',
  component: TextStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Text themed preview',
      },
    },
  },
} satisfies Meta<typeof TextStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
