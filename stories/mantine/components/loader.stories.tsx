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
  type?: 'bars' | 'oval' | 'dots';
};

function LoaderStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Loader
      color={controlValues.color ?? 'tinyrack'}
      size={controlValues.size ?? 'md'}
      type={controlValues.type ?? 'oval'}
    />
  );
}

LoaderStory.displayName = 'LoaderStory';

const meta = {
  title: 'Mantine/Loader',
  component: LoaderStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    color: 'tinyrack',
    type: 'oval',
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
    type: {
      control: 'select',
      options: ['bars', 'oval', 'dots'],
      description: 'Mantine loader type.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Loader themed preview',
      },
    },
  },
} satisfies Meta<typeof LoaderStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
