import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function CodeStory() {
  return <Mantine.Code>@tinyrack/themes</Mantine.Code>;
}

CodeStory.displayName = 'CodeStory';

const meta = {
  title: 'Mantine/Code',
  component: CodeStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Code themed preview',
      },
    },
  },
} satisfies Meta<typeof CodeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
