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
  thickness?: number;
};

function RingProgressStory(controlValues: ComponentStoryProps) {
  const value = controlValues.value ?? 72;

  return (
    <Mantine.RingProgress
      label={
        <Mantine.Text ta="center" size="xs">
          {value}%
        </Mantine.Text>
      }
      sections={[{ value, color: controlValues.color ?? 'tinyrack' }]}
      size={controlValues.controlSize ?? 120}
      thickness={controlValues.thickness ?? 12}
    />
  );
}

RingProgressStory.displayName = 'RingProgressStory';

const meta = {
  title: 'Mantine/RingProgress',
  component: RingProgressStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    value: 72,
    controlSize: 120,
    thickness: 12,
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
      description: 'Ring progress value.',
    },
    controlSize: {
      control: {
        type: 'range',
        min: 80,
        max: 180,
        step: 10,
      },
      description: 'Ring size in pixels.',
    },
    thickness: {
      control: {
        type: 'range',
        min: 4,
        max: 24,
        step: 2,
      },
      description: 'Ring thickness.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core RingProgress themed preview',
      },
    },
  },
} satisfies Meta<typeof RingProgressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
