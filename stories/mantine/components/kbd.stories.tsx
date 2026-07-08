import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
};

function KbdStory(controlValues: ComponentStoryProps) {
  return <Mantine.Kbd size={controlValues.size ?? 'sm'}>Ctrl K</Mantine.Kbd>;
}

KbdStory.displayName = 'KbdStory';

const meta = {
  title: 'Mantine/Kbd',
  component: KbdStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Kbd themed preview',
      },
    },
  },
} satisfies Meta<typeof KbdStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
