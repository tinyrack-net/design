import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  dropdownOpened?: boolean;
  radius?: (typeof mantineRadiusOptions)[number];
};

function ComboboxStory(controlValues: ComponentStoryProps) {
  const store = Mantine.useCombobox();

  return (
    <Mantine.Combobox store={store} withinPortal={false}>
      <Mantine.Combobox.Target>
        <Mantine.Input
          component="button"
          pointer
          radius={controlValues.radius ?? 'md'}
          size={controlValues.size ?? 'sm'}
          type="button"
        >
          nas-01
        </Mantine.Input>
      </Mantine.Combobox.Target>
      {(controlValues.dropdownOpened ?? true) ? (
        <Mantine.Combobox.Dropdown>
          <Mantine.Combobox.Options>
            <Mantine.Combobox.Option value="nas-01">nas-01</Mantine.Combobox.Option>
            <Mantine.Combobox.Option value="router">router</Mantine.Combobox.Option>
          </Mantine.Combobox.Options>
        </Mantine.Combobox.Dropdown>
      ) : null}
    </Mantine.Combobox>
  );
}

ComboboxStory.displayName = 'ComboboxStory';

const meta = {
  title: 'Mantine/Combobox',
  component: ComboboxStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    radius: 'md',
    dropdownOpened: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    dropdownOpened: {
      control: 'boolean',
      description: 'Shows the Combobox dropdown.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
