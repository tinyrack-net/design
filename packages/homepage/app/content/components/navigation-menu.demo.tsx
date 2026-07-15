import { Drawer } from '@tinyrack/ui/components/drawer';
import { Link } from '@tinyrack/ui/components/link';
import { NavigationMenu } from '@tinyrack/ui/components/navigation-menu';
import { ChevronDown, MenuIcon } from 'lucide-react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  label: string;
  disabled: boolean;
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
    <NavigationMenu.Link className="grid gap-1" href={href}>
      <strong>{title}</strong>
      <span className="text-tinyrack-xs text-tinyrack-text-muted">{description}</span>
    </NavigationMenu.Link>
  );
}

function MobileNavigation() {
  return (
    <div className="md:hidden">
      <Drawer.Root swipeDirection="right">
        <Drawer.Trigger aria-label="Open site navigation">
          <MenuIcon aria-hidden="true" />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Viewport>
            <Drawer.Popup>
              <Drawer.Content>
                <Drawer.Title>Tinyrack Cloud</Drawer.Title>
                <Drawer.Description>
                  Platform and support destinations.
                </Drawer.Description>
                <nav aria-label="Mobile site navigation" className="grid gap-3">
                  <strong>Product</strong>
                  <Link href="#deployments">Deployments</Link>
                  <Link href="#observability">Observability</Link>
                  <strong>Resources</strong>
                  <Link href="#guides">Guides</Link>
                  <Link href="#api">API reference</Link>
                  <Link href="#pricing">Pricing</Link>
                  <Link href="#status">Status</Link>
                </nav>
                <Drawer.Close>Close navigation</Drawer.Close>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

export function NavigationMenuPreview({
  label,
  disabled,
  openSection,
  navigationLabel = 'Tinyrack Cloud site navigation',
  onOpenSectionChange,
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
      <Link className="shrink-0 font-bold no-underline" href="#home" underline="none">
        Tinyrack Cloud
      </Link>
      <div className="hidden min-w-0 md:block">
        <NavigationMenu.Root aria-label={navigationLabel} {...stateProps}>
          <NavigationMenu.List>
            <NavigationMenu.Item value="product">
              <NavigationMenu.Trigger disabled={disabled}>
                {label}
                <NavigationMenu.Icon aria-hidden="true">
                  <ChevronDown />
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="grid min-w-72 gap-2 p-2 sm:grid-cols-2">
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
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="resources">
              <NavigationMenu.Trigger>
                Resources
                <NavigationMenu.Icon aria-hidden="true">
                  <ChevronDown />
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="grid min-w-72 gap-2 p-2">
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
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#status">Status</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
          <NavigationMenu.Portal>
            <NavigationMenu.Positioner>
              <NavigationMenu.Popup>
                <NavigationMenu.Viewport />
                <NavigationMenu.Arrow />
              </NavigationMenu.Popup>
            </NavigationMenu.Positioner>
          </NavigationMenu.Portal>
        </NavigationMenu.Root>
      </div>
      <MobileNavigation />
    </header>
  );
}

export function NavigationMenuResponsiveAlternative() {
  return (
    <NavigationMenuPreview
      disabled={false}
      label="Product"
      navigationLabel="Responsive Tinyrack Cloud navigation"
      openSection="none"
    />
  );
}

const meta = {
  title: 'Components/Navigation Menu',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered', playgroundLayout: 'fill' },
  args: { label: 'Product', disabled: false, openSection: 'none' },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    openSection: { control: 'select', options: ['none', 'product', 'resources'] },
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
