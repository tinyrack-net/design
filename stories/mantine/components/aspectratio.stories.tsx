import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function AspectRatioStory() {
  return (
    <Mantine.AspectRatio ratio={16 / 9} maw={220}>
      <Mantine.Center bg="tinyrack.1" c="dark.9">
        16:9
      </Mantine.Center>
    </Mantine.AspectRatio>
  );
}

AspectRatioStory.displayName = 'AspectRatioStory';

const meta = {
  title: 'Mantine/AspectRatio',
  component: AspectRatioStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core AspectRatio themed preview',
      },
    },
  },
} satisfies Meta<typeof AspectRatioStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
