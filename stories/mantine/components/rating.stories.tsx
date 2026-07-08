import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineColorOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  color?: (typeof mantineColorOptions)[number];
  value?: number;
};

function RatingStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Rating
      color={controlValues.color ?? 'tinyrack'}
      defaultValue={controlValues.value ?? 4}
      size={controlValues.size ?? 'md'}
    />
  );
}

RatingStory.displayName = 'RatingStory';

const meta = {
  title: 'Mantine/Rating',
  component: RatingStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    color: 'tinyrack',
    value: 4,
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 5,
        step: 1,
      },
      description: 'Rating value.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Rating themed preview',
      },
    },
  },
} satisfies Meta<typeof RatingStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
