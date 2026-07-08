import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineTextVariantOptions = ['text', 'gradient'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  variant?: (typeof mantineTextVariantOptions)[number];
  truncate?: 'none' | 'start' | 'end';
  lineClamp?: number;
};

function TextStory(controlValues: ComponentStoryProps) {
  const truncate = controlValues.truncate ?? 'none';
  const lineClamp = controlValues.lineClamp ?? 0;

  return (
    <Mantine.Text
      className="w-80"
      size={controlValues.size ?? 'md'}
      variant={controlValues.variant ?? 'text'}
      {...(lineClamp > 0 ? { lineClamp } : {})}
      {...(truncate === 'none' ? {} : { truncate })}
    >
      Tinyrack keeps homelab operations quiet, local, and recoverable.
    </Mantine.Text>
  );
}

TextStory.displayName = 'TextStory';

const meta = {
  title: 'Mantine/Text',
  component: TextStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'text',
    truncate: 'none',
    lineClamp: 0,
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    variant: {
      control: 'select',
      options: mantineTextVariantOptions,
      description: 'Text variant.',
    },
    truncate: {
      control: 'select',
      options: ['none', 'start', 'end'],
      description: 'Text truncation mode.',
    },
    lineClamp: {
      control: {
        type: 'number',
        min: 0,
        max: 3,
        step: 1,
      },
      description: 'Line clamp count. Zero disables clamping.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Text themed preview',
      },
    },
  },
} satisfies Meta<typeof TextStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
