import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function ComboboxStory() {
  return (
    <Mantine.Combobox store={Mantine.useCombobox()}>
      <Mantine.Combobox.Target>
        <Mantine.Input component="button" type="button">
          Combobox target
        </Mantine.Input>
      </Mantine.Combobox.Target>
    </Mantine.Combobox>
  );
}

ComboboxStory.displayName = 'ComboboxStory';

const meta = {
  title: 'Mantine/Combobox',
  component: ComboboxStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Combobox themed preview',
      },
    },
  },
} satisfies Meta<typeof ComboboxStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
