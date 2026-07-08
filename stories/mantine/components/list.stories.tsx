import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineColorOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  type?: 'ordered' | 'unordered';
  withPadding?: boolean;
  color?: (typeof mantineColorOptions)[number];
};

function ListStory(controlValues: ComponentStoryProps) {
  const color = controlValues.color ?? 'tinyrack';

  return (
    <Mantine.List
      c={color}
      size={controlValues.size ?? 'sm'}
      type={controlValues.type ?? 'unordered'}
      withPadding={controlValues.withPadding ?? true}
    >
      <Mantine.List.Item>Backup completed</Mantine.List.Item>
      <Mantine.List.Item>Router online</Mantine.List.Item>
      <Mantine.List.Item>UPS charged</Mantine.List.Item>
    </Mantine.List>
  );
}

ListStory.displayName = 'ListStory';

const meta = {
  title: 'Mantine/List',
  component: ListStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    type: 'unordered',
    withPadding: true,
    color: 'tinyrack',
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    type: {
      control: 'select',
      options: ['ordered', 'unordered'],
      description: 'List marker type.',
    },
    withPadding: {
      control: 'boolean',
      description: 'Adds list padding.',
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
        component: '@mantine/core List themed preview',
      },
    },
  },
} satisfies Meta<typeof ListStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
