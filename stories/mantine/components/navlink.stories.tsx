import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function NavLinkStory() {
  return <Mantine.NavLink label="Nodes" active />;
}

NavLinkStory.displayName = 'NavLinkStory';

const meta = {
  title: 'Mantine/NavLink',
  component: NavLinkStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core NavLink themed preview',
      },
    },
  },
} satisfies Meta<typeof NavLinkStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
