import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function SpoilerStory() {
  return (
    <Mantine.Spoiler maxHeight={36} showLabel="Show" hideLabel="Hide">
      Spoiler content with more text for previewing typography and spacing.
    </Mantine.Spoiler>
  );
}

SpoilerStory.displayName = 'SpoilerStory';

const meta = {
  title: 'Mantine/Spoiler',
  component: SpoilerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Spoiler themed preview',
      },
    },
  },
} satisfies Meta<typeof SpoilerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
