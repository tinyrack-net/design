import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  opened?: boolean;
  orientation?: (typeof mantineOrientationOptions)[number];
};

function CollapseStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Box className="w-80 rounded-md border border-neutral-700 p-3">
      <Mantine.Button size="xs" color="tinyrack">
        Details
      </Mantine.Button>
      <Mantine.Collapse
        expanded={controlValues.opened ?? true}
        orientation={controlValues.orientation ?? 'vertical'}
      >
        <Mantine.Text mt="sm" size="sm">
          Backup window: 02:00-03:00.
        </Mantine.Text>
      </Mantine.Collapse>
    </Mantine.Box>
  );
}

CollapseStory.displayName = 'CollapseStory';

const meta = {
  title: 'Mantine/Collapse',
  component: CollapseStory,
  tags: ['autodocs'],
  args: {
    opened: true,
    orientation: 'vertical',
  },
  argTypes: {
    opened: {
      control: 'boolean',
      description: 'Opens the collapse content.',
    },
    orientation: {
      control: 'select',
      options: mantineOrientationOptions,
      description: 'Collapse orientation.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Collapse themed preview',
      },
    },
  },
} satisfies Meta<typeof CollapseStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
