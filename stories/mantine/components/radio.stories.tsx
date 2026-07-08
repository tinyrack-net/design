import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  variant?: 'filled' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'tinyrack' | 'blue' | 'gray' | 'green' | 'yellow' | 'red';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  checked?: boolean;
  disabled?: boolean;
  labelPosition?: 'right' | 'left';
};

function RadioStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Radio
      checked={controlValues.checked ?? true}
      color={controlValues.color ?? 'tinyrack'}
      disabled={controlValues.disabled ?? false}
      label="Radio"
      labelPosition={controlValues.labelPosition ?? 'right'}
      radius={controlValues.radius ?? 'sm'}
      readOnly
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'filled'}
    />
  );
}

RadioStory.displayName = 'RadioStory';

const meta = {
  title: 'Mantine/Radio',
  component: RadioStory,
  tags: ['autodocs'],
  args: {
    variant: 'filled',
    size: 'sm',
    color: 'tinyrack',
    radius: 'sm',
    checked: true,
    disabled: false,
    labelPosition: 'right',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outline'],
      description: 'Mantine control variant.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Control size token.',
    },
    color: {
      control: 'select',
      options: ['tinyrack', 'blue', 'gray', 'green', 'yellow', 'red'],
      description: 'Checked color token.',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Control radius token.',
    },
    checked: { control: 'boolean', description: 'Checked state.' },
    disabled: { control: 'boolean', description: 'Disabled state.' },
    labelPosition: {
      control: 'select',
      options: ['right', 'left'],
      description: 'Label placement.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Radio themed preview',
      },
    },
  },
} satisfies Meta<typeof RadioStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
