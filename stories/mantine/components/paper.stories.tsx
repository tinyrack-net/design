import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineShadowOptions = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  shadow?: (typeof mantineShadowOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  withBorder?: boolean;
};

function PaperStory(controlValues: ComponentStoryProps) {
  const shadow = controlValues.shadow ?? 'sm';

  return (
    <Mantine.Paper
      className="w-80"
      p="md"
      radius={controlValues.radius ?? 'md'}
      {...(shadow === 'none' ? {} : { shadow })}
      withBorder={controlValues.withBorder ?? true}
    >
      <Mantine.Text fw={600}>nas-01</Mantine.Text>
      <Mantine.Text c="dimmed" size="sm">
        Backup service healthy.
      </Mantine.Text>
    </Mantine.Paper>
  );
}

PaperStory.displayName = 'PaperStory';

const meta = {
  title: 'Mantine/Paper',
  component: PaperStory,
  tags: ['autodocs'],
  args: {
    shadow: 'sm',
    radius: 'md',
    withBorder: true,
  },
  argTypes: {
    shadow: {
      control: 'select',
      options: mantineShadowOptions,
      description: 'Mantine shadow token.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    withBorder: {
      control: 'boolean',
      description: 'Shows the Paper border.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Paper themed preview',
      },
    },
  },
} satisfies Meta<typeof PaperStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
