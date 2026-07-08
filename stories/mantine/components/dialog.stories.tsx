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
    <Mantine.Dialog
      opened={controlValues.opened ?? true}
      position={{ left: '50%', top: '50%' }}
      size={controlValues.size ?? 'sm'}
      style={{
        marginLeft: 'max(-11rem, calc(-50vw + 1rem))',
        marginTop: '-2rem',
        width: 'min(22rem, calc(100vw - 2rem))',
      }}
      transitionProps={{ duration: 0 }}
      withinPortal={false}
      withCloseButton={controlValues.withCloseButton ?? true}
    >
      <Mantine.Text size="sm">Metrics synced.</Mantine.Text>
    </Mantine.Dialog>
  );
}

DialogStory.displayName = 'DialogStory';

const meta = {
  title: 'Mantine/Dialog',
  component: DialogStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
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
    layout: 'fullscreen',
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
