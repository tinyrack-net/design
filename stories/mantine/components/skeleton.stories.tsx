import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  radius?: (typeof mantineRadiusOptions)[number];
  visible?: boolean;
  height?: number;
};

function SkeletonStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Skeleton
      height={controlValues.height ?? 48}
      radius={controlValues.radius ?? 'md'}
      visible={controlValues.visible ?? true}
      width={280}
    />
  );
}

SkeletonStory.displayName = 'SkeletonStory';

const meta = {
  title: 'Mantine/Skeleton',
  component: SkeletonStory,
  tags: ['autodocs'],
  args: {
    radius: 'md',
    visible: true,
    height: 48,
  },
  argTypes: {
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    visible: {
      control: 'boolean',
      description: 'Shows skeleton placeholder state.',
    },
    height: {
      control: {
        type: 'range',
        min: 24,
        max: 96,
        step: 8,
      },
      description: 'Skeleton height in pixels.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Skeleton themed preview',
      },
    },
  },
} satisfies Meta<typeof SkeletonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
