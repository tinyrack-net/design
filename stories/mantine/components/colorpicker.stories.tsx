import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ColorPickerStory() {
  return <Mantine.ColorPicker defaultValue="#737373" format="hex" />;
}

ColorPickerStory.displayName = 'ColorPickerStory';

const meta = {
  title: 'Mantine/ColorPicker',
  component: ColorPickerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core ColorPicker themed preview',
      },
    },
  },
} satisfies Meta<typeof ColorPickerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
