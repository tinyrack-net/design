import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  format?: 'hex' | 'rgba' | 'hsla';
  withPicker?: boolean;
  fullWidth?: boolean;
};

function ColorPickerStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.ColorPicker
      defaultValue="#1762ae"
      format={controlValues.format ?? 'hex'}
      fullWidth={controlValues.fullWidth ?? false}
      size={controlValues.size ?? 'sm'}
      withPicker={controlValues.withPicker ?? true}
      className="w-80"
    />
  );
}

ColorPickerStory.displayName = 'ColorPickerStory';

const meta = {
  title: 'Mantine/ColorPicker',
  component: ColorPickerStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    format: 'hex',
    withPicker: true,
    fullWidth: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    format: {
      control: 'select',
      options: ['hex', 'rgba', 'hsla'],
      description: 'Color output format.',
    },
    withPicker: {
      control: 'boolean',
      description: 'Shows the color area picker.',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands the picker to full width.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
