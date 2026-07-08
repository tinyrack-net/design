import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function NumberInputStory() {
  return <Mantine.NumberInput label="Power draw" defaultValue={142} />;
}

NumberInputStory.displayName = 'NumberInputStory';

const meta = {
  title: 'Mantine/NumberInput',
  component: NumberInputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core NumberInput themed preview',
      },
    },
  },
} satisfies Meta<typeof NumberInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
