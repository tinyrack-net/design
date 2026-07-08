import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  radius?: (typeof mantineRadiusOptions)[number];
  fit?: 'cover' | 'contain';
};

function ImageStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Image
      alt="Tinyrack preview"
      className="h-40 w-80 bg-neutral-900"
      fit={controlValues.fit ?? 'cover'}
      radius={controlValues.radius ?? 'md'}
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 160'%3E%3Crect width='320' height='160' fill='%23171717'/%3E%3Ccircle cx='80' cy='80' r='36' fill='%231762ae'/%3E%3Crect x='140' y='56' width='120' height='48' rx='8' fill='%23f5f5f5'/%3E%3C/svg%3E"
    />
  );
}

ImageStory.displayName = 'ImageStory';

const meta = {
  title: 'Mantine/Image',
  component: ImageStory,
  tags: ['autodocs'],
  args: {
    radius: 'md',
    fit: 'cover',
  },
  argTypes: {
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    fit: {
      control: 'select',
      options: ['cover', 'contain'],
      description: 'Image object-fit value.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Image themed preview',
      },
    },
  },
} satisfies Meta<typeof ImageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
