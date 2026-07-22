import { TRDrawer } from '@tinyrack/ui/components/drawer';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRNavigationMenu } from '@tinyrack/ui/components/navigation-menu';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  orientation: 'horizontal' | 'vertical';
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
  active: boolean;
  openSection: 'none' | 'product' | 'resources';
};

type NavigationMenuPreviewProps = StoryArgs & {
  navigationLabel?: string;
  onOpenSectionChange?: (value: StoryArgs['openSection']) => void;
};

function FlyoutLink({
  description,
  href,
  title,
}: {
  description: string;
  href: string;
  title: string;
}) {
  return (
    <TRNavigationMenu.Link className="grid gap-1" closeOnClick href={href}>
      <strong>{title}</strong>
      <span className="text-tinyrack-xs text-tinyrack-text-muted">{description}</span>
    </TRNavigationMenu.Link>
  );
}

function MobileNavigation() {
  return (
    <div className="md:hidden">
      <TRDrawer.Root swipeDirection="right">
        <TRDrawer.Trigger>Open site navigation</TRDrawer.Trigger>
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup>
              <TRDrawer.Content>
                <TRDrawer.Title>Tinyrack Cloud</TRDrawer.Title>
                <TRDrawer.Description>
                  Platform and support destinations.
                </TRDrawer.Description>
                <nav aria-label="Mobile site navigation" className="grid gap-3">
                  <strong>Product</strong>
                  <TRLink href="#deployments">Deployments</TRLink>
                  <TRLink href="#observability">Observability</TRLink>
                  <strong>Resources</strong>
                  <TRLink href="#guides">Guides</TRLink>
                  <TRLink href="#api">API reference</TRLink>
                  <TRLink href="#pricing">Pricing</TRLink>
                  <TRLink href="#status">Status</TRLink>
                </nav>
                <TRDrawer.Close>Close navigation</TRDrawer.Close>
              </TRDrawer.Content>
            </TRDrawer.Popup>
          </TRDrawer.Viewport>
        </TRDrawer.Portal>
      </TRDrawer.Root>
    </div>
  );
}

export function NavigationMenuPreview({
  active,
  align,
  disabled,
  openSection,
  orientation,
  navigationLabel = 'Tinyrack Cloud site navigation',
  onOpenSectionChange,
  side,
}: NavigationMenuPreviewProps) {
  const value = openSection === 'none' ? null : openSection;
  const stateProps =
    onOpenSectionChange === undefined
      ? { defaultValue: value }
      : {
          onValueChange: (nextValue: unknown) =>
            onOpenSectionChange(
              nextValue === 'product' || nextValue === 'resources' ? nextValue : 'none',
            ),
          value,
        };

  return (
    <header className="flex w-full items-center justify-between gap-4 border-b border-tinyrack-border bg-tinyrack-surface px-4 py-3">
      <TRLink className="shrink-0 font-bold no-underline" href="#home" underline="none">
        Tinyrack Cloud
      </TRLink>
      <div className="hidden min-w-0 md:block">
        <TRNavigationMenu.Root
          aria-label={navigationLabel}
          orientation={orientation}
          {...stateProps}
        >
          <TRNavigationMenu.List>
            <TRNavigationMenu.Item value="product">
              <TRNavigationMenu.Trigger disabled={disabled}>
                Product
                <TRNavigationMenu.Icon />
              </TRNavigationMenu.Trigger>
              <TRNavigationMenu.Content className="grid min-w-72 gap-2 p-2 sm:grid-cols-2">
                <FlyoutLink
                  description="Ship and manage workloads."
                  href="#deployments"
                  title="Deployments"
                />
                <FlyoutLink
                  description="Follow rack health and events."
                  href="#observability"
                  title="Observability"
                />
              </TRNavigationMenu.Content>
            </TRNavigationMenu.Item>
            <TRNavigationMenu.Item value="resources">
              <TRNavigationMenu.Trigger>
                Resources
                <TRNavigationMenu.Icon />
              </TRNavigationMenu.Trigger>
              <TRNavigationMenu.Content className="grid min-w-72 gap-2 p-2">
                <FlyoutLink
                  description="Task-oriented platform guidance."
                  href="#guides"
                  title="Guides"
                />
                <FlyoutLink
                  description="Endpoints, schemas, and examples."
                  href="#api"
                  title="API reference"
                />
              </TRNavigationMenu.Content>
            </TRNavigationMenu.Item>
            <TRNavigationMenu.Item>
              <TRNavigationMenu.Link active={active} href="#pricing">
                Pricing
              </TRNavigationMenu.Link>
            </TRNavigationMenu.Item>
            <TRNavigationMenu.Item>
              <TRNavigationMenu.Link href="#status">Status</TRNavigationMenu.Link>
            </TRNavigationMenu.Item>
          </TRNavigationMenu.List>
          <TRNavigationMenu.Portal>
            <TRNavigationMenu.Positioner align={align} side={side}>
              <TRNavigationMenu.Popup>
                <TRNavigationMenu.Viewport />
                <TRNavigationMenu.Arrow />
              </TRNavigationMenu.Popup>
            </TRNavigationMenu.Positioner>
          </TRNavigationMenu.Portal>
        </TRNavigationMenu.Root>
      </div>
      <MobileNavigation />
    </header>
  );
}

export function NavigationMenuResponsivePreview() {
  return (
    <NavigationMenuPreview
      active={false}
      align="center"
      disabled={false}
      navigationLabel="Responsive Tinyrack Cloud navigation"
      openSection="none"
      orientation="horizontal"
      side="bottom"
    />
  );
}

const meta = {
  title: 'Components/Navigation Menu',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered', playgroundLayout: 'fill' },
  args: {
    disabled: false,
    orientation: 'horizontal',
    side: 'bottom',
    align: 'center',
    active: false,
    openSection: 'none',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    active: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <NavigationMenuPreview
        {...args}
        onOpenSectionChange={(openSection) => updateArgs({ openSection })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
