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
  error?: boolean;
};

function JsonInputStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.JsonInput
      autosize
      defaultValue={'{"host":"nas-01"}'}
      disabled={controlValues.disabled ?? false}
      error={(controlValues.error ?? false) ? 'JSON is invalid.' : undefined}
      label="JSON config"
      minRows={3}
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'default'}
      className="w-80"
    />
  );
}

JsonInputStory.displayName = 'JsonInputStory';

const meta = {
  title: 'Mantine/JsonInput',
  component: JsonInputStory,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'sm',
    radius: 'md',
    disabled: false,
    error: false,
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
    error: {
      control: 'boolean',
      description: 'Shows an error state.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core JsonInput themed preview',
      },
    },
  },
} satisfies Meta<typeof JsonInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
