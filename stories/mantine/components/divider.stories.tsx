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

const mantineOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  color?: (typeof mantineColorOptions)[number];
  size?: (typeof mantineSizeOptions)[number];
  orientation?: (typeof mantineOrientationOptions)[number];
  variant?: 'solid' | 'dashed' | 'dotted';
  labelPosition?: 'left' | 'center' | 'right';
};

function DividerStory(controlValues: ComponentStoryProps) {
  return (
    <div className={controlValues.orientation === 'vertical' ? 'flex h-40' : 'w-80'}>
      <Mantine.Divider
        color={controlValues.color ?? 'tinyrack'}
        label="rack"
        labelPosition={controlValues.labelPosition ?? 'center'}
        orientation={controlValues.orientation ?? 'horizontal'}
        size={controlValues.size ?? 'sm'}
        variant={controlValues.variant ?? 'solid'}
      />
    </div>
  );
}

DividerStory.displayName = 'DividerStory';

const meta = {
  title: 'Mantine/Divider',
  component: DividerStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    size: 'sm',
    orientation: 'horizontal',
    variant: 'solid',
    labelPosition: 'center',
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    orientation: {
      control: 'select',
      options: mantineOrientationOptions,
      description: 'Divider orientation.',
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Divider line variant.',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Divider label position.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Divider themed preview',
      },
    },
  },
} satisfies Meta<typeof DividerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
