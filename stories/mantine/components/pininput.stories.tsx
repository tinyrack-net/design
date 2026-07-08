import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function PinInputStory() {
  return <Mantine.PinInput defaultValue="1234" />;
}

PinInputStory.displayName = 'PinInputStory';

const meta = {
  title: 'Mantine/PinInput',
  component: PinInputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core PinInput themed preview',
      },
    },
  },
} satisfies Meta<typeof PinInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
