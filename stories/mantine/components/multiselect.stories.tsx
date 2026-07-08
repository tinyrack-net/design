import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineInputVariantOptions = ['default', 'filled', 'unstyled'] as const;

type ComponentStoryProps = {
  variant?: (typeof mantineInputVariantOptions)[number];
  size?: (typeof mantineSizeOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  disabled?: boolean;
  withCheckIcon?: boolean;
};

function MultiSelectStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.MultiSelect
      data={['backup', 'network', 'storage']}
      defaultValue={['backup']}
      disabled={controlValues.disabled ?? false}
      label="Tags"
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'default'}
      withCheckIcon={controlValues.withCheckIcon ?? true}
      className="w-80"
    />
  );
}

MultiSelectStory.displayName = 'MultiSelectStory';

const meta = {
  title: 'Mantine/MultiSelect',
  component: MultiSelectStory,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'sm',
    radius: 'md',
    disabled: false,
    withCheckIcon: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: mantineInputVariantOptions,
      description: 'Mantine input variant.',
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
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
    withCheckIcon: {
      control: 'boolean',
      description: 'Shows check icons in options.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core MultiSelect themed preview',
      },
    },
  },
} satisfies Meta<typeof MultiSelectStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
