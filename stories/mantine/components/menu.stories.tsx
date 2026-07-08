import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function MenuStory() {
  return (
    <Mantine.Menu opened withinPortal={false}>
      <Mantine.Menu.Target>
        <Mantine.Button size="xs">Node menu</Mantine.Button>
      </Mantine.Menu.Target>
      <Mantine.Menu.Dropdown>
        <Mantine.Menu.Item>Open logs</Mantine.Menu.Item>
        <Mantine.Menu.Item>Restart service</Mantine.Menu.Item>
      </Mantine.Menu.Dropdown>
    </Mantine.Menu>
  );
}

MenuStory.displayName = 'MenuStory';

const meta = {
  title: 'Mantine/Menu',
  component: MenuStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Menu themed preview',
      },
    },
  },
} satisfies Meta<typeof MenuStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
