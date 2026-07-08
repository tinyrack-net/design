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
  order?: 1 | 2 | 3 | 4;
  size?: 'h1' | 'h2' | 'h3' | 'h4';
  color?: (typeof mantineColorOptions)[number];
};

function TitleStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Title
      c={controlValues.color ?? 'tinyrack'}
      order={controlValues.order ?? 3}
      size={controlValues.size ?? 'h3'}
    >
      Rack status
    </Mantine.Title>
  );
}

TitleStory.displayName = 'TitleStory';

const meta = {
  title: 'Mantine/Title',
  component: TitleStory,
  tags: ['autodocs'],
  args: {
    order: 3,
    size: 'h3',
    color: 'tinyrack',
  },
  argTypes: {
    order: {
      control: {
        type: 'number',
        min: 1,
        max: 4,
        step: 1,
      },
      description: 'Semantic heading order.',
    },
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4'],
      description: 'Visual title size.',
    },
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Title themed preview',
      },
    },
  },
} satisfies Meta<typeof TitleStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
