import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  variant?:
    | 'filled'
    | 'light'
    | 'outline'
    | 'dot'
    | 'transparent'
    | 'white'
    | 'default'
    | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'tinyrack' | 'blue' | 'gray' | 'green' | 'yellow' | 'red';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

function BadgeStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Badge
      color={controlValues.color ?? 'tinyrack'}
      radius={controlValues.radius ?? 'xl'}
      size={controlValues.size ?? 'md'}
      variant={controlValues.variant ?? 'filled'}
    >
      Healthy
    </Mantine.Badge>
  );
}

BadgeStory.displayName = 'BadgeStory';

const meta = {
  title: 'Mantine/Badge',
  component: BadgeStory,
  tags: ['autodocs'],
  args: {
    variant: 'filled',
    size: 'md',
    color: 'tinyrack',
    radius: 'xl',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'filled',
        'light',
        'outline',
        'dot',
        'transparent',
        'white',
        'default',
        'gradient',
      ],
      description: 'Mantine badge visual variant.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Badge size token.',
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
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Badge themed preview',
      },
    },
  },
} satisfies Meta<typeof BadgeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
