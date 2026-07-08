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
  checked?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'outline';
};

function ChipStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Chip
      checked={controlValues.checked ?? true}
      color={controlValues.color ?? 'tinyrack'}
      disabled={controlValues.disabled ?? false}
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'filled'}
    >
      Backup
    </Mantine.Chip>
  );
}

ChipStory.displayName = 'ChipStory';

const meta = {
  title: 'Mantine/Chip',
  component: ChipStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    size: 'sm',
    radius: 'md',
    checked: true,
    disabled: false,
    variant: 'filled',
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
    checked: {
      control: 'boolean',
      description: 'Checked state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outline'],
      description: 'Chip variant.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Chip themed preview',
      },
    },
  },
} satisfies Meta<typeof ChipStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
