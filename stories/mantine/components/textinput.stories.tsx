import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  variant?: 'default' | 'filled' | 'unstyled';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  error?: boolean;
};

function TextInputStory(controlValues: ComponentStoryProps) {
  const disabled = controlValues.disabled ?? false;
  const error =
    (controlValues.error ?? false) ? 'Use a local hostname or LAN IP.' : undefined;
  const radius = controlValues.radius ?? 'md';
  const size = controlValues.size ?? 'sm';
  const variant = controlValues.variant ?? 'default';

  return (
    <Mantine.Stack
      className="grid w-[min(100%,42rem)] max-w-full min-w-0 box-border gap-3"
      gap="sm"
    >
      <Mantine.TextInput
        disabled={disabled}
        error={error}
        label="Local domain"
        placeholder="rack.local"
        radius={radius}
        size={size}
        variant={variant}
      />
      <Mantine.TextInput
        error="Use a local hostname or LAN IP."
        label="Route target"
        placeholder="192.168.1.2"
        radius={radius}
        size={size}
        variant={variant}
      />
      <Mantine.TextInput
        disabled
        label="DHCP lease"
        placeholder="Managed by router"
        radius={radius}
        size={size}
        variant={variant}
      />
    </Mantine.Stack>
  );
}

TextInputStory.displayName = 'TextInputStory';

const meta = {
  title: 'Mantine/TextInput',
  component: TextInputStory,
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
        component: '@mantine/core TextInput themed preview',
      },
    },
  },
} satisfies Meta<typeof TextInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
