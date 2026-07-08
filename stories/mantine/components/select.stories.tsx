import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function SelectStory() {
  return (
    <Mantine.Select
      label="Select"
      data={['Mantine', 'daisyUI']}
      defaultValue="Mantine"
    />
  );
}

SelectStory.displayName = 'SelectStory';

const meta = {
  title: 'Mantine/Select',
  component: SelectStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Select themed preview',
      },
    },
  },
} satisfies Meta<typeof SelectStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
