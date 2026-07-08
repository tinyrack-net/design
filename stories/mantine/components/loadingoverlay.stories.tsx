import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineColorOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;

type ComponentStoryProps = {
  visible?: boolean;
  color?: (typeof mantineColorOptions)[number];
  blur?: number;
};

function LoadingOverlayStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Box className="relative h-32 w-80 rounded-md border border-neutral-700 p-4">
      <Mantine.LoadingOverlay
        loaderProps={{ color: controlValues.color ?? 'tinyrack' }}
        overlayProps={{ blur: controlValues.blur ?? 2 }}
        visible={controlValues.visible ?? true}
      />
      <Mantine.Text size="sm">Refreshing rack metrics...</Mantine.Text>
    </Mantine.Box>
  );
}

LoadingOverlayStory.displayName = 'LoadingOverlayStory';

const meta = {
  title: 'Mantine/LoadingOverlay',
  component: LoadingOverlayStory,
  tags: ['autodocs'],
  args: {
    visible: true,
    color: 'tinyrack',
    blur: 2,
  },
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Shows the loading overlay.',
    },
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    blur: {
      control: {
        type: 'range',
        min: 0,
        max: 8,
        step: 1,
      },
      description: 'Overlay blur radius.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core LoadingOverlay themed preview',
      },
    },
  },
} satisfies Meta<typeof LoadingOverlayStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
