import { TRAlert } from '@tinyrack/ui/components/alert';
import { TRAppShell } from '@tinyrack/ui/components/app-shell';
import { TRBadge, type TRBadgeVariant } from '@tinyrack/ui/components/badge';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRCard } from '@tinyrack/ui/components/card';
import { TRInput } from '@tinyrack/ui/components/input';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRProgress } from '@tinyrack/ui/components/progress';
import { TRSwitch } from '@tinyrack/ui/components/switch';
import { TRTabs } from '@tinyrack/ui/components/tabs';
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
import {
  type CSSProperties,
  createElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { componentDocsManifest } from './component-docs-manifest.js';
import { GettingStartedCode } from './getting-started-contract.js';
import { type WelcomeCopy, type WelcomeLocale, welcomeCopy } from './welcome-copy.js';
import {
  sampleWelcomeMotion,
  WELCOME_MOTION_CYCLE_MS,
  WELCOME_MOTION_SAMPLE_MS,
  WELCOME_REDUCED_MOTION_FRAME,
} from './welcome-motion.js';

const simulationPhases = [
  'monitoring',
  'deploying',
  'scaling',
  'verifying',
  'complete',
] as const;

type SimulationPhase = (typeof simulationPhases)[number];

type SimulationStepCopy = {
  activity: { label: string; meta: string; time: string };
  compactLabel: string;
  label: string;
  status: string;
};

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
  rackLabel: string;
  regionDescription: string;
  regionRows: readonly { detail: string; label: string; value: number }[];
  regionTitle: string;
  search: string;
  serviceDescription: string;
  serviceRows: readonly { detail: string; label: string }[];
  serviceTitle: string;
  simulation: Record<SimulationPhase, SimulationStepCopy>;
  throughputDescription: string;
  throughputStats: readonly { label: string; value: string }[];
  throughputTimes: readonly string[];
  throughputTitle: string;
  title: string;
};

const productCopy: Record<WelcomeLocale, ProductCopy> = {
  en: {
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
    rackLabel: 'Rack A',
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
    simulation: {
      monitoring: {
        activity: {
          label: 'Deployment completed',
          meta: 'api-gateway · v2.8.4',
          time: 'Now',
        },
        compactLabel: 'Live',
        label: 'Monitoring',
        status: 'All systems operational',
      },
      deploying: {
        activity: {
          label: 'Deployment started',
          meta: 'api-gateway · v2.8.5',
          time: 'Now',
        },
        compactLabel: 'Deploy',
        label: 'Deploying',
        status: 'Deploying v2.8.5',
      },
      scaling: {
        activity: {
          label: 'Workers scaling',
          meta: 'compute-pool · 8 → 10',
          time: 'Now',
        },
        compactLabel: 'Scale',
        label: 'Auto scaling',
        status: 'Scaling compute',
      },
      verifying: {
        activity: {
          label: 'Health checks running',
          meta: 'api-gateway · 12 / 12 passing',
          time: 'Now',
        },
        compactLabel: 'Verify',
        label: 'Verifying',
        status: 'Verifying rollout',
      },
      complete: {
        activity: {
          label: 'Deployment completed',
          meta: 'api-gateway · v2.8.5',
          time: 'Now',
        },
        compactLabel: 'Done',
        label: 'Complete',
        status: 'Deployment completed',
      },
    },
    throughputDescription: 'Successful releases over the last 12 hours',
    throughputStats: [
      { label: 'Successful', value: '28' },
      { label: 'Median duration', value: '4m 18s' },
      { label: 'Success rate', value: '99.8%' },
    ],
    throughputTimes: ['12h', '9h', '6h', '3h', 'Now'],
    throughputTitle: 'Deployment throughput',
    title: 'Production overview',
  },
  ko: {
    activityDescription: '최근 프로덕션 이벤트',
    activityTitle: '활동',
    activityRows: [
      { label: '배포 완료', meta: 'api-gateway · v2.8.4', time: '지금' },
      { label: '백업 검증 완료', meta: 'database-primary', time: '8분 전' },
      { label: '워커 확장', meta: 'compute-pool · 6 → 8', time: '21분 전' },
    ],
    breadcrumb: '운영 / 개요',
    consoleTitle: '운영 콘솔',
    environment: '서울 · KOR',
    footer: ['보안', '팀 구성원'],
    live: '실시간',
    metrics: [
      { label: '활성 노드', meta: '3개 리전', value: '12 / 12' },
      { label: '평균 부하', meta: '지난 1시간 대비 -4.2%', value: '41%' },
      { label: '배포', meta: '최근 24시간', value: '28' },
      { label: '열린 인시던트', meta: '조치 불필요', value: '0' },
    ],
    navigation: ['개요', '배포', '인프라', '데이터 서비스'],
    production: '프로덕션',
    rackLabel: '랙 A',
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
    simulation: {
      monitoring: {
        activity: {
          label: '배포 완료',
          meta: 'api-gateway · v2.8.4',
          time: '지금',
        },
        compactLabel: '정상',
        label: '모니터링',
        status: '모든 시스템 정상',
      },
      deploying: {
        activity: {
          label: '배포 시작',
          meta: 'api-gateway · v2.8.5',
          time: '지금',
        },
        compactLabel: '배포',
        label: '배포 중',
        status: 'v2.8.5 배포 중',
      },
      scaling: {
        activity: {
          label: '워커 자동 확장',
          meta: 'compute-pool · 8 → 10',
          time: '지금',
        },
        compactLabel: '확장',
        label: '자동 확장',
        status: '컴퓨트 확장 중',
      },
      verifying: {
        activity: {
          label: '상태 검사 실행',
          meta: 'api-gateway · 12 / 12 통과',
          time: '지금',
        },
        compactLabel: '검증',
        label: '검증 중',
        status: '롤아웃 검증 중',
      },
      complete: {
        activity: {
          label: '배포 완료',
          meta: 'api-gateway · v2.8.5',
          time: '지금',
        },
        compactLabel: '완료',
        label: '완료',
        status: '배포 완료',
      },
    },
    throughputDescription: '최근 12시간 동안 성공한 릴리스',
    throughputStats: [
      { label: '성공', value: '28' },
      { label: '배포 시간 중앙값', value: '4분 18초' },
      { label: '성공률', value: '99.8%' },
    ],
    throughputTimes: ['12시간 전', '9시간 전', '6시간 전', '3시간 전', '현재'],
    throughputTitle: '배포 처리량',
    title: '프로덕션 개요',
  },
  ja: {
    activityDescription: '最新の本番イベント',
    activityTitle: 'アクティビティ',
    activityRows: [
      { label: 'デプロイ完了', meta: 'api-gateway · v2.8.4', time: 'たった今' },
      { label: 'バックアップ検証済み', meta: 'database-primary', time: '8 分' },
      { label: 'ワーカー拡張', meta: 'compute-pool · 6 → 8', time: '21 分' },
    ],
    breadcrumb: '運用 / 概要',
    consoleTitle: '運用コンソール',
    environment: 'ソウル · KOR',
    footer: ['セキュリティ', 'チームメンバー'],
    live: 'ライブ',
    metrics: [
      { label: '稼働ノード', meta: '3 リージョン', value: '12 / 12' },
      { label: '平均負荷', meta: '過去 1 時間で -4.2%', value: '41%' },
      { label: 'デプロイ', meta: '過去 24 時間', value: '28' },
      { label: '未解決インシデント', meta: '対応不要', value: '0' },
    ],
    navigation: ['概要', 'デプロイ', 'インフラ', 'データサービス'],
    production: '本番',
    rackLabel: 'ラック A',
    regionDescription: 'リージョン別の空きコンピューティング容量',
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
      { detail: '3 リージョンで稼働', label: 'プライマリデータベース' },
    ],
    serviceTitle: 'サービス状態',
    simulation: {
      monitoring: {
        activity: {
          label: 'デプロイ完了',
          meta: 'api-gateway · v2.8.4',
          time: '現在',
        },
        compactLabel: '正常',
        label: 'モニタリング',
        status: 'すべて正常',
      },
      deploying: {
        activity: {
          label: 'デプロイ開始',
          meta: 'api-gateway · v2.8.5',
          time: '現在',
        },
        compactLabel: 'デプロイ',
        label: 'デプロイ中',
        status: 'v2.8.5 をデプロイ中',
      },
      scaling: {
        activity: {
          label: 'ワーカーを自動スケール',
          meta: 'compute-pool · 8 → 10',
          time: '現在',
        },
        compactLabel: '拡張',
        label: '自動スケール',
        status: 'コンピュートを拡張中',
      },
      verifying: {
        activity: {
          label: 'ヘルスチェック実行中',
          meta: 'api-gateway · 12 / 12 合格',
          time: '現在',
        },
        compactLabel: '検証',
        label: '検証中',
        status: 'ロールアウトを検証中',
      },
      complete: {
        activity: {
          label: 'デプロイ完了',
          meta: 'api-gateway · v2.8.5',
          time: '現在',
        },
        compactLabel: '完了',
        label: '完了',
        status: 'デプロイ完了',
      },
    },
    throughputDescription: '過去 12 時間に成功したデプロイ',
    throughputStats: [
      { label: '成功', value: '28' },
      { label: '所要時間の中央値', value: '4 分 18 秒' },
      { label: '成功率', value: '99.8%' },
    ],
    throughputTimes: ['12 時間前', '9 時間前', '6 時間前', '3 時間前', '現在'],
    throughputTitle: 'デプロイ件数',
    title: '本番環境の概要',
  },
};

const workspaceNavigation = [
  { icon: Gauge, selected: true },
  { icon: Layers3, selected: false },
  { icon: Server, selected: false },
  { icon: Database, selected: false },
] as const;

const serviceRows = [
  { variant: 'success' },
  { variant: 'info' },
  { variant: 'success' },
] as const;

const metricIcons = [Server, Activity, CloudCog, TerminalSquare] as const;

const deploymentBadgePhases = ['deploying', 'verifying', 'complete'] as const;

const throughputBars = [
  { high: 0.74, id: 'slot-01', low: 0.24, mid: 0.46, still: 0.38 },
  { high: 0.86, id: 'slot-02', low: 0.31, mid: 0.58, still: 0.52 },
  { high: 0.78, id: 'slot-03', low: 0.27, mid: 0.49, still: 0.44 },
  { high: 0.94, id: 'slot-04', low: 0.4, mid: 0.66, still: 0.68 },
  { high: 0.83, id: 'slot-05', low: 0.36, mid: 0.6, still: 0.61 },
  { high: 0.96, id: 'slot-06', low: 0.47, mid: 0.72, still: 0.78 },
  { high: 0.87, id: 'slot-07', low: 0.41, mid: 0.64, still: 0.7 },
  { high: 0.95, id: 'slot-08', low: 0.55, mid: 0.78, still: 0.88 },
  { high: 0.9, id: 'slot-09', low: 0.43, mid: 0.68, still: 0.76 },
  { high: 0.96, id: 'slot-10', low: 0.58, mid: 0.8, still: 0.92 },
  { high: 0.93, id: 'slot-11', low: 0.49, mid: 0.7, still: 0.84 },
  { high: 0.96, id: 'slot-12', low: 0.62, mid: 0.84, still: 0.96 },
] as const;

function useWelcomeMotion(root: { current: HTMLDivElement | null }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReducedMotion(media.matches);

    syncPreference();
    media.addEventListener('change', syncPreference);
    return () => media.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const syncVisibility = () => setIsDocumentVisible(!document.hidden);

    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => document.removeEventListener('visibilitychange', syncVisibility);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [root]);

  const running = isVisible && isDocumentVisible && !reducedMotion;

  useEffect(() => {
    if (reducedMotion) {
      elapsedRef.current = 0;
      setElapsedMs(0);
      return;
    }
    if (!running) return;

    const startedAt = window.performance.now();
    const startingElapsed = elapsedRef.current;
    let animationFrame = 0;
    let lastPublishedAt = Number.NEGATIVE_INFINITY;

    const tick = (now: number) => {
      const nextElapsed = (startingElapsed + now - startedAt) % WELCOME_MOTION_CYCLE_MS;
      if (now - lastPublishedAt >= WELCOME_MOTION_SAMPLE_MS) {
        lastPublishedAt = now;
        elapsedRef.current = nextElapsed;
        setElapsedMs(nextElapsed);
      }
      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => {
      elapsedRef.current =
        (startingElapsed + window.performance.now() - startedAt) %
        WELCOME_MOTION_CYCLE_MS;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [reducedMotion, running]);

  return {
    frame: reducedMotion
      ? WELCOME_REDUCED_MOTION_FRAME
      : sampleWelcomeMotion(elapsedMs),
    reducedMotion,
    running,
  };
}

function ProductWindow({ content }: { content: ProductCopy }) {
  const root = useRef<HTMLDivElement>(null);
  const { frame, running } = useWelcomeMotion(root);
  const deploymentStep = content.simulation[frame.deploymentDisplayPhase];
  const activityPhase = simulationPhases[frame.activityIndex] ?? 'monitoring';
  const activity = content.simulation[activityPhase].activity;
  const deploymentVariant: TRBadgeVariant =
    frame.deploymentDisplayPhase === 'complete'
      ? 'success'
      : frame.deploymentDisplayPhase === 'verifying'
        ? 'warning'
        : 'info';
  const metricValues = [
    `${frame.activeNodes} / 14`,
    `${frame.averageLoad}%`,
    content.metrics[2]?.value,
    content.metrics[3]?.value,
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute start-1/2 top-tinyrack-measure-xs z-0 min-h-[63rem] w-[min(calc(100%_-_6rem),86rem)] -translate-x-1/2 overflow-hidden rounded-tinyrack-xl border-tinyrack-default border-tinyrack-border-strong bg-tinyrack-surface shadow-tinyrack-overlay max-lg:w-[calc(100%_-_2rem)] max-md:top-tinyrack-2xl max-md:min-h-[54rem]"
      data-welcome-app=""
      data-welcome-simulation-running={running ? 'true' : 'false'}
      ref={root}
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
              <strong>{content.rackLabel}</strong> {content.environment}
            </TRAppShell.SidebarLabel>
          </div>
          <nav className="grid gap-tinyrack-xs [&>span]:flex [&>span]:items-center [&>span]:justify-start max-lg:[&>span]:justify-center [&>span]:gap-tinyrack-sm [&>span]:rounded-tinyrack-sm [&>span]:px-tinyrack-md [&>span]:py-tinyrack-sm [&>span]:text-tinyrack-xs max-lg:[&>span]:px-tinyrack-sm max-lg:[&>span]:text-[0]">
            {workspaceNavigation.map(({ icon: Icon, selected }, index) => (
              <span
                className={
                  selected
                    ? 'bg-tinyrack-surface-selected font-tinyrack-medium text-tinyrack-text'
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
          <header className="mb-tinyrack-xl flex items-end justify-between max-md:items-start max-md:gap-tinyrack-md [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-xs [&_span]:text-tinyrack-text-muted [&_h2]:m-0 [&_h2]:text-tinyrack-2xl [&_h2]:leading-tinyrack-sm max-md:[&_h2]:text-tinyrack-xl [&_.tr-badge_svg]:size-tinyrack-md">
            <div>
              <span>{content.breadcrumb}</span>
              <h2>{content.title}</h2>
            </div>
            <TRBadge data-welcome-status="" variant="success">
              <CircleCheck /> {content.simulation.monitoring.status}
            </TRBadge>
          </header>
          <div className="mb-tinyrack-md grid grid-cols-4 gap-tinyrack-md max-md:grid-cols-2">
            {content.metrics.map((metric, index) => {
              const Icon = metricIcons[index];
              if (!Icon) return null;
              return (
                <Metric
                  icon={<Icon />}
                  key={metric.label}
                  {...(index === 0
                    ? { motionId: 'active-nodes' }
                    : index === 1
                      ? { motionId: 'average-load' }
                      : {})}
                  {...metric}
                  value={metricValues[index] ?? metric.value}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.8fr)] gap-tinyrack-md max-lg:grid-cols-[minmax(0,1fr)]">
            <TRCard.Root
              className="min-w-0"
              data-welcome-deployment-phase={frame.deploymentPhase}
              data-welcome-throughput=""
              padding="none"
              variant="outlined"
            >
              <header className="flex items-center justify-between gap-tinyrack-sm border-b-tinyrack-default border-tinyrack-border p-tinyrack-lg [&>div]:min-w-0 [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-xs [&_span]:text-tinyrack-text-muted">
                <div>
                  <strong>{content.throughputTitle}</strong>
                  <span data-welcome-throughput-description="">
                    {content.throughputDescription}
                  </span>
                </div>
                <TRBadge
                  className="shrink-0 whitespace-nowrap"
                  data-welcome-phase-label=""
                  style={{ opacity: frame.deploymentOpacity }}
                  variant={deploymentVariant}
                >
                  {deploymentBadgePhases.map((phase) => {
                    const phaseCopy = content.simulation[phase];
                    return (
                      <span
                        data-active={
                          frame.deploymentDisplayPhase === phase ? 'true' : 'false'
                        }
                        data-welcome-phase-label-option=""
                        key={phase}
                      >
                        <span data-welcome-phase-label-full="">{phaseCopy.label}</span>
                        <span data-welcome-phase-label-compact="">
                          {phaseCopy.compactLabel}
                        </span>
                      </span>
                    );
                  })}
                </TRBadge>
              </header>
              <dl className="m-0 grid grid-cols-3 border-b-tinyrack-default border-tinyrack-border px-tinyrack-lg py-tinyrack-md max-md:hidden [&>div]:grid [&>div]:gap-tinyrack-xs [&>div+div]:border-s-tinyrack-default [&>div+div]:border-tinyrack-border [&>div+div]:ps-tinyrack-lg [&_dd]:m-0 [&_dd]:text-tinyrack-lg [&_dd]:font-tinyrack-medium [&_dt]:text-tinyrack-2xs [&_dt]:text-tinyrack-text-muted">
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
                    {throughputBars.map((bar, index) => {
                      const style = {
                        '--welcome-wave-delay': `${index * -0.32}s`,
                        '--welcome-wave-high': `${bar.high}`,
                        '--welcome-wave-low': `${bar.low}`,
                        '--welcome-wave-mid': `${bar.mid}`,
                        '--welcome-wave-still': `${bar.still}`,
                      } as CSSProperties;
                      return (
                        <span
                          className={
                            index === throughputBars.length - 1
                              ? 'min-h-tinyrack-xs rounded-t-tinyrack-xs bg-tinyrack-primary'
                              : 'min-h-tinyrack-xs rounded-t-tinyrack-xs bg-tinyrack-info'
                          }
                          data-welcome-throughput-bar=""
                          data-welcome-wave-index={index}
                          key={bar.id}
                          style={style}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="mt-tinyrack-sm flex justify-between text-tinyrack-2xs text-tinyrack-text-muted">
                  {content.throughputTimes.map((time) => (
                    <span key={time}>{time}</span>
                  ))}
                </div>
              </div>
              <div
                className="grid gap-tinyrack-sm border-t-tinyrack-default border-tinyrack-border px-tinyrack-lg py-tinyrack-md"
                data-welcome-deployment=""
                style={{ opacity: frame.deploymentOpacity }}
              >
                <div className="flex items-center justify-between text-tinyrack-xs [&>strong]:font-tinyrack-medium [&>span]:text-tinyrack-text-muted">
                  <strong>{deploymentStep.status}</strong>
                  <span data-welcome-deployment-progress="">
                    {frame.deploymentProgress}%
                  </span>
                </div>
                <TRProgress.Root
                  value={frame.deploymentProgress}
                  variant={deploymentVariant}
                >
                  <TRProgress.Track>
                    <TRProgress.Indicator />
                  </TRProgress.Track>
                </TRProgress.Root>
              </div>
            </TRCard.Root>
            <div className="grid min-w-0 content-start gap-tinyrack-md max-lg:hidden">
              <TRCard.Root
                className="order-2"
                data-welcome-services=""
                padding="none"
                variant="outlined"
              >
                <header className="flex items-center justify-between border-b-tinyrack-default border-tinyrack-border p-tinyrack-md [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-2xs [&_span]:text-tinyrack-text-muted">
                  <div>
                    <strong>{content.serviceTitle}</strong>
                    <span>{content.serviceDescription}</span>
                  </div>
                  <TRBadge>{content.live}</TRBadge>
                </header>
                <div className="grid grid-cols-3 gap-tinyrack-md p-tinyrack-md">
                  {serviceRows.map((service, index) => {
                    const localizedService = content.serviceRows[index];
                    const value = frame.serviceValues[index];
                    if (!localizedService || value === undefined) return null;
                    return (
                      <div
                        className="grid min-w-0 gap-tinyrack-sm [&>div]:flex [&>div]:items-center [&>div]:justify-between [&_strong]:truncate [&_strong]:text-tinyrack-2xs [&_span]:text-tinyrack-2xs [&_span]:text-tinyrack-text-muted"
                        key={localizedService.label}
                      >
                        <div>
                          <strong>{localizedService.label}</strong>
                          <span data-welcome-service-value="">{value}%</span>
                        </div>
                        <TRProgress.Root value={value} variant={service.variant}>
                          <TRProgress.Track>
                            <TRProgress.Indicator />
                          </TRProgress.Track>
                        </TRProgress.Root>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="grid grid-cols-3 gap-tinyrack-md border-t-tinyrack-default border-tinyrack-border px-tinyrack-md py-tinyrack-sm"
                  data-welcome-regions=""
                >
                  {content.regionRows.map((region) => (
                    <div
                      className="flex min-w-0 items-center justify-between gap-tinyrack-xs text-tinyrack-2xs [&>strong]:truncate [&>span]:text-tinyrack-text-muted"
                      key={region.label}
                    >
                      <strong>{region.label}</strong>
                      <span>{region.value}%</span>
                    </div>
                  ))}
                </div>
              </TRCard.Root>
              <TRCard.Root className="order-1" padding="none" variant="outlined">
                <header className="flex items-center justify-between border-b-tinyrack-default border-tinyrack-border p-tinyrack-md [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-2xs [&_span]:text-tinyrack-text-muted">
                  <div>
                    <strong>{content.activityTitle}</strong>
                    <span>{content.activityDescription}</span>
                  </div>
                  <Activity className="size-tinyrack-lg text-tinyrack-text-muted" />
                </header>
                <ol className="m-0 list-none px-tinyrack-md">
                  <ActivityRow animated key={activityPhase} {...activity} />
                  {content.activityRows.slice(1, 2).map((row) => (
                    <ActivityRow key={row.label} {...row} />
                  ))}
                </ol>
              </TRCard.Root>
            </div>
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
  motionId,
  value,
}: {
  icon: ReactNode;
  label: string;
  meta: string;
  motionId?: string;
  value: string;
}) {
  return (
    <div
      className="grid gap-tinyrack-sm border-t-tinyrack-default border-tinyrack-border py-tinyrack-lg max-md:nth-[n+3]:hidden [&>div]:flex [&>div]:items-center [&>div]:gap-tinyrack-sm [&>div]:text-tinyrack-xs [&>div]:text-tinyrack-text-muted [&_svg]:size-tinyrack-lg [&>b]:text-tinyrack-2xl [&>b]:leading-tinyrack-sm [&>small]:text-tinyrack-2xs [&>small]:text-tinyrack-text-muted"
      data-welcome-metric={motionId}
    >
      <div>
        <span>{icon}</span>
        <strong>{label}</strong>
      </div>
      <b data-welcome-metric-value="">{value}</b>
      <small>{meta}</small>
    </div>
  );
}

function ActivityRow({
  animated = false,
  label,
  meta,
  time,
}: {
  animated?: boolean;
  label: string;
  meta: string;
  time: string;
}) {
  return (
    <li
      className={`flex min-h-14 items-center gap-tinyrack-md border-b-tinyrack-default border-tinyrack-border last:border-b-0 [&_small]:text-tinyrack-2xs [&_small]:text-tinyrack-text-muted [&_time]:text-tinyrack-2xs [&_time]:text-tinyrack-text-muted ${
        animated
          ? 'motion-safe:animate-welcome-feed-enter motion-reduce:animate-none'
          : ''
      }`}
      data-welcome-live-activity={animated ? '' : undefined}
    >
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

function SectionIntro({
  description,
  eyebrow,
  id,
  title,
}: {
  description: string;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <div className="grid max-w-[52rem] content-start gap-tinyrack-lg">
      <span className="text-tinyrack-xs font-tinyrack-medium tracking-tinyrack-lg text-tinyrack-text-muted uppercase">
        {eyebrow}
      </span>
      <h2
        className="m-0 text-[clamp(var(--tinyrack-text-3xl),5vw,calc(var(--tinyrack-text-5xl)*1.25))] leading-tinyrack-sm tracking-[-0.04em]"
        id={id}
      >
        {title}
      </h2>
      <p className="m-0 max-w-[44rem] text-tinyrack-lg leading-tinyrack-md text-tinyrack-text-muted max-md:text-tinyrack-md">
        {description}
      </p>
    </div>
  );
}

function SystemVisual({ id }: { id: 'components' | 'themes' | 'tokens' }) {
  if (id === 'tokens') {
    return (
      <div
        aria-hidden="true"
        className="grid grid-cols-4 gap-tinyrack-sm rounded-tinyrack-lg bg-tinyrack-canvas p-tinyrack-lg [&>span]:aspect-square [&>span]:rounded-tinyrack-md [&>span]:border-tinyrack-default [&>span]:border-tinyrack-border"
      >
        <span className="bg-tinyrack-primary" />
        <span className="bg-tinyrack-info" />
        <span className="bg-tinyrack-warning" />
        <span className="bg-tinyrack-success" />
      </div>
    );
  }

  if (id === 'themes') {
    return (
      <div aria-hidden="true" className="grid grid-cols-2 gap-tinyrack-sm">
        {(['light', 'dark'] as const).map((theme) => (
          <div
            className="grid min-h-24 content-between rounded-tinyrack-lg border-tinyrack-default border-tinyrack-border p-tinyrack-md"
            data-theme={`tinyrack-${theme}`}
            key={theme}
            style={{
              background: 'var(--tinyrack-surface)',
              color: 'var(--tinyrack-text)',
            }}
          >
            <span className="h-tinyrack-sm w-3/4 rounded-tinyrack-full bg-tinyrack-text" />
            <span className="h-tinyrack-control-height-sm rounded-tinyrack-md bg-tinyrack-primary" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="grid min-h-24 grid-cols-[auto_1fr] items-center gap-tinyrack-md rounded-tinyrack-lg border-tinyrack-default border-tinyrack-border bg-tinyrack-canvas p-tinyrack-lg"
    >
      <span className="grid size-tinyrack-control-height-lg place-items-center rounded-tinyrack-md bg-tinyrack-primary text-tinyrack-on-primary [&>svg]:size-tinyrack-lg">
        <TerminalSquare />
      </span>
      <span className="grid gap-tinyrack-sm">
        <span className="h-tinyrack-sm w-3/4 rounded-tinyrack-full bg-tinyrack-text" />
        <span className="h-tinyrack-xs w-full rounded-tinyrack-full bg-tinyrack-border-strong" />
      </span>
    </div>
  );
}

function SystemSection({
  content,
  localeRoot,
}: {
  content: WelcomeCopy['system'];
  localeRoot: string;
}) {
  return (
    <section
      aria-labelledby="welcome-system-title"
      className="grid gap-[clamp(2.5rem,6vw,5rem)] border-b-tinyrack-default border-tinyrack-border py-[clamp(4rem,8vw,8rem)]"
      data-welcome-system=""
    >
      <SectionIntro
        description={content.description}
        eyebrow={content.eyebrow}
        id="welcome-system-title"
        title={content.title}
      />
      <div className="grid grid-cols-3 gap-tinyrack-lg max-lg:grid-cols-1">
        {content.items.map((item) => (
          <TRCard.Root
            className="grid gap-tinyrack-xl"
            key={item.id}
            padding="lg"
            variant="outlined"
          >
            <SystemVisual id={item.id} />
            <div className="grid gap-tinyrack-sm">
              <h3 className="m-0 text-tinyrack-xl">{item.title}</h3>
              <p className="m-0 text-tinyrack-text-muted">{item.description}</p>
            </div>
            <TRLink href={`${localeRoot}${item.path}`}>{item.linkLabel}</TRLink>
          </TRCard.Root>
        ))}
      </div>
    </section>
  );
}

function ComponentShowcase({
  content,
  localeRoot,
}: {
  content: WelcomeCopy['components'];
  localeRoot: string;
}) {
  const inputId = useId();
  const switchId = useId();
  const [monitoring, setMonitoring] = useState(true);

  return (
    <section
      aria-labelledby="welcome-components-title"
      className="grid grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] gap-[clamp(3rem,8vw,8rem)] border-b-tinyrack-default border-tinyrack-border py-[clamp(4rem,8vw,8rem)] max-lg:grid-cols-1"
      data-welcome-components=""
    >
      <div className="grid content-start gap-tinyrack-2xl">
        <SectionIntro
          description={content.description}
          eyebrow={content.eyebrow}
          id="welcome-components-title"
          title={content.title}
        />
        <TRLink href={`${localeRoot}/components/button/`}>{content.docsLink}</TRLink>
      </div>
      <TRCard.Root className="min-w-0" padding="none" variant="outlined">
        <TRTabs.Root defaultValue="controls">
          <TRTabs.List
            aria-label={content.tabs.label}
            className="px-tinyrack-lg pt-tinyrack-lg"
          >
            <TRTabs.Tab value="controls">{content.tabs.controls}</TRTabs.Tab>
            <TRTabs.Tab value="feedback">{content.tabs.feedback}</TRTabs.Tab>
            <TRTabs.Indicator />
          </TRTabs.List>
          <TRTabs.Panel
            className="grid gap-tinyrack-xl p-tinyrack-xl max-md:p-tinyrack-lg"
            value="controls"
          >
            <label className="grid gap-tinyrack-sm" htmlFor={inputId}>
              <span className="text-tinyrack-sm font-tinyrack-medium">
                {content.inputLabel}
              </span>
              <TRInput id={inputId} placeholder={content.inputPlaceholder} />
            </label>
            <div className="flex items-center gap-tinyrack-sm">
              <TRSwitch.Root
                aria-label={content.switchLabel}
                checked={monitoring}
                id={switchId}
                onCheckedChange={setMonitoring}
              >
                <TRSwitch.Thumb />
              </TRSwitch.Root>
              <label className="cursor-pointer" htmlFor={switchId}>
                {content.switchLabel}
              </label>
            </div>
            <TRButton className="w-fit" intent="primary" type="button">
              {content.button}
            </TRButton>
          </TRTabs.Panel>
          <TRTabs.Panel
            className="grid gap-tinyrack-lg p-tinyrack-xl max-md:p-tinyrack-lg"
            value="feedback"
          >
            <div className="flex items-center justify-between gap-tinyrack-md">
              <strong>{content.tabs.feedback}</strong>
              <TRBadge variant="success">{content.badge}</TRBadge>
            </div>
            <TRAlert.Root role="status" variant="success">
              <TRAlert.Title render={<h3>{content.alertTitle}</h3>} />
              <TRAlert.Description>{content.alertDescription}</TRAlert.Description>
              <TRAlert.Actions>
                <TRButton appearance="outline" intent="success" type="button">
                  {content.alertAction}
                </TRButton>
              </TRAlert.Actions>
            </TRAlert.Root>
          </TRTabs.Panel>
        </TRTabs.Root>
      </TRCard.Root>
    </section>
  );
}

function StartSection({
  content,
  locale,
  localeRoot,
}: {
  content: WelcomeCopy['start'];
  locale: WelcomeLocale;
  localeRoot: string;
}) {
  return (
    <section
      aria-labelledby="quick-start-title"
      className="grid grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)] gap-[clamp(3rem,8vw,8rem)] border-b-tinyrack-default border-tinyrack-border py-[clamp(4rem,8vw,8rem)] max-lg:grid-cols-1"
      data-welcome-start=""
      id="quick-start"
    >
      <div className="grid content-start gap-tinyrack-2xl">
        <SectionIntro
          description={content.description}
          eyebrow={content.eyebrow}
          id="quick-start-title"
          title={content.title}
        />
        <TRLink href={`${localeRoot}/installation/`}>{content.guideLink}</TRLink>
      </div>
      <div className="grid min-w-0 gap-tinyrack-md">
        <GettingStartedCode
          label={content.installLabel}
          locale={locale}
          snippet="install"
        />
        <GettingStartedCode
          label={content.buttonLabel}
          locale={locale}
          snippet="button"
        />
      </div>
    </section>
  );
}

function ExploreSection({
  content,
  localeRoot,
}: {
  content: WelcomeCopy['explore'];
  localeRoot: string;
}) {
  return (
    <section
      aria-labelledby="welcome-explore-title"
      className="grid gap-[clamp(2.5rem,6vw,5rem)] py-[clamp(4rem,8vw,8rem)]"
      data-welcome-explore=""
    >
      <SectionIntro
        description={content.description}
        eyebrow={content.eyebrow}
        id="welcome-explore-title"
        title={content.title}
      />
      <div className="grid grid-cols-2 gap-tinyrack-lg max-md:grid-cols-1">
        {content.items.map((item) => {
          const href = item.href.startsWith('http')
            ? item.href
            : `${localeRoot}${item.href}`;
          return (
            <div
              className="grid gap-tinyrack-md rounded-tinyrack-xl border-tinyrack-default border-tinyrack-border bg-tinyrack-surface-muted p-tinyrack-xl"
              key={item.href}
            >
              <h3 className="m-0 text-tinyrack-xl">{item.title}</h3>
              <p className="m-0 text-tinyrack-text-muted">{item.description}</p>
              <TRLink href={href}>{item.title}</TRLink>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function WelcomePage({ locale }: { locale: WelcomeLocale }) {
  const content = welcomeCopy[locale];
  const product = productCopy[locale];
  const localeRoot = `/${locale}`;

  return (
    <div
      className="w-full overflow-clip bg-tinyrack-surface text-tinyrack-text"
      data-welcome-page=""
    >
      <section
        aria-label={content.hero.label}
        className="relative h-[max(42rem,calc(100dvh-var(--tinyrack-control-height-lg)))] min-h-[42rem] overflow-hidden bg-tinyrack-canvas max-md:h-[max(40rem,calc(100dvh-var(--tinyrack-control-height-lg)))] max-md:min-h-[40rem]"
        data-welcome-hero=""
      >
        <ProductWindow content={product} />
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
            <p className="m-0 mb-tinyrack-lg flex items-center gap-0 text-tinyrack-xs font-tinyrack-medium tracking-tinyrack-lg text-tinyrack-text-muted uppercase max-md:flex-wrap max-md:text-tinyrack-2xs [&>span+span]:before:px-tinyrack-md [&>span+span]:before:text-tinyrack-border-strong [&>span+span]:before:content-['/']">
              <span>React 19</span>
              <span>Base UI</span>
              <span>{content.hero.componentCount(componentDocsManifest.length)}</span>
            </p>
            <h1
              aria-label={content.hero.title.join(' ')}
              className="m-0 max-w-none text-[clamp(calc(var(--tinyrack-text-5xl)*1.35),9vw,calc(var(--tinyrack-text-5xl)*3.15))] leading-[0.98] font-tinyrack-bold tracking-[-0.065em] text-balance max-md:text-[clamp(calc(var(--tinyrack-text-5xl)*1.15),15vw,calc(var(--tinyrack-text-5xl)*1.7))] max-md:tracking-[-0.055em] [&>span]:block"
            >
              {content.hero.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p
              className="mt-tinyrack-xl mb-0 max-w-[52rem] text-tinyrack-lg leading-tinyrack-md text-tinyrack-text-muted max-md:hidden"
              data-welcome-description=""
            >
              {content.hero.description}
            </p>
            <div className="mt-tinyrack-2xl flex max-md:mt-tinyrack-xl">
              <div
                className="flex min-w-0 gap-tinyrack-sm max-md:w-full"
                data-welcome-actions=""
              >
                <TRButton
                  className="min-h-tinyrack-control-height-lg min-w-0 px-tinyrack-xl max-md:flex-1"
                  data-welcome-cta=""
                  nativeButton={false}
                  intent="primary"
                  render={createElement('a', { href: `${localeRoot}/installation/` })}
                >
                  {content.hero.installation}
                </TRButton>
                <TRButton
                  appearance="outline"
                  className="min-h-tinyrack-control-height-lg min-w-0 px-tinyrack-xl max-md:flex-1"
                  data-welcome-cta=""
                  nativeButton={false}
                  render={createElement('a', { href: `${localeRoot}/foundations/` })}
                >
                  {content.hero.foundations}
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
        <SystemSection content={content.system} localeRoot={localeRoot} />
        <ComponentShowcase content={content.components} localeRoot={localeRoot} />
        <StartSection content={content.start} locale={locale} localeRoot={localeRoot} />
        <ExploreSection content={content.explore} localeRoot={localeRoot} />
      </div>
    </div>
  );
}
