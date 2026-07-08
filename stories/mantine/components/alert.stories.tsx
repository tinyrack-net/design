import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  variant?: 'light' | 'filled' | 'outline' | 'transparent' | 'default';
  color?: 'tinyrack' | 'blue' | 'gray' | 'green' | 'yellow' | 'red';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withCloseButton?: boolean;
};

function AlertStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Alert
      color={controlValues.color ?? 'tinyrack'}
      radius={controlValues.radius ?? 'md'}
      title="Backup window delayed"
      variant={controlValues.variant ?? 'light'}
      withCloseButton={controlValues.withCloseButton ?? false}
    >
      NAS snapshot is still running on node-01. Keep restart actions paused.
    </Mantine.Alert>
  );
}

AlertStory.displayName = 'AlertStory';

const meta = {
  title: 'Mantine/Alert',
  component: AlertStory,
  tags: ['autodocs'],
  args: {
    variant: 'light',
    color: 'tinyrack',
    radius: 'md',
    withCloseButton: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['light', 'filled', 'outline', 'transparent', 'default'],
      description: 'Mantine alert visual variant.',
    },
    color: {
      control: 'select',
      options: ['tinyrack', 'blue', 'gray', 'green', 'yellow', 'red'],
      description: 'Theme color token.',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius token.',
    },
    withCloseButton: {
      control: 'boolean',
      description: 'Show close button affordance.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Alert themed preview',
      },
    },
  },
} satisfies Meta<typeof AlertStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
