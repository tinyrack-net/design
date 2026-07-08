import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function AppShellStory() {
  return (
    <Mantine.Box className="relative h-52 w-[min(100%,34rem)] max-w-[34rem] overflow-hidden rounded-md border border-base-300 [&_.mantine-AppShell-header]:!absolute [&_.mantine-AppShell-header]:!right-0 [&_.mantine-AppShell-header]:!left-0 [&_.mantine-AppShell-header]:!top-0 [&_.mantine-AppShell-main]:!min-h-full [&_.mantine-AppShell-main]:!pl-36 [&_.mantine-AppShell-main]:!pt-12 [&_.mantine-AppShell-navbar]:!absolute [&_.mantine-AppShell-navbar]:!bottom-0 [&_.mantine-AppShell-navbar]:!left-0 [&_.mantine-AppShell-navbar]:!top-10 [&_.mantine-AppShell-navbar]:!h-auto [&_.mantine-AppShell-navbar]:!w-32 [&_.mantine-AppShell-navbar]:!max-w-32 [&_.mantine-AppShell-navbar]:!transform-none [&_.mantine-AppShell-root]:!relative [&_.mantine-AppShell-root]:!h-full [&_.mantine-AppShell-root]:!min-h-full [&_.mantine-AppShell-root]:!overflow-hidden">
      <Mantine.AppShell
        header={{ height: 40 }}
        mode="static"
        navbar={{ width: 128, breakpoint: 'sm' }}
        padding="sm"
        style={{
          height: '100%',
          minHeight: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Mantine.AppShell.Header
          px="sm"
          style={{
            height: 40,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          Tinyrack console
        </Mantine.AppShell.Header>
        <Mantine.AppShell.Navbar
          p="sm"
          style={{
            bottom: 0,
            height: 'auto',
            left: 0,
            maxWidth: 128,
            position: 'absolute',
            top: 40,
            transform: 'none',
            width: 128,
          }}
        >
          Nodes
        </Mantine.AppShell.Navbar>
        <Mantine.AppShell.Main
          style={{
            minHeight: '100%',
            paddingLeft: 144,
            paddingTop: 48,
          }}
        >
          Rack status
        </Mantine.AppShell.Main>
      </Mantine.AppShell>
    </Mantine.Box>
  );
}

AppShellStory.displayName = 'AppShellStory';

const meta = {
  title: 'Mantine/AppShell',
  component: AppShellStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core AppShell themed preview',
      },
    },
  },
} satisfies Meta<typeof AppShellStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
