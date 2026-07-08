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
  color?: (typeof mantineColorOptions)[number];
  active?: boolean;
  opened?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'light' | 'subtle';
};

function NavLinkStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.NavLink
      active={controlValues.active ?? true}
      childrenOffset={20}
      color={controlValues.color ?? 'tinyrack'}
      disabled={controlValues.disabled ?? false}
      label="Services"
      opened={controlValues.opened ?? true}
      variant={controlValues.variant ?? 'filled'}
      className="w-80"
    >
      <Mantine.NavLink label="nas-01" active />
    </Mantine.NavLink>
  );
}

NavLinkStory.displayName = 'NavLinkStory';

const meta = {
  title: 'Mantine/NavLink',
  component: NavLinkStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    active: true,
    opened: true,
    disabled: false,
    variant: 'filled',
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    active: {
      control: 'boolean',
      description: 'Active state.',
    },
    opened: {
      control: 'boolean',
      description: 'Expanded state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
    variant: {
      control: 'select',
      options: ['filled', 'light', 'subtle'],
      description: 'NavLink variant.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core NavLink themed preview',
      },
    },
  },
} satisfies Meta<typeof NavLinkStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
