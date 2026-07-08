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
};

function RangeSliderStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.RangeSlider
      className={controlValues.orientation === 'vertical' ? 'h-48' : 'w-80'}
      color={controlValues.color ?? 'tinyrack'}
      defaultValue={[20, 80]}
      orientation={controlValues.orientation ?? 'horizontal'}
      radius={controlValues.radius ?? 'xl'}
      size={controlValues.size ?? 'md'}
    />
  );
}

RangeSliderStory.displayName = 'RangeSliderStory';

const meta = {
  title: 'Mantine/RangeSlider',
  component: RangeSliderStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    size: 'md',
    radius: 'xl',
    orientation: 'horizontal',
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
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core RangeSlider themed preview',
      },
    },
  },
} satisfies Meta<typeof RangeSliderStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
