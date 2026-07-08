import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  maxHeight?: number;
  initiallyOpened?: boolean;
};

function SpoilerStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Spoiler
      defaultExpanded={controlValues.initiallyOpened ?? false}
      hideLabel="Hide details"
      maxHeight={controlValues.maxHeight ?? 48}
      showLabel="Show details"
      className="w-80"
    >
      Rack runbook details include backup windows, restore targets, and maintenance
      contacts.
    </Mantine.Spoiler>
  );
}

SpoilerStory.displayName = 'SpoilerStory';

const meta = {
  title: 'Mantine/Spoiler',
  component: SpoilerStory,
  tags: ['autodocs'],
  args: {
    maxHeight: 48,
    initiallyOpened: false,
  },
  argTypes: {
    maxHeight: {
      control: {
        type: 'range',
        min: 24,
        max: 120,
        step: 8,
      },
      description: 'Collapsed max height.',
    },
    initiallyOpened: {
      control: 'boolean',
      description: 'Initial open state.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Spoiler themed preview',
      },
    },
  },
} satisfies Meta<typeof SpoilerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
