import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withBorder?: boolean;
};

function CardStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Card
      padding={controlValues.padding ?? 'md'}
      radius={controlValues.radius ?? 'md'}
      shadow={controlValues.shadow ?? 'sm'}
      withBorder={controlValues.withBorder ?? true}
    >
      <Mantine.Text fw={600}>node-01</Mantine.Text>
      <Mantine.Text c="dimmed" size="sm">
        CPU 34%, memory 61%, last backup 18 minutes ago.
      </Mantine.Text>
      <Mantine.Group justify="flex-end" mt="md">
        <Mantine.Button size="xs">Open node</Mantine.Button>
      </Mantine.Group>
    </Mantine.Card>
  );
}

CardStory.displayName = 'CardStory';

const meta = {
  title: 'Mantine/Card',
  component: CardStory,
  tags: ['autodocs'],
  args: {
    shadow: 'sm',
    padding: 'md',
    radius: 'md',
    withBorder: true,
  },
  argTypes: {
    shadow: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Card shadow token.',
    },
    padding: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Card padding token.',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Card radius token.',
    },
    withBorder: { control: 'boolean', description: 'Show card border.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Card themed preview',
      },
    },
  },
} satisfies Meta<typeof CardStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
