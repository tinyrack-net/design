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

const mantineTextVariantOptions = ['text', 'gradient'] as const;

type ComponentStoryProps = {
  color?: (typeof mantineColorOptions)[number];
  variant?: (typeof mantineTextVariantOptions)[number];
  term?: 'rack' | 'backup' | 'local';
};

function HighlightStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Highlight
      color={controlValues.color ?? 'tinyrack'}
      highlight={controlValues.term ?? 'rack'}
      variant={controlValues.variant ?? 'text'}
    >
      Tinyrack keeps backup and local rack operations visible.
    </Mantine.Highlight>
  );
}

HighlightStory.displayName = 'HighlightStory';

const meta = {
  title: 'Mantine/Highlight',
  component: HighlightStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    variant: 'text',
    term: 'rack',
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    variant: {
      control: 'select',
      options: mantineTextVariantOptions,
      description: 'Highlight text variant.',
    },
    term: {
      control: 'select',
      options: ['rack', 'backup', 'local'],
      description: 'Highlighted term.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Highlight themed preview',
      },
    },
  },
} satisfies Meta<typeof HighlightStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
