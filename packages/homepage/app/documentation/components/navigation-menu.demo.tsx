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
import { useDemoLocale } from '../shared/demo-locale.js';

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
    deployments: 'Deployments',
    observability: 'Observability',
    environments: 'Environments',
    access: 'Access control',
    guides: 'Guides',
    api: 'API reference',
    pricing: 'Pricing',
    status: 'Status',
    ship: 'Ship and manage workloads.',
    health: 'Follow rack health and events.',
    promote: 'Promote configuration across stages.',
    roles: 'Manage roles and service access.',
    guidance: 'Task-oriented platform guidance.',
    endpoints: 'Endpoints, schemas, and examples.',
    orientations: ['Horizontal navigation', 'Vertical navigation'],
    states: ['Inactive link', 'Active link', 'Disabled trigger'],
    sides: ['Top', 'Right', 'Bottom', 'Left'],
    aligns: ['Start', 'Center', 'End'],
    keyboard: 'Keyboard navigation',
    first: 'Product',
    second: 'Resources',
  },
  ja: {
    close: 'メニューを閉じる',
    description: '製品またはサポートの目的地を選択してください。',
    menu: 'サイトナビゲーションを開く',
    navigation: 'モバイルサイトナビゲーション',
    product: '製品',
    resources: 'リソース',
    deployments: 'デプロイ',
    observability: 'オブザーバビリティ',
    environments: '環境',
    access: 'アクセス制御',
    guides: 'ガイド',
    api: 'API リファレンス',
    pricing: '料金',
    status: 'ステータス',
    ship: 'ワークロードをデプロイして管理します。',
    health: 'ラックの状態とイベントを確認します。',
    promote: '設定を環境間で昇格します。',
    roles: 'ロールとサービスアクセスを管理します。',
    guidance: 'タスク別のプラットフォームガイドです。',
    endpoints: 'エンドポイント、スキーマ、例を確認します。',
    orientations: ['横方向のナビゲーション', '縦方向のナビゲーション'],
    states: ['非アクティブなリンク', 'アクティブなリンク', '無効なトリガー'],
    sides: ['上', '右', '下', '左'],
    aligns: ['開始位置', '中央', '終了位置'],
    keyboard: 'キーボードナビゲーション',
    first: '製品',
    second: 'リソース',
  },
  ko: {
    close: '메뉴 닫기',
    description: '제품 또는 지원 목적지를 선택하세요.',
    menu: '사이트 탐색 열기',
    navigation: '모바일 사이트 탐색',
    product: '제품',
    resources: '리소스',
    deployments: '배포',
    observability: '관측 정보',
    environments: '환경',
    access: '접근 제어',
    guides: '가이드',
    api: 'API 참고 자료',
    pricing: '요금',
    status: '상태',
    ship: '워크로드를 배포하고 관리해요.',
    health: '랙 상태와 이벤트를 확인해요.',
    promote: '환경 사이에서 설정을 승격해요.',
    roles: '역할과 서비스 접근을 관리해요.',
    guidance: '작업 중심 플랫폼 가이드를 제공해요.',
    endpoints: '엔드포인트, 스키마, 예시를 확인해요.',
    orientations: ['가로 탐색', '세로 탐색'],
    states: ['비활성 링크', '현재 링크', '사용할 수 없는 트리거'],
    sides: ['위쪽', '오른쪽', '아래쪽', '왼쪽'],
    aligns: ['시작', '가운데', '끝'],
    keyboard: '키보드 탐색',
    first: '제품',
    second: '리소스',
  },
} as const;

function NavigationSpecimen({
  active = false,
  align = 'center',
  disabled = false,
  label,
  orientation = 'horizontal',
  side = 'bottom',
}: {
  active?: boolean;
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
  label: string;
  orientation?: 'horizontal' | 'vertical';
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  const copy = localeCopy[useDemoLocale()];
  return (
    <TRNavigationMenu.Root
      aria-label={label}
      data-docs-example-item=""
      defaultValue="section"
      orientation={orientation}
    >
      <TRNavigationMenu.List>
        <TRNavigationMenu.Item value="section">
          <TRNavigationMenu.Trigger disabled={disabled}>
            {label}
            <TRNavigationMenu.Icon />
          </TRNavigationMenu.Trigger>
          <TRNavigationMenu.Content>
            <TRNavigationMenu.Link closeOnClick href="#section">
              {copy.first}
            </TRNavigationMenu.Link>
          </TRNavigationMenu.Content>
        </TRNavigationMenu.Item>
        <TRNavigationMenu.Item>
          <TRNavigationMenu.Link active={active} href="#direct">
            {copy.second}
          </TRNavigationMenu.Link>
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
  );
}

export function NavigationMenuStateComparison() {
  const locale = useDemoLocale();
  const copy = localeCopy[locale];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <NavigationMenuPreview
        active={false}
        align="center"
        disabled={false}
        locale={locale}
        navigationLabel={copy.states[0]}
        openSection="none"
        orientation="horizontal"
        side="bottom"
      />
      <NavigationSpecimen active label={copy.states[1]} />
      <NavigationSpecimen disabled label={copy.states[2]} />
    </div>
  );
}
export function NavigationMenuOrientationComparison() {
  const copy = localeCopy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <NavigationSpecimen label={copy.orientations[0]} />
      <NavigationSpecimen label={copy.orientations[1]} orientation="vertical" />
    </div>
  );
}
export function NavigationMenuSideComparison() {
  const copy = localeCopy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(['top', 'right', 'bottom', 'left'] as const).map((side, index) => (
        <NavigationSpecimen key={side} label={copy.sides[index] ?? side} side={side} />
      ))}
    </div>
  );
}
export function NavigationMenuAlignComparison() {
  const copy = localeCopy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(['start', 'center', 'end'] as const).map((align, index) => (
        <NavigationSpecimen
          align={align}
          key={align}
          label={copy.aligns[index] ?? align}
        />
      ))}
    </div>
  );
}
export function NavigationMenuKeyboardPreview() {
  const copy = localeCopy[useDemoLocale()];
  return <NavigationSpecimen label={copy.keyboard} />;
}

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
                        {copy.deployments}
                      </TRLink>
                      <TRLink className="min-h-11 px-3" href="#observability">
                        {copy.observability}
                      </TRLink>
                      <TRLink className="min-h-11 px-3" href="#environments">
                        {copy.environments}
                      </TRLink>
                      <TRLink className="min-h-11 px-3" href="#access">
                        {copy.access}
                      </TRLink>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <strong className="text-tinyrack-xs uppercase tracking-wide text-tinyrack-text-muted">
                      {copy.resources}
                    </strong>
                    <div className="grid gap-1">
                      <TRLink className="min-h-11 px-3" href="#guides">
                        {copy.guides}
                      </TRLink>
                      <TRLink className="min-h-11 px-3" href="#api">
                        {copy.api}
                      </TRLink>
                    </div>
                  </div>
                  <div className="grid gap-1 border-t border-tinyrack-border pt-4">
                    <TRLink className="min-h-11 px-3" href="#pricing">
                      {copy.pricing}
                    </TRLink>
                    <TRLink className="min-h-11 px-3" href="#status">
                      {copy.status}
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
  locale,
  openSection,
  orientation,
  navigationLabel = 'Tinyrack Cloud site navigation',
  onOpenSectionChange,
  side,
}: NavigationMenuPreviewProps) {
  const demoLocale = useDemoLocale();
  const resolvedLocale = locale ?? demoLocale;
  const copy = localeCopy[resolvedLocale];
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
    <header
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-tinyrack-border bg-tinyrack-surface p-2 shadow-sm"
      data-docs-example-item=""
    >
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
                {copy.product}
                <TRNavigationMenu.Icon />
              </TRNavigationMenu.Trigger>
              <TRNavigationMenu.Content className="grid min-w-96 gap-1 p-2 sm:grid-cols-2">
                <FlyoutLink
                  description={copy.ship}
                  href="#deployments"
                  title={copy.deployments}
                />
                <FlyoutLink
                  description={copy.health}
                  href="#observability"
                  title={copy.observability}
                />
                <FlyoutLink
                  description={copy.promote}
                  href="#environments"
                  title={copy.environments}
                />
                <FlyoutLink
                  description={copy.roles}
                  href="#access"
                  title={copy.access}
                />
              </TRNavigationMenu.Content>
            </TRNavigationMenu.Item>
            <TRNavigationMenu.Item value="resources">
              <TRNavigationMenu.Trigger>
                {copy.resources}
                <TRNavigationMenu.Icon />
              </TRNavigationMenu.Trigger>
              <TRNavigationMenu.Content className="grid min-w-80 gap-1 p-2">
                <FlyoutLink
                  description={copy.guidance}
                  href="#guides"
                  title={copy.guides}
                />
                <FlyoutLink description={copy.endpoints} href="#api" title={copy.api} />
              </TRNavigationMenu.Content>
            </TRNavigationMenu.Item>
            <TRNavigationMenu.Item>
              <TRNavigationMenu.Link active={active} href="#pricing">
                {copy.pricing}
              </TRNavigationMenu.Link>
            </TRNavigationMenu.Item>
            <TRNavigationMenu.Item>
              <TRNavigationMenu.Link href="#status">
                {copy.status}
              </TRNavigationMenu.Link>
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
      <MobileNavigation locale={resolvedLocale} />
    </header>
  );
}

export function NavigationMenuResponsivePreview({
  locale,
}: {
  locale?: 'en' | 'ja' | 'ko';
}) {
  const demoLocale = useDemoLocale();
  const resolvedLocale = locale ?? demoLocale;
  return (
    <NavigationMenuPreview
      active={false}
      align="center"
      disabled={false}
      locale={resolvedLocale}
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
