import { AppShell } from '@tinyrack/ui/components/app-shell';
import { Link } from '@tinyrack/ui/components/link';
import { MenuIcon, XIcon } from 'lucide-react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  breakpoint: 'sm' | 'lg';
  layout: 'header-first' | 'sidebar-first';
  open: boolean;
};

export function AppShellPreview({
  breakpoint,
  contained = false,
  layout,
  onOpenChange,
  open,
}: Omit<StoryArgs, 'open'> & {
  contained?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) {
  const stateProps =
    open === undefined
      ? {}
      : {
          open,
          ...(onOpenChange === undefined ? {} : { onOpenChange }),
        };

  return (
    <AppShell.Root
      {...stateProps}
      breakpoint={breakpoint}
      className={
        contained
          ? 'h-80 min-h-0 w-full max-w-[390px] overflow-hidden rounded-tinyrack-lg border border-tinyrack-border'
          : 'h-full min-h-80 w-full overflow-hidden'
      }
      layout={layout}
    >
      <AppShell.Header className="flex items-center gap-3 border-b border-tinyrack-border p-3">
        <AppShell.Trigger aria-label="Open navigation">
          <MenuIcon aria-hidden="true" />
        </AppShell.Trigger>
        <strong>Tinyrack</strong>
      </AppShell.Header>
      <AppShell.Sidebar aria-label="Example navigation">
        <div className="p-4">
          <AppShell.Close aria-label="Close navigation">
            <XIcon aria-hidden="true" />
          </AppShell.Close>
          <nav className="grid gap-2" aria-label="Rack pages">
            <Link href="#overview">Overview</Link>
            <Link href="#deployments">Deployments</Link>
          </nav>
        </div>
      </AppShell.Sidebar>
      <AppShell.Main className="p-5" render={<div />}>
        Operational content
      </AppShell.Main>
    </AppShell.Root>
  );
}

export function AppShellLayoutMatrix() {
  const combinations = [
    ['sm', 'header-first'],
    ['sm', 'sidebar-first'],
    ['lg', 'header-first'],
    ['lg', 'sidebar-first'],
  ] as const;

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-2">
      {combinations.map(([breakpoint, layout]) => (
        <section className="grid min-w-0 gap-2" key={`${breakpoint}-${layout}`}>
          <strong>{`${breakpoint} · ${layout}`}</strong>
          <AppShellPreview breakpoint={breakpoint} contained layout={layout} />
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/AppShell',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered', playgroundLayout: 'fill' },
  args: { breakpoint: 'lg', layout: 'sidebar-first', open: false },
  argTypes: {
    breakpoint: { options: ['sm', 'lg'], control: 'radio' },
    layout: { options: ['header-first', 'sidebar-first'], control: 'radio' },
    open: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return <AppShellPreview {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
