import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  withRemoveButton?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'outline';
};

function PillStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Pill
      disabled={controlValues.disabled ?? false}
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'default'}
      withRemoveButton={controlValues.withRemoveButton ?? true}
    >
      nas-01
    </Mantine.Pill>
  );
}

PillStory.displayName = 'PillStory';

const meta = {
  title: 'Mantine/Pill',
  component: PillStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    radius: 'md',
    withRemoveButton: true,
    disabled: false,
    variant: 'default',
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
    withRemoveButton: {
      control: 'boolean',
      description: 'Shows remove button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Pill variant.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Pill themed preview',
      },
    },
  },
} satisfies Meta<typeof PillStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
