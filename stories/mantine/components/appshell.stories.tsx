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
      className="min-h-96 w-full overflow-hidden rounded-md border border-neutral-700"
      header={{ height: 44 }}
      layout={controlValues.layout ?? 'default'}
      mode="static"
      navbar={{ width: 96, breakpoint: '0px' }}
      padding={controlValues.padding ?? 'md'}
      style={{ height: 'min(42rem, calc(100vh - 3rem))' }}
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
    tinyrackCanvas: 'full',
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
