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

function ThemeIconStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.ThemeIcon
      color={controlValues.color ?? 'tinyrack'}
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'lg'}
      variant={controlValues.variant ?? 'filled'}
    >
      TR
    </Mantine.ThemeIcon>
  );
}

ThemeIconStory.displayName = 'ThemeIconStory';

const meta = {
  title: 'Mantine/ThemeIcon',
  component: ThemeIconStory,
  tags: ['autodocs'],
  args: {
    size: 'lg',
    color: 'tinyrack',
    radius: 'md',
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
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core ThemeIcon themed preview',
      },
    },
  },
} satisfies Meta<typeof ThemeIconStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
