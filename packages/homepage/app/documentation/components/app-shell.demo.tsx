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
import { useDemoLocale } from '../shared/demo-locale.js';

type StoryArgs = {
  breakpoint: 'sm' | 'lg';
  controlAppearance: 'solid' | 'outline' | 'ghost';
  layout: 'header-first' | 'sidebar-first';
  mobileSidebar: 'drawer' | 'rail';
  open: boolean;
  sidebarMode: 'expanded' | 'rail';
};

const getNavigationItems = (locale: 'en' | 'ko' | 'ja') => {
  const labels = {
    en: ['Overview', 'Deployments', 'Services', 'Data stores'],
    ko: ['개요예요', '배포예요', '서비스예요', '데이터 저장소예요'],
    ja: ['概要', 'デプロイ', 'サービス', 'データストア'],
  }[locale];
  return [GaugeIcon, RocketIcon, BoxesIcon, DatabaseIcon].map((icon, index) => ({
    icon,
    label: labels[index] ?? '',
  }));
};

function WorkspaceSidebar({
  controlAppearance,
}: {
  controlAppearance: StoryArgs['controlAppearance'];
}) {
  const locale = useDemoLocale();
  const copy = {
    en: [
      'Toggle sidebar',
      'Close navigation',
      'Workspace pages',
      'Production workspace',
      'Platform team',
    ],
    ko: [
      '사이드바를 전환해요',
      '탐색을 닫아요',
      '워크스페이스 페이지예요',
      '프로덕션 워크스페이스예요',
      '플랫폼 팀이에요',
    ],
    ja: [
      'サイドバーを切り替える',
      'ナビゲーションを閉じる',
      'ワークスペースページ',
      '本番ワークスペース',
      'プラットフォームチーム',
    ],
  }[locale];
  const navigationItems = getNavigationItems(locale);
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
              {copy[3]}
            </span>
          </TRAppShell.SidebarLabel>
        </div>
        <div className="flex flex-none items-center gap-1">
          <TRAppShell.SidebarToggle
            appearance={controlAppearance}
            aria-label={copy[0] ?? ''}
            uiSize="sm"
          >
            <PanelLeftCloseIcon aria-hidden="true" />
          </TRAppShell.SidebarToggle>
          <TRAppShell.Close
            appearance={controlAppearance}
            aria-label={copy[1] ?? ''}
            uiSize="sm"
          >
            <XIcon aria-hidden="true" />
          </TRAppShell.Close>
        </div>
      </div>
      <nav className="grid gap-1" aria-label={copy[2]}>
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
            {copy[4]}
          </span>
        </TRAppShell.SidebarLabel>
      </div>
    </div>
  );
}

function WorkspaceContent() {
  const locale = useDemoLocale();
  const copy = {
    en: [
      'Healthy services',
      'Deployments today',
      'P95 response',
      'System overview',
      'All systems operational',
      'Recent activity',
      'Live',
      'api-gateway deployed successfully',
      'Database backup completed',
    ],
    ko: [
      '정상 서비스예요',
      '오늘 배포예요',
      'P95 응답이에요',
      '시스템 개요예요',
      '모든 시스템이 정상이에요',
      '최근 활동이에요',
      '실시간이에요',
      'api-gateway 배포에 성공했어요',
      '데이터베이스 백업을 마쳤어요',
    ],
    ja: [
      '正常なサービス',
      '本日のデプロイ',
      'P95 応答',
      'システム概要',
      'すべてのシステムが正常です',
      '最近のアクティビティ',
      'ライブ',
      'api-gateway のデプロイに成功しました',
      'データベースのバックアップが完了しました',
    ],
  }[locale];
  const metrics = [
    { label: copy[0], value: '24 / 24' },
    { label: copy[1], value: '18' },
    { label: copy[2], value: '128 ms' },
  ];

  return (
    <div className="grid min-w-0 gap-4 p-4 sm:p-5">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-tinyrack-2xs font-medium uppercase tracking-wide text-tinyrack-text-muted">
            Production / us-east
          </p>
          <h2 className="m-0 mt-1 truncate text-tinyrack-lg font-semibold">
            {copy[3]}
          </h2>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-tinyrack-border px-3 py-1 text-tinyrack-xs">
          <span className="size-2 rounded-full bg-tinyrack-success" />
          {copy[4]}
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
          <h3 className="m-0 text-tinyrack-sm font-semibold">{copy[5]}</h3>
          <span className="flex items-center gap-1 text-tinyrack-2xs text-tinyrack-text-muted">
            <ActivityIcon aria-hidden="true" className="size-3" /> {copy[6]}
          </span>
        </div>
        <div className="mt-3 grid gap-2 text-tinyrack-xs">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="truncate">{copy[7]}</span>
            <span className="flex flex-none items-center gap-1 text-tinyrack-text-muted">
              <Clock3Icon aria-hidden="true" className="size-3" /> 4m
            </span>
          </div>
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="truncate">{copy[8]}</span>
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
  const locale = useDemoLocale();
  const copy = {
    en: {
      open: 'Open navigation',
      nav: 'Example navigation',
      environment: 'Production environment',
    },
    ko: {
      open: '탐색을 열어요',
      nav: '예제 탐색이에요',
      environment: '프로덕션 환경이에요',
    },
    ja: {
      open: 'ナビゲーションを開く',
      nav: 'サンプルナビゲーション',
      environment: '本番環境',
    },
  }[locale];
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
      data-docs-example-item=""
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
        <TRAppShell.Trigger appearance={controlAppearance} aria-label={copy.open}>
          <MenuIcon aria-hidden="true" />
        </TRAppShell.Trigger>
        <div className="min-w-0">
          <strong className="block truncate text-tinyrack-sm">Orbit Ops</strong>
          <span className="block truncate text-tinyrack-2xs text-tinyrack-text-muted">
            {copy.environment}
          </span>
        </div>
        <span className="ml-auto flex-none rounded-full bg-tinyrack-surface-muted px-2 py-1 text-tinyrack-2xs text-tinyrack-text-muted">
          us-east
        </span>
      </TRAppShell.Header>
      <TRAppShell.Sidebar aria-label={copy.nav}>
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
  const locale = useDemoLocale();
  const localized = {
    en: [
      [
        'Workspace navigation',
        'Expanded navigation from 48rem, then a contained drawer below it.',
        '48rem breakpoint',
      ],
      [
        'Header-first product',
        'A full-width header stays above navigation and content from 64rem.',
        '64rem breakpoint',
      ],
      [
        'Dense operations tool',
        'Primary destinations remain visible as a compact rail on small screens.',
        'Persistent mobile rail',
      ],
    ],
    ko: [
      [
        '워크스페이스 탐색이에요',
        '48rem부터 탐색을 펼치고 그 아래에서는 포함형 drawer를 사용해요.',
        '48rem breakpoint예요',
      ],
      [
        '헤더 우선 제품이에요',
        '64rem부터 전체 너비 헤더가 탐색과 콘텐츠 위에 있어요.',
        '64rem breakpoint예요',
      ],
      [
        '밀도 높은 운영 도구예요',
        '작은 화면에서도 주요 목적지를 간결한 rail로 유지해요.',
        '모바일 rail을 유지해요',
      ],
    ],
    ja: [
      [
        'ワークスペースナビゲーション',
        '48rem からナビゲーションを展開し、それ未満では内包された drawer を使います。',
        '48rem breakpoint',
      ],
      [
        'ヘッダー優先のプロダクト',
        '64rem から全幅ヘッダーをナビゲーションとコンテンツの上に配置します。',
        '64rem breakpoint',
      ],
      [
        '高密度な運用ツール',
        '小さい画面でも主要な移動先をコンパクトな rail として表示します。',
        '常時表示の mobile rail',
      ],
    ],
  }[locale];
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
  const localizedPatterns = patterns.map((pattern, index) => ({
    ...pattern,
    title: localized[index]?.[0] ?? pattern.title,
    description: localized[index]?.[1] ?? pattern.description,
    label: localized[index]?.[2] ?? pattern.label,
  }));

  return (
    <div className="grid min-w-0 gap-6" data-docs-example-item-count="3">
      {localizedPatterns.map((pattern) => (
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

export function AppShellControlAppearances() {
  return (
    <div className="grid min-w-0 gap-6" data-docs-example-item-count="3">
      {(['solid', 'outline', 'ghost'] as const).map((controlAppearance) => (
        <AppShellPreview
          breakpoint="lg"
          contained
          controlAppearance={controlAppearance}
          key={controlAppearance}
          layout="header-first"
        />
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
