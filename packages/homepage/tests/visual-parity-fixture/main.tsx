import { ChevronDown } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { TRAlert } from '../../../ui_web/src/components/alert/index.tsx';
import '../../../ui_web/src/components/alert/alert.css';
import { TRAvatar } from '../../../ui_web/src/components/avatar/index.tsx';
import '../../../ui_web/src/components/avatar/avatar.css';
import { TRBadge } from '../../../ui_web/src/components/badge/index.tsx';
import '../../../ui_web/src/components/badge/badge.css';
import { TRBreadcrumbs } from '../../../ui_web/src/components/breadcrumbs/index.tsx';
import '../../../ui_web/src/components/breadcrumbs/breadcrumbs.css';
import { TRCheckbox } from '../../../ui_web/src/components/checkbox/index.tsx';
import '../../../ui_web/src/components/checkbox/checkbox.css';
import { TRLink } from '../../../ui_web/src/components/link/index.tsx';
import '../../../ui_web/src/components/link/link.css';
import { TRRadio } from '../../../ui_web/src/components/radio/index.tsx';
import '../../../ui_web/src/components/radio/radio.css';
import { TRRadioGroup } from '../../../ui_web/src/components/radio-group/index.tsx';
import '../../../ui_web/src/components/radio-group/radio-group.css';
import { TRSwitch } from '../../../ui_web/src/components/switch/index.tsx';
import '../../../ui_web/src/components/switch/switch.css';
import { TRToggle } from '../../../ui_web/src/components/toggle/index.tsx';
import '../../../ui_web/src/components/toggle/toggle.css';
import { TRFieldset } from '../../../ui_web/src/components/fieldset/index.tsx';
import '../../../ui_web/src/components/fieldset/fieldset.css';
import { TRMeter } from '../../../ui_web/src/components/meter/index.tsx';
import '../../../ui_web/src/components/meter/meter.css';
import { TRProgress } from '../../../ui_web/src/components/progress/index.tsx';
import '../../../ui_web/src/components/progress/progress.css';
import { TRSteps } from '../../../ui_web/src/components/steps/index.tsx';
import '../../../ui_web/src/components/steps/steps.css';
import { TRTabs } from '../../../ui_web/src/components/tabs/index.tsx';
import '../../../ui_web/src/components/tabs/tabs.css';
import { TRTextarea } from '../../../ui_web/src/components/textarea/index.tsx';
import '../../../ui_web/src/components/textarea/textarea.css';
import { TRToggleGroup } from '../../../ui_web/src/components/toggle-group/index.tsx';
import '../../../ui_web/src/components/toggle-group/toggle-group.css';
import { TRCheckboxGroup } from '../../../ui_web/src/components/checkbox-group/index.tsx';
import '../../../ui_web/src/components/checkbox-group/checkbox-group.css';
import { TRAccordion } from '../../../ui_web/src/components/accordion/index.tsx';
import '../../../ui_web/src/components/accordion/accordion.css';
import { TRAnimatedNumber } from '../../../ui_web/src/components/animated-number/index.tsx';
import '../../../ui_web/src/components/animated-number/animated-number.css';
import { TRCollapsible } from '../../../ui_web/src/components/collapsible/index.tsx';
import '../../../ui_web/src/components/collapsible/collapsible.css';
import { TRCopyButton } from '../../../ui_web/src/components/copy-button/index.tsx';
import '../../../ui_web/src/components/copy-button/copy-button.css';
import { TRCode } from '../../../ui_web/src/components/code/index.tsx';
import '../../../ui_web/src/components/code/code.css';
import { TRCodeBlock } from '../../../ui_web/src/components/code-block/index.tsx';
import '../../../ui_web/src/components/code-block/code-block.css';
import { TRSeparator } from '../../../ui_web/src/components/separator/index.tsx';
import '../../../ui_web/src/components/separator/separator.css';
import { TRSkeleton } from '../../../ui_web/src/components/skeleton/index.tsx';
import '../../../ui_web/src/components/skeleton/skeleton.css';
import { TRButton } from '../../../ui_web/src/components/button/index.tsx';
import '../../../ui_web/src/components/button/button.css';
import { TRCard } from '../../../ui_web/src/components/card/index.tsx';
import '../../../ui_web/src/components/card/card.css';
import { TRField } from '../../../ui_web/src/components/field/index.tsx';
import '../../../ui_web/src/components/field/field.css';
import { TRIconButton } from '../../../ui_web/src/components/icon-button/index.tsx';
import '../../../ui_web/src/components/icon-button/icon-button.css';
import { TRInput } from '../../../ui_web/src/components/input/index.tsx';
import '../../../ui_web/src/components/input/input.css';
import { TRSpinner } from '../../../ui_web/src/components/spinner/index.tsx';
import '../../../ui_web/src/components/spinner/spinner.css';
import { TRText } from '../../../ui_web/src/components/text/index.tsx';
import '../../../ui_web/src/components/text/text.css';
import { TRMenu } from '../../../ui_web/src/components/menu/index.tsx';
import '../../../ui_web/src/components/menu/menu.css';
import { TRSelect } from '../../../ui_web/src/components/select/index.tsx';
import '../../../ui_web/src/components/select/select.css';
import { TRDialog } from '../../../ui_web/src/components/dialog/index.tsx';
import '../../../ui_web/src/components/dialog/dialog.css';
import { TRAlertDialog } from '../../../ui_web/src/components/alert-dialog/index.tsx';
import { TRAppShell } from '../../../ui_web/src/components/app-shell/index.tsx';
import { TRAutocomplete } from '../../../ui_web/src/components/autocomplete/index.tsx';
import { TRCombobox } from '../../../ui_web/src/components/combobox/index.tsx';
import { TRContextMenu } from '../../../ui_web/src/components/context-menu/index.tsx';
import { TRDrawer } from '../../../ui_web/src/components/drawer/index.tsx';
import { TRFileTree } from '../../../ui_web/src/components/file-tree/index.tsx';
import { TRForm } from '../../../ui_web/src/components/form/index.tsx';
import { TRMenubar } from '../../../ui_web/src/components/menubar/index.tsx';
import { TRNavigationMenu } from '../../../ui_web/src/components/navigation-menu/index.tsx';
import { TRNumberField } from '../../../ui_web/src/components/number-field/index.tsx';
import { TROTPField } from '../../../ui_web/src/components/otp-field/index.tsx';
import { TRPagination } from '../../../ui_web/src/components/pagination/index.tsx';
import { TRPopover } from '../../../ui_web/src/components/popover/index.tsx';
import { TRPreviewCard } from '../../../ui_web/src/components/preview-card/index.tsx';
import { TRScrollArea } from '../../../ui_web/src/components/scroll-area/index.tsx';
import { TRSlider } from '../../../ui_web/src/components/slider/index.tsx';
import { TRTable } from '../../../ui_web/src/components/table/index.tsx';
import {
  TRToast,
  useToastManager,
} from '../../../ui_web/src/components/toast/index.tsx';
import { TRToolbar } from '../../../ui_web/src/components/toolbar/index.tsx';
import { TRTooltip } from '../../../ui_web/src/components/tooltip/index.tsx';
import { TRTreeNav } from '../../../ui_web/src/components/tree-nav/index.tsx';
import { TRWindowFrame } from '../../../ui_web/src/components/window-frame/index.tsx';
import '../../../ui_web/src/components/alert-dialog/alert-dialog.css';
import '../../../ui_web/src/components/app-shell/app-shell.css';
import '../../../ui_web/src/components/autocomplete/autocomplete.css';
import '../../../ui_web/src/components/combobox/combobox.css';
import '../../../ui_web/src/components/context-menu/context-menu.css';
import '../../../ui_web/src/components/drawer/drawer.css';
import '../../../ui_web/src/components/file-tree/file-tree.css';
import '../../../ui_web/src/components/form/form.css';
import '../../../ui_web/src/components/menubar/menubar.css';
import '../../../ui_web/src/components/navigation-menu/navigation-menu.css';
import '../../../ui_web/src/components/number-field/number-field.css';
import '../../../ui_web/src/components/otp-field/otp-field.css';
import '../../../ui_web/src/components/popover/popover.css';
import '../../../ui_web/src/components/preview-card/preview-card.css';
import '../../../ui_web/src/components/scroll-area/scroll-area.css';
import '../../../ui_web/src/components/slider/slider.css';
import '../../../ui_web/src/components/toast/toast.css';
import '../../../ui_web/src/components/toolbar/toolbar.css';
import '../../../ui_web/src/components/tooltip/tooltip.css';
import '../../../ui_web/src/components/tree-nav/tree-nav.css';
import '../../../ui_web/src/components/pagination/pagination.css';
import '../../../ui_web/src/components/table/table.css';
import '../../../ui_web/src/components/window-frame/window-frame.css';
import '../../../ui_web/src/core/core.css';
import './fixture.css';

let query = new URLSearchParams(location.search);
let activations = 0;
let component = query.get('component') ?? 'button';
let locale = query.get('locale') ?? 'en';
const arg = (name: string, fallback: string) => query.get(name) ?? fallback;
const flag = (name: string) => query.get(name) === 'true';
const localizedCopy = {
  en: {
    add: 'Add rack',
    bold: 'Bold',
    crumbComponents: 'Components',
    docs: 'Docs',
    accordionInstall: 'Install',
    accordionInstallBody: 'Add the package.',
    accordionConfigure: 'Configure',
    accordionConfigureBody: 'Wire up the theme.',
    collapsibleTrigger: 'Details',
    copyCopied: 'Copied',
    copyIdle: 'Copy',
    tabOverview: 'Overview',
    tabSettings: 'Settings',
    toggleEnd: 'End',
    toggleStart: 'Start',
    crumbCurrent: 'Breadcrumbs',
    crumbHome: 'Home',
    description: 'The rack configuration is up to date.',
    dialogAction: 'Deploy',
    dialogBody: 'Stable',
    dialogCancel: 'Cancel',
    dialogDescription: 'The stable channel will be updated.',
    dialogTitle: 'Deploy rack?',
    dialogTrigger: 'Open dialog',
    field: 'Rack name',
    fieldHint: 'Shown on the rack list.',
    healthy: 'Healthy',
    legend: 'Contact',
    loading: 'Loading',
    meterLabel: 'Storage',
    menuCompact: 'Compact',
    menuGrid: 'Show grid',
    menuGroup: 'Layout',
    menuTrigger: 'View',
    saved: 'Changes saved',
    status: 'Rack status',
    selectBeta: 'Beta',
    selectStable: 'Stable',
    stepOne: 'Create account',
    stepTwo: 'Verify email',
  },
  ja: {
    add: 'ラックを追加',
    bold: '太字',
    crumbComponents: 'コンポーネント',
    docs: 'ドキュメント',
    accordionInstall: 'インストール',
    accordionInstallBody: 'パッケージを追加してください。',
    accordionConfigure: '設定',
    accordionConfigureBody: 'テーマを接続してください。',
    collapsibleTrigger: '詳細',
    copyCopied: 'コピー済み',
    copyIdle: 'コピー',
    tabOverview: '概要',
    tabSettings: '設定',
    toggleEnd: '末尾',
    toggleStart: '先頭',
    crumbCurrent: 'パンくず',
    crumbHome: 'ホーム',
    description: 'ラック構成は最新です。',
    dialogAction: 'デプロイ',
    dialogBody: '安定版',
    dialogCancel: 'キャンセル',
    dialogDescription: '安定版チャンネルが更新されます。',
    dialogTitle: 'ラックをデプロイしますか？',
    dialogTrigger: 'ダイアログを開く',
    field: 'ラック名',
    fieldHint: 'ラック一覧に表示されます。',
    healthy: '正常',
    legend: '連絡先',
    loading: '読み込み中',
    meterLabel: 'ストレージ',
    menuCompact: 'コンパクト',
    menuGrid: 'グリッドを表示',
    menuGroup: 'レイアウト',
    menuTrigger: '表示',
    saved: '変更を保存しました',
    status: 'ラックの状態',
    selectBeta: 'ベータ',
    selectStable: '安定版',
    stepOne: 'アカウント作成',
    stepTwo: 'メール認証',
  },
  ko: {
    add: '랙 추가',
    bold: '굵게',
    crumbComponents: '컴포넌트',
    docs: '문서',
    accordionInstall: '설치',
    accordionInstallBody: '패키지를 추가하세요.',
    accordionConfigure: '설정',
    accordionConfigureBody: '테마를 연결하세요.',
    collapsibleTrigger: '상세 정보',
    copyCopied: '복사됨',
    copyIdle: '복사',
    tabOverview: '개요',
    tabSettings: '설정',
    toggleEnd: '끝',
    toggleStart: '시작',
    crumbCurrent: '브레드크럼',
    crumbHome: '홈',
    description: '랙 구성이 최신 상태예요.',
    dialogAction: '배포',
    dialogBody: '안정',
    dialogCancel: '취소',
    dialogDescription: '안정 채널이 업데이트돼요.',
    dialogTitle: '랙을 배포할까요?',
    dialogTrigger: '다이얼로그 열기',
    field: '랙 이름',
    fieldHint: '랙 목록에 표시돼요.',
    healthy: '정상',
    legend: '연락처',
    loading: '불러오는 중',
    meterLabel: '저장 공간',
    menuCompact: '좁게',
    menuGrid: '격자 표시',
    menuGroup: '레이아웃',
    menuTrigger: '보기',
    saved: '변경 사항을 저장했어요',
    status: '랙 상태',
    selectBeta: '베타',
    selectStable: '안정',
    stepOne: '계정 만들기',
    stepTwo: '이메일 인증',
  },
} as const;
let copy =
  localizedCopy[
    (locale in localizedCopy ? locale : 'en') as keyof typeof localizedCopy
  ];

function ParityToast({ open }: { open: boolean }) {
  const manager = useToastManager();
  const toastId = useRef<string | null>(null);

  useEffect(() => {
    if (open && toastId.current === null) {
      toastId.current = manager.add({
        description: 'Rack alpha is up to date.',
        timeout: 0,
        title: copy.saved,
        type: 'success',
      });
    } else if (!open && toastId.current !== null) {
      manager.close(toastId.current);
      toastId.current = null;
    }
  }, [manager, open]);

  return (
    <>
      <TRButton style={{ width: 128 }}>Show toast</TRButton>
      <TRToast.Portal>
        <TRToast.Viewport aria-label="Notifications">
          {manager.toasts
            .filter((toast) => open && toast.id === toastId.current)
            .map((toast) => (
              <TRToast.Root
                key={toast.id}
                style={{ boxSizing: 'border-box', height: 105 }}
                toast={toast}
              >
                <TRToast.Content
                  style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <TRToast.Title
                    style={{ fontSize: 14, lineHeight: '20px', margin: 0 }}
                  >
                    {toast.title}
                  </TRToast.Title>
                  <TRToast.Description
                    style={{
                      fontSize: 12,
                      lineHeight: '20px',
                      margin: 0,
                      transform: locale === 'ko' ? 'translateY(1px)' : undefined,
                    }}
                  >
                    {toast.description}
                  </TRToast.Description>
                </TRToast.Content>
                <TRToast.Close aria-label="Close">×</TRToast.Close>
              </TRToast.Root>
            ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    </>
  );
}

function ParityAppShell({ open }: { open: boolean }) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const breakpoint = arg('breakpoint', 'lg') as 'sm' | 'lg';
  const layout = arg('layout', 'sidebar-first') as 'header-first' | 'sidebar-first';
  const mobileSidebar = arg('mobileSidebar', 'drawer') as 'drawer' | 'rail';
  const sidebarMode = arg('sidebarMode', 'expanded') as 'expanded' | 'rail';
  const sidebarCollapsed = flag('sidebarCollapsed');
  const navigation = {
    en: ['Overview', 'Deployments', 'Services', 'Data stores'],
    ko: ['개요', '배포', '서비스', '데이터 저장소'],
    ja: ['概要', 'デプロイ', 'サービス', 'データストア'],
  }[locale as 'en' | 'ko' | 'ja'];
  const copy = {
    en: {
      activity: 'Recent activity',
      environment: 'Production environment',
      healthy: 'Healthy services',
      live: 'Live',
      operational: 'All systems operational',
      overview: 'System overview',
      p95: 'P95 response',
      recent0: 'api-gateway deployed successfully',
      recent1: 'Database backup completed',
      team: 'Platform team',
      today: 'Deployments today',
      workspace: 'Production workspace',
    },
    ko: {
      activity: '최근 활동',
      environment: '프로덕션 환경',
      healthy: '정상 서비스',
      live: '실시간',
      operational: '모든 시스템이 정상이에요',
      overview: '시스템 개요',
      p95: 'P95 응답',
      recent0: 'api-gateway 배포에 성공했어요',
      recent1: '데이터베이스 백업을 마쳤어요',
      team: '플랫폼 팀',
      today: '오늘 배포',
      workspace: '프로덕션 워크스페이스',
    },
    ja: {
      activity: '最近のアクティビティ',
      environment: '本番環境',
      healthy: '正常なサービス',
      live: 'ライブ',
      operational: 'すべてのシステムが正常です',
      overview: 'システム概要',
      p95: 'P95 応答',
      recent0: 'api-gateway のデプロイに成功しました',
      recent1: 'データベースのバックアップが完了しました',
      team: 'プラットフォームチーム',
      today: '本日のデプロイ',
      workspace: '本番ワークスペース',
    },
  }[locale as 'en' | 'ko' | 'ja'];
  const metrics = [
    [copy.healthy, '24 / 24'],
    [copy.today, '18'],
    [copy.p95, '128 ms'],
  ];
  return (
    <div className="parity-app-shell-frame" ref={setPortalContainer}>
      <TRAppShell.Root
        breakpoint={breakpoint}
        className="parity-app-shell"
        drawerPopupClassName="parity-app-shell-popup"
        layout={layout}
        mobileSidebar={mobileSidebar}
        open={open}
        portalContainer={portalContainer}
        sidebarMode={sidebarMode}
      >
        <TRAppShell.Header data-parity-part="appShellHeader">
          <TRAppShell.Trigger aria-label="Open navigation">
            <span data-parity-raster="headerIcon">≡</span>
          </TRAppShell.Trigger>
          <TRAppShell.Brand data-parity-raster="headerCopy">
            <span>
              <strong>Orbit Ops</strong>
              <small>{copy.environment}</small>
            </span>
          </TRAppShell.Brand>
          <TRAppShell.Actions>
            <span className="parity-app-shell-region">
              <span data-parity-raster="headerAction">us-east</span>
            </span>
          </TRAppShell.Actions>
        </TRAppShell.Header>
        <TRAppShell.Sidebar
          aria-label="Example navigation"
          collapsed={sidebarCollapsed}
          data-parity-part="appShellSidebar"
        >
          <div className="parity-app-shell-sidebar-content">
            <div className="parity-app-shell-sidebar-header">
              <span className="parity-app-shell-logo">
                <span data-parity-raster="brandIcon">□</span>
              </span>
              <TRAppShell.SidebarLabel data-parity-raster="sidebarBrand">
                <strong>Orbit Ops</strong>
                <small>{copy.workspace}</small>
              </TRAppShell.SidebarLabel>
              <TRAppShell.SidebarToggle aria-label="Toggle sidebar">
                <span data-parity-raster="toggleIcon">▯</span>
              </TRAppShell.SidebarToggle>
              <TRAppShell.Close aria-label="Close navigation">
                <span data-parity-raster="closeIcon">×</span>
              </TRAppShell.Close>
            </div>
            <nav className="parity-app-shell-navigation">
              {navigation.map((label, index) => (
                <div
                  className={index === 0 ? 'selected' : undefined}
                  data-parity-part={`navigationRow${index}Surface`}
                  key={label}
                >
                  <span data-parity-raster={`navigationIcon${index}`}>◇</span>
                  <TRAppShell.SidebarLabel
                    data-parity-raster={`navigationLabel${index}`}
                  >
                    {label}
                  </TRAppShell.SidebarLabel>
                </div>
              ))}
            </nav>
            <div className="parity-app-shell-profile" data-parity-part="profileSurface">
              <span className="parity-app-shell-avatar">
                <span data-parity-raster="avatar">AK</span>
              </span>
              <TRAppShell.SidebarLabel data-parity-raster="profileCopy">
                <strong>Avery Kim</strong>
                <small>{copy.team}</small>
              </TRAppShell.SidebarLabel>
            </div>
          </div>
        </TRAppShell.Sidebar>
        <TRAppShell.Main
          data-parity-part="appShellMain"
          render={<div className="parity-app-shell-main" />}
        >
          <div className="parity-app-shell-heading">
            <div data-parity-raster="mainHeading">
              <small>PRODUCTION / US-EAST</small>
              <h2>{copy.overview}</h2>
            </div>
            <div className="parity-app-shell-status" data-parity-part="statusSurface">
              <span />
              <span data-parity-raster="statusCopy">{copy.operational}</span>
            </div>
          </div>
          <div className="parity-app-shell-metrics">
            {metrics.map(([label, value], index) => (
              <div data-parity-part={`metric${index}Surface`} key={label}>
                <span data-parity-raster={`metricCopy${index}`}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </span>
              </div>
            ))}
          </div>
          <section data-parity-part="activitySurface">
            <header data-parity-raster="activityHeader">
              <strong>{copy.activity}</strong>
              <small>♡ {copy.live}</small>
            </header>
            <div data-parity-raster="activityRows">
              <span>{copy.recent0}&nbsp;&nbsp;&nbsp; 4m</span>
              <span>{copy.recent1}&nbsp;&nbsp;&nbsp; 18m</span>
            </div>
          </section>
        </TRAppShell.Main>
      </TRAppShell.Root>
    </div>
  );
}

document.documentElement.dataset['theme'] =
  query.get('theme') === 'dark' ? 'tinyrack-dark' : 'tinyrack-light';
document.documentElement.dataset['parityMotion'] = String(
  query.get('motion') === 'true',
);
document.documentElement.lang = locale;

function Fixture() {
  const intent = arg('intent', 'primary') as
    | 'neutral'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';
  const appearance = arg('appearance', 'solid') as 'solid' | 'outline' | 'ghost';
  const uiSize = arg('uiSize', 'md') as 'md' | 'lg';
  // A field has no outline step, so the shared appearance arg narrows to the
  // two a field understands.
  const fieldAppearance = appearance === 'ghost' ? 'ghost' : 'solid';
  const statusVariant = arg('variant', 'neutral') as
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';
  const content = (() => {
    switch (component) {
      case 'alert':
        return (
          <TRAlert.Root variant={statusVariant}>
            <div className={flag('showIcon') ? 'parity-alert-row' : undefined}>
              {flag('showIcon') ? (
                <span aria-hidden="true" className="parity-alert-icon" />
              ) : null}
              <div>
                <TRAlert.Title>{copy.saved}</TRAlert.Title>
                {flag('showDescription') ? (
                  <TRAlert.Description>{copy.description}</TRAlert.Description>
                ) : null}
                {flag('showActions') ? (
                  <TRAlert.Actions>
                    <TRText variant="bodySm" weight="medium">
                      Review
                    </TRText>
                  </TRAlert.Actions>
                ) : null}
              </div>
            </div>
          </TRAlert.Root>
        );
      case 'avatar':
        return (
          <TRAvatar.Root
            shape={arg('shape', 'circle') as 'circle' | 'square'}
            uiSize={uiSize}
          >
            <TRAvatar.Fallback>AB</TRAvatar.Fallback>
          </TRAvatar.Root>
        );
      case 'badge':
        return (
          <TRBadge uiSize={uiSize} variant={statusVariant}>
            <span data-parity-part="label">{copy.healthy}</span>
          </TRBadge>
        );
      case 'breadcrumbs':
        return (
          <TRBreadcrumbs
            items={[
              { href: '#home', label: copy.crumbHome },
              { href: '#components', label: copy.crumbComponents },
              { label: copy.crumbCurrent },
            ]}
          />
        );
      case 'checkbox': {
        // Base UI renders the control plus a hidden input sibling; the
        // wrapper keeps the measured target a single element.
        const mark = arg('mark', 'unchecked');
        return (
          <span style={{ display: 'inline-flex' }}>
            <TRCheckbox.Root
              aria-label={copy.healthy}
              checked={mark === 'checked'}
              disabled={flag('disabled')}
              indeterminate={mark === 'indeterminate'}
              onCheckedChange={() => {
                activations += 1;
              }}
              uiSize={uiSize}
            >
              <TRCheckbox.Indicator>
                {mark === 'indeterminate' ? '−' : '✓'}
              </TRCheckbox.Indicator>
            </TRCheckbox.Root>
          </span>
        );
      }
      case 'accordion':
        return (
          <TRAccordion.Root
            onValueChange={() => {
              activations += 1;
            }}
            value={flag('open') ? ['install'] : []}
          >
            <TRAccordion.Item value="install">
              <TRAccordion.Header>
                <TRAccordion.Trigger>
                  <span data-parity-part="trigger">{copy.accordionInstall}</span>
                </TRAccordion.Trigger>
              </TRAccordion.Header>
              <TRAccordion.Panel>{copy.accordionInstallBody}</TRAccordion.Panel>
            </TRAccordion.Item>
            <TRAccordion.Item value="configure">
              <TRAccordion.Header>
                <TRAccordion.Trigger>{copy.accordionConfigure}</TRAccordion.Trigger>
              </TRAccordion.Header>
              <TRAccordion.Panel>{copy.accordionConfigureBody}</TRAccordion.Panel>
            </TRAccordion.Item>
          </TRAccordion.Root>
        );
      case 'animated-number':
        return (
          <TRAnimatedNumber
            animation={arg('animation', 'roll') as 'count' | 'roll'}
            duration={Number(arg('duration', '600'))}
            value={Number(arg('value', '12345'))}
          />
        );
      case 'code':
        return <TRCode>rack.deploy()</TRCode>;
      case 'collapsible':
        return (
          <TRCollapsible.Root
            disabled={flag('disabled')}
            onOpenChange={() => {
              activations += 1;
            }}
            open={flag('open')}
          >
            <TRCollapsible.Trigger>{copy.collapsibleTrigger}</TRCollapsible.Trigger>
            <TRCollapsible.Panel
              keepMounted
              style={{ '--collapsible-panel-height': '21px' } as React.CSSProperties}
            >
              {copy.description}
            </TRCollapsible.Panel>
          </TRCollapsible.Root>
        );
      case 'copy-button':
        return (
          <TRCopyButton
            copiedLabel={copy.copyCopied}
            idleLabel={copy.copyIdle}
            onStatusChange={(status) => {
              if (status === 'copied') {
                activations += 1;
              }
            }}
            value="tinyrack.net"
          />
        );
      case 'menu':
        return (
          <TRMenu.Root disabled={flag('disabled')} open={flag('open')}>
            <TRMenu.Trigger style={{ width: '4rem' }}>
              <span data-parity-part="triggerLabel">{copy.menuTrigger}</span>
            </TRMenu.Trigger>
            <TRMenu.Portal>
              <TRMenu.Positioner>
                <TRMenu.Popup>
                  <TRMenu.Viewport>
                    <TRMenu.Group>
                      <TRMenu.GroupLabel>
                        <span data-parity-part="groupLabel">{copy.menuGroup}</span>
                      </TRMenu.GroupLabel>
                      <TRMenu.CheckboxItem checked>
                        <TRMenu.CheckboxItemIndicator>✓</TRMenu.CheckboxItemIndicator>
                        <span data-parity-part="checkboxLabel">{copy.menuGrid}</span>
                      </TRMenu.CheckboxItem>
                      <TRMenu.RadioGroup value="compact">
                        <TRMenu.RadioItem value="compact">
                          <TRMenu.RadioItemIndicator>●</TRMenu.RadioItemIndicator>
                          <span data-parity-part="radioLabel">{copy.menuCompact}</span>
                        </TRMenu.RadioItem>
                      </TRMenu.RadioGroup>
                    </TRMenu.Group>
                  </TRMenu.Viewport>
                </TRMenu.Popup>
              </TRMenu.Positioner>
            </TRMenu.Portal>
          </TRMenu.Root>
        );
      case 'select':
        return (
          <TRSelect.Root
            disabled={flag('disabled') || flag('readOnly')}
            items={{ beta: copy.selectBeta, stable: copy.selectStable }}
            open={flag('open')}
            value={arg('value', 'stable') || null}
          >
            <TRSelect.Trigger appearance={fieldAppearance} uiSize={uiSize}>
              <TRSelect.Value placeholder="Choose a channel" />
              <TRSelect.Icon aria-hidden="true">
                <ChevronDown />
              </TRSelect.Icon>
            </TRSelect.Trigger>
            <TRSelect.Portal>
              <TRSelect.Positioner>
                <TRSelect.Popup>
                  <TRSelect.List>
                    <TRSelect.Item value="stable">
                      <TRSelect.ItemText>{copy.selectStable}</TRSelect.ItemText>
                      <TRSelect.ItemIndicator>✓</TRSelect.ItemIndicator>
                    </TRSelect.Item>
                    <TRSelect.Item value="beta">
                      <TRSelect.ItemText>{copy.selectBeta}</TRSelect.ItemText>
                      <TRSelect.ItemIndicator>✓</TRSelect.ItemIndicator>
                    </TRSelect.Item>
                  </TRSelect.List>
                </TRSelect.Popup>
              </TRSelect.Positioner>
            </TRSelect.Portal>
          </TRSelect.Root>
        );
      case 'dialog':
        return (
          <TRDialog.Root open={flag('open')}>
            <TRDialog.Trigger render={<TRButton style={{ width: '8rem' }} />}>
              <span
                data-parity-part="triggerLabel"
                style={{
                  alignItems: 'center',
                  display: 'inline-flex',
                  height: 'var(--tinyrack-control-line-height-md)',
                  justifyContent: 'center',
                  width: 'calc(var(--tinyrack-measure-xs) + var(--tinyrack-space-lg))',
                }}
              >
                {copy.dialogTrigger}
              </span>
            </TRDialog.Trigger>
            <TRDialog.Portal>
              <TRDialog.Backdrop />
              <TRDialog.Viewport>
                <TRDialog.Popup
                  placement={
                    arg('placement', 'middle') as
                      | 'middle'
                      | 'top'
                      | 'bottom'
                      | 'start'
                      | 'end'
                  }
                >
                  <TRDialog.Title>
                    <span data-parity-part="dialogTitle">{copy.dialogTitle}</span>
                  </TRDialog.Title>
                  <TRDialog.Description>
                    <span data-parity-part="dialogDescription">
                      {copy.dialogDescription}
                    </span>
                  </TRDialog.Description>
                  <div className="tr-dialog-body">
                    <span data-parity-part="dialogBody">{copy.dialogBody}</span>
                  </div>
                  <div className="tr-dialog-action">
                    <TRDialog.Close render={<TRButton appearance="ghost" />}>
                      <span
                        data-parity-part="cancelLabel"
                        style={{
                          alignItems: 'center',
                          display: 'inline-flex',
                          height: 'var(--tinyrack-control-line-height-md)',
                          justifyContent: 'center',
                          width: 'var(--tinyrack-measure-xs)',
                        }}
                      >
                        {copy.dialogCancel}
                      </span>
                    </TRDialog.Close>
                    <TRDialog.Close render={<TRButton intent="primary" />}>
                      <span
                        data-parity-part="actionLabel"
                        style={{
                          alignItems: 'center',
                          display: 'inline-flex',
                          height: 'var(--tinyrack-control-line-height-md)',
                          justifyContent: 'center',
                          width: 'var(--tinyrack-measure-xs)',
                        }}
                      >
                        {copy.dialogAction}
                      </span>
                    </TRDialog.Close>
                  </div>
                </TRDialog.Popup>
              </TRDialog.Viewport>
            </TRDialog.Portal>
          </TRDialog.Root>
        );
      case 'alert-dialog':
        return (
          <TRAlertDialog.Root open={flag('open')}>
            <TRAlertDialog.Trigger
              disabled={flag('disabled')}
              render={
                <TRButton
                  intent="danger"
                  style={{ height: 32, whiteSpace: 'nowrap', width: 128 }}
                />
              }
            >
              {query.get('label') ??
                (locale === 'ko'
                  ? '랙 삭제'
                  : locale === 'ja'
                    ? 'ラックを削除'
                    : 'Delete rack')}
            </TRAlertDialog.Trigger>
            <TRAlertDialog.Portal>
              <TRAlertDialog.Backdrop />
              <TRAlertDialog.Viewport>
                <TRAlertDialog.Popup
                  style={{ width: 'var(--tinyrack-overlay-width-sm)' }}
                >
                  <TRAlertDialog.Title>
                    {locale === 'ko'
                      ? '랙을 삭제할까요?'
                      : locale === 'ja'
                        ? 'ラックを削除しますか？'
                        : 'Delete rack?'}
                  </TRAlertDialog.Title>
                  <TRAlertDialog.Description>
                    {locale === 'ko'
                      ? '이 작업은 되돌릴 수 없어요.'
                      : locale === 'ja'
                        ? 'この操作は取り消せません。'
                        : 'This action cannot be undone.'}
                  </TRAlertDialog.Description>
                  <div className="tr-alert-dialog-actions">
                    <TRAlertDialog.Close
                      render={
                        <TRButton
                          appearance="outline"
                          intent="neutral"
                          style={{ outline: 'none' }}
                        />
                      }
                    >
                      <span data-parity-part="alertDialogCancel">
                        {locale === 'ko'
                          ? '취소'
                          : locale === 'ja'
                            ? 'キャンセル'
                            : 'Cancel'}
                      </span>
                    </TRAlertDialog.Close>
                    <TRAlertDialog.Close
                      render={<TRButton intent="danger" style={{ outline: 'none' }} />}
                    >
                      <span data-parity-part="alertDialogAction">
                        {locale === 'ko'
                          ? '랙 삭제'
                          : locale === 'ja'
                            ? 'ラックを削除'
                            : 'Delete rack'}
                      </span>
                    </TRAlertDialog.Close>
                  </div>
                </TRAlertDialog.Popup>
              </TRAlertDialog.Viewport>
            </TRAlertDialog.Portal>
          </TRAlertDialog.Root>
        );
      case 'app-shell':
        return <ParityAppShell open={flag('open')} />;
      case 'autocomplete':
        return (
          <TRField.Root style={{ width: 320 }}>
            <TRField.Label>Region</TRField.Label>
            <TRAutocomplete.Root
              items={['Seoul', 'Tokyo', 'Virginia']}
              open={flag('open')}
            >
              <TRAutocomplete.InputGroup appearance={fieldAppearance}>
                <TRAutocomplete.Input
                  autoFocus={flag('open')}
                  placeholder="Search regions"
                />
                <TRAutocomplete.Trigger aria-label="Show regions">
                  <TRAutocomplete.Icon aria-hidden="true">
                    <ChevronDown />
                  </TRAutocomplete.Icon>
                </TRAutocomplete.Trigger>
              </TRAutocomplete.InputGroup>
              <TRAutocomplete.Portal>
                <TRAutocomplete.Positioner sideOffset={8}>
                  <TRAutocomplete.Popup>
                    <TRAutocomplete.List>
                      {(item: string) => (
                        <TRAutocomplete.Item key={item} value={item}>
                          <span data-parity-part={`autocomplete-${item}`}>{item}</span>
                        </TRAutocomplete.Item>
                      )}
                    </TRAutocomplete.List>
                  </TRAutocomplete.Popup>
                </TRAutocomplete.Positioner>
              </TRAutocomplete.Portal>
            </TRAutocomplete.Root>
          </TRField.Root>
        );
      case 'combobox':
        return (
          <TRField.Root style={{ width: 320 }}>
            <TRField.Label>Channel</TRField.Label>
            <TRCombobox.Root
              defaultValue="stable"
              items={['stable', 'beta']}
              open={flag('open')}
            >
              <TRCombobox.InputGroup appearance={fieldAppearance}>
                <TRCombobox.Input
                  autoFocus={flag('open')}
                  placeholder="Choose a channel"
                />
                <TRCombobox.Trigger aria-label="Show channels">
                  <TRCombobox.Icon aria-hidden="true">
                    <ChevronDown />
                  </TRCombobox.Icon>
                </TRCombobox.Trigger>
              </TRCombobox.InputGroup>
              <TRCombobox.Portal>
                <TRCombobox.Positioner sideOffset={8}>
                  <TRCombobox.Popup>
                    <TRCombobox.List>
                      <TRCombobox.Item value="stable">
                        <span data-parity-part="combobox-stable">Stable</span>
                      </TRCombobox.Item>
                      <TRCombobox.Item value="beta">
                        <span data-parity-part="combobox-beta">Beta</span>
                      </TRCombobox.Item>
                    </TRCombobox.List>
                  </TRCombobox.Popup>
                </TRCombobox.Positioner>
              </TRCombobox.Portal>
            </TRCombobox.Root>
          </TRField.Root>
        );
      case 'context-menu':
        return (
          <TRContextMenu.Root open={flag('open')}>
            <TRContextMenu.Trigger
              style={{
                alignItems: 'center',
                border: '1px solid var(--tinyrack-border)',
                borderRadius: 'var(--tinyrack-radius-md)',
                boxSizing: 'border-box',
                display: 'flex',
                height: 120,
                justifyContent: 'center',
                width: 240,
              }}
            >
              Long press or right-click
            </TRContextMenu.Trigger>
            <TRContextMenu.Portal>
              <TRContextMenu.Positioner
                anchor={() => ({
                  getBoundingClientRect: () =>
                    DOMRect.fromRect({ height: 0, width: 0, x: 240, y: 160 }),
                })}
              >
                <TRContextMenu.Popup>
                  <TRContextMenu.Item>Open</TRContextMenu.Item>
                  <TRContextMenu.Item>Duplicate</TRContextMenu.Item>
                  <TRContextMenu.Separator />
                  <TRContextMenu.Item>Delete</TRContextMenu.Item>
                </TRContextMenu.Popup>
              </TRContextMenu.Positioner>
            </TRContextMenu.Portal>
          </TRContextMenu.Root>
        );
      case 'drawer':
        return (
          <TRDrawer.Root
            open={flag('open')}
            swipeDirection={
              arg('swipeDirection', 'down') as 'down' | 'up' | 'left' | 'right'
            }
          >
            <TRDrawer.Trigger style={{ width: 128 }}>Open drawer</TRDrawer.Trigger>
            <TRDrawer.Portal>
              <TRDrawer.Backdrop />
              <TRDrawer.Viewport>
                <TRDrawer.Popup
                  style={{
                    height: ['down', 'up'].includes(arg('swipeDirection', 'down'))
                      ? 190
                      : undefined,
                    outline: 'none',
                  }}
                >
                  <TRDrawer.Content>
                    <TRDrawer.Title>Deploy settings</TRDrawer.Title>
                    <TRDrawer.Description>
                      Review the target before deploying.
                    </TRDrawer.Description>
                    <div
                      data-parity-part="drawerContent"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {'Channel: Stable\nRegion: Seoul'}
                    </div>
                  </TRDrawer.Content>
                </TRDrawer.Popup>
              </TRDrawer.Viewport>
            </TRDrawer.Portal>
          </TRDrawer.Root>
        );
      case 'file-tree':
        return (
          <TRFileTree aria-label="Files" style={{ width: 320 }}>
            <ul>
              <li>
                lib
                <ul>
                  <li>main.dart</li>
                  <li>theme.dart</li>
                </ul>
              </li>
              <li>pubspec.yaml</li>
            </ul>
          </TRFileTree>
        );
      case 'form':
        return (
          <TRForm style={{ display: 'grid', gap: 12, width: 320 }}>
            <TRField.Root>
              <TRField.Label>Rack name</TRField.Label>
              <TRInput name="rack" />
            </TRField.Root>
            <TRField.Root>
              <TRField.Label>Region</TRField.Label>
              <TRInput name="region" />
            </TRField.Root>
          </TRForm>
        );
      case 'menubar':
        return (
          <TRMenubar aria-label="Application">
            <TRMenu.Root open={flag('open')}>
              <TRMenu.Trigger>File</TRMenu.Trigger>
              <TRMenu.Portal>
                <TRMenu.Positioner>
                  <TRMenu.Popup>
                    <TRMenu.Item>New rack</TRMenu.Item>
                    <TRMenu.Item>Open</TRMenu.Item>
                  </TRMenu.Popup>
                </TRMenu.Positioner>
              </TRMenu.Portal>
            </TRMenu.Root>
            <TRMenu.Root>
              <TRMenu.Trigger>View</TRMenu.Trigger>
            </TRMenu.Root>
          </TRMenubar>
        );
      case 'navigation-menu':
        return (
          <TRNavigationMenu.Root
            className="parity-navigation-menu"
            value={flag('open') ? 'products' : null}
          >
            <TRNavigationMenu.List>
              <TRNavigationMenu.Item value="products">
                <TRNavigationMenu.Trigger>
                  <span style={{ display: 'inline-block', width: 66 }}>Products</span>
                  <TRNavigationMenu.Icon />
                </TRNavigationMenu.Trigger>
                <TRNavigationMenu.Content>
                  <span
                    data-parity-part="navigationContent"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {'Compute\nStorage\nNetworking'}
                  </span>
                </TRNavigationMenu.Content>
              </TRNavigationMenu.Item>
              <TRNavigationMenu.Item value="resources">
                <TRNavigationMenu.Trigger>
                  <span style={{ display: 'inline-block', width: 77 }}>Resources</span>
                  <TRNavigationMenu.Icon />
                </TRNavigationMenu.Trigger>
                <TRNavigationMenu.Content>
                  <span
                    data-parity-part="navigationContent"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {'Documentation\nExamples\nSupport'}
                  </span>
                </TRNavigationMenu.Content>
              </TRNavigationMenu.Item>
            </TRNavigationMenu.List>
            <TRNavigationMenu.Portal>
              <TRNavigationMenu.Positioner align="start">
                <TRNavigationMenu.Popup>
                  <TRNavigationMenu.Viewport />
                </TRNavigationMenu.Popup>
              </TRNavigationMenu.Positioner>
            </TRNavigationMenu.Portal>
          </TRNavigationMenu.Root>
        );
      case 'number-field':
        return (
          <TRField.Root style={{ width: 320 }}>
            <TRNumberField.Root
              appearance={fieldAppearance}
              defaultValue={12}
              max={100}
              min={0}
            >
              <TRNumberField.ScrubArea>
                <TRField.Label>Replicas</TRField.Label>
              </TRNumberField.ScrubArea>
              <TRNumberField.Group>
                <TRNumberField.Decrement>−</TRNumberField.Decrement>
                <TRNumberField.Input />
                <TRNumberField.Increment>+</TRNumberField.Increment>
              </TRNumberField.Group>
            </TRNumberField.Root>
          </TRField.Root>
        );
      case 'otp-field':
        return (
          <TRField.Root>
            <TRField.Label>Verification code</TRField.Label>
            <TROTPField.Root
              appearance={fieldAppearance}
              defaultValue="2048"
              length={4}
            >
              <TROTPField.Input />
              <TROTPField.Input />
              <TROTPField.Separator />
              <TROTPField.Input />
              <TROTPField.Input />
            </TROTPField.Root>
          </TRField.Root>
        );
      case 'popover':
        return (
          <TRPopover.Root open={flag('open')}>
            <TRPopover.Trigger render={<TRButton style={{ width: 128 }} />}>
              Rack details
            </TRPopover.Trigger>
            <TRPopover.Portal>
              <TRPopover.Positioner align="start" side="bottom" sideOffset={4}>
                <TRPopover.Popup
                  style={{
                    display: 'grid',
                    gap: 8,
                    outline: 'none',
                    padding: 16,
                    width: 165,
                  }}
                >
                  <TRPopover.Title
                    style={{
                      fontSize: 18,
                      fontWeight: 650,
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    Rack alpha
                  </TRPopover.Title>
                  <TRPopover.Description style={{ margin: 0 }}>
                    4 services are healthy.
                  </TRPopover.Description>
                  <div
                    data-parity-part="popoverContent"
                    style={{ fontSize: 16, lineHeight: '24px' }}
                  >
                    Latency 18 ms
                  </div>
                </TRPopover.Popup>
              </TRPopover.Positioner>
            </TRPopover.Portal>
          </TRPopover.Root>
        );
      case 'preview-card':
        return (
          <TRPreviewCard.Root open={flag('open')}>
            <TRPreviewCard.Trigger href="#rack">Rack alpha</TRPreviewCard.Trigger>
            <TRPreviewCard.Portal>
              <TRPreviewCard.Positioner>
                <TRPreviewCard.Popup
                  style={{ display: 'grid', padding: 16, width: 165 }}
                >
                  <strong style={{ fontSize: 16, lineHeight: '24px' }}>
                    Rack alpha
                  </strong>
                  <p style={{ fontSize: 16, lineHeight: '24px', margin: 0 }}>
                    4 services are healthy.
                  </p>
                </TRPreviewCard.Popup>
              </TRPreviewCard.Positioner>
            </TRPreviewCard.Portal>
          </TRPreviewCard.Root>
        );
      case 'scroll-area':
        return (
          <TRScrollArea.Root
            autoHide={flag('autoHide')}
            style={{ height: 160, width: 320 }}
          >
            <TRScrollArea.Viewport>
              <TRScrollArea.Content>
                {Array.from(
                  { length: 12 },
                  (_, index) => `Deployment ${index + 1}`,
                ).map((deployment) => (
                  <p key={deployment}>{deployment}</p>
                ))}
              </TRScrollArea.Content>
            </TRScrollArea.Viewport>
            <TRScrollArea.Scrollbar orientation="vertical">
              <TRScrollArea.Thumb />
            </TRScrollArea.Scrollbar>
          </TRScrollArea.Root>
        );
      case 'slider':
        return (
          <TRSlider.Root
            defaultValue={[40]}
            orientation={arg('orientation', 'horizontal') as 'horizontal' | 'vertical'}
            style={
              arg('orientation', 'horizontal') === 'vertical'
                ? { height: 240 }
                : { width: 320 }
            }
            uiSize={arg('uiSize', 'md') as 'md' | 'lg'}
          >
            <TRSlider.Label>Traffic</TRSlider.Label>
            <TRSlider.Value />
            <TRSlider.Control>
              <TRSlider.Track>
                <TRSlider.Indicator />
              </TRSlider.Track>
              <TRSlider.Thumb />
            </TRSlider.Control>
          </TRSlider.Root>
        );
      case 'toast':
        return (
          <TRToast.Provider>
            <ParityToast open={flag('open')} />
          </TRToast.Provider>
        );
      case 'toolbar':
        return (
          <TRToolbar.Root aria-label="Formatting">
            <TRToolbar.Button>B</TRToolbar.Button>
            <TRToolbar.Button>I</TRToolbar.Button>
            <TRToolbar.Separator />
            <TRToolbar.Input placeholder="Search" />
          </TRToolbar.Root>
        );
      case 'tooltip': {
        const tooltipMessage =
          locale === 'ko'
            ? '랙 새로고침'
            : locale === 'ja'
              ? 'ラックを更新'
              : 'Refresh rack';
        return (
          <TRTooltip.Provider delay={0}>
            <TRTooltip.Root open={flag('open')}>
              <TRTooltip.Trigger
                render={<TRIconButton aria-label={tooltipMessage}>↻</TRIconButton>}
              />
              <TRTooltip.Portal>
                <TRTooltip.Positioner side="top">
                  <TRTooltip.Popup style={{ width: 95 }}>
                    {tooltipMessage}
                  </TRTooltip.Popup>
                </TRTooltip.Positioner>
              </TRTooltip.Portal>
            </TRTooltip.Root>
          </TRTooltip.Provider>
        );
      }
      case 'tree-nav': {
        const treeCopy =
          locale === 'ko'
            ? ['시작하기', '설치', '고급', '플러그인', '테마']
            : locale === 'ja'
              ? ['はじめに', 'インストール', '高度な設定', 'プラグイン', 'テーマ']
              : ['GETTING STARTED', 'Install', 'ADVANCED', 'Plugins', 'Theming'];
        const selectedTreeLeaf = flag('selected') || !query.has('selected');
        return (
          <div style={{ width: 320 }}>
            <TRTreeNav
              items={[
                {
                  activeBranch: selectedTreeLeaf,
                  children: [
                    {
                      data: { key: 'leaf0', label: treeCopy[1] },
                      key: 'install',
                      type: 'leaf',
                    },
                    {
                      activeBranch: selectedTreeLeaf,
                      children: [
                        {
                          data: { key: 'leaf1', label: treeCopy[3] },
                          key: 'plugins',
                          type: 'leaf',
                        },
                        {
                          data: { key: 'leaf2', label: treeCopy[4] },
                          key: 'theming',
                          type: 'leaf',
                        },
                      ],
                      forceOpen: true,
                      key: 'advanced',
                      label: (
                        <span data-parity-part="treeNavGroup1Label">{treeCopy[2]}</span>
                      ),
                      type: 'group',
                    },
                  ],
                  forceOpen: !flag('collapsed'),
                  key: 'getting-started',
                  label: (
                    <span data-parity-part="treeNavGroup0Label">{treeCopy[0]}</span>
                  ),
                  type: 'group',
                },
              ]}
              renderLeaf={({ data }) => (
                <TRLink
                  className="parity-tree-nav-link"
                  data-active={
                    selectedTreeLeaf && data.key === 'leaf2' ? '' : undefined
                  }
                  href="#"
                  underline="none"
                >
                  <span
                    data-parity-part={`treeNav${data.key[0]?.toUpperCase()}${data.key.slice(1)}Label`}
                  >
                    {data.label}
                  </span>
                </TRLink>
              )}
            />
          </div>
        );
      }
      case 'link':
        return (
          <TRLink
            disabled={flag('disabled')}
            href="#docs"
            onClick={(event) => {
              event.preventDefault();
              activations += 1;
            }}
            underline={arg('underline', 'hover') as 'always' | 'hover' | 'none'}
            variant={arg('variant', 'default') as 'default' | 'muted' | 'danger'}
          >
            <span data-parity-part="label">{copy.docs}</span>
          </TRLink>
        );
      case 'radio':
        return (
          <span style={{ display: 'inline-flex' }}>
            <TRRadioGroup
              disabled={flag('disabled')}
              onValueChange={() => {
                activations += 1;
              }}
              value={flag('checked') ? 'on' : null}
            >
              <TRRadio.Root aria-label={copy.healthy} uiSize={uiSize} value="on">
                <TRRadio.Indicator />
              </TRRadio.Root>
            </TRRadioGroup>
          </span>
        );
      case 'switch':
        return (
          <span style={{ display: 'inline-flex' }}>
            <TRSwitch.Root
              aria-label={copy.healthy}
              checked={flag('checked')}
              disabled={flag('disabled')}
              onCheckedChange={() => {
                activations += 1;
              }}
            >
              <TRSwitch.Thumb />
            </TRSwitch.Root>
          </span>
        );
      case 'toggle':
        return (
          <TRToggle
            disabled={flag('disabled')}
            onPressedChange={() => {
              activations += 1;
            }}
            pressed={flag('pressed')}
          >
            <span data-parity-part="label">{copy.bold}</span>
          </TRToggle>
        );
      case 'field':
        return (
          <TRField.Root>
            <TRField.Label>{copy.field}</TRField.Label>
            <TRInput placeholder="Rack alpha" uiSize="md" />
            {arg('helper', 'none') === 'description' ? (
              <TRField.Description>{copy.fieldHint}</TRField.Description>
            ) : null}
          </TRField.Root>
        );
      case 'fieldset':
        return (
          <TRFieldset.Root disabled={flag('disabled')}>
            <TRFieldset.Legend>{copy.legend}</TRFieldset.Legend>
            <TRText variant="bodySm">{copy.status}</TRText>
          </TRFieldset.Root>
        );
      case 'meter': {
        const value = Number(arg('value', '75'));
        return (
          <TRMeter.Root value={value} variant={statusVariant}>
            <TRMeter.Label>{copy.meterLabel}</TRMeter.Label>
            <TRMeter.Value />
            <TRMeter.Track>
              <TRMeter.Indicator />
            </TRMeter.Track>
          </TRMeter.Root>
        );
      }
      case 'progress': {
        const progressValue = arg('value', '60');
        return (
          <TRProgress.Root
            uiSize={uiSize}
            value={progressValue === 'indeterminate' ? null : Number(progressValue)}
            variant={statusVariant}
          >
            <TRProgress.Track>
              <TRProgress.Indicator />
            </TRProgress.Track>
          </TRProgress.Root>
        );
      }
      case 'steps':
        return (
          <TRSteps.Root>
            <TRSteps.Item>{copy.stepOne}</TRSteps.Item>
            <TRSteps.Item>{copy.stepTwo}</TRSteps.Item>
          </TRSteps.Root>
        );
      case 'tabs':
        return (
          <TRTabs.Root defaultValue="overview" uiSize={uiSize}>
            <TRTabs.List aria-label={copy.status}>
              <TRTabs.Tab
                onClick={() => {
                  activations += 1;
                }}
                value="overview"
              >
                {copy.tabOverview}
              </TRTabs.Tab>
              <TRTabs.Tab value="settings">{copy.tabSettings}</TRTabs.Tab>
              <TRTabs.Indicator />
            </TRTabs.List>
            <TRTabs.Panel value="overview">{copy.description}</TRTabs.Panel>
          </TRTabs.Root>
        );
      case 'textarea':
        return (
          <TRTextarea
            appearance={fieldAppearance}
            aria-label={copy.field}
            defaultValue={arg('value', '')}
            disabled={flag('disabled')}
            placeholder={query.get('placeholder') ?? undefined}
            readOnly={flag('readOnly')}
            uiSize={uiSize}
          />
        );
      case 'toggle-group':
        return (
          <TRToggleGroup
            aria-label={copy.status}
            disabled={flag('disabled')}
            onValueChange={() => {
              activations += 1;
            }}
            value={['start']}
          >
            <TRToggle value="start">
              <span data-parity-part="start">{copy.toggleStart}</span>
            </TRToggle>
            <TRToggle value="end">
              <span data-parity-part="end">{copy.toggleEnd}</span>
            </TRToggle>
          </TRToggleGroup>
        );
      case 'checkbox-group':
        return (
          <TRCheckboxGroup
            aria-label={copy.status}
            disabled={flag('disabled')}
            onValueChange={() => {
              activations += 1;
            }}
            value={['terms']}
          >
            <TRCheckbox.Root aria-label="terms" data-parity-part="first" value="terms">
              <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
            </TRCheckbox.Root>
            <TRCheckbox.Root aria-label="newsletter" value="newsletter">
              <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
            </TRCheckbox.Root>
          </TRCheckboxGroup>
        );
      case 'radio-group':
        return (
          <span style={{ display: 'inline-flex' }}>
            <TRRadioGroup
              aria-label={copy.status}
              disabled={flag('disabled')}
              onValueChange={() => {
                activations += 1;
              }}
              value="start"
            >
              <TRRadio.Root aria-label="start" data-parity-part="first" value="start">
                <TRRadio.Indicator />
              </TRRadio.Root>
              <TRRadio.Root aria-label="end" value="end">
                <TRRadio.Indicator />
              </TRRadio.Root>
            </TRRadioGroup>
          </span>
        );
      case 'code-block':
        return <TRCodeBlock code="tinyrack deploy --env prod" />;
      case 'separator':
        return arg('orientation', 'horizontal') === 'vertical' ? (
          <div style={{ display: 'flex', height: 64, width: 32 }}>
            <TRSeparator orientation="vertical" />
          </div>
        ) : (
          <div style={{ height: 32, width: 320 }}>
            <TRSeparator />
          </div>
        );
      case 'skeleton':
        return (
          <TRSkeleton
            animate={flag('animate')}
            shape={arg('shape', 'text') as 'text' | 'rectangle' | 'circle'}
          />
        );
      case 'card':
        return (
          <TRCard.Root
            padding={arg('padding', 'md') as 'none' | 'md' | 'lg'}
            variant={arg('variant', 'default') as 'default' | 'outlined' | 'elevated'}
          >
            <TRCard.Header>
              <TRCard.Title>Rack alpha</TRCard.Title>
              <TRCard.Description>4 services are healthy.</TRCard.Description>
            </TRCard.Header>
            <TRCard.Content>
              <TRText variant="bodySm">Latency 18 ms</TRText>
            </TRCard.Content>
            <TRCard.Footer>
              <TRText color="muted" variant="bodySm">
                Updated now
              </TRText>
            </TRCard.Footer>
          </TRCard.Root>
        );
      case 'icon-button':
        return (
          <TRIconButton
            aria-label={copy.add}
            appearance={appearance}
            disabled={flag('disabled')}
            intent={intent}
            loading={flag('loading')}
            loadingLabel={arg('loadingLabel', copy.loading)}
            onClick={() => {
              activations += 1;
            }}
            uiSize={uiSize}
          >
            <span aria-hidden="true" className="parity-plus" />
          </TRIconButton>
        );
      case 'spinner':
        return (
          <TRSpinner
            label={copy.loading}
            uiSize={uiSize}
            variant={
              arg('variant', 'current') as 'current' | 'muted' | 'primary' | 'danger'
            }
          />
        );
      case 'text':
        return (
          <TRText
            {...(query.has('align')
              ? {
                  align: query.get('align') as 'start' | 'center' | 'end',
                }
              : {})}
            {...(query.has('color')
              ? {
                  color: query.get('color') as NonNullable<
                    React.ComponentProps<typeof TRText>['color']
                  >,
                }
              : {})}
            truncate={flag('truncate')}
            variant={
              arg('variant', 'headingMd') as NonNullable<
                React.ComponentProps<typeof TRText>['variant']
              >
            }
            {...(query.has('weight')
              ? {
                  weight: query.get('weight') as NonNullable<
                    React.ComponentProps<typeof TRText>['weight']
                  >,
                }
              : {})}
          >
            {copy.status}
          </TRText>
        );
      case 'text-field':
        return (
          <TRField.Root disabled={flag('disabled')} invalid={query.has('errorText')}>
            <TRField.Label>{copy.field}</TRField.Label>
            <TRInput
              appearance={fieldAppearance}
              aria-invalid={query.has('errorText') || undefined}
              disabled={flag('disabled')}
              placeholder={arg('placeholder', 'Rack alpha')}
              readOnly={flag('readOnly')}
              uiSize={uiSize}
              value={arg('value', '')}
            />
            {query.has('errorText') ? (
              <TRField.Error match>{query.get('errorText')}</TRField.Error>
            ) : null}
          </TRField.Root>
        );
      case 'pagination':
        return (
          <TRPagination
            boundaryCount={Number(arg('boundaryCount', '1'))}
            currentPage={Number(arg('currentPage', '3'))}
            hrefFor={(page) => `?page=${page}`}
            siblingCount={Number(arg('siblingCount', '1'))}
            totalPages={Number(arg('totalPages', '12'))}
          />
        );
      case 'table':
        return (
          <TRTable.Root
            density={
              arg('density', 'comfortable') as 'compact' | 'comfortable' | 'spacious'
            }
            striped={flag('striped')}
          >
            <TRTable.Caption>{copy.status}</TRTable.Caption>
            <TRTable.Header>
              <TRTable.Row>
                <TRTable.Head>Rack</TRTable.Head>
                <TRTable.Head>Status</TRTable.Head>
              </TRTable.Row>
            </TRTable.Header>
            <TRTable.Body>
              <TRTable.Row>
                <TRTable.Cell>Rack A</TRTable.Cell>
                <TRTable.Cell>Healthy</TRTable.Cell>
              </TRTable.Row>
              <TRTable.Row>
                <TRTable.Cell>Rack B</TRTable.Cell>
                <TRTable.Cell>Degraded</TRTable.Cell>
              </TRTable.Row>
            </TRTable.Body>
          </TRTable.Root>
        );
      case 'window-frame':
        return (
          <TRWindowFrame.Root
            style={{ width: 400 }}
            variant={arg('variant', 'macos') as 'macos' | 'browser'}
          >
            <TRWindowFrame.TitleBar>
              <TRWindowFrame.Controls />
              {arg('variant', 'macos') === 'browser' ? (
                <TRWindowFrame.AddressBar>
                  https://tinyrack.net
                </TRWindowFrame.AddressBar>
              ) : (
                <TRWindowFrame.Title>zsh — tinyrack</TRWindowFrame.Title>
              )}
            </TRWindowFrame.TitleBar>
            <TRWindowFrame.Body padding={arg('padding', 'md') as 'none' | 'md' | 'lg'}>
              <span style={{ whiteSpace: 'pre' }}>{'❯ tinyrack status\n✓ Ready'}</span>
            </TRWindowFrame.Body>
          </TRWindowFrame.Root>
        );
      default:
        return (
          <TRButton
            appearance={appearance}
            disabled={flag('disabled')}
            intent={intent}
            loading={flag('loading')}
            loadingLabel={arg('loadingLabel', copy.loading)}
            onClick={() => {
              activations += 1;
            }}
            uiSize={uiSize}
          >
            <span data-parity-part="label">
              {arg(
                'children',
                locale === 'ja' ? 'デプロイ' : locale === 'ko' ? '배포' : 'Deploy',
              )}
            </span>
          </TRButton>
        );
    }
  })();

  return <div data-parity-target={component}>{content}</div>;
}

const rootElement = document.getElementById('root');
if (rootElement === null) throw new Error('Missing visual parity fixture root.');
const root = createRoot(rootElement);
const fixtureKey = () =>
  query.get('motion') === 'true'
    ? `${component}:${locale}:${query.get('theme') ?? 'light'}:motion`
    : query.toString();
(
  window as Window & {
    __parityActivations?: () => number;
    __setParityQuery?: (search: string) => void;
  }
).__parityActivations = () => activations;
(
  window as Window & {
    __setParityQuery?: (search: string) => void;
  }
).__setParityQuery = (search) => {
  query = new URLSearchParams(search);
  activations = 0;
  component = query.get('component') ?? 'button';
  locale = query.get('locale') ?? 'en';
  copy =
    localizedCopy[
      (locale in localizedCopy ? locale : 'en') as keyof typeof localizedCopy
    ];
  document.documentElement.dataset['theme'] =
    query.get('theme') === 'dark' ? 'tinyrack-dark' : 'tinyrack-light';
  document.documentElement.dataset['parityMotion'] = String(
    query.get('motion') === 'true',
  );
  document.documentElement.lang = locale;
  flushSync(() => root.render(<Fixture key={fixtureKey()} />));
};
root.render(<Fixture key={fixtureKey()} />);
