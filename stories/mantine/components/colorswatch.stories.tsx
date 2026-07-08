import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ColorSwatchStory() {
  return <Mantine.ColorSwatch color="#737373" />;
}

ColorSwatchStory.displayName = 'ColorSwatchStory';

const meta = {
  title: 'Mantine/ColorSwatch',
  component: ColorSwatchStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core ColorSwatch themed preview',
      },
    },
  },
} satisfies Meta<typeof ColorSwatchStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
