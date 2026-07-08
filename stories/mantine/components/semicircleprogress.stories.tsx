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
  value?: number;
  controlSize?: number;
  orientation?: 'up' | 'down';
};

function SemiCircleProgressStory(controlValues: ComponentStoryProps) {
  const value = controlValues.value ?? 72;

  return (
    <Mantine.SemiCircleProgress
      filledSegmentColor={controlValues.color ?? 'tinyrack'}
      label={<Mantine.Text size="xs">{value}%</Mantine.Text>}
      orientation={controlValues.orientation ?? 'up'}
      size={controlValues.controlSize ?? 160}
      value={value}
    />
  );
}

SemiCircleProgressStory.displayName = 'SemiCircleProgressStory';

const meta = {
  title: 'Mantine/SemiCircleProgress',
  component: SemiCircleProgressStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    value: 72,
    controlSize: 160,
    orientation: 'up',
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
      },
      description: 'Semi circle progress value.',
    },
    controlSize: {
      control: {
        type: 'range',
        min: 100,
        max: 240,
        step: 10,
      },
      description: 'Semi circle size in pixels.',
    },
    orientation: {
      control: 'select',
      options: ['up', 'down'],
      description: 'Semi circle orientation.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core SemiCircleProgress themed preview',
      },
    },
  },
} satisfies Meta<typeof SemiCircleProgressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
