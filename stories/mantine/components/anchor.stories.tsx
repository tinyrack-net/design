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
  variant?: (typeof mantineTextVariantOptions)[number];
  underline?: 'always' | 'hover' | 'never';
  color?: (typeof mantineColorOptions)[number];
};

function AnchorStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Anchor
      c={controlValues.color ?? 'tinyrack'}
      href="#top"
      underline={controlValues.underline ?? 'hover'}
      variant={controlValues.variant ?? 'text'}
    >
      Open node details
    </Mantine.Anchor>
  );
}

AnchorStory.displayName = 'AnchorStory';

const meta = {
  title: 'Mantine/Anchor',
  component: AnchorStory,
  tags: ['autodocs'],
  args: {
    variant: 'text',
    underline: 'hover',
    color: 'tinyrack',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: mantineTextVariantOptions,
      description: 'Anchor text variant.',
    },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'never'],
      description: 'Underline behavior.',
    },
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Anchor themed preview',
      },
    },
  },
} satisfies Meta<typeof AnchorStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
