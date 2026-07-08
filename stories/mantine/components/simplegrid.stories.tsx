import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  cols?: number;
  spacing?: (typeof mantineSpacingOptions)[number];
  verticalSpacing?: (typeof mantineSpacingOptions)[number];
};

function SimpleGridStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.SimpleGrid
      className="w-96"
      cols={controlValues.cols ?? 3}
      spacing={controlValues.spacing ?? 'sm'}
      verticalSpacing={controlValues.verticalSpacing ?? 'sm'}
    >
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Mantine.Paper key={item} p="sm" withBorder>
          Node {item}
        </Mantine.Paper>
      ))}
    </Mantine.SimpleGrid>
  );
}

SimpleGridStory.displayName = 'SimpleGridStory';

const meta = {
  title: 'Mantine/SimpleGrid',
  component: SimpleGridStory,
  tags: ['autodocs'],
  args: {
    cols: 3,
    spacing: 'sm',
    verticalSpacing: 'sm',
  },
  argTypes: {
    cols: {
      control: {
        type: 'number',
        min: 1,
        max: 4,
        step: 1,
      },
      description: 'Number of columns.',
    },
    spacing: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Column gap token.',
    },
    verticalSpacing: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Row gap token.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core SimpleGrid themed preview',
      },
    },
  },
} satisfies Meta<typeof SimpleGridStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
