import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineColorOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  color?: (typeof mantineColorOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
};

function BlockquoteStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Blockquote
      cite="Tinyrack operator note"
      color={controlValues.color ?? 'tinyrack'}
      radius={controlValues.radius ?? 'md'}
    >
      Keep the rack quiet, local, and recoverable.
    </Mantine.Blockquote>
  );
}

BlockquoteStory.displayName = 'BlockquoteStory';

const meta = {
  title: 'Mantine/Blockquote',
  component: BlockquoteStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    radius: 'md',
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Blockquote themed preview',
      },
    },
  },
} satisfies Meta<typeof BlockquoteStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
