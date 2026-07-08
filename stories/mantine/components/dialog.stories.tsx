import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  opened?: boolean;
  withCloseButton?: boolean;
};

function DialogStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Box className="relative h-40 w-96 rounded-md border border-neutral-700">
      <Mantine.Dialog
        opened={controlValues.opened ?? true}
        position={{ bottom: 16, right: 16 }}
        size={controlValues.size ?? 'md'}
        withCloseButton={controlValues.withCloseButton ?? true}
      >
        <Mantine.Text size="sm">Metrics synced.</Mantine.Text>
      </Mantine.Dialog>
    </Mantine.Box>
  );
}

DialogStory.displayName = 'DialogStory';

const meta = {
  title: 'Mantine/Dialog',
  component: DialogStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    opened: true,
    withCloseButton: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    opened: {
      control: 'boolean',
      description: 'Shows the dialog.',
    },
    withCloseButton: {
      control: 'boolean',
      description: 'Shows close button.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Dialog themed preview',
      },
    },
  },
} satisfies Meta<typeof DialogStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
