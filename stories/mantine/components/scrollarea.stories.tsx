import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  type?: 'auto' | 'always' | 'scroll' | 'hover' | 'never';
  scrollbarSize?: number;
  offsetScrollbars?: boolean;
};

function ScrollAreaStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.ScrollArea
      className="h-40 w-80 rounded-md border border-neutral-700"
      offsetScrollbars={controlValues.offsetScrollbars ?? true}
      scrollbarSize={controlValues.scrollbarSize ?? 8}
      type={controlValues.type ?? 'hover'}
    >
      <Mantine.Stack p="sm">
        {Array.from({ length: 8 }, (_, index) => `Log entry ${index + 1}`).map(
          (entry) => (
            <Mantine.Paper key={entry} p="xs" withBorder>
              {entry}
            </Mantine.Paper>
          ),
        )}
      </Mantine.Stack>
    </Mantine.ScrollArea>
  );
}

ScrollAreaStory.displayName = 'ScrollAreaStory';

const meta = {
  title: 'Mantine/ScrollArea',
  component: ScrollAreaStory,
  tags: ['autodocs'],
  args: {
    type: 'hover',
    scrollbarSize: 8,
    offsetScrollbars: true,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['auto', 'always', 'scroll', 'hover', 'never'],
      description: 'ScrollArea scrollbar behavior.',
    },
    scrollbarSize: {
      control: {
        type: 'range',
        min: 4,
        max: 16,
        step: 1,
      },
      description: 'Scrollbar size.',
    },
    offsetScrollbars: {
      control: 'boolean',
      description: 'Offsets content for scrollbars.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core ScrollArea themed preview',
      },
    },
  },
} satisfies Meta<typeof ScrollAreaStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
