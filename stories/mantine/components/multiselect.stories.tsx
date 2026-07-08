import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function MultiSelectStory() {
  return (
    <Mantine.MultiSelect
      label="Watched services"
      data={['home-assistant', 'reverse-proxy', 'backup-sync']}
      defaultValue={['home-assistant']}
    />
  );
}

MultiSelectStory.displayName = 'MultiSelectStory';

const meta = {
  title: 'Mantine/MultiSelect',
  component: MultiSelectStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core MultiSelect themed preview',
      },
    },
  },
} satisfies Meta<typeof MultiSelectStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
