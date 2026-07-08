import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  variant?: 'default' | 'outline' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  color?: 'tinyrack' | 'blue' | 'gray' | 'green' | 'yellow' | 'red';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
};

function TabsStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Tabs
      className="w-[min(100%,40rem)]"
      color={controlValues.color ?? 'tinyrack'}
      defaultValue="overview"
      inverted={controlValues.inverted ?? false}
      orientation={controlValues.orientation ?? 'horizontal'}
      radius={controlValues.radius ?? 'md'}
      variant={controlValues.variant ?? 'default'}
    >
      <Mantine.Tabs.List>
        <Mantine.Tabs.Tab value="overview">Overview</Mantine.Tabs.Tab>
        <Mantine.Tabs.Tab value="logs">Logs</Mantine.Tabs.Tab>
      </Mantine.Tabs.List>
      <Mantine.Tabs.Panel value="overview">
        Node health and service drift.
      </Mantine.Tabs.Panel>
    </Mantine.Tabs>
  );
}

TabsStory.displayName = 'TabsStory';

const meta = {
  title: 'Mantine/Tabs',
  component: TabsStory,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    orientation: 'horizontal',
    color: 'tinyrack',
    radius: 'md',
    inverted: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'pills'],
      description: 'Mantine tabs visual variant.',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tabs orientation.',
    },
    color: {
      control: 'select',
      options: ['tinyrack', 'blue', 'gray', 'green', 'yellow', 'red'],
      description: 'Theme color token.',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius token.',
    },
    inverted: { control: 'boolean', description: 'Invert tab border placement.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Tabs themed preview',
      },
    },
  },
} satisfies Meta<typeof TabsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
