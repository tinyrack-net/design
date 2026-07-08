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

type ComponentStoryProps = {
  color?: (typeof mantineColorOptions)[number];
};

function MarkStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Text>
      <Mantine.Mark color={controlValues.color ?? 'tinyrack'}>Local-first</Mantine.Mark>{' '}
      rack operations.
    </Mantine.Text>
  );
}

MarkStory.displayName = 'MarkStory';

const meta = {
  title: 'Mantine/Mark',
  component: MarkStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Mark themed preview',
      },
    },
  },
} satisfies Meta<typeof MarkStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
