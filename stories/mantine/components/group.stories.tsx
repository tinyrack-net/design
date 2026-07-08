import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  gap?: (typeof mantineSpacingOptions)[number];
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  wrap?: 'nowrap' | 'wrap';
  grow?: boolean;
};

function GroupStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Group
      align={controlValues.align ?? 'center'}
      className="w-[min(100%,24rem)] rounded-md border border-neutral-700 p-3"
      gap={controlValues.gap ?? 'sm'}
      grow={controlValues.grow ?? false}
      justify={controlValues.justify ?? 'flex-start'}
      wrap={controlValues.wrap ?? 'wrap'}
    >
      <Mantine.Button size="xs">Apply</Mantine.Button>
      <Mantine.Button size="xs" variant="default">
        Cancel
      </Mantine.Button>
    </Mantine.Group>
  );
}

GroupStory.displayName = 'GroupStory';

const meta = {
  title: 'Mantine/Group',
  component: GroupStory,
  tags: ['autodocs'],
  args: {
    gap: 'sm',
    align: 'center',
    justify: 'flex-start',
    wrap: 'wrap',
    grow: false,
  },
  argTypes: {
    gap: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Mantine spacing token.',
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch'],
      description: 'Group align-items value.',
    },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between'],
      description: 'Group justify-content value.',
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap'],
      description: 'Group wrap value.',
    },
    grow: {
      control: 'boolean',
      description: 'Child items grow evenly.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Group themed preview',
      },
    },
  },
} satisfies Meta<typeof GroupStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
