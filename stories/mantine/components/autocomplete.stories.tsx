import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function AutocompleteStory() {
  return (
    <Mantine.Autocomplete
      label="Autocomplete"
      data={['Mantine', 'daisyUI', 'Starlight']}
      defaultValue="Mantine"
    />
  );
}

AutocompleteStory.displayName = 'AutocompleteStory';

const meta = {
  title: 'Mantine/Autocomplete',
  component: AutocompleteStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Autocomplete themed preview',
      },
    },
  },
} satisfies Meta<typeof AutocompleteStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
