import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  opened?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  fullScreen?: boolean;
  withCloseButton?: boolean;
};

function ModalStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Box>
      <Mantine.Modal
        centered={controlValues.centered ?? false}
        fullScreen={controlValues.fullScreen ?? false}
        opened={controlValues.opened ?? false}
        onClose={() => undefined}
        size={controlValues.size ?? 'md'}
        title="Restart service"
        withCloseButton={controlValues.withCloseButton ?? true}
        withinPortal={false}
      >
        Restarting reverse-proxy will briefly interrupt local routing.
      </Mantine.Modal>
      <Mantine.Button variant="light">Open restart dialog</Mantine.Button>
    </Mantine.Box>
  );
}

ModalStory.displayName = 'ModalStory';

const meta = {
  title: 'Mantine/Modal',
  component: ModalStory,
  tags: ['autodocs'],
  args: {
    opened: false,
    size: 'md',
    centered: false,
    fullScreen: false,
    withCloseButton: true,
  },
  argTypes: {
    opened: { control: 'boolean', description: 'Open modal state.' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Modal size token.',
    },
    centered: { control: 'boolean', description: 'Center the modal in the viewport.' },
    fullScreen: { control: 'boolean', description: 'Use fullscreen modal layout.' },
    withCloseButton: {
      control: 'boolean',
      description: 'Show close button affordance.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Modal themed preview',
      },
    },
  },
} satisfies Meta<typeof ModalStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
