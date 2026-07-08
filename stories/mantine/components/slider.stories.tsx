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
  value?: number;
};

function SliderStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Slider
      className={controlValues.orientation === 'vertical' ? 'h-48' : 'w-80'}
      color={controlValues.color ?? 'tinyrack'}
      defaultValue={controlValues.value ?? 60}
      orientation={controlValues.orientation ?? 'horizontal'}
      radius={controlValues.radius ?? 'xl'}
      size={controlValues.size ?? 'md'}
    />
  );
}

SliderStory.displayName = 'SliderStory';

const meta = {
  title: 'Mantine/Slider',
  component: SliderStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    size: 'md',
    radius: 'xl',
    orientation: 'horizontal',
    value: 60,
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
      description: 'Slider orientation.',
    },
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
      },
      description: 'Slider value.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Slider themed preview',
      },
    },
  },
} satisfies Meta<typeof SliderStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
