import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  height?: number;
  width?: number;
};

function SpaceStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Group gap="sm">
      <Mantine.Badge>Before</Mantine.Badge>
      <Mantine.Space h={controlValues.height ?? 24} w={controlValues.width ?? 32} />
      <Mantine.Badge color="tinyrack">After</Mantine.Badge>
    </Mantine.Group>
  );
}

SpaceStory.displayName = 'SpaceStory';

const meta = {
  title: 'Mantine/Space',
  component: SpaceStory,
  tags: ['autodocs'],
  args: {
    height: 24,
    width: 32,
  },
  argTypes: {
    height: {
      control: {
        type: 'range',
        min: 0,
        max: 80,
        step: 4,
      },
      description: 'Space height.',
    },
    width: {
      control: {
        type: 'range',
        min: 0,
        max: 120,
        step: 4,
      },
      description: 'Space width.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Space themed preview',
      },
    },
  },
} satisfies Meta<typeof SpaceStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
