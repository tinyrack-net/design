import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  radius?: (typeof mantineRadiusOptions)[number];
  opacity?: number;
  blur?: number;
};

function OverlayStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Box className="relative grid h-40 w-80 place-content-center overflow-hidden rounded-md bg-neutral-800 text-white">
      <span>Rack image</span>
      <Mantine.Overlay
        blur={controlValues.blur ?? 2}
        opacity={controlValues.opacity ?? 0.45}
        radius={controlValues.radius ?? 'md'}
      />
    </Mantine.Box>
  );
}

OverlayStory.displayName = 'OverlayStory';

const meta = {
  title: 'Mantine/Overlay',
  component: OverlayStory,
  tags: ['autodocs'],
  args: {
    radius: 'md',
    opacity: 0.45,
    blur: 2,
  },
  argTypes: {
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    opacity: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.05,
      },
      description: 'Overlay opacity.',
    },
    blur: {
      control: {
        type: 'range',
        min: 0,
        max: 8,
        step: 1,
      },
      description: 'Overlay blur.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Overlay themed preview',
      },
    },
  },
} satisfies Meta<typeof OverlayStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
