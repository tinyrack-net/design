import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  gap?: (typeof mantineSpacingOptions)[number];
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
};

function StackStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Stack
      align={controlValues.align ?? 'stretch'}
      className="h-48 w-80 rounded-md border border-neutral-700 p-3"
      gap={controlValues.gap ?? 'sm'}
      justify={controlValues.justify ?? 'flex-start'}
    >
      <Mantine.Button size="xs">Apply</Mantine.Button>
      <Mantine.Button size="xs" variant="default">
        Cancel
      </Mantine.Button>
    </Mantine.Stack>
  );
}

StackStory.displayName = 'StackStory';

const meta = {
  title: 'Mantine/Stack',
  component: StackStory,
  tags: ['autodocs'],
  args: {
    gap: 'sm',
    align: 'stretch',
    justify: 'flex-start',
  },
  argTypes: {
    gap: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Mantine spacing token.',
    },
    align: {
      control: 'select',
      options: ['stretch', 'center', 'flex-start', 'flex-end'],
      description: 'Stack align-items value.',
    },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between'],
      description: 'Stack justify-content value.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Stack themed preview',
      },
    },
  },
} satisfies Meta<typeof StackStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
