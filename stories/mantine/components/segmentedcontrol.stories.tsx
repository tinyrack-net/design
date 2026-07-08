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

const mantineOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  color?: (typeof mantineColorOptions)[number];
  size?: (typeof mantineSizeOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  orientation?: (typeof mantineOrientationOptions)[number];
  disabled?: boolean;
  withItemsBorders?: boolean;
};

function SegmentedControlStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.SegmentedControl
      color={controlValues.color ?? 'tinyrack'}
      data={['Status', 'Logs', 'Settings']}
      disabled={controlValues.disabled ?? false}
      orientation={controlValues.orientation ?? 'horizontal'}
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      withItemsBorders={controlValues.withItemsBorders ?? true}
    />
  );
}

SegmentedControlStory.displayName = 'SegmentedControlStory';

const meta = {
  title: 'Mantine/SegmentedControl',
  component: SegmentedControlStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    size: 'sm',
    radius: 'md',
    orientation: 'horizontal',
    disabled: false,
    withItemsBorders: true,
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
    orientation: {
      control: 'select',
      options: mantineOrientationOptions,
      description: 'SegmentedControl orientation.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
    withItemsBorders: {
      control: 'boolean',
      description: 'Shows item borders.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core SegmentedControl themed preview',
      },
    },
  },
} satisfies Meta<typeof SegmentedControlStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
