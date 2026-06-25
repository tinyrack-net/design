import { Button, Stack, TextInput } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function MantineForm() {
  return (
    <Stack maw={420}>
      <TextInput label="Project" placeholder="tinyrack/themes" />
      <TextInput label="Owner" placeholder="Tinyrack" />
      <Button>Save theme</Button>
    </Stack>
  );
}

const meta = {
  title: 'Mantine/Forms',
  component: MantineForm,
} satisfies Meta<typeof MantineForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
