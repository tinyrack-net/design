import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: (typeof mantineSizeOptions)[number];
  opened?: boolean;
  withOverlay?: boolean;
  withCloseButton?: boolean;
};

function DrawerStory(controlValues: ComponentStoryProps) {
  const position = controlValues.position ?? 'right';
  const isHorizontal = position === 'left' || position === 'right';
  const contentPositionStyle: CSSProperties = isHorizontal
    ? {
        bottom: 0,
        height: '100%',
        maxHeight: '100%',
        maxWidth: '80%',
        position: 'absolute',
        top: 0,
        width: 'min(80%, 16rem)',
        [position]: 0,
      }
    : {
        height: 'min(80%, 12rem)',
        left: 0,
        maxHeight: '80%',
        maxWidth: '100%',
        position: 'absolute',
        right: 0,
        width: '100%',
        [position]: 0,
      };

  return (
    <Mantine.Box className="relative h-64 w-[min(100%,24rem)] overflow-hidden rounded-md border border-neutral-700">
      <Mantine.Drawer
        opened={controlValues.opened ?? true}
        onClose={() => undefined}
        position={position}
        size={controlValues.size ?? 'sm'}
        styles={{
          content: contentPositionStyle,
          inner: { inset: 0, position: 'absolute' },
          overlay: { inset: 0, position: 'absolute' },
          root: { inset: 0, position: 'absolute' },
        }}
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
    layout: 'fullscreen',
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
