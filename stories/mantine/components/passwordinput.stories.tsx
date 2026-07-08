import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function PasswordInputStory() {
  return <Mantine.PasswordInput label="Token secret" defaultValue="secret" />;
}

PasswordInputStory.displayName = 'PasswordInputStory';

const meta = {
  title: 'Mantine/PasswordInput',
  component: PasswordInputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core PasswordInput themed preview',
      },
    },
  },
} satisfies Meta<typeof PasswordInputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
