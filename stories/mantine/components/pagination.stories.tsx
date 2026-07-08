import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  gap?: (typeof mantineSpacingOptions)[number];
  total?: number;
  value?: number;
  withEdges?: boolean;
  withControls?: boolean;
};

function PaginationStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Pagination
      gap={controlValues.gap ?? 'xs'}
      total={controlValues.total ?? 8}
      value={controlValues.value ?? 3}
      withControls={controlValues.withControls ?? true}
      withEdges={controlValues.withEdges ?? true}
    />
  );
}

PaginationStory.displayName = 'PaginationStory';

const meta = {
  title: 'Mantine/Pagination',
  component: PaginationStory,
  tags: ['autodocs'],
  args: {
    gap: 'xs',
    total: 8,
    value: 3,
    withEdges: true,
    withControls: true,
  },
  argTypes: {
    gap: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Mantine spacing token.',
    },
    total: {
      control: {
        type: 'number',
        min: 3,
        max: 12,
        step: 1,
      },
      description: 'Total pages.',
    },
    value: {
      control: {
        type: 'number',
        min: 1,
        max: 12,
        step: 1,
      },
      description: 'Current page.',
    },
    withEdges: {
      control: 'boolean',
      description: 'Shows first and last controls.',
    },
    withControls: {
      control: 'boolean',
      description: 'Shows previous and next controls.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Pagination themed preview',
      },
    },
  },
} satisfies Meta<typeof PaginationStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
