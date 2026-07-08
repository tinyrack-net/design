import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  layout?: 'default' | 'alt';
  padding?: (typeof mantineSpacingOptions)[number];
  withBorder?: boolean;
};

function AppShellStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.AppShell
      className="h-64 w-[min(100%,24rem)] overflow-hidden rounded-md border border-neutral-700"
      header={{ height: 44 }}
      layout={controlValues.layout ?? 'default'}
      mode="static"
      navbar={{ width: 96, breakpoint: '0px' }}
      padding={controlValues.padding ?? 'md'}
      style={{ height: '16rem', maxHeight: '16rem', minHeight: '16rem' }}
      withBorder={controlValues.withBorder ?? true}
    >
      <Mantine.AppShell.Header className="grid place-content-center">
        Header
      </Mantine.AppShell.Header>
      <Mantine.AppShell.Navbar className="grid place-content-center">
        Nav
      </Mantine.AppShell.Navbar>
      <Mantine.AppShell.Main>Main content</Mantine.AppShell.Main>
    </Mantine.AppShell>
  );
}

AppShellStory.displayName = 'AppShellStory';

const meta = {
  title: 'Mantine/AppShell',
  component: AppShellStory,
  tags: ['autodocs'],
  args: {
    layout: 'default',
    padding: 'md',
    withBorder: true,
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['default', 'alt'],
      description: 'AppShell layout mode.',
    },
    padding: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Main content padding token.',
    },
    withBorder: {
      control: 'boolean',
      description: 'Shows AppShell borders.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
