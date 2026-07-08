import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  inline?: boolean;
  height?: number;
};

function CenterStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Center
      className="w-80 rounded-md border border-neutral-700"
      h={controlValues.height ?? 120}
      inline={controlValues.inline ?? false}
    >
      <Mantine.Badge color="tinyrack">Centered</Mantine.Badge>
    </Mantine.Center>
  );
}

CenterStory.displayName = 'CenterStory';

const meta = {
  title: 'Mantine/Center',
  component: CenterStory,
  tags: ['autodocs'],
  args: {
    inline: false,
    height: 120,
  },
  argTypes: {
    inline: {
      control: 'boolean',
      description: 'Uses inline center display.',
    },
    height: {
      control: {
        type: 'range',
        min: 64,
        max: 200,
        step: 8,
      },
      description: 'Container height in pixels.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Center themed preview',
      },
    },
  },
} satisfies Meta<typeof CenterStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
