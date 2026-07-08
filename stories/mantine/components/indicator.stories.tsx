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
  controlSize?: number;
  position?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  withBorder?: boolean;
  disabled?: boolean;
};

function IndicatorStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Indicator
      color={controlValues.color ?? 'tinyrack'}
      disabled={controlValues.disabled ?? false}
      position={controlValues.position ?? 'top-end'}
      radius={controlValues.radius ?? 'xl'}
      size={controlValues.controlSize ?? 12}
      withBorder={controlValues.withBorder ?? true}
    >
      <Mantine.Avatar radius="md">TR</Mantine.Avatar>
    </Mantine.Indicator>
  );
}

IndicatorStory.displayName = 'IndicatorStory';

const meta = {
  title: 'Mantine/Indicator',
  component: IndicatorStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    radius: 'xl',
    controlSize: 12,
    position: 'top-end',
    withBorder: true,
    disabled: false,
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
    controlSize: {
      control: {
        type: 'range',
        min: 6,
        max: 24,
        step: 2,
      },
      description: 'Indicator size in pixels.',
    },
    position: {
      control: 'select',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
      description: 'Indicator position.',
    },
    withBorder: {
      control: 'boolean',
      description: 'Shows the contrast border.',
    },
    disabled: {
      control: 'boolean',
      description: 'Hides the indicator.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Indicator themed preview',
      },
    },
  },
} satisfies Meta<typeof IndicatorStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
