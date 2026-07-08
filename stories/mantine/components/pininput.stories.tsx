import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  disabled?: boolean;
  type?: 'alphanumeric' | 'number';
  length?: number;
};

function PinInputStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.PinInput
      defaultValue="1234"
      disabled={controlValues.disabled ?? false}
      length={controlValues.length ?? 4}
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      type={controlValues.type ?? 'number'}
    />
  );
}

PinInputStory.displayName = 'PinInputStory';

const meta = {
  title: 'Mantine/PinInput',
  component: PinInputStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    radius: 'md',
    disabled: false,
    type: 'number',
    length: 4,
  },
  argTypes: {
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
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
    type: {
      control: 'select',
      options: ['alphanumeric', 'number'],
      description: 'Pin input type.',
    },
    length: {
      control: {
        type: 'number',
        min: 3,
        max: 6,
        step: 1,
      },
      description: 'Number of input cells.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core PinInput themed preview',
      },
    },
  },
} satisfies Meta<typeof PinInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
