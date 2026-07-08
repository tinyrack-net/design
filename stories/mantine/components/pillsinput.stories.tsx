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

function PillsInputStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.PillsInput
      disabled={controlValues.disabled ?? false}
      label="Selected nodes"
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'default'}
      className="w-80"
    >
      <Mantine.Pill.Group>
        <Mantine.Pill>nas-01</Mantine.Pill>
        <Mantine.PillsInput.Field placeholder="Add node" />
      </Mantine.Pill.Group>
    </Mantine.PillsInput>
  );
}

PillsInputStory.displayName = 'PillsInputStory';

const meta = {
  title: 'Mantine/PillsInput',
  component: PillsInputStory,
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
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core PillsInput themed preview',
      },
    },
  },
} satisfies Meta<typeof PillsInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
