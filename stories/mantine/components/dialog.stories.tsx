import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function DialogStory() {
  return (
    <Mantine.Box pos="relative" h={84}>
      <Mantine.Dialog
        opened
        withCloseButton={false}
        withinPortal={false}
        position={{ bottom: 8, right: 8 }}
        size="sm"
      >
        Dialog
      </Mantine.Dialog>
    </Mantine.Box>
  );
}

DialogStory.displayName = 'DialogStory';

const meta = {
  title: 'Mantine/Dialog',
  component: DialogStory,
  tags: ['autodocs'],
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
