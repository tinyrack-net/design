import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  position?: 'top' | 'bottom' | 'left' | 'right';
  withArrow?: boolean;
  opened?: boolean;
};

function HoverCardStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.HoverCard
      position={controlValues.position ?? 'bottom'}
      shadow="md"
      withArrow={controlValues.withArrow ?? true}
      withinPortal={false}
      initiallyOpened={controlValues.opened ?? true}
    >
      <Mantine.HoverCard.Target>
        <Mantine.Button color="tinyrack" size="xs">
          Node
        </Mantine.Button>
      </Mantine.HoverCard.Target>
      <Mantine.HoverCard.Dropdown>
        <Mantine.Text size="sm">nas-01 is healthy.</Mantine.Text>
      </Mantine.HoverCard.Dropdown>
    </Mantine.HoverCard>
  );
}

HoverCardStory.displayName = 'HoverCardStory';

const meta = {
  title: 'Mantine/HoverCard',
  component: HoverCardStory,
  tags: ['autodocs'],
  args: {
    position: 'bottom',
    withArrow: true,
    opened: true,
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'HoverCard position.',
    },
    withArrow: {
      control: 'boolean',
      description: 'Shows dropdown arrow.',
    },
    opened: {
      control: 'boolean',
      description: 'Forces the card open.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core HoverCard themed preview',
      },
    },
  },
} satisfies Meta<typeof HoverCardStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
