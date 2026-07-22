import { TRAppShell } from '@tinyrack/ui/components/app-shell';
import { TRLink } from '@tinyrack/ui/components/link';
import {
  ActivityIcon,
  BoxesIcon,
  Clock3Icon,
  DatabaseIcon,
  GaugeIcon,
  MenuIcon,
  PanelLeftCloseIcon,
  RocketIcon,
  XIcon,
} from 'lucide-react';
import { type CSSProperties, useState } from 'react';
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
  controlAppearance: 'solid' | 'outline' | 'ghost';
  layout: 'header-first' | 'sidebar-first';
  mobileSidebar: 'drawer' | 'rail';
  open: boolean;
  sidebarMode: 'expanded' | 'rail';
};

const navigationItems = [
  { icon: GaugeIcon, label: 'Overview' },
  { icon: RocketIcon, label: 'Deployments' },
  { icon: BoxesIcon, label: 'Services' },
  { icon: DatabaseIcon, label: 'Data stores' },
] as const;

function WorkspaceSidebar({
  controlAppearance,
}: {
  controlAppearance: StoryArgs['controlAppearance'];
}) {
  return (
    <div className="flex min-h-full flex-col gap-4 p-3">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 px-2">
          <span className="grid size-7 flex-none place-items-center rounded-tinyrack-md bg-tinyrack-primary text-tinyrack-on-primary">
            <BoxesIcon aria-hidden="true" className="size-4" />
          </span>
          <TRAppShell.SidebarLabel className="min-w-0">
            <span className="block truncate text-tinyrack-sm font-semibold">
              Orbit Ops
            </span>
            <span className="block truncate text-tinyrack-2xs text-tinyrack-text-muted">
              Production workspace
            </span>
          </TRAppShell.SidebarLabel>
        </div>
        <div className="flex flex-none items-center gap-1">
          <TRAppShell.SidebarToggle
            appearance={controlAppearance}
            aria-label="Toggle sidebar"
            uiSize="sm"
          >
            <PanelLeftCloseIcon aria-hidden="true" />
          </TRAppShell.SidebarToggle>
          <TRAppShell.Close
            appearance={controlAppearance}
            aria-label="Close navigation"
            uiSize="sm"
          >
            <XIcon aria-hidden="true" />
          </TRAppShell.Close>
        </div>
      </div>
      <nav className="grid gap-1" aria-label="Workspace pages">
        {navigationItems.map(({ icon: Icon, label }, index) => (
          <TRLink
            className={`flex min-h-9 items-center gap-3 rounded-tinyrack-md px-2 no-underline ${
              index === 0
                ? 'bg-tinyrack-surface-muted text-tinyrack-text'
                : 'text-tinyrack-text-muted'
            }`}
            href={`#${label.toLowerCase().replace(' ', '-')}`}
            key={label}
          >
            <Icon aria-hidden="true" className="size-4 flex-none" />
            <TRAppShell.SidebarLabel className="truncate text-tinyrack-sm">
              {label}
            </TRAppShell.SidebarLabel>
          </TRLink>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 rounded-tinyrack-md border border-tinyrack-border p-2">
        <span className="grid size-7 flex-none place-items-center rounded-full bg-tinyrack-surface-muted text-tinyrack-2xs font-semibold">
          AK
        </span>
        <TRAppShell.SidebarLabel className="min-w-0">
          <span className="block truncate text-tinyrack-xs font-medium">Avery Kim</span>
          <span className="block truncate text-tinyrack-2xs text-tinyrack-text-muted">
            Platform team
          </span>
        </TRAppShell.SidebarLabel>
      </div>
    </div>
  );
}

function WorkspaceContent() {
  const metrics = [
    { label: 'Healthy services', value: '24 / 24' },
    { label: 'Deployments today', value: '18' },
    { label: 'P95 response', value: '128 ms' },
  ];

  return (
    <div className="grid min-w-0 gap-4 p-4 sm:p-5">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-tinyrack-2xs font-medium uppercase tracking-wide text-tinyrack-text-muted">
            Production / us-east
          </p>
          <h2 className="m-0 mt-1 truncate text-tinyrack-lg font-semibold">
            System overview
          </h2>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-tinyrack-border px-3 py-1 text-tinyrack-xs">
          <span className="size-2 rounded-full bg-tinyrack-success" />
          All systems operational
        </span>
      </div>
      <div className="grid min-w-0 gap-2 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            className="min-w-0 rounded-tinyrack-md border border-tinyrack-border bg-tinyrack-surface p-3"
            key={metric.label}
          >
            <p className="m-0 truncate text-tinyrack-2xs text-tinyrack-text-muted">
              {metric.label}
            </p>
            <strong className="mt-1 block truncate text-tinyrack-md">
              {metric.value}
            </strong>
          </div>
        ))}
      </div>
      <section className="min-w-0 rounded-tinyrack-md border border-tinyrack-border bg-tinyrack-surface p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="m-0 text-tinyrack-sm font-semibold">Recent activity</h3>
          <span className="flex items-center gap-1 text-tinyrack-2xs text-tinyrack-text-muted">
            <ActivityIcon aria-hidden="true" className="size-3" /> Live
          </span>
        </div>
        <div className="mt-3 grid gap-2 text-tinyrack-xs">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="truncate">api-gateway deployed successfully</span>
            <span className="flex flex-none items-center gap-1 text-tinyrack-text-muted">
              <Clock3Icon aria-hidden="true" className="size-3" /> 4m
            </span>
          </div>
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="truncate">Database backup completed</span>
            <span className="flex-none text-tinyrack-text-muted">18m</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export function AppShellPreview({
  breakpoint,
  contained = false,
  controlAppearance = 'ghost',
  layout,
  mobileSidebar = 'drawer',
  onOpenChange,
  onSidebarModeChange,
  open,
  sidebarMode = 'expanded',
  width = 'full',
}: Omit<StoryArgs, 'controlAppearance' | 'mobileSidebar' | 'open' | 'sidebarMode'> & {
  contained?: boolean;
  controlAppearance?: StoryArgs['controlAppearance'];
  mobileSidebar?: StoryArgs['mobileSidebar'];
  onOpenChange?: (open: boolean) => void;
  onSidebarModeChange?: (mode: 'expanded' | 'rail') => void;
  open?: boolean;
  sidebarMode?: StoryArgs['sidebarMode'];
  width?: 'full' | 'narrow';
}) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const stateProps =
    open === undefined
      ? {}
      : {
          open,
          ...(onOpenChange === undefined ? {} : { onOpenChange }),
        };

  const shell = (
    <TRAppShell.Root
      {...stateProps}
      breakpoint={breakpoint}
      className={`h-full min-h-80 w-full overflow-hidden${
        contained ? ' rounded-tinyrack-lg border border-tinyrack-border' : ''
      }`}
      layout={layout}
      mobileSidebar={mobileSidebar}
      sidebarMode={sidebarMode}
      {...(onSidebarModeChange === undefined ? {} : { onSidebarModeChange })}
      {...(contained ? { portalContainer } : {})}
    >
      <TRAppShell.Header className="flex min-w-0 items-center gap-3 border-b border-tinyrack-border px-3 py-2">
        <TRAppShell.Trigger appearance={controlAppearance} aria-label="Open navigation">
          <MenuIcon aria-hidden="true" />
        </TRAppShell.Trigger>
        <div className="min-w-0">
          <strong className="block truncate text-tinyrack-sm">Orbit Ops</strong>
          <span className="block truncate text-tinyrack-2xs text-tinyrack-text-muted">
            Production environment
          </span>
        </div>
        <span className="ml-auto flex-none rounded-full bg-tinyrack-surface-muted px-2 py-1 text-tinyrack-2xs text-tinyrack-text-muted">
          us-east
        </span>
      </TRAppShell.Header>
      <TRAppShell.Sidebar aria-label="Example navigation">
        <WorkspaceSidebar controlAppearance={controlAppearance} />
      </TRAppShell.Sidebar>
      <TRAppShell.Main render={<div />}>
        <WorkspaceContent />
      </TRAppShell.Main>
    </TRAppShell.Root>
  );

  if (!contained) return shell;

  return (
    <div
      className={`h-80 min-h-0 w-full overflow-hidden${
        width === 'narrow' ? ' max-w-[390px]' : ''
      }`}
      ref={setPortalContainer}
      style={
        {
          '--tr-app-shell-drawer-block-size': '100%',
          transform: 'translateZ(0)',
        } as CSSProperties
      }
    >
      {shell}
    </div>
  );
}

export function AppShellLayoutMatrix() {
  const patterns = [
    {
      breakpoint: 'sm',
      description: 'Expanded navigation from 48rem, then a contained drawer below it.',
      label: '48rem breakpoint',
      layout: 'sidebar-first',
      mobileSidebar: 'drawer',
      sidebarMode: 'expanded',
      title: 'Workspace navigation',
    },
    {
      breakpoint: 'lg',
      description: 'A full-width header stays above navigation and content from 64rem.',
      label: '64rem breakpoint',
      layout: 'header-first',
      mobileSidebar: 'drawer',
      sidebarMode: 'expanded',
      title: 'Header-first product',
    },
    {
      breakpoint: 'lg',
      description:
        'Primary destinations remain visible as a compact rail on small screens.',
      label: 'Persistent mobile rail',
      layout: 'sidebar-first',
      mobileSidebar: 'rail',
      sidebarMode: 'rail',
      title: 'Dense operations tool',
    },
  ] as const;

  return (
    <div className="grid min-w-0 gap-6">
      {patterns.map((pattern) => (
        <section className="grid min-w-0 gap-3" key={pattern.title}>
          <div className="grid min-w-0 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
            <div className="min-w-0">
              <strong className="block text-tinyrack-sm">{pattern.title}</strong>
              <p className="m-0 mt-1 text-tinyrack-xs leading-tinyrack-sm text-tinyrack-text-muted">
                {pattern.description}
              </p>
            </div>
            <span className="w-fit rounded-full border border-tinyrack-border px-2 py-1 text-tinyrack-2xs text-tinyrack-text-muted">
              {pattern.label}
            </span>
          </div>
          <AppShellPreview
            breakpoint={pattern.breakpoint}
            contained
            layout={pattern.layout}
            mobileSidebar={pattern.mobileSidebar}
            sidebarMode={pattern.sidebarMode}
          />
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/AppShell',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered', playgroundLayout: 'fill' },
  args: {
    breakpoint: 'lg',
    controlAppearance: 'ghost',
    layout: 'sidebar-first',
    mobileSidebar: 'drawer',
    open: false,
    sidebarMode: 'expanded',
  },
  argTypes: {
    breakpoint: { options: ['sm', 'lg'], control: 'radio' },
    controlAppearance: {
      options: ['solid', 'outline', 'ghost'],
      control: 'radio',
    },
    layout: { options: ['header-first', 'sidebar-first'], control: 'radio' },
    mobileSidebar: { options: ['drawer', 'rail'], control: 'radio' },
    sidebarMode: { options: ['expanded', 'rail'], control: 'radio' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <AppShellPreview
        {...args}
        contained
        onOpenChange={(open) => updateArgs({ open })}
        onSidebarModeChange={(sidebarMode) => updateArgs({ sidebarMode })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
