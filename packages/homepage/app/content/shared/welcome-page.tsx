import { TRBadge } from '@tinyrack/ui/components/badge';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRCard } from '@tinyrack/ui/components/card';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRProgress } from '@tinyrack/ui/components/progress';
import {
  Activity,
  Bell,
  Boxes,
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
  search: string;
  serviceDescription: string;
  serviceRows: readonly { detail: string; label: string }[];
  serviceTitle: string;
  status: string;
  title: string;
};

type CompositionCopy = {
  accessibility: string;
  activity: string;
  checksPassed: string;
  componentTests: string;
  packageSurface: string;
  passed: string;
  productionWorkspace: string;
  ready: string;
  readiness: string;
  resources: string;
  score: string;
  stable: string;
  verified: string;
  workspace: string;
};

type WelcomeCopy = {
  appShell: string;
  build: string;
  composition: CompositionCopy;
  componentPreview: string;
  description: string;
  explore: string;
  foundations: string;
  installNote: string;
  principles: readonly {
    description: string;
    label: string;
    title: string;
  }[];
  principlesDescription: string;
  principlesTitle: string;
  quickStartDescription: string;
  quickStartTitle: string;
  showcaseDescription: string;
  showcaseTitle: string;
  product: ProductCopy;
};

const copy: Record<WelcomeLocale, WelcomeCopy> = {
  en: {
    appShell: 'Explore the app shell',
    build: 'Start building',
    composition: {
      accessibility: 'Accessibility',
      activity: 'Activity',
      checksPassed: 'All required checks have passed.',
      componentTests: 'Component tests',
      packageSurface: 'Package surface',
      passed: '620 passed',
      productionWorkspace: 'Production workspace',
      ready: 'Ready to ship',
      readiness: 'Release readiness',
      resources: 'Resources',
      score: 'Readiness score',
      stable: 'Stable',
      verified: 'Verified',
      workspace: 'Workspace',
    },
    componentPreview: 'Tinyrack component composition',
    description:
      'A React design system for precise operational interfaces—without rebuilding the fundamentals.',
    explore: 'Explore foundations',
    foundations: 'Foundations',
    installNote:
      'Import the foundation once, then add only the component CSS your interface uses.',
    principles: [
      {
        description:
          'Base UI owns keyboard behavior, focus, positioning, dismissal, and state.',
        label: '01 / Behavior',
        title: 'Accessible by default',
      },
      {
        description:
          'A deliberate type and spacing system keeps dense workflows calm and scannable.',
        label: '02 / Density',
        title: 'Compact without clutter',
      },
      {
        description:
          'Semantic tokens and separate CSS imports make every styling decision visible.',
        label: '03 / Styling',
        title: 'Own every surface',
      },
    ],
    principlesDescription:
      'The decisions that make a product feel coherent are already part of the system.',
    principlesTitle: 'Built into every layer.',
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
      search: 'Search infrastructure',
      serviceDescription: 'Live resource utilization',
      serviceRows: [
        { detail: '12 instances', label: 'Edge gateway' },
        { detail: '8 active workers', label: 'Compute pool' },
        { detail: '3 regions', label: 'Primary database' },
      ],
      serviceTitle: 'Service health',
      status: 'All systems operational',
      title: 'Production overview',
    },
    quickStartDescription:
      'Install the React package and compose your first production-ready control.',
    quickStartTitle: 'Start with the essentials.',
    showcaseDescription:
      'Primitives, patterns, and tokens designed to read as one product—not a collection of parts.',
    showcaseTitle: 'One system. A complete product.',
  },
  ko: {
    appShell: '앱 셸 살펴보기',
    build: '빌드 시작',
    composition: {
      accessibility: '접근성',
      activity: '활동',
      checksPassed: '필수 검증을 모두 통과했습니다.',
      componentTests: '컴포넌트 테스트',
      packageSurface: '패키지 표면',
      passed: '620개 통과',
      productionWorkspace: '프로덕션 워크스페이스',
      ready: '출시 준비 완료',
      readiness: '릴리스 준비',
      resources: '리소스',
      score: '준비 점수',
      stable: '안정적',
      verified: '검증됨',
      workspace: '워크스페이스',
    },
    componentPreview: 'Tinyrack 컴포넌트 조합',
    description:
      '기초를 다시 만들지 않고 정교한 운영 인터페이스를 구축하는 React 디자인 시스템.',
    explore: '기초 살펴보기',
    foundations: '기초',
    installNote:
      '기초 CSS는 한 번만 불러오고, 인터페이스에서 사용하는 컴포넌트 CSS만 추가하세요.',
    principles: [
      {
        description:
          'Base UI가 키보드 동작, 포커스, 위치 지정, 닫기와 상태를 담당합니다.',
        label: '01 / 동작',
        title: '기본부터 접근 가능하게',
      },
      {
        description:
          '의도적인 타입과 간격 체계가 밀도 높은 워크플로를 차분하고 읽기 쉽게 만듭니다.',
        label: '02 / 밀도',
        title: '혼잡함 없는 컴팩트함',
      },
      {
        description:
          '시맨틱 토큰과 분리된 CSS import로 모든 스타일 결정을 명확하게 드러냅니다.',
        label: '03 / 스타일링',
        title: '모든 표면을 직접 제어',
      },
    ],
    principlesDescription:
      '제품을 하나의 경험으로 느끼게 하는 결정이 이미 시스템 안에 들어 있습니다.',
    principlesTitle: '모든 레이어에 내장된 원칙.',
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
      search: '인프라 검색',
      serviceDescription: '실시간 리소스 사용량',
      serviceRows: [
        { detail: '인스턴스 12개', label: '엣지 게이트웨이' },
        { detail: '활성 워커 8개', label: '컴퓨트 풀' },
        { detail: '3개 리전', label: '기본 데이터베이스' },
      ],
      serviceTitle: '서비스 상태',
      status: '모든 시스템 정상',
      title: '프로덕션 개요',
    },
    quickStartDescription:
      'React 패키지를 설치하고 첫 번째 프로덕션 수준 컨트롤을 조합하세요.',
    quickStartTitle: '핵심부터 시작하세요.',
    showcaseDescription:
      '부품의 모음이 아니라 하나의 제품처럼 읽히도록 설계한 primitive, pattern, token.',
    showcaseTitle: '하나의 시스템. 완성된 제품.',
  },
  ja: {
    appShell: 'App shell を見る',
    build: '構築を始める',
    composition: {
      accessibility: 'アクセシビリティ',
      activity: 'アクティビティ',
      checksPassed: '必須チェックをすべて通過しました。',
      componentTests: 'コンポーネントテスト',
      packageSurface: 'パッケージ表面',
      passed: '620 件通過',
      productionWorkspace: '本番ワークスペース',
      ready: 'リリース可能',
      readiness: 'リリース準備',
      resources: 'リソース',
      score: '準備スコア',
      stable: '安定',
      verified: '検証済み',
      workspace: 'ワークスペース',
    },
    componentPreview: 'Tinyrack コンポーネントの構成',
    description:
      '基礎を作り直すことなく、精密な運用インターフェースを構築する React デザインシステム。',
    explore: '基礎を見る',
    foundations: '基礎',
    installNote:
      '基礎 CSS を一度読み込み、インターフェースで使うコンポーネント CSS だけを追加します。',
    principles: [
      {
        description:
          'Base UI がキーボード操作、フォーカス、配置、解除、状態を担います。',
        label: '01 / 振る舞い',
        title: '最初からアクセシブル',
      },
      {
        description:
          '意図的なタイプと余白のシステムが、高密度なワークフローを読みやすく保ちます。',
        label: '02 / 密度',
        title: '散らからないコンパクトさ',
      },
      {
        description:
          'セマンティックトークンと分離された CSS import が、すべての判断を明確にします。',
        label: '03 / スタイル',
        title: 'すべての面を管理',
      },
    ],
    principlesDescription:
      '製品を一つの体験として感じさせる判断が、すでにシステムに組み込まれています。',
    principlesTitle: 'すべてのレイヤーに組み込まれた原則。',
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
      search: 'インフラを検索',
      serviceDescription: 'リアルタイムのリソース使用率',
      serviceRows: [
        { detail: '12 インスタンス', label: 'エッジゲートウェイ' },
        { detail: '8 ワーカー稼働中', label: 'コンピュートプール' },
        { detail: '3 リージョン', label: 'プライマリDB' },
      ],
      serviceTitle: 'サービス状態',
      status: 'すべて正常',
      title: '本番環境の概要',
    },
    quickStartDescription:
      'React パッケージをインストールし、最初の実用的なコントロールを構成します。',
    quickStartTitle: '必要なものから始める。',
    showcaseDescription:
      '部品の集合ではなく、一つの製品として読める primitive、pattern、token。',
    showcaseTitle: '一つのシステム。完成された製品。',
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

function ProductWindow({ content }: { content: ProductCopy }) {
  return (
    <div aria-hidden="true" className="welcome-product-window" data-welcome-app="">
      <div className="welcome-product-bar">
        <div className="welcome-product-brand">
          <span className="welcome-product-brand-icon">
            <CloudCog />
          </span>
          <strong>{content.consoleTitle}</strong>
          <span>{content.production}</span>
        </div>
        <div className="welcome-product-tools">
          <span className="welcome-product-search">
            <Search /> {content.search}
          </span>
          <Bell />
          <span className="welcome-product-avatar">WT</span>
        </div>
      </div>
      <div className="welcome-product-layout">
        <aside className="welcome-product-sidebar">
          <div className="welcome-product-environment">
            <span className="welcome-status-pulse" />
            <span>
              <strong>Rack A</strong> {content.environment}
            </span>
          </div>
          <nav>
            {workspaceNavigation.map(({ icon: Icon, selected }, index) => (
              <span
                className={selected ? 'is-selected' : undefined}
                key={content.navigation[index]}
              >
                <Icon /> {content.navigation[index]}
              </span>
            ))}
          </nav>
          <div className="welcome-product-sidebar-footer">
            <span>
              <ShieldCheck /> {content.footer[0]}
            </span>
            <span>
              <Users /> {content.footer[1]}
            </span>
          </div>
        </aside>
        <div className="welcome-product-main">
          <header className="welcome-product-heading">
            <div>
              <span>{content.breadcrumb}</span>
              <h2>{content.title}</h2>
            </div>
            <TRBadge variant="success">
              <CircleCheck /> {content.status}
            </TRBadge>
          </header>
          <div className="welcome-product-metrics">
            {content.metrics.map((metric, index) => {
              const Icon = metricIcons[index];
              if (!Icon) return null;
              return <Metric icon={<Icon />} key={metric.label} {...metric} />;
            })}
          </div>
          <div className="welcome-product-panels">
            <TRCard.Root
              className="welcome-product-panel"
              padding="none"
              variant="outlined"
            >
              <header>
                <div>
                  <strong>{content.serviceTitle}</strong>
                  <span>{content.serviceDescription}</span>
                </div>
                <TRBadge>{content.live}</TRBadge>
              </header>
              <div className="welcome-service-list">
                {serviceRows.map((service, index) => {
                  const localizedService = content.serviceRows[index];
                  if (!localizedService) return null;
                  return (
                    <div className="welcome-service-row" key={localizedService.label}>
                      <div>
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
              className="welcome-product-panel welcome-activity-panel"
              padding="none"
              variant="outlined"
            >
              <header>
                <div>
                  <strong>{content.activityTitle}</strong>
                  <span>{content.activityDescription}</span>
                </div>
                <Activity />
              </header>
              <ol>
                {content.activityRows.map((row) => (
                  <ActivityRow key={row.label} {...row} />
                ))}
              </ol>
            </TRCard.Root>
          </div>
        </div>
      </div>
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
    <div className="welcome-product-metric">
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
    <li>
      <span>
        <Sparkles />
      </span>
      <div>
        <strong>{label}</strong>
        <small>{meta}</small>
      </div>
      <time>{time}</time>
    </li>
  );
}

function ComponentComposition({
  content,
  label,
}: {
  content: CompositionCopy;
  label: string;
}) {
  return (
    <div
      aria-label={label}
      className="welcome-composition"
      data-welcome-composition=""
      role="img"
    >
      <div className="welcome-composition-rail" aria-hidden="true">
        <span className="is-active">
          <Boxes /> {content.workspace}
        </span>
        <span>
          <Activity /> {content.activity}
        </span>
        <span>
          <Database /> {content.resources}
        </span>
      </div>
      <div className="welcome-composition-body" aria-hidden="true">
        <div className="welcome-composition-toolbar">
          <div>
            <strong>{content.readiness}</strong>
            <span>{content.productionWorkspace}</span>
          </div>
          <TRBadge variant="success">{content.ready}</TRBadge>
        </div>
        <div className="welcome-composition-grid">
          <div className="welcome-composition-score">
            <span>{content.score}</span>
            <strong>94</strong>
            <TRProgress.Root value={94} variant="success">
              <TRProgress.Track>
                <TRProgress.Indicator />
              </TRProgress.Track>
            </TRProgress.Root>
            <small>{content.checksPassed}</small>
          </div>
          <div className="welcome-composition-checks">
            <span>
              <CircleCheck /> {content.componentTests}{' '}
              <TRBadge variant="success">{content.passed}</TRBadge>
            </span>
            <span>
              <CircleCheck /> {content.accessibility}{' '}
              <TRBadge variant="success">{content.verified}</TRBadge>
            </span>
            <span>
              <CircleCheck /> {content.packageSurface}{' '}
              <TRBadge variant="info">{content.stable}</TRBadge>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WelcomePage({ locale }: { locale: WelcomeLocale }) {
  const content = copy[locale];
  const localeRoot = `/${locale}`;

  return (
    <div className="welcome-page" data-welcome-page="">
      <section
        aria-label="Tinyrack Design System introduction"
        className="welcome-hero"
        data-welcome-hero=""
      >
        <ProductWindow content={content.product} />
        <div
          aria-hidden="true"
          className="welcome-hero-gradient"
          data-welcome-gradient=""
        />
        <div className="welcome-hero-content">
          <p className="welcome-eyebrow">
            <span>React 19</span>
            <span>Base UI</span>
            <span>{componentDocsManifest.length} components</span>
          </p>
          <h1>
            <span>TINYRACK</span>
            <span>DESIGN SYSTEM</span>
          </h1>
          <div className="welcome-hero-summary">
            <p>{content.description}</p>
            <div className="welcome-hero-actions">
              <TRButton
                nativeButton={false}
                render={createElement('a', { href: '#quick-start' })}
                variant="primary"
              >
                {content.build}
              </TRButton>
              <TRButton
                appearance="outline"
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
      </section>

      <div className="welcome-content">
        <section
          aria-labelledby="welcome-showcase"
          className="welcome-section welcome-showcase"
        >
          <div className="welcome-section-heading">
            <span className="welcome-section-index">01 / Product composition</span>
            <h2 id="welcome-showcase">{content.showcaseTitle}</h2>
            <p>{content.showcaseDescription}</p>
          </div>
          <ComponentComposition
            content={content.composition}
            label={content.componentPreview}
          />
        </section>

        <section
          aria-labelledby="welcome-principles"
          className="welcome-section welcome-principles"
        >
          <div className="welcome-section-heading">
            <span className="welcome-section-index">02 / System principles</span>
            <h2 id="welcome-principles">{content.principlesTitle}</h2>
            <p>{content.principlesDescription}</p>
          </div>
          <ul className="welcome-principle-list">
            {content.principles.map((principle) => (
              <li key={principle.label}>
                <span>{principle.label}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="quick-start"
          className="welcome-section welcome-quick-start"
          id="quick-start"
        >
          <div className="welcome-quick-start-copy">
            <span className="welcome-section-index">03 / Quick start</span>
            <h2>{content.quickStartTitle}</h2>
            <p>{content.quickStartDescription}</p>
            <div className="welcome-quick-start-links">
              <TRLink href={`${localeRoot}/foundations/`}>{content.explore}</TRLink>
              <TRLink href={`${localeRoot}/components/app-shell/`}>
                {content.appShell}
              </TRLink>
            </div>
          </div>
          <div className="welcome-install">
            <ComponentInstall
              surfaces={[
                {
                  label: 'React',
                  install: 'pnpm add @tinyrack/ui react react-dom',
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
