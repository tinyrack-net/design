import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function CopyButtonStory() {
  return (
    <Mantine.CopyButton value="@tinyrack/themes">
      {({ copied, copy }) => (
        <Mantine.Button onClick={copy}>{copied ? 'Copied' : 'Copy'}</Mantine.Button>
      )}
    </Mantine.CopyButton>
  );
}

CopyButtonStory.displayName = 'CopyButtonStory';

const meta = {
  title: 'Mantine/CopyButton',
  component: CopyButtonStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core CopyButton themed preview',
      },
    },
  },
} satisfies Meta<typeof CopyButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
