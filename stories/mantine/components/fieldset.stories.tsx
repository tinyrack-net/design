import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function FieldsetStory() {
  return (
    <Mantine.Fieldset legend="Fieldset">
      <Mantine.TextInput label="Node name" />
    </Mantine.Fieldset>
  );
}

FieldsetStory.displayName = 'FieldsetStory';

const meta = {
  title: 'Mantine/Fieldset',
  component: FieldsetStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Fieldset themed preview',
      },
    },
  },
} satisfies Meta<typeof FieldsetStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
