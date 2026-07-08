import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function JsonInputStory() {
  return (
    <Mantine.JsonInput
      label="JSON"
      defaultValue={'{\n  "theme": "tinyrack"\n}'}
      autosize
    />
  );
}

JsonInputStory.displayName = 'JsonInputStory';

const meta = {
  title: 'Mantine/JsonInput',
  component: JsonInputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core JsonInput themed preview',
      },
    },
  },
} satisfies Meta<typeof JsonInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
