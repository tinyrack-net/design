import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function CollapseStory() {
  return <Mantine.Collapse expanded>Collapse content</Mantine.Collapse>;
}

CollapseStory.displayName = 'CollapseStory';

const meta = {
  title: 'Mantine/Collapse',
  component: CollapseStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Collapse themed preview',
      },
    },
  },
} satisfies Meta<typeof CollapseStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
