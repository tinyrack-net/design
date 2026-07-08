import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  variant?: 'default' | 'filled' | 'unstyled';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  error?: boolean;
};

function InputStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Input
      disabled={controlValues.disabled ?? false}
      error={controlValues.error ?? false}
      placeholder="rack.local"
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'default'}
    />
  );
}

InputStory.displayName = 'InputStory';

const meta = {
  title: 'Mantine/Input',
  component: InputStory,
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
      options: ['default', 'filled', 'unstyled'],
      description: 'Mantine input variant.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Input size token.',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius token.',
    },
    disabled: { control: 'boolean', description: 'Disabled state.' },
    error: { control: 'boolean', description: 'Error state.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Input themed preview',
      },
    },
  },
} satisfies Meta<typeof InputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
