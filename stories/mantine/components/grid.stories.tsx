import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  gap?: (typeof mantineSpacingOptions)[number];
  grow?: boolean;
  justify?: 'flex-start' | 'center' | 'flex-end';
  align?: 'stretch' | 'center' | 'flex-start';
};

function GridStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Grid
      align={controlValues.align ?? 'stretch'}
      className="w-[min(100%,24rem)]"
      grow={controlValues.grow ?? false}
      gap={controlValues.gap ?? 'sm'}
      justify={controlValues.justify ?? 'flex-start'}
    >
      {[1, 2, 3].map((item) => (
        <Mantine.Grid.Col key={item} span={4}>
          <Mantine.Paper p="sm" withBorder>
            Col {item}
          </Mantine.Paper>
        </Mantine.Grid.Col>
      ))}
    </Mantine.Grid>
  );
}

GridStory.displayName = 'GridStory';

const meta = {
  title: 'Mantine/Grid',
  component: GridStory,
  tags: ['autodocs'],
  args: {
    gap: 'sm',
    grow: false,
    justify: 'flex-start',
    align: 'stretch',
  },
  argTypes: {
    gap: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Mantine spacing token.',
    },
    grow: {
      control: 'boolean',
      description: 'Grid columns grow to fill remaining space.',
    },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end'],
      description: 'Grid justify-content value.',
    },
    align: {
      control: 'select',
      options: ['stretch', 'center', 'flex-start'],
      description: 'Grid align-items value.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Grid themed preview',
      },
    },
  },
} satisfies Meta<typeof GridStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
