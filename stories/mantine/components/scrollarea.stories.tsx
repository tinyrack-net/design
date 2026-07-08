import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ScrollAreaStory() {
  return (
    <Mantine.ScrollArea h={80}>
      <Mantine.Text>
        Scrollable content
        <br />
        Line 2<br />
        Line 3<br />
        Line 4<br />
        Line 5
      </Mantine.Text>
    </Mantine.ScrollArea>
  );
}

ScrollAreaStory.displayName = 'ScrollAreaStory';

const meta = {
  title: 'Mantine/ScrollArea',
  component: ScrollAreaStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core ScrollArea themed preview',
      },
    },
  },
} satisfies Meta<typeof ScrollAreaStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
