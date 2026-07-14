import { AppShell } from '@tinyrack/ui/components/app-shell';
import { Link } from '@tinyrack/ui/components/link';
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
  layout,
  onOpenChange,
  open,
}: StoryArgs & { onOpenChange?: (open: boolean) => void }) {
  return (
    <AppShell.Root
      breakpoint={breakpoint}
      className="h-80 w-[min(46rem,90vw)] overflow-hidden rounded-tinyrack-lg border border-tinyrack-border"
      layout={layout}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
      open={open}
    >
      <AppShell.Header className="flex items-center gap-3 border-b border-tinyrack-border p-3">
        <AppShell.Trigger aria-label="Open navigation">☰</AppShell.Trigger>
        <strong>Tinyrack</strong>
      </AppShell.Header>
      <AppShell.Sidebar aria-label="Example navigation" className="p-4">
        <AppShell.Close aria-label="Close navigation">×</AppShell.Close>
        <nav className="grid gap-2" aria-label="Rack pages">
          <Link href="#overview">Overview</Link>
          <Link href="#deployments">Deployments</Link>
        </nav>
      </AppShell.Sidebar>
      <AppShell.Main className="p-5" render={<div />}>
        Operational content
      </AppShell.Main>
    </AppShell.Root>
  );
}

const meta = {
  title: 'Components/AppShell',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
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
