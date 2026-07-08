import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function DrawerStory() {
  return (
    <Mantine.Box>
      <Mantine.Drawer
        opened={false}
        onClose={() => undefined}
        title="Drawer"
        withinPortal={false}
      >
        Drawer content
      </Mantine.Drawer>
      <Mantine.Button variant="light">Drawer trigger</Mantine.Button>
    </Mantine.Box>
  );
}

DrawerStory.displayName = 'DrawerStory';

const meta = {
  title: 'Mantine/Drawer',
  component: DrawerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Drawer themed preview',
      },
    },
  },
} satisfies Meta<typeof DrawerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
