import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function DataListStory() {
  return (
    <Mantine.DataList>
      <Mantine.DataList.Item>
        <Mantine.DataList.ItemLabel>Package</Mantine.DataList.ItemLabel>
        <Mantine.DataList.ItemValue>@tinyrack/themes</Mantine.DataList.ItemValue>
      </Mantine.DataList.Item>
    </Mantine.DataList>
  );
}

DataListStory.displayName = 'DataListStory';

const meta = {
  title: 'Mantine/DataList',
  component: DataListStory,
  tags: ['autodocs'],
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
