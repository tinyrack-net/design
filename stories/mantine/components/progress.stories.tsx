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

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  color?: (typeof mantineColorOptions)[number];
  size?: (typeof mantineSizeOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  value?: number;
  striped?: boolean;
  animated?: boolean;
};

function ProgressStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Progress
      animated={controlValues.animated ?? false}
      color={controlValues.color ?? 'tinyrack'}
      radius={controlValues.radius ?? 'xl'}
      size={controlValues.size ?? 'md'}
      striped={controlValues.striped ?? false}
      value={controlValues.value ?? 72}
      className="w-80"
    />
  );
}

ProgressStory.displayName = 'ProgressStory';

const meta = {
  title: 'Mantine/Progress',
  component: ProgressStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    size: 'md',
    radius: 'xl',
    value: 72,
    striped: false,
    animated: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
      },
      description: 'Progress value.',
    },
    striped: {
      control: 'boolean',
      description: 'Shows striped progress fill.',
    },
    animated: {
      control: 'boolean',
      description: 'Animates striped progress fill.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Progress themed preview',
      },
    },
  },
} satisfies Meta<typeof ProgressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
