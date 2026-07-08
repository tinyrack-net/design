import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function NotificationStory() {
  return (
    <Mantine.Notification title="Config saved" withCloseButton={false}>
      Restart approval remains enabled.
    </Mantine.Notification>
  );
}

NotificationStory.displayName = 'NotificationStory';

const meta = {
  title: 'Mantine/Notification',
  component: NotificationStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Notification themed preview',
      },
    },
  },
} satisfies Meta<typeof NotificationStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
