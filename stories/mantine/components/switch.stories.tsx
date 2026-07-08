import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'tinyrack' | 'blue' | 'gray' | 'green' | 'yellow' | 'red';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  checked?: boolean;
  disabled?: boolean;
  labelPosition?: 'right' | 'left';
};

function SwitchStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Switch
      checked={controlValues.checked ?? true}
      color={controlValues.color ?? 'tinyrack'}
      disabled={controlValues.disabled ?? false}
      label="Guard restarts"
      labelPosition={controlValues.labelPosition ?? 'right'}
      radius={controlValues.radius ?? 'sm'}
      readOnly
      size={controlValues.size ?? 'sm'}
    />
  );
}

SwitchStory.displayName = 'SwitchStory';

const meta = {
  title: 'Mantine/Switch',
  component: SwitchStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    color: 'tinyrack',
    radius: 'sm',
    checked: true,
    disabled: false,
    labelPosition: 'right',
  },
  argTypes: {
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
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Switch themed preview',
      },
    },
  },
} satisfies Meta<typeof SwitchStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
