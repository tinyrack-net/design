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
};

function TagsInputStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.TagsInput
      data={['backup', 'network', 'storage']}
      defaultValue={['backup']}
      disabled={controlValues.disabled ?? false}
      label="Tags"
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'default'}
      className="w-80"
    />
  );
}

TagsInputStory.displayName = 'TagsInputStory';

const meta = {
  title: 'Mantine/TagsInput',
  component: TagsInputStory,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'sm',
    radius: 'md',
    disabled: false,
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
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core TagsInput themed preview',
      },
    },
  },
} satisfies Meta<typeof TagsInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
