import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function PopoverStory() {
  return (
    <Mantine.Popover opened withinPortal={false}>
      <Mantine.Popover.Target>
        <Mantine.Button size="xs">Inspect route</Mantine.Button>
      </Mantine.Popover.Target>
      <Mantine.Popover.Dropdown>Popover content</Mantine.Popover.Dropdown>
    </Mantine.Popover>
  );
}

PopoverStory.displayName = 'PopoverStory';

const meta = {
  title: 'Mantine/Popover',
  component: PopoverStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Popover themed preview',
      },
    },
  },
} satisfies Meta<typeof PopoverStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
