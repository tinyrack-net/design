import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function SliderStory() {
  return <Mantine.Slider className="w-[min(100%,40rem)]" defaultValue={60} />;
}

SliderStory.displayName = 'SliderStory';

const meta = {
  title: 'Mantine/Slider',
  component: SliderStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Slider themed preview',
      },
    },
  },
} satisfies Meta<typeof SliderStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
