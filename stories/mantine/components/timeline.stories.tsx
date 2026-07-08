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
  active?: number;
  align?: 'left' | 'right';
};

function TimelineStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Timeline
      active={controlValues.active ?? 1}
      align={controlValues.align ?? 'left'}
      color={controlValues.color ?? 'tinyrack'}
      radius={controlValues.radius ?? 'xl'}
    >
      <Mantine.Timeline.Item title="Deploy">Storybook deployed</Mantine.Timeline.Item>
      <Mantine.Timeline.Item title="Verify">Checks passed</Mantine.Timeline.Item>
      <Mantine.Timeline.Item title="Release">Ready</Mantine.Timeline.Item>
    </Mantine.Timeline>
  );
}

TimelineStory.displayName = 'TimelineStory';

const meta = {
  title: 'Mantine/Timeline',
  component: TimelineStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    radius: 'xl',
    active: 1,
    align: 'left',
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
    active: {
      control: {
        type: 'number',
        min: 0,
        max: 2,
        step: 1,
      },
      description: 'Active timeline item index.',
    },
    align: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Timeline alignment.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Timeline themed preview',
      },
    },
  },
} satisfies Meta<typeof TimelineStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
