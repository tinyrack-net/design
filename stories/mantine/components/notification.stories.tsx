import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineColorOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  color?: (typeof mantineColorOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  loading?: boolean;
  withBorder?: boolean;
  withCloseButton?: boolean;
};

function NotificationStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Notification
      color={controlValues.color ?? 'tinyrack'}
      loading={controlValues.loading ?? false}
      radius={controlValues.radius ?? 'md'}
      title="Backup complete"
      withBorder={controlValues.withBorder ?? true}
      withCloseButton={controlValues.withCloseButton ?? true}
      className="w-80"
    >
      nas-01 snapshot is ready.
    </Mantine.Notification>
  );
}

NotificationStory.displayName = 'NotificationStory';

const meta = {
  title: 'Mantine/Notification',
  component: NotificationStory,
  tags: ['autodocs'],
  args: {
    color: 'tinyrack',
    radius: 'md',
    loading: false,
    withBorder: true,
    withCloseButton: true,
  },
  argTypes: {
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading indicator.',
    },
    withBorder: {
      control: 'boolean',
      description: 'Shows notification border.',
    },
    withCloseButton: {
      control: 'boolean',
      description: 'Shows close button.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
