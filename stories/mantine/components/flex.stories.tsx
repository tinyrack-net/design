import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  gap?: (typeof mantineSpacingOptions)[number];
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  direction?: 'row' | 'column';
  wrap?: 'nowrap' | 'wrap';
};

function FlexStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Flex
      align={controlValues.align ?? 'center'}
      className="h-32 w-[min(100%,24rem)] rounded-md border border-neutral-700 p-3"
      direction={controlValues.direction ?? 'row'}
      gap={controlValues.gap ?? 'sm'}
      justify={controlValues.justify ?? 'flex-start'}
      wrap={controlValues.wrap ?? 'wrap'}
    >
      <Mantine.Badge color="tinyrack">NAS</Mantine.Badge>
      <Mantine.Badge color="gray">Router</Mantine.Badge>
      <Mantine.Badge color="green">UPS</Mantine.Badge>
    </Mantine.Flex>
  );
}

FlexStory.displayName = 'FlexStory';

const meta = {
  title: 'Mantine/Flex',
  component: FlexStory,
  tags: ['autodocs'],
  args: {
    gap: 'sm',
    align: 'center',
    justify: 'flex-start',
    direction: 'row',
    wrap: 'wrap',
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
      description: 'Flex align-items value.',
    },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between'],
      description: 'Flex justify-content value.',
    },
    direction: {
      control: 'select',
      options: ['row', 'column'],
      description: 'Flex direction.',
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap'],
      description: 'Flex wrap value.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Flex themed preview',
      },
    },
  },
} satisfies Meta<typeof FlexStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
