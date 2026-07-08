import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function PillsInputStory() {
  return (
    <Mantine.PillsInput label="Service tags">
      <Mantine.Pill.Group>
        <Mantine.Pill>React</Mantine.Pill>
        <Mantine.PillsInput.Field placeholder="Add" />
      </Mantine.Pill.Group>
    </Mantine.PillsInput>
  );
}

PillsInputStory.displayName = 'PillsInputStory';

const meta = {
  title: 'Mantine/PillsInput',
  component: PillsInputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core PillsInput themed preview',
      },
    },
  },
} satisfies Meta<typeof PillsInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
