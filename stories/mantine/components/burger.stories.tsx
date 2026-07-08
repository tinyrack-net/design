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

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  color?: (typeof mantineColorOptions)[number];
  opened?: boolean;
  disabled?: boolean;
};

function BurgerStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Burger
      color={controlValues.color ?? 'tinyrack'}
      disabled={controlValues.disabled ?? false}
      opened={controlValues.opened ?? true}
      size={controlValues.size ?? 'sm'}
      aria-label="Toggle navigation"
    />
  );
}

BurgerStory.displayName = 'BurgerStory';

const meta = {
  title: 'Mantine/Burger',
  component: BurgerStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    color: 'tinyrack',
    opened: true,
    disabled: false,
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
    opened: {
      control: 'boolean',
      description: 'Opened state.',
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
        component: '@mantine/core Burger themed preview',
      },
    },
  },
} satisfies Meta<typeof BurgerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
