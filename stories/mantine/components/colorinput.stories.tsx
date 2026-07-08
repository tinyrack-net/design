import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ColorInputStory() {
  return <Mantine.ColorInput label="Color input" defaultValue="#737373" />;
}

ColorInputStory.displayName = 'ColorInputStory';

const meta = {
  title: 'Mantine/ColorInput',
  component: ColorInputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core ColorInput themed preview',
      },
    },
  },
} satisfies Meta<typeof ColorInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
