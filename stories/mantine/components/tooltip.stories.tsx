import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function TooltipStory() {
  return (
    <Mantine.Tooltip label="Open service logs" opened withinPortal={false}>
      <Mantine.Button size="xs">Logs</Mantine.Button>
    </Mantine.Tooltip>
  );
}

TooltipStory.displayName = 'TooltipStory';

const meta = {
  title: 'Mantine/Tooltip',
  component: TooltipStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Tooltip themed preview',
      },
    },
  },
} satisfies Meta<typeof TooltipStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
