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
    <Mantine.Box className="relative h-64 w-[min(100%,24rem)] overflow-hidden rounded-md border border-neutral-700 p-4">
      <Mantine.Modal
        centered={controlValues.centered ?? false}
        fullScreen={controlValues.fullScreen ?? false}
        lockScroll={false}
        opened={controlValues.opened ?? true}
        onClose={() => undefined}
        returnFocus={false}
        size={controlValues.size ?? 'md'}
        styles={{
          body: { fontSize: 'var(--mantine-font-size-sm)' },
          content: {
            flex: '0 1 min(100%, 20rem)',
            maxHeight: 'calc(100% - 2rem)',
            overflow: 'hidden',
            width: 'min(100%, 20rem)',
          },
          header: { minHeight: '2.5rem' },
          inner: {
            alignItems: 'flex-start',
            inset: '1rem',
            justifyContent: 'center',
            padding: 0,
            position: 'absolute',
            width: 'auto',
          },
          root: {
            inset: 0,
            position: 'absolute',
          },
        }}
        title="Restart service"
        transitionProps={{ duration: 0 }}
        trapFocus={false}
        withOverlay={false}
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
    opened: true,
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
    layout: 'fullscreen',
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
