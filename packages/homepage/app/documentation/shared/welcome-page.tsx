import { TRAppShell } from '@tinyrack/ui/components/app-shell';
import { TRBadge, type TRBadgeVariant } from '@tinyrack/ui/components/badge';
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
import { createElement, type ReactNode, useEffect, useRef, useState } from 'react';
import { componentDocsManifest } from './component-docs-manifest.js';
import { GettingStartedCode } from './getting-started-contract.js';

type WelcomeLocale = 'en' | 'ja' | 'ko';

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
  throughputTitle: string;
  title: string;
};

type WelcomeCopy = {
  componentCount: (count: number) => string;
  heroLabel: string;
  foundations: string;
  installation: string;
  snippetLabels: {
    button: string;
    styles: string;
    theme: string;
    vite: string;
    viteInstall: string;
  };
  proposition: string;
  quickStartEyebrow: string;
  standards: readonly { description: string; title: string }[];
  nextComponents: string;
  nextFoundations: string;
  quickStartDescription: string;
  quickStartTitle: string;
  product: ProductCopy;
};

const copy: Record<WelcomeLocale, WelcomeCopy> = {
  en: {
    componentCount: (count) => `${count} components`,
    heroLabel: 'Tinyrack Design System introduction',
    foundations: 'Foundations',
    installation: 'Installation',
    snippetLabels: {
      button: 'Primary button example',
      styles: 'Tinyrack style imports',
      theme: 'Theme selection',
      vite: 'Vite configuration',
      viteInstall: 'Vite package installation',
    },
    proposition:
      'Standardize accessible React interfaces with shared tokens, themes, and production-ready components.',
    quickStartEyebrow: '01 / Quick start',
    standards: [
      {
        title: 'Tokens',
        description: 'Use one scale for color, type, spacing, and elevation.',
      },
      {
        title: 'Themes',
        description: 'Select a product theme without changing component code.',
      },
      {
        title: 'Components',
        description: 'Compose accessible controls with consistent interaction states.',
      },
    ],
    nextFoundations: 'Understand the system rules',
    nextComponents: 'Build with components',
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
      throughputTitle: 'Deployment throughput',
      title: 'Production overview',
    },
    quickStartDescription:
      'Install the React package and compose your first production-ready control.',
    quickStartTitle: 'Start with the essentials.',
  },
  ko: {
    componentCount: (count) => `컴포넌트 ${count}개`,
    heroLabel: 'Tinyrack 디자인 시스템 소개',
    foundations: '기초',
    installation: '설치',
    snippetLabels: {
      button: '기본 버튼 예시',
      styles: 'Tinyrack 스타일 불러오기',
      theme: '테마 선택',
      vite: 'Vite 설정',
      viteInstall: 'Vite 패키지 설치',
    },
    proposition:
      '공통 토큰과 테마, 프로덕션용 컴포넌트로 접근성 높은 React 인터페이스를 일관되게 만들어요.',
    quickStartEyebrow: '01 / 빠른 시작',
    standards: [
      {
        title: '토큰',
        description: '색상, 글꼴, 간격, 높이에 하나의 척도를 사용해요.',
      },
      {
        title: '테마',
        description: '컴포넌트 코드를 바꾸지 않고 제품 테마를 선택해요.',
      },
      {
        title: '컴포넌트',
        description: '일관된 상호작용 상태를 갖춘 접근성 높은 컨트롤을 조합해요.',
      },
    ],
    nextFoundations: '시스템 규칙 이해',
    nextComponents: '컴포넌트로 만들기',
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
    componentCount: (count) => `${count} 個のコンポーネント`,
    heroLabel: 'Tinyrack デザインシステムの紹介',
    foundations: '基礎',
    installation: 'インストール',
    snippetLabels: {
      button: '主要ボタンの例',
      styles: 'Tinyrackスタイルの読み込み',
      theme: 'テーマの選択',
      vite: 'Vite設定',
      viteInstall: 'Viteパッケージのインストール',
    },
    proposition:
      '共通のトークン、テーマ、実用的なコンポーネントで、アクセシブルな React インターフェースを統一できます。',
    quickStartEyebrow: '01 / クイックスタート',
    standards: [
      {
        title: 'トークン',
        description: '色、文字、余白、エレベーションに共通の尺度を使います。',
      },
      {
        title: 'テーマ',
        description: 'コンポーネントのコードを変えずに製品テーマを選べます。',
      },
      {
        title: 'コンポーネント',
        description:
          '一貫した操作状態を備えたアクセシブルなコントロールを組み合わせます。',
      },
    ],
    nextFoundations: 'システムのルールを理解する',
    nextComponents: 'コンポーネントで構築する',
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
  { variant: 'success' },
  { variant: 'info' },
  { variant: 'success' },
] as const;

const metricIcons = [Server, Activity, CloudCog, TerminalSquare] as const;

const SIMULATION_STEP_MS = 2_400;

type SimulationFrame = {
  activeNodes: string;
  averageLoad: string;
  deploymentProgress: number;
  serviceValues: readonly [number, number, number];
  throughput: readonly number[];
  variant: TRBadgeVariant;
};

const simulationFrames: Record<SimulationPhase, SimulationFrame> = {
  monitoring: {
    activeNodes: '12 / 12',
    averageLoad: '41%',
    deploymentProgress: 100,
    serviceValues: [92, 68, 84],
    throughput: [38, 52, 44, 68, 61, 78, 70, 88, 76, 92, 84, 96],
    variant: 'success',
  },
  deploying: {
    activeNodes: '12 / 12',
    averageLoad: '48%',
    deploymentProgress: 28,
    serviceValues: [91, 74, 84],
    throughput: [38, 52, 44, 68, 61, 78, 70, 88, 76, 84, 72, 78],
    variant: 'info',
  },
  scaling: {
    activeNodes: '14 / 14',
    averageLoad: '57%',
    deploymentProgress: 62,
    serviceValues: [90, 82, 82],
    throughput: [38, 52, 44, 68, 61, 78, 70, 88, 82, 90, 86, 92],
    variant: 'info',
  },
  verifying: {
    activeNodes: '14 / 14',
    averageLoad: '46%',
    deploymentProgress: 88,
    serviceValues: [91, 76, 83],
    throughput: [38, 52, 44, 68, 61, 78, 70, 88, 80, 94, 90, 96],
    variant: 'warning',
  },
  complete: {
    activeNodes: '12 / 12',
    averageLoad: '41%',
    deploymentProgress: 100,
    serviceValues: [92, 68, 84],
    throughput: [38, 52, 44, 68, 61, 78, 70, 88, 76, 92, 84, 96],
    variant: 'success',
  },
};

const throughputSlots = [
  'slot-01',
  'slot-02',
  'slot-03',
  'slot-04',
  'slot-05',
  'slot-06',
  'slot-07',
  'slot-08',
  'slot-09',
  'slot-10',
  'slot-11',
  'slot-12',
] as const;

const throughputTimes = ['12h', '9h', '6h', '3h', 'Now'] as const;

function useWelcomeSimulation(root: { current: HTMLDivElement | null }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReducedMotion(media.matches);

    syncPreference();
    media.addEventListener('change', syncPreference);
    return () => media.removeEventListener('change', syncPreference);
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

  useEffect(() => {
    if (reducedMotion) setPhaseIndex(0);
  }, [reducedMotion]);

  const running = isVisible && !reducedMotion;

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setPhaseIndex((current) => (current + 1) % simulationPhases.length);
    }, SIMULATION_STEP_MS);
    return () => window.clearInterval(timer);
  }, [running]);

  return {
    phase: simulationPhases[phaseIndex] ?? simulationPhases[0],
    running,
  };
}

function ProductWindow({ content }: { content: ProductCopy }) {
  const root = useRef<HTMLDivElement>(null);
  const { phase, running } = useWelcomeSimulation(root);
  const frame = simulationFrames[phase];
  const step = content.simulation[phase];
  const metricValues = [
    frame.activeNodes,
    frame.averageLoad,
    content.metrics[2]?.value,
    content.metrics[3]?.value,
  ];
  const StatusIcon = frame.variant === 'success' ? CircleCheck : Activity;

  return (
    <div
      aria-hidden="true"
      className="absolute start-1/2 top-tinyrack-measure-xs z-0 min-h-[63rem] w-[min(calc(100%_-_6rem),86rem)] -translate-x-1/2 overflow-hidden rounded-tinyrack-xl border-tinyrack-default border-tinyrack-border-strong bg-tinyrack-surface shadow-tinyrack-overlay max-lg:w-[calc(100%_-_2rem)] max-md:top-tinyrack-2xl max-md:min-h-[54rem]"
      data-welcome-app=""
      data-welcome-simulation-phase={phase}
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
          <header className="mb-tinyrack-xl flex items-end justify-between max-md:items-start max-md:gap-tinyrack-md [&>div]:grid [&>div]:gap-tinyrack-xs [&_span]:text-tinyrack-xs [&_span]:text-tinyrack-text-muted [&_h2]:m-0 [&_h2]:text-tinyrack-2xl [&_h2]:leading-tinyrack-sm max-md:[&_h2]:text-tinyrack-xl [&_.tr-badge_svg]:size-tinyrack-md">
            <div>
              <span>{content.breadcrumb}</span>
              <h2>{content.title}</h2>
            </div>
            <TRBadge
              className="motion-safe:animate-welcome-feed-enter motion-reduce:animate-none"
              data-welcome-status=""
              key={phase}
              variant={frame.variant}
            >
              <StatusIcon /> {step.status}
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
                  {...metric}
                  value={metricValues[index] ?? metric.value}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.8fr)] gap-tinyrack-md max-lg:grid-cols-[minmax(0,1fr)]">
            <TRCard.Root
              className="min-w-0"
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
                  className="shrink-0 whitespace-nowrap motion-safe:animate-welcome-feed-enter motion-reduce:animate-none"
                  data-welcome-phase-label=""
                  key={phase}
                  variant={frame.variant}
                >
                  <span data-welcome-phase-label-full="">{step.label}</span>
                  <span data-welcome-phase-label-compact="">{step.compactLabel}</span>
                </TRBadge>
              </header>
              <dl className="m-0 grid grid-cols-3 border-b-tinyrack-default border-tinyrack-border px-tinyrack-lg py-tinyrack-md max-md:hidden [&>div]:grid [&>div]:gap-tinyrack-xs [&>div+div]:border-s-tinyrack-default [&>div+div]:border-tinyrack-border [&>div+div]:ps-tinyrack-lg [&_dd]:m-0 [&_dd]:text-tinyrack-lg [&_dd]:font-tinyrack-semibold [&_dt]:text-tinyrack-2xs [&_dt]:text-tinyrack-text-muted">
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
                    {throughputSlots.map((slot, index) => {
                      const value = frame.throughput[index] ?? 0;
                      return (
                        <span
                          className={
                            index === throughputSlots.length - 1
                              ? 'min-h-tinyrack-space-xs rounded-t-tinyrack-xs bg-tinyrack-primary transition-[height] duration-tinyrack-slow ease-tinyrack-ease-out motion-reduce:transition-none'
                              : 'min-h-tinyrack-space-xs rounded-t-tinyrack-xs bg-tinyrack-info transition-[height] duration-tinyrack-slow ease-tinyrack-ease-out motion-reduce:transition-none'
                          }
                          data-welcome-throughput-bar=""
                          key={slot}
                          style={{ height: `${value}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="mt-tinyrack-sm flex justify-between text-tinyrack-2xs text-tinyrack-text-muted">
                  {throughputTimes.map((time) => (
                    <span key={time}>{time}</span>
                  ))}
                </div>
              </div>
              <div className="grid gap-tinyrack-sm border-t-tinyrack-default border-tinyrack-border px-tinyrack-lg py-tinyrack-md">
                <div className="flex items-center justify-between text-tinyrack-xs [&>strong]:font-tinyrack-semibold [&>span]:text-tinyrack-text-muted">
                  <strong>{step.status}</strong>
                  <span data-welcome-deployment-progress="">
                    {frame.deploymentProgress}%
                  </span>
                </div>
                <TRProgress.Root
                  value={frame.deploymentProgress}
                  variant={frame.variant}
                >
                  <TRProgress.Track>
                    <TRProgress.Indicator />
                  </TRProgress.Track>
                </TRProgress.Root>
              </div>
            </TRCard.Root>
            <div className="grid min-w-0 content-start gap-tinyrack-md max-lg:hidden">
              <TRCard.Root className="order-2" padding="none" variant="outlined">
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
                  <ActivityRow animated key={phase} {...step.activity} />
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
      <b
        className="motion-safe:animate-welcome-feed-enter motion-reduce:animate-none"
        data-welcome-metric-value=""
        key={value}
      >
        {value}
      </b>
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

export function WelcomePage({ locale }: { locale: WelcomeLocale }) {
  const content = copy[locale];
  const localeRoot = `/${locale}`;

  return (
    <div
      className="w-full overflow-clip bg-tinyrack-surface text-tinyrack-text"
      data-welcome-page=""
    >
      <section
        aria-label={content.heroLabel}
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
              <span>{content.componentCount(componentDocsManifest.length)}</span>
            </p>
            <h1 className="m-0 max-w-none text-[clamp(calc(var(--tinyrack-text-5xl)*1.35),9vw,calc(var(--tinyrack-text-5xl)*3.15))] leading-[0.98] font-tinyrack-bold tracking-[-0.065em] text-balance max-md:text-[clamp(calc(var(--tinyrack-text-5xl)*1.15),15vw,calc(var(--tinyrack-text-5xl)*1.7))] max-md:tracking-[-0.055em] [&>span]:block">
              <span>TINYRACK</span>
              <span>DESIGN SYSTEM</span>
            </h1>
            <p className="mt-tinyrack-xl mb-0 max-w-[52rem] text-tinyrack-lg leading-tinyrack-md text-tinyrack-text-muted">
              {content.proposition}
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
                  {content.installation}
                </TRButton>
                <TRButton
                  appearance="outline"
                  className="min-h-tinyrack-control-height-lg min-w-0 px-tinyrack-xl max-md:flex-1"
                  data-welcome-cta=""
                  nativeButton={false}
                  render={createElement('a', { href: `${localeRoot}/foundations/` })}
                >
                  {content.foundations}
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
        <section className="grid grid-cols-3 gap-tinyrack-lg border-b-tinyrack-default border-tinyrack-border py-[clamp(3rem,6vw,6rem)] max-md:grid-cols-1">
          {content.standards.map((area) => (
            <div className="grid gap-tinyrack-sm" key={area.title}>
              <h2 className="m-0 text-tinyrack-xl">{area.title}</h2>
              <p className="m-0 text-tinyrack-text-muted">{area.description}</p>
            </div>
          ))}
        </section>
        <section
          aria-labelledby="quick-start"
          className="grid grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)] gap-[clamp(3rem,8vw,8rem)] border-b-0 border-tinyrack-border py-[clamp(4rem,8vw,8rem)] max-md:grid-cols-[minmax(0,1fr)] max-md:gap-tinyrack-2xl max-md:py-16"
          id="quick-start"
        >
          <div className="grid content-start gap-tinyrack-lg">
            <span className="text-tinyrack-xs font-tinyrack-semibold tracking-tinyrack-lg text-tinyrack-text-muted uppercase">
              {content.quickStartEyebrow}
            </span>
            <h2 className="m-0 max-w-[48rem] text-[clamp(var(--tinyrack-text-3xl),5vw,calc(var(--tinyrack-text-5xl)*1.45))] leading-tinyrack-sm tracking-[-0.04em]">
              {content.quickStartTitle}
            </h2>
            <p className="m-0 max-w-[42rem] text-tinyrack-lg leading-tinyrack-md text-tinyrack-text-muted max-md:text-tinyrack-md">
              {content.quickStartDescription}
            </p>
          </div>
          <div className="grid min-w-0 gap-tinyrack-md">
            <GettingStartedCode label={content.installation} snippet="install" />
            <GettingStartedCode
              label={content.snippetLabels.viteInstall}
              snippet="viteInstall"
            />
            <GettingStartedCode label={content.snippetLabels.vite} snippet="vite" />
            <GettingStartedCode label={content.snippetLabels.styles} snippet="styles" />
            <GettingStartedCode label={content.snippetLabels.theme} snippet="theme" />
            <GettingStartedCode label={content.snippetLabels.button} snippet="button" />
          </div>
        </section>
        <section className="grid grid-cols-2 gap-tinyrack-xl py-[clamp(3rem,6vw,6rem)] max-md:grid-cols-1">
          <TRLink href={`${localeRoot}/foundations/`}>{content.nextFoundations}</TRLink>
          <TRLink href={`${localeRoot}/components/`}>{content.nextComponents}</TRLink>
        </section>
      </div>
    </div>
  );
}
