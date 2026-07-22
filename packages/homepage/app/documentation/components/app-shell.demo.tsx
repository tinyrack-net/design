import { TRAppShell } from '@tinyrack/ui/components/app-shell';
import { TRLink } from '@tinyrack/ui/components/link';
import {
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
      <TRAppShell.Header className="flex items-center gap-3 border-b border-tinyrack-border p-3">
        <TRAppShell.Trigger appearance={controlAppearance} aria-label="Open navigation">
          <MenuIcon aria-hidden="true" />
        </TRAppShell.Trigger>
        <strong>Tinyrack</strong>
      </TRAppShell.Header>
      <TRAppShell.Sidebar aria-label="Example navigation">
        <div className="p-4">
          <TRAppShell.SidebarToggle
            appearance={controlAppearance}
            aria-label="Toggle sidebar"
          >
            <PanelLeftCloseIcon aria-hidden="true" />
          </TRAppShell.SidebarToggle>
          <TRAppShell.Close
            appearance={controlAppearance}
            aria-label="Close navigation"
          >
            <XIcon aria-hidden="true" />
          </TRAppShell.Close>
          <nav className="grid gap-2" aria-label="Rack pages">
            <TRLink href="#overview">
              <GaugeIcon aria-hidden="true" />
              <TRAppShell.SidebarLabel>Overview</TRAppShell.SidebarLabel>
            </TRLink>
            <TRLink href="#deployments">
              <RocketIcon aria-hidden="true" />
              <TRAppShell.SidebarLabel>Deployments</TRAppShell.SidebarLabel>
            </TRLink>
          </nav>
        </div>
      </TRAppShell.Sidebar>
      <TRAppShell.Main className="p-5" render={<div />}>
        Operational content
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
          <AppShellPreview
            breakpoint={breakpoint}
            contained
            layout={layout}
            mobileSidebar="drawer"
            sidebarMode="expanded"
            width="narrow"
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
