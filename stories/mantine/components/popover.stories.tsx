import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineShadowOptions = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  opened?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  radius?: (typeof mantineRadiusOptions)[number];
  shadow?: (typeof mantineShadowOptions)[number];
  withArrow?: boolean;
  withOverlay?: boolean;
};

function PopoverStory(controlValues: ComponentStoryProps) {
  const shadow = controlValues.shadow ?? 'md';

  return (
    <Mantine.Popover
      opened={controlValues.opened ?? true}
      position={controlValues.position ?? 'bottom'}
      radius={controlValues.radius ?? 'md'}
      withArrow={controlValues.withArrow ?? true}
      withOverlay={controlValues.withOverlay ?? false}
      withinPortal={false}
      {...(shadow === 'none' ? {} : { shadow })}
    >
      <Mantine.Popover.Target>
        <Mantine.Button color="tinyrack" size="xs">
          Status
        </Mantine.Button>
      </Mantine.Popover.Target>
      <Mantine.Popover.Dropdown>
        <Mantine.Text size="sm">All services healthy.</Mantine.Text>
      </Mantine.Popover.Dropdown>
    </Mantine.Popover>
  );
}

PopoverStory.displayName = 'PopoverStory';

const meta = {
  title: 'Mantine/Popover',
  component: PopoverStory,
  tags: ['autodocs'],
  args: {
    opened: true,
    position: 'bottom',
    radius: 'md',
    shadow: 'md',
    withArrow: true,
    withOverlay: false,
  },
  argTypes: {
    opened: {
      control: 'boolean',
      description: 'Shows the popover dropdown.',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Popover position.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    shadow: {
      control: 'select',
      options: mantineShadowOptions,
      description: 'Mantine shadow token.',
    },
    withArrow: {
      control: 'boolean',
      description: 'Shows popover arrow.',
    },
    withOverlay: {
      control: 'boolean',
      description: 'Shows popover overlay.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Popover themed preview',
      },
    },
  },
} satisfies Meta<typeof PopoverStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
