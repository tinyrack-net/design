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
  color?: (typeof mantineColorOptions)[number];
  variant?: (typeof mantineButtonVariantOptions)[number];
  copied?: boolean;
};

function CopyButtonStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.CopyButton value="tinyrack.local">
      {({ copy }) => (
        <Mantine.Button
          color={
            (controlValues.copied ?? false)
              ? 'green'
              : (controlValues.color ?? 'tinyrack')
          }
          onClick={copy}
          size="xs"
          variant={controlValues.variant ?? 'filled'}
        >
          {(controlValues.copied ?? false) ? 'Copied' : 'Copy host'}
        </Mantine.Button>
      )}
    </Mantine.CopyButton>
  );
}

CopyButtonStory.displayName = 'CopyButtonStory';

const meta = {
  title: 'Mantine/CopyButton',
  component: CopyButtonStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    variant: 'filled',
    copied: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    variant: {
      control: 'select',
      options: mantineButtonVariantOptions,
      description: 'Mantine visual variant.',
    },
    copied: {
      control: 'boolean',
      description: 'Shows copied visual state.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core CopyButton themed preview',
      },
    },
  },
} satisfies Meta<typeof CopyButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
