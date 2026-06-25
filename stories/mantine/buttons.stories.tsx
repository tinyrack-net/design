import { Button, Group } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function MantineButtons() {
  return (
    <Group>
      <Button>Primary</Button>
      <Button variant="light">Light</Button>
      <Button variant="outline">Outline</Button>
    </Group>
  );
}

const meta = {
  title: 'Mantine/Buttons',
  component: MantineButtons,
} satisfies Meta<typeof MantineButtons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {};
