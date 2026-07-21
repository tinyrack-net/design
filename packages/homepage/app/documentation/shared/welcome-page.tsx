import { TRAppShell } from '@tinyrack/ui/components/app-shell';
import { TRBadge } from '@tinyrack/ui/components/badge';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRCard } from '@tinyrack/ui/components/card';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRProgress } from '@tinyrack/ui/components/progress';
import {
  Activity,
  Bell,
  CircleCheck,
  CloudCog,
  Database,
  Gauge,
  Layers3,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users,
} from 'lucide-react';
import { createElement, type ReactNode } from 'react';
import { componentDocsManifest } from './component-docs-manifest.js';
import { ComponentInstall } from './component-install.js';

type WelcomeLocale = 'en' | 'ja' | 'ko';

type ProductCopy = {
  activityDescription: string;
  activityTitle: string;
  activityRows: readonly { label: string; meta: string; time: string }[];
  breadcrumb: string;
  consoleTitle: string;
  environment: string;
  footer: readonly string[];
  live: string;
  metrics: readonly { label: string; meta: string; value: string }[];
  navigation: readonly string[];
  production: string;
  regionDescription: string;
  regionRows: readonly { detail: string; label: string; value: number }[];
  regionTitle: string;
  search: string;
  serviceDescription: string;
  serviceRows: readonly { detail: string; label: string }[];
  serviceTitle: string;
  status: string;
  throughputDescription: string;
  throughputStats: readonly { label: string; value: string }[];
  throughputTitle: string;
  title: string;
};

type WelcomeCopy = {
  appShell: string;
  build: string;
  explore: string;
  foundations: string;
  installNote: string;
  quickStartDescription: string;
  quickStartTitle: string;
  product: ProductCopy;
};

const copy: Record<WelcomeLocale, WelcomeCopy> = {
  en: {
    appShell: 'Explore the app shell',
    build: 'Start building',
    explore: 'Explore foundations',
    foundations: 'Foundations',
    installNote:
      'Import the foundation once, then add only the component CSS your interface uses.',
    product: {
      activityDescription: 'Latest production events',
      activityTitle: 'Activity',
      activityRows: [
        { label: 'Deployment completed', meta: 'api-gateway · v2.8.4', time: 'Now' },
        { label: 'Backup verified', meta: 'database-primary', time: '8m' },
        { label: 'Worker scaled', meta: 'compute-pool · 6 → 8', time: '21m' },
      ],
      breadcrumb: 'Operations / Overview',
      consoleTitle: 'Operations console',
      environment: 'Seoul · KOR',
      footer: ['Security', 'Team members'],
      live: 'Live',
      metrics: [
        { label: 'Active nodes', meta: 'Across 3 regions', value: '12 / 12' },
        { label: 'Average load', meta: '-4.2% this hour', value: '41%' },
        { label: 'Deployments', meta: 'Last 24 hours', value: '28' },
        { label: 'Open incidents', meta: 'No action needed', value: '0' },
      ],
      navigation: ['Overview', 'Deployments', 'Infrastructure', 'Data services'],
      production: 'Production',
      regionDescription: 'Available compute by location',
      regionRows: [
        { detail: 'Primary', label: 'Seoul', value: 86 },
        { detail: 'Edge', label: 'Tokyo', value: 72 },
        { detail: 'Standby', label: 'Singapore', value: 64 },
      ],
      regionTitle: 'Regional capacity',
      search: 'Search infrastructure',
      serviceDescription: 'Live resource utilization',
      serviceRows: [
        { detail: '12 instances', label: 'Edge gateway' },
        { detail: '8 active workers', label: 'Compute pool' },
        { detail: '3 regions', label: 'Primary database' },
      ],
      serviceTitle: 'Service health',
      status: 'All systems operational',
      throughputDescription: 'Successful releases over the last 12 hours',
      throughputStats: [
        { label: 'Successful', value: '28' },
        { label: 'Median duration', value: '4m 18s' },
        { label: 'Success rate', value: '99.8%' },
      ],
      throughputTitle: 'Deployment throughput',
      title: 'Production overview',
    },
    quickStartDescription:
      'Install the React package and compose your first production-ready control.',
    quickStartTitle: 'Start with the essentials.',
  },
  ko: {
    appShell: '앱 셸 살펴보기',
    build: '빌드 시작',
    explore: '기초 살펴보기',
    foundations: '기초',
    installNote:
      '기초 CSS는 한 번만 불러오고, 인터페이스에서 사용하는 컴포넌트 CSS만 추가하세요.',
    product: {
      activityDescription: '최근 프로덕션 이벤트',
      activityTitle: '활동',
      activityRows: [
        { label: '배포 완료', meta: 'api-gateway · v2.8.4', time: '지금' },
        { label: '백업 검증 완료', meta: 'database-primary', time: '8분' },
        { label: '워커 확장', meta: 'compute-pool · 6 → 8', time: '21분' },
      ],
      breadcrumb: '운영 / 개요',
      consoleTitle: '운영 콘솔',
      environment: '서울 · KOR',
      footer: ['보안', '팀 구성원'],
      live: '실시간',
      metrics: [
        { label: '활성 노드', meta: '3개 리전', value: '12 / 12' },
        { label: '평균 부하', meta: '지난 1시간 -4.2%', value: '41%' },
        { label: '배포', meta: '최근 24시간', value: '28' },
        { label: '열린 인시던트', meta: '조치 불필요', value: '0' },
      ],
      navigation: ['개요', '배포', '인프라', '데이터 서비스'],
      production: '프로덕션',
      regionDescription: '위치별 사용 가능한 컴퓨팅 용량',
      regionRows: [
        { detail: '기본', label: '서울', value: 86 },
        { detail: '엣지', label: '도쿄', value: 72 },
        { detail: '대기', label: '싱가포르', value: 64 },
      ],
      regionTitle: '리전 용량',
      search: '인프라 검색',
      serviceDescription: '실시간 리소스 사용량',
      serviceRows: [
        { detail: '인스턴스 12개', label: '엣지 게이트웨이' },
        { detail: '활성 워커 8개', label: '컴퓨트 풀' },
        { detail: '3개 리전', label: '기본 데이터베이스' },
      ],
      serviceTitle: '서비스 상태',
      status: '모든 시스템 정상',
      throughputDescription: '최근 12시간 동안 성공한 릴리스',
      throughputStats: [
        { label: '성공', value: '28' },
        { label: '중앙 배포 시간', value: '4분 18초' },
        { label: '성공률', value: '99.8%' },
      ],
      throughputTitle: '배포 처리량',
      title: '프로덕션 개요',
    },
    quickStartDescription:
      'React 패키지를 설치하고 첫 번째 프로덕션 수준 컨트롤을 조합하세요.',
    quickStartTitle: '핵심부터 시작하세요.',
  },
  ja: {
    appShell: 'App shell を見る',
    build: '構築を始める',
    explore: '基礎を見る',
    foundations: '基礎',
    installNote:
      '基礎 CSS を一度読み込み、インターフェースで使うコンポーネント CSS だけを追加します。',
    product: {
      activityDescription: '最新の本番イベント',
      activityTitle: 'アクティビティ',
      activityRows: [
        { label: 'デプロイ完了', meta: 'api-gateway · v2.8.4', time: '現在' },
        { label: 'バックアップ検証済み', meta: 'database-primary', time: '8分' },
        { label: 'ワーカー拡張', meta: 'compute-pool · 6 → 8', time: '21分' },
      ],
      breadcrumb: '運用 / 概要',
      consoleTitle: '運用コンソール',
      environment: 'ソウル · KOR',
      footer: ['セキュリティ', 'チームメンバー'],
      live: 'ライブ',
      metrics: [
        { label: '稼働ノード', meta: '3 リージョン', value: '12 / 12' },
        { label: '平均負荷', meta: '過去1時間 -4.2%', value: '41%' },
        { label: 'デプロイ', meta: '過去24時間', value: '28' },
        { label: '未解決インシデント', meta: '対応不要', value: '0' },
      ],
      navigation: ['概要', 'デプロイ', 'インフラ', 'データサービス'],
      production: '本番',
      regionDescription: 'ロケーション別の利用可能なコンピュート容量',
      regionRows: [
        { detail: 'プライマリ', label: 'ソウル', value: 86 },
        { detail: 'エッジ', label: '東京', value: 72 },
        { detail: 'スタンバイ', label: 'シンガポール', value: 64 },
      ],
      regionTitle: 'リージョン容量',
      search: 'インフラを検索',
      serviceDescription: 'リアルタイムのリソース使用率',
      serviceRows: [
        { detail: '12 インスタンス', label: 'エッジゲートウェイ' },
        { detail: '8 ワーカー稼働中', label: 'コンピュートプール' },
        { detail: '3 リージョン', label: 'プライマリDB' },
      ],
      serviceTitle: 'サービス状態',
      status: 'すべて正常',
      throughputDescription: '過去12時間に成功したリリース',
      throughputStats: [
        { label: '成功', value: '28' },
        { label: '中央値', value: '4分18秒' },
        { label: '成功率', value: '99.8%' },
      ],
      throughputTitle: 'デプロイ処理量',
      title: '本番環境の概要',
    },
    quickStartDescription:
      'React パッケージをインストールし、最初の実用的なコントロールを構成します。',
    quickStartTitle: '必要なものから始める。',
  },
};

const workspaceNavigation = [
  { icon: Gauge, selected: true },
  { icon: Layers3, selected: false },
  { icon: Server, selected: false },
  { icon: Database, selected: false },
] as const;

const serviceRows = [
  { value: 92, variant: 'success' },
  { value: 68, variant: 'info' },
  { value: 84, variant: 'success' },
] as const;

const metricIcons = [Server, Activity, CloudCog, TerminalSquare] as const;

const throughput = [38, 52, 44, 68, 61, 78, 70, 88, 76, 92, 84, 96] as const;
const throughputTimes = ['12h', '9h', '6h', '3h', 'Now'] as const;

function ProductWindow({ content }: { content: ProductCopy }) {
  return (
    <div
      aria-hidden="true"
      className="absolute start-1/2 top-tinyrack-measure-xs z-0 min-h-[63rem] w-[min(calc(100%_-_6rem),86rem)] -translate-x-1/2 overflow-hidden rounded-tinyrack-xl border-tinyrack-default border-tinyrack-border-strong bg-tinyrack-surface shadow-tinyrack-overlay motion-safe:animate-welcome-enter motion-reduce:animate-none max-lg:w-[calc(100%_-_2rem)] max-md:top-tinyrack-2xl max-md:min-h-[54rem]"
      data-welcome-app=""
    >
      <TRAppShell.Root
        className="min-h-[59.5rem] bg-tinyrack-surface [--tr-app-shell-sidebar-rail-width:calc(var(--tinyrack-space-2xl)*2)] [--tr-app-shell-sidebar-width:13rem]"
        breakpoint="lg"
        mobileSidebar="rail"
      >
        <TRAppShell.Header className="flex h-14 items-center justify-between border-b-tinyrack-default border-tinyrack-border bg-tinyrack-surface-muted px-tinyrack-lg max-md:px-tinyrack-md">
          <div
            className="flex items-center gap-tinyrack-sm [&>strong]:text-tinyrack-sm"
            data-welcome-brand=""
          >
            <span
              className="grid min-h-tinyrack-control-height-sm min-w-tinyrack-control-height-sm flex-none place-items-center rounded-tinyrack-md border-tinyrack-default border-tinyrack-border bg-tinyrack-surface-selected leading-none text-tinyrack-text [&>svg]:size-tinyrack-lg"
              data-welcome-brand-icon=""
            >
              <CloudCog />
            </span>
            <strong>{content.consoleTitle}</strong>
            <span className="ms-tinyrack-xs border-s-tinyrack-default border-tinyrack-border ps-tinyrack-md text-tinyrack-xs text-tinyrack-text-muted max-md:hidden">
              {content.production}
            </span>
          </div>
          <div className="flex items-center gap-tinyrack-lg text-tinyrack-text-muted [&>svg]:size-tinyrack-lg max-md:[&>svg]:hidden">
            <span className="flex w-[15rem] items-center gap-tinyrack-sm rounded-tinyrack-md border-tinyrack-default border-tinyrack-border bg-tinyrack-surface-muted px-tinyrack-md py-tinyrack-sm text-tinyrack-xs max-md:hidden [&>svg]:size-tinyrack-md">
              <Search /> {content.search}
            </span>
            <Bell />
            <span className="grid min-h-tinyrack-control-height-sm w-tinyrack-control-height-sm place-items-center rounded-tinyrack-full bg-tinyrack-primary text-tinyrack-2xs font-tinyrack-bold text-tinyrack-on-primary">
              WT
            </span>
          </div>
        </TRAppShell.Header>
        <TRAppShell.Sidebar
          aria-label={content.consoleTitle}
          className="border-e-tinyrack-border bg-tinyrack-surface-muted [&_.tr-scroll-area-content]:flex [&_.tr-scroll-area-content]:min-w-full [&_.tr-scroll-area-content]:flex-col [&_.tr-scroll-area-content]:p-tinyrack-lg max-lg:[&_.tr-scroll-area-content]:px-tinyrack-sm [&_svg]:size-tinyrack-lg"
          data-welcome-sidebar=""
        >
          <div
            className="mb-tinyrack-xl flex items-center gap-tinyrack-sm max-lg:justify-center max-lg:px-tinyrack-sm"
            data-welcome-environment=""
          >
            <span className="size-tinyrack-sm flex-none rounded-tinyrack-full bg-tinyrack-success shadow-[0_0_0_var(--tinyrack-space-xs)_color-mix(in_srgb,var(--tinyrack-success)_18%,transparent)] motion-safe:animate-welcome-pulse motion-reduce:animate-none" />
            <TRAppShell.SidebarLabel className="flex gap-tinyrack-xs whitespace-nowrap text-tinyrack-2xs leading-tinyrack-sm text-tinyrack-text-muted [&>strong]:flex-none [&>strong]:text-tinyrack-xs [&>strong]:text-tinyrack-text">
              <strong>Rack&nbsp;A</strong> {content.environment}
            </TRAppShell.SidebarLabel>
          </div>
          <nav className="grid gap-tinyrack-xs [&>span]:flex [&>span]:items-center [&>span]:justify-start max-lg:[&>span]:justify-center [&>span]:gap-tinyrack-sm [&>span]:rounded-tinyrack-sm [&>span]:px-tinyrack-md [&>span]:py-tinyrack-sm [&>span]:text-tinyrack-xs max-lg:[&>span]:px-tinyrack-sm max-lg:[&>span]:text-[0]">
            {workspaceNavigation.map(({ icon: Icon, selected }, index) => (
              <span
                className={
                  selected
                    ? 'bg-tinyrack-surface-selected font-tinyrack-semibold text-tinyrack-text'
                    : 'text-tinyrack-text-muted'
                }
                key={content.navigation[index]}
              >
                <Icon />
                <TRAppShell.SidebarLabel>
                  {content.navigation[index]}
                </TRAppShell.SidebarLabel>
              </span>
            ))}
          </nav>
          <div className="mt-auto grid gap-tinyrack-xs border-t-tinyrack-default border-tinyrack-border pt-tinyrack-md max-lg:hidden [&>span]:flex [&>span]:items-center [&>span]:gap-tinyrack-sm [&>span]:rounded-tinyrack-sm [&>span]:px-tinyrack-md [&>span]:py-tinyrack-sm [&>span]:text-tinyrack-xs [&>span]:text-tinyrack-text-muted">
            <span>
              <ShieldCheck />
              <TRAppShell.SidebarLabel>{content.footer[0]}</TRAppShell.SidebarLabel>
            </span>
            <span>
              <Users />
              <TRAppShell.SidebarLabel>{content.footer[1]}</TRAppShell.SidebarLabel>
            </span>
          </div>
        </TRAppShell.Sidebar>
        <TRAppShell.Main
          className="min-w-0 p-tinyrack-xl max-md:p-tinyrack-lg"
          render={<div />}
        >
          <header className="mb-tinyrack-xl flex items-end justify-between max-md:items-start max-md:gap-tinyrack-md [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-xs [&_span]:text-tinyrack-text-muted [&_h2]:m-0 [&_h2]:text-tinyrack-2xl [&_h2]:leading-tinyrack-sm max-md:[&_h2]:text-tinyrack-xl [&_.tr-badge_svg]:size-tinyrack-md max-md:[&_.tr-badge]:hidden">
            <div>
              <span>{content.breadcrumb}</span>
              <h2>{content.title}</h2>
            </div>
            <TRBadge variant="success">
              <CircleCheck /> {content.status}
            </TRBadge>
          </header>
          <div className="mb-tinyrack-md grid grid-cols-4 gap-tinyrack-md max-md:grid-cols-2">
            {content.metrics.map((metric, index) => {
              const Icon = metricIcons[index];
              if (!Icon) return null;
              return <Metric icon={<Icon />} key={metric.label} {...metric} />;
            })}
          </div>
          <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.8fr)] gap-tinyrack-md max-lg:grid-cols-[minmax(0,1fr)]">
            <TRCard.Root className="min-w-0" padding="none" variant="outlined">
              <header className="flex items-center justify-between border-b-tinyrack-default border-tinyrack-border p-tinyrack-lg [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-xs [&_span]:text-tinyrack-text-muted">
                <div>
                  <strong>{content.serviceTitle}</strong>
                  <span>{content.serviceDescription}</span>
                </div>
                <TRBadge>{content.live}</TRBadge>
              </header>
              <div className="px-tinyrack-lg">
                {serviceRows.map((service, index) => {
                  const localizedService = content.serviceRows[index];
                  if (!localizedService) return null;
                  return (
                    <div
                      className="flex min-h-16 items-center gap-tinyrack-lg border-b-tinyrack-default border-tinyrack-border last:border-b-0 [&>.tr-progress-root]:flex-1 [&>span]:text-tinyrack-2xs [&>span]:text-tinyrack-text-muted"
                      key={localizedService.label}
                    >
                      <div className="grid w-[9rem] gap-tinyrack-xs max-md:w-[7rem] [&>strong]:text-tinyrack-xs [&>span]:text-tinyrack-2xs [&>span]:text-tinyrack-text-muted">
                        <strong>{localizedService.label}</strong>
                        <span>{localizedService.detail}</span>
                      </div>
                      <TRProgress.Root value={service.value} variant={service.variant}>
                        <TRProgress.Track>
                          <TRProgress.Indicator />
                        </TRProgress.Track>
                      </TRProgress.Root>
                      <span>{service.value}%</span>
                    </div>
                  );
                })}
              </div>
            </TRCard.Root>
            <TRCard.Root
              className="min-w-0 max-lg:hidden"
              padding="none"
              variant="outlined"
            >
              <header className="flex items-center justify-between border-b-tinyrack-default border-tinyrack-border p-tinyrack-lg [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-xs [&_span]:text-tinyrack-text-muted">
                <div>
                  <strong>{content.activityTitle}</strong>
                  <span>{content.activityDescription}</span>
                </div>
                <Activity className="size-tinyrack-lg text-tinyrack-text-muted" />
              </header>
              <ol className="m-0 list-none px-tinyrack-lg">
                {content.activityRows.map((row) => (
                  <ActivityRow key={row.label} {...row} />
                ))}
              </ol>
            </TRCard.Root>
          </div>
          <div className="mt-tinyrack-md grid grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.8fr)] gap-tinyrack-md max-lg:grid-cols-[minmax(0,1fr)]">
            <TRCard.Root
              className="min-w-0"
              data-welcome-throughput=""
              padding="none"
              variant="outlined"
            >
              <header className="flex items-center justify-between border-b-tinyrack-default border-tinyrack-border p-tinyrack-lg [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-xs [&_span]:text-tinyrack-text-muted">
                <div>
                  <strong>{content.throughputTitle}</strong>
                  <span>{content.throughputDescription}</span>
                </div>
                <TRBadge variant="success">+18.4%</TRBadge>
              </header>
              <dl className="m-0 grid grid-cols-3 border-b-tinyrack-default border-tinyrack-border px-tinyrack-lg py-tinyrack-md [&>div]:grid [&>div]:gap-tinyrack-xs [&>div+div]:border-s-tinyrack-default [&>div+div]:border-tinyrack-border [&>div+div]:ps-tinyrack-lg [&_dd]:m-0 [&_dd]:text-tinyrack-lg [&_dd]:font-tinyrack-semibold [&_dt]:text-tinyrack-2xs [&_dt]:text-tinyrack-text-muted">
                {content.throughputStats.map((stat) => (
                  <div data-welcome-throughput-stat="" key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="px-tinyrack-lg pt-tinyrack-lg pb-tinyrack-md">
                <div className="relative h-36 border-b-tinyrack-default border-tinyrack-border">
                  <div className="pointer-events-none absolute inset-0 grid grid-rows-4 opacity-50 [&>span]:border-t-tinyrack-default [&>span]:border-tinyrack-border">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="absolute inset-0 grid grid-cols-12 items-end gap-tinyrack-sm max-md:gap-tinyrack-xs">
                    {throughput.map((value) => (
                      <span
                        className="min-h-tinyrack-space-xs rounded-t-tinyrack-xs bg-tinyrack-primary-subtle"
                        data-welcome-throughput-bar=""
                        key={value}
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-tinyrack-sm flex justify-between text-tinyrack-2xs text-tinyrack-text-muted">
                  {throughputTimes.map((time) => (
                    <span key={time}>{time}</span>
                  ))}
                </div>
              </div>
            </TRCard.Root>
            <TRCard.Root
              className="min-w-0 max-lg:hidden"
              data-welcome-regions=""
              padding="none"
              variant="outlined"
            >
              <header className="border-b-tinyrack-default border-tinyrack-border p-tinyrack-lg [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-xs [&_span]:text-tinyrack-text-muted">
                <div>
                  <strong>{content.regionTitle}</strong>
                  <span>{content.regionDescription}</span>
                </div>
              </header>
              <div className="grid gap-tinyrack-lg p-tinyrack-lg">
                {content.regionRows.map((region) => (
                  <div className="grid gap-tinyrack-sm" key={region.label}>
                    <div className="flex items-center justify-between text-tinyrack-xs">
                      <span className="flex items-center gap-tinyrack-sm">
                        <span className="size-tinyrack-sm rounded-tinyrack-full bg-tinyrack-success" />
                        <strong>{region.label}</strong>
                        <small className="text-tinyrack-text-muted">
                          {region.detail}
                        </small>
                      </span>
                      <span>{region.value}%</span>
                    </div>
                    <TRProgress.Root value={region.value} variant="success">
                      <TRProgress.Track>
                        <TRProgress.Indicator />
                      </TRProgress.Track>
                    </TRProgress.Root>
                  </div>
                ))}
              </div>
            </TRCard.Root>
          </div>
        </TRAppShell.Main>
      </TRAppShell.Root>
    </div>
  );
}

function Metric({
  icon,
  label,
  meta,
  value,
}: {
  icon: ReactNode;
  label: string;
  meta: string;
  value: string;
}) {
  return (
    <div className="grid gap-tinyrack-sm border-t-tinyrack-default border-tinyrack-border py-tinyrack-lg max-md:nth-[n+3]:hidden [&>div]:flex [&>div]:items-center [&>div]:gap-tinyrack-sm [&>div]:text-tinyrack-xs [&>div]:text-tinyrack-text-muted [&_svg]:size-tinyrack-lg [&>b]:text-tinyrack-2xl [&>b]:leading-tinyrack-sm [&>small]:text-tinyrack-2xs [&>small]:text-tinyrack-text-muted">
      <div>
        <span>{icon}</span>
        <strong>{label}</strong>
      </div>
      <b>{value}</b>
      <small>{meta}</small>
    </div>
  );
}

function ActivityRow({
  label,
  meta,
  time,
}: {
  label: string;
  meta: string;
  time: string;
}) {
  return (
    <li className="flex min-h-16 items-center gap-tinyrack-md border-b-tinyrack-default border-tinyrack-border last:border-b-0 [&_small]:text-tinyrack-2xs [&_small]:text-tinyrack-text-muted [&_time]:text-tinyrack-2xs [&_time]:text-tinyrack-text-muted">
      <span className="grid min-h-tinyrack-control-height-sm min-w-tinyrack-control-height-sm place-items-center rounded-tinyrack-full bg-tinyrack-surface-muted [&>svg]:size-tinyrack-md">
        <Sparkles />
      </span>
      <div className="grid flex-1 gap-tinyrack-xs [&>strong]:text-tinyrack-xs">
        <strong>{label}</strong>
        <small>{meta}</small>
      </div>
      <time>{time}</time>
    </li>
  );
}

export function WelcomePage({ locale }: { locale: WelcomeLocale }) {
  const content = copy[locale];
  const localeRoot = `/${locale}`;

  return (
    <div
      className="w-full overflow-clip bg-tinyrack-surface text-tinyrack-text"
      data-welcome-page=""
    >
      <section
        aria-label="Tinyrack Design System introduction"
        className="relative h-[max(42rem,calc(100dvh-var(--tinyrack-control-height-lg)))] min-h-[42rem] overflow-hidden bg-tinyrack-canvas max-md:h-[max(40rem,calc(100dvh-var(--tinyrack-control-height-lg)))] max-md:min-h-[40rem]"
        data-welcome-hero=""
      >
        <ProductWindow content={content.product} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[calc(var(--tinyrack-measure-xs)+3.5rem)] bottom-0 z-[1] [background:linear-gradient(to_bottom,transparent_0%,color-mix(in_srgb,var(--tinyrack-canvas)_6%,transparent)_15%,color-mix(in_srgb,var(--tinyrack-canvas)_28%,transparent)_30%,color-mix(in_srgb,var(--tinyrack-canvas)_80%,transparent)_45%,color-mix(in_srgb,var(--tinyrack-canvas)_96%,transparent)_55%,var(--tinyrack-canvas)_65%)] max-md:top-[calc(var(--tinyrack-space-2xl)+3.5rem)]"
          data-welcome-gradient=""
        />
        <div
          className="absolute start-1/2 bottom-[clamp(2rem,5vh,4.5rem)] z-[2] w-[min(calc(100%_-_4rem),76rem)] -translate-x-1/2 max-md:bottom-tinyrack-2xl max-md:w-[calc(100%_-_2rem)]"
          data-welcome-hero-content=""
        >
          <div className="grid">
            <p className="m-0 mb-tinyrack-lg flex items-center gap-0 text-tinyrack-xs font-tinyrack-semibold tracking-tinyrack-lg text-tinyrack-text-muted uppercase max-md:flex-wrap max-md:text-tinyrack-2xs [&>span+span]:before:px-tinyrack-md [&>span+span]:before:text-tinyrack-border-strong [&>span+span]:before:content-['/']">
              <span>React 19</span>
              <span>Base UI</span>
              <span>{componentDocsManifest.length} components</span>
            </p>
            <h1 className="m-0 max-w-none text-[clamp(calc(var(--tinyrack-text-5xl)*1.35),9vw,calc(var(--tinyrack-text-5xl)*3.15))] leading-[0.98] font-tinyrack-bold tracking-[-0.065em] text-balance max-md:text-[clamp(calc(var(--tinyrack-text-5xl)*1.15),15vw,calc(var(--tinyrack-text-5xl)*1.7))] max-md:tracking-[-0.055em] [&>span]:block">
              <span>TINYRACK</span>
              <span>DESIGN SYSTEM</span>
            </h1>
            <div className="mt-tinyrack-2xl flex max-md:mt-tinyrack-xl">
              <div className="flex flex-none gap-tinyrack-sm max-md:w-full">
                <TRButton
                  className="min-h-tinyrack-control-height-lg px-tinyrack-xl max-md:flex-1"
                  nativeButton={false}
                  render={createElement('a', { href: '#quick-start' })}
                  variant="primary"
                >
                  {content.build}
                </TRButton>
                <TRButton
                  appearance="outline"
                  className="min-h-tinyrack-control-height-lg px-tinyrack-xl max-md:flex-1"
                  nativeButton={false}
                  render={createElement('a', {
                    href: `${localeRoot}/components/app-shell/`,
                  })}
                >
                  {content.appShell}
                </TRButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="mx-auto w-[min(calc(100%_-_3rem),76rem)] max-md:w-[calc(100%_-_2rem)]"
        data-welcome-content=""
      >
        <section
          aria-labelledby="quick-start"
          className="grid grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)] gap-[clamp(3rem,8vw,8rem)] border-b-0 border-tinyrack-border py-[clamp(4rem,8vw,8rem)] max-md:grid-cols-[minmax(0,1fr)] max-md:gap-tinyrack-2xl max-md:py-16"
          id="quick-start"
        >
          <div className="grid content-start gap-tinyrack-lg">
            <span className="text-tinyrack-xs font-tinyrack-semibold tracking-tinyrack-lg text-tinyrack-text-muted uppercase">
              01 / Quick start
            </span>
            <h2 className="m-0 max-w-[48rem] text-[clamp(var(--tinyrack-text-3xl),5vw,calc(var(--tinyrack-text-5xl)*1.45))] leading-tinyrack-sm tracking-[-0.04em]">
              {content.quickStartTitle}
            </h2>
            <p className="m-0 max-w-[42rem] text-tinyrack-lg leading-tinyrack-md text-tinyrack-text-muted max-md:text-tinyrack-md">
              {content.quickStartDescription}
            </p>
            <div className="mt-tinyrack-lg flex flex-wrap gap-tinyrack-lg">
              <TRLink href={`${localeRoot}/foundations/`}>{content.explore}</TRLink>
              <TRLink href={`${localeRoot}/components/app-shell/`}>
                {content.appShell}
              </TRLink>
            </div>
          </div>
          <div className="min-w-0">
            <ComponentInstall
              surfaces={[
                {
                  label: 'React',
                  install: 'pnpm add @tinyrack/ui tailwindcss react react-dom',
                  imports: [
                    "import '@tinyrack/ui/core.css';",
                    "import '@tinyrack/ui/components/button.css';",
                    "import { TRButton } from '@tinyrack/ui/components/button';",
                  ],
                  note: content.installNote,
                },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
