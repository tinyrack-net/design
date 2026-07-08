import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: (typeof mantineSizeOptions)[number];
  opened?: boolean;
  withOverlay?: boolean;
  withCloseButton?: boolean;
};

function DrawerStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Box className="relative h-56 w-96 overflow-hidden rounded-md border border-neutral-700">
      <Mantine.Drawer
        opened={controlValues.opened ?? true}
        onClose={() => undefined}
        position={controlValues.position ?? 'right'}
        size={controlValues.size ?? 'sm'}
        title="Node details"
        trapFocus={false}
        withinPortal={false}
        withCloseButton={controlValues.withCloseButton ?? true}
        withOverlay={controlValues.withOverlay ?? true}
      >
        <Mantine.Text size="sm">nas-01 backup is healthy.</Mantine.Text>
      </Mantine.Drawer>
    </Mantine.Box>
  );
}

DrawerStory.displayName = 'DrawerStory';

const meta = {
  title: 'Mantine/Drawer',
  component: DrawerStory,
  tags: ['autodocs'],
  args: {
    position: 'right',
    size: 'sm',
    opened: true,
    withOverlay: true,
    withCloseButton: true,
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Drawer position.',
    },
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    opened: {
      control: 'boolean',
      description: 'Shows the drawer.',
    },
    withOverlay: {
      control: 'boolean',
      description: 'Shows overlay layer.',
    },
    withCloseButton: {
      control: 'boolean',
      description: 'Shows close button.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Drawer themed preview',
      },
    },
  },
} satisfies Meta<typeof DrawerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
