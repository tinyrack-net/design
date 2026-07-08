import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function TagsInputStory() {
  return (
    <Mantine.TagsInput
      label="Tags"
      data={['theme', 'token']}
      defaultValue={['theme']}
    />
  );
}

TagsInputStory.displayName = 'TagsInputStory';

const meta = {
  title: 'Mantine/TagsInput',
  component: TagsInputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core TagsInput themed preview',
      },
    },
  },
} satisfies Meta<typeof TagsInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
