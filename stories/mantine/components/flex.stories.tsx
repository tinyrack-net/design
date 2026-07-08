import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function FlexStory() {
  return (
    <Mantine.Flex gap="sm">
      <Mantine.Badge>One</Mantine.Badge>
      <Mantine.Badge>Two</Mantine.Badge>
    </Mantine.Flex>
  );
}

FlexStory.displayName = 'FlexStory';

const meta = {
  title: 'Mantine/Flex',
  component: FlexStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Flex themed preview',
      },
    },
  },
} satisfies Meta<typeof FlexStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
