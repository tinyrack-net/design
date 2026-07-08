import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function RangeSliderStory() {
  return (
    <Mantine.RangeSlider className="w-[min(100%,40rem)]" defaultValue={[20, 80]} />
  );
}

RangeSliderStory.displayName = 'RangeSliderStory';

const meta = {
  title: 'Mantine/RangeSlider',
  component: RangeSliderStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core RangeSlider themed preview',
      },
    },
  },
} satisfies Meta<typeof RangeSliderStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
