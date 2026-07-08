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
  opened?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  withArrow?: boolean;
  color?: (typeof mantineColorOptions)[number];
};

function TooltipStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Tooltip
      color={controlValues.color ?? 'tinyrack'}
      label="Open logs"
      opened={controlValues.opened ?? true}
      position={controlValues.position ?? 'top'}
      withArrow={controlValues.withArrow ?? true}
    >
      <Mantine.Button size="xs" color="tinyrack">
        Logs
      </Mantine.Button>
    </Mantine.Tooltip>
  );
}

TooltipStory.displayName = 'TooltipStory';

const meta = {
  title: 'Mantine/Tooltip',
  component: TooltipStory,
  tags: ['autodocs'],
  args: {
    opened: true,
    position: 'top',
    withArrow: true,
    color: 'tinyrack',
  },
  argTypes: {
    opened: {
      control: 'boolean',
      description: 'Shows tooltip.',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Tooltip position.',
    },
    withArrow: {
      control: 'boolean',
      description: 'Shows tooltip arrow.',
    },
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Tooltip themed preview',
      },
    },
  },
} satisfies Meta<typeof TooltipStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
