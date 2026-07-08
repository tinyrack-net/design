import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function HoverCardStory() {
  return (
    <Mantine.HoverCard defaultOpened withinPortal={false}>
      <Mantine.HoverCard.Target>
        <Mantine.Button size="xs">Inspect</Mantine.Button>
      </Mantine.HoverCard.Target>
      <Mantine.HoverCard.Dropdown>
        node-01 has 3 active containers.
      </Mantine.HoverCard.Dropdown>
    </Mantine.HoverCard>
  );
}

HoverCardStory.displayName = 'HoverCardStory';

const meta = {
  title: 'Mantine/HoverCard',
  component: HoverCardStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core HoverCard themed preview',
      },
    },
  },
} satisfies Meta<typeof HoverCardStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
