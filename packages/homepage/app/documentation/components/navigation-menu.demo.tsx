import { TRDrawer } from '@tinyrack/ui/components/drawer';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRNavigationMenu } from '@tinyrack/ui/components/navigation-menu';
import { Menu, X } from 'lucide-react';
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
  locale?: 'en' | 'ja' | 'ko';
  navigationLabel?: string;
  onOpenSectionChange?: (value: StoryArgs['openSection']) => void;
};

const localeCopy = {
  en: {
    close: 'Close navigation',
    description: 'Choose a product or support destination.',
    menu: 'Open site navigation',
    navigation: 'Mobile site navigation',
    product: 'Product',
    resources: 'Resources',
  },
  ja: {
    close: 'メニューを閉じる',
    description: '製品またはサポートの目的地を選択してください。',
    menu: 'サイトナビゲーションを開く',
    navigation: 'モバイルサイトナビゲーション',
    product: '製品',
    resources: 'リソース',
  },
  ko: {
    close: '메뉴 닫기',
    description: '제품 또는 지원 목적지를 선택하세요.',
    menu: '사이트 탐색 열기',
    navigation: '모바일 사이트 탐색',
    product: '제품',
    resources: '리소스',
  },
} as const;

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
    <TRNavigationMenu.Link
      className="grid min-h-20 content-center gap-1 px-4 py-3"
      closeOnClick
      href={href}
    >
      <strong className="text-tinyrack-sm">{title}</strong>
      <span className="text-tinyrack-xs text-tinyrack-text-muted">{description}</span>
    </TRNavigationMenu.Link>
  );
}

function MobileNavigation({ locale }: { locale: keyof typeof localeCopy }) {
  const copy = localeCopy[locale];
  return (
    <div className="md:hidden">
      <TRDrawer.Root swipeDirection="right">
        <TRDrawer.Trigger
          aria-label={copy.menu}
          className="size-11 min-h-11 justify-center px-0"
        >
          <Menu aria-hidden="true" size={18} />
        </TRDrawer.Trigger>
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup>
              <TRDrawer.Content className="gap-6">
                <div className="flex items-center justify-between gap-4">
                  <TRDrawer.Title>Tinyrack Cloud</TRDrawer.Title>
                  <TRDrawer.Close
                    aria-label={copy.close}
                    className="size-11 min-h-11 justify-center px-0"
                  >
                    <X aria-hidden="true" size={18} />
                  </TRDrawer.Close>
                </div>
                <TRDrawer.Description>{copy.description}</TRDrawer.Description>
                <nav aria-label={copy.navigation} className="grid gap-6">
                  <div className="grid gap-2">
                    <strong className="text-tinyrack-xs uppercase tracking-wide text-tinyrack-text-muted">
                      {copy.product}
                    </strong>
                    <div className="grid gap-1">
                      <TRLink className="min-h-11 px-3" href="#deployments">
                        Deployments
                      </TRLink>
                      <TRLink className="min-h-11 px-3" href="#observability">
                        Observability
                      </TRLink>
                      <TRLink className="min-h-11 px-3" href="#environments">
                        Environments
                      </TRLink>
                      <TRLink className="min-h-11 px-3" href="#access">
                        Access control
                      </TRLink>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <strong className="text-tinyrack-xs uppercase tracking-wide text-tinyrack-text-muted">
                      {copy.resources}
                    </strong>
                    <div className="grid gap-1">
                      <TRLink className="min-h-11 px-3" href="#guides">
                        Guides
                      </TRLink>
                      <TRLink className="min-h-11 px-3" href="#api">
                        API reference
                      </TRLink>
                    </div>
                  </div>
                  <div className="grid gap-1 border-t border-tinyrack-border pt-4">
                    <TRLink className="min-h-11 px-3" href="#pricing">
                      Pricing
                    </TRLink>
                    <TRLink className="min-h-11 px-3" href="#status">
                      Status
                    </TRLink>
                  </div>
                </nav>
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
  locale = 'en',
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
    <header className="flex w-full items-center justify-between gap-4 rounded-lg border border-tinyrack-border bg-tinyrack-surface p-2 shadow-sm">
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
              <TRNavigationMenu.Content className="grid min-w-96 gap-1 p-2 sm:grid-cols-2">
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
                <FlyoutLink
                  description="Promote configuration across stages."
                  href="#environments"
                  title="Environments"
                />
                <FlyoutLink
                  description="Manage roles and service access."
                  href="#access"
                  title="Access control"
                />
              </TRNavigationMenu.Content>
            </TRNavigationMenu.Item>
            <TRNavigationMenu.Item value="resources">
              <TRNavigationMenu.Trigger>
                Resources
                <TRNavigationMenu.Icon />
              </TRNavigationMenu.Trigger>
              <TRNavigationMenu.Content className="grid min-w-80 gap-1 p-2">
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
      <MobileNavigation locale={locale} />
    </header>
  );
}

export function NavigationMenuResponsivePreview({
  locale = 'en',
}: {
  locale?: 'en' | 'ja' | 'ko';
}) {
  return (
    <NavigationMenuPreview
      active={false}
      align="center"
      disabled={false}
      locale={locale}
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
