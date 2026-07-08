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
  align?: 'left' | 'center' | 'right';
  variant?: 'none' | 'filled' | 'light';
  withIndicatorBackground?: boolean;
};

function EmptyStateStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.EmptyState
      align={controlValues.align ?? 'center'}
      color={controlValues.color ?? 'tinyrack'}
      size={controlValues.size ?? 'md'}
      {...((controlValues.variant ?? 'none') === 'none'
        ? {}
        : { variant: controlValues.variant as 'filled' | 'light' })}
      withIndicatorBackground={controlValues.withIndicatorBackground ?? true}
      className="w-96"
    >
      <Mantine.EmptyState.Indicator>TR</Mantine.EmptyState.Indicator>
      <Mantine.EmptyState.Title>No alerts</Mantine.EmptyState.Title>
      <Mantine.EmptyState.Description>
        Rack checks are clear for this view.
      </Mantine.EmptyState.Description>
    </Mantine.EmptyState>
  );
}

EmptyStateStory.displayName = 'EmptyStateStory';

const meta = {
  title: 'Mantine/EmptyState',
  component: EmptyStateStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    color: 'tinyrack',
    align: 'center',
    variant: 'none',
    withIndicatorBackground: true,
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
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'EmptyState text alignment.',
    },
    variant: {
      control: 'select',
      options: ['none', 'filled', 'light'],
      description: 'EmptyState visual variant.',
    },
    withIndicatorBackground: {
      control: 'boolean',
      description: 'Shows indicator background.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core EmptyState themed preview',
      },
    },
  },
} satisfies Meta<typeof EmptyStateStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
