import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  gap?: (typeof mantineSpacingOptions)[number];
  orientation?: (typeof mantineOrientationOptions)[number];
  withDivider?: boolean;
};

function DataListStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.DataList
      gap={controlValues.gap ?? 'sm'}
      orientation={controlValues.orientation ?? 'horizontal'}
      size={controlValues.size ?? 'sm'}
      withDivider={controlValues.withDivider ?? true}
      className="w-96"
    >
      <Mantine.DataList.Item>
        <Mantine.DataList.ItemLabel>Package</Mantine.DataList.ItemLabel>
        <Mantine.DataList.ItemValue>@tinyrack/themes</Mantine.DataList.ItemValue>
      </Mantine.DataList.Item>
      <Mantine.DataList.Item>
        <Mantine.DataList.ItemLabel>Status</Mantine.DataList.ItemLabel>
        <Mantine.DataList.ItemValue>Healthy</Mantine.DataList.ItemValue>
      </Mantine.DataList.Item>
    </Mantine.DataList>
  );
}

DataListStory.displayName = 'DataListStory';

const meta = {
  title: 'Mantine/DataList',
  component: DataListStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    gap: 'sm',
    orientation: 'horizontal',
    withDivider: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    gap: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Mantine spacing token.',
    },
    orientation: {
      control: 'select',
      options: mantineOrientationOptions,
      description: 'DataList orientation.',
    },
    withDivider: {
      control: 'boolean',
      description: 'Shows dividers between items.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core DataList themed preview',
      },
    },
  },
} satisfies Meta<typeof DataListStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
