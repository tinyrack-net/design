import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineInputVariantOptions = ['default', 'filled', 'unstyled'] as const;

type ComponentStoryProps = {
  variant?: (typeof mantineInputVariantOptions)[number];
  size?: (typeof mantineSizeOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  withPreview?: boolean;
  withEyeDropper?: boolean;
  disabled?: boolean;
};

function ColorInputStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.ColorInput
      defaultValue="#1762ae"
      disabled={controlValues.disabled ?? false}
      label="Accent color"
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'default'}
      withEyeDropper={controlValues.withEyeDropper ?? true}
      withPreview={controlValues.withPreview ?? true}
      className="w-80"
    />
  );
}

ColorInputStory.displayName = 'ColorInputStory';

const meta = {
  title: 'Mantine/ColorInput',
  component: ColorInputStory,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'sm',
    radius: 'md',
    withPreview: true,
    withEyeDropper: true,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: mantineInputVariantOptions,
      description: 'Mantine input variant.',
    },
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    withPreview: {
      control: 'boolean',
      description: 'Shows the color preview swatch.',
    },
    withEyeDropper: {
      control: 'boolean',
      description: 'Shows the eyedropper action.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
