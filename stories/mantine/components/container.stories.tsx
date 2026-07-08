import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ContainerStory() {
  return (
    <Mantine.Container size="xs" bg="tinyrack.0" c="dark.9" p="sm">
      Container
    </Mantine.Container>
  );
}

ContainerStory.displayName = 'ContainerStory';

const meta = {
  title: 'Mantine/Container',
  component: ContainerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Container themed preview',
      },
    },
  },
} satisfies Meta<typeof ContainerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
