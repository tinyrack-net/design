import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineColorOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineButtonVariantOptions = [
  'filled',
  'light',
  'outline',
  'subtle',
  'transparent',
  'white',
  'default',
  'gradient',
] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  color?: (typeof mantineColorOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  variant?: (typeof mantineButtonVariantOptions)[number];
};

function AvatarStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Avatar
      color={controlValues.color ?? 'tinyrack'}
      radius={controlValues.radius ?? 'xl'}
      size={controlValues.size ?? 'md'}
      variant={controlValues.variant ?? 'filled'}
    >
      TR
    </Mantine.Avatar>
  );
}

AvatarStory.displayName = 'AvatarStory';

const meta = {
  title: 'Mantine/Avatar',
  component: AvatarStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    color: 'tinyrack',
    radius: 'xl',
    variant: 'filled',
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    variant: {
      control: 'select',
      options: mantineButtonVariantOptions,
      description: 'Mantine visual variant.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Avatar themed preview',
      },
    },
  },
} satisfies Meta<typeof AvatarStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
