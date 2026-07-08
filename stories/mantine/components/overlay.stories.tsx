import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function OverlayStory() {
  return (
    <Mantine.Box pos="relative" h={72} bg="dark.8">
      <Mantine.Overlay color="#000" backgroundOpacity={0.25} />
      <Mantine.Text c="white" pos="relative" p="sm">
        Overlay
      </Mantine.Text>
    </Mantine.Box>
  );
}

OverlayStory.displayName = 'OverlayStory';

const meta = {
  title: 'Mantine/Overlay',
  component: OverlayStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Overlay themed preview',
      },
    },
  },
} satisfies Meta<typeof OverlayStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
