import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineInputVariantOptions = ['default', 'filled', 'unstyled'] as const;

type ComponentStoryProps = {
  variant?: (typeof mantineInputVariantOptions)[number];
  size?: (typeof mantineSizeOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  visible?: boolean;
  disabled?: boolean;
  error?: boolean;
};

function PasswordInputStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.PasswordInput
      defaultValue="tinyrack-secret"
      disabled={controlValues.disabled ?? false}
      error={(controlValues.error ?? false) ? 'Secret is too short.' : undefined}
      label="API secret"
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'default'}
      visible={controlValues.visible ?? false}
      className="w-80"
    />
  );
}

PasswordInputStory.displayName = 'PasswordInputStory';

const meta = {
  title: 'Mantine/PasswordInput',
  component: PasswordInputStory,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'sm',
    radius: 'md',
    visible: false,
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
    visible: {
      control: 'boolean',
      description: 'Shows the password value.',
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
        component: '@mantine/core PasswordInput themed preview',
      },
    },
  },
} satisfies Meta<typeof PasswordInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
