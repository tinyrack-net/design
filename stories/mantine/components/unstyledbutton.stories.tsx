import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineColorOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  padded?: boolean;
  radius?: (typeof mantineRadiusOptions)[number];
  color?: (typeof mantineColorOptions)[number];
  disabled?: boolean;
};

function UnstyledButtonStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.UnstyledButton
      bg={controlValues.color ?? 'tinyrack'}
      c="white"
      className={(controlValues.padded ?? true) ? 'px-4 py-2' : undefined}
      disabled={controlValues.disabled ?? false}
      style={{
        borderRadius: `var(--mantine-radius-${controlValues.radius ?? 'md'})`,
      }}
    >
      Open console
    </Mantine.UnstyledButton>
  );
}

UnstyledButtonStory.displayName = 'UnstyledButtonStory';

const meta = {
  title: 'Mantine/UnstyledButton',
  component: UnstyledButtonStory,
  tags: ['autodocs'],
  args: {
    padded: true,
    radius: 'md',
    color: 'tinyrack',
    disabled: false,
  },
  argTypes: {
    padded: {
      control: 'boolean',
      description: 'Applies padding to the unstyled button preview.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
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
        component: '@mantine/core UnstyledButton themed preview',
      },
    },
  },
} satisfies Meta<typeof UnstyledButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
