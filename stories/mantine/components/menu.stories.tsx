import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineShadowOptions = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  opened?: boolean;
  position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  shadow?: (typeof mantineShadowOptions)[number];
};

function MenuStory(controlValues: ComponentStoryProps) {
  const shadow = controlValues.shadow ?? 'md';

  return (
    <Mantine.Menu
      opened={controlValues.opened ?? true}
      position={controlValues.position ?? 'bottom-start'}
      withinPortal={false}
      {...(shadow === 'none' ? {} : { shadow })}
    >
      <Mantine.Menu.Target>
        <Mantine.Button color="tinyrack" size="xs">
          Actions
        </Mantine.Button>
      </Mantine.Menu.Target>
      <Mantine.Menu.Dropdown>
        <Mantine.Menu.Item>Restart service</Mantine.Menu.Item>
        <Mantine.Menu.Item color="red">Stop service</Mantine.Menu.Item>
      </Mantine.Menu.Dropdown>
    </Mantine.Menu>
  );
}

MenuStory.displayName = 'MenuStory';

const meta = {
  title: 'Mantine/Menu',
  component: MenuStory,
  tags: ['autodocs'],
  args: {
    opened: true,
    position: 'bottom-start',
    shadow: 'md',
  },
  argTypes: {
    opened: {
      control: 'boolean',
      description: 'Shows the menu dropdown.',
    },
    position: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      description: 'Menu dropdown position.',
    },
    shadow: {
      control: 'select',
      options: mantineShadowOptions,
      description: 'Mantine shadow token.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Menu themed preview',
      },
    },
  },
} satisfies Meta<typeof MenuStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
