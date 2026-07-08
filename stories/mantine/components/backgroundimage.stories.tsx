import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  radius?: (typeof mantineRadiusOptions)[number];
  overlay?: boolean;
};

function BackgroundImageStory(controlValues: ComponentStoryProps) {
  const overlay = controlValues.overlay ?? true;

  return (
    <Mantine.BackgroundImage
      className="grid h-40 w-80 place-content-center p-6 text-center"
      radius={controlValues.radius ?? 'md'}
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 160'%3E%3Crect width='320' height='160' fill='%230a0a0a'/%3E%3Cpath d='M0 120h320' stroke='%231762ae' stroke-width='18'/%3E%3C/svg%3E"
    >
      <Mantine.Box
        className={overlay ? 'rounded-md bg-black/50 p-4 text-white' : 'text-white'}
      >
        Rack telemetry
      </Mantine.Box>
    </Mantine.BackgroundImage>
  );
}

BackgroundImageStory.displayName = 'BackgroundImageStory';

const meta = {
  title: 'Mantine/BackgroundImage',
  component: BackgroundImageStory,
  tags: ['autodocs'],
  args: {
    radius: 'md',
    overlay: true,
  },
  argTypes: {
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    overlay: {
      control: 'boolean',
      description: 'Shows a dark text overlay surface.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core BackgroundImage themed preview',
      },
    },
  },
} satisfies Meta<typeof BackgroundImageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
