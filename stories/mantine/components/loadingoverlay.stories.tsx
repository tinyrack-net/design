import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function LoadingOverlayStory() {
  return (
    <Mantine.Box pos="relative" h={72}>
      <Mantine.LoadingOverlay visible zIndex={1} />
      <Mantine.Text>Loading area</Mantine.Text>
    </Mantine.Box>
  );
}

LoadingOverlayStory.displayName = 'LoadingOverlayStory';

const meta = {
  title: 'Mantine/LoadingOverlay',
  component: LoadingOverlayStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core LoadingOverlay themed preview',
      },
    },
  },
} satisfies Meta<typeof LoadingOverlayStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
