import { ChevronDown } from 'lucide-react';
import type React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { TRAlert } from '../../../ui/src/components/alert/index.tsx';
import '../../../ui/src/components/alert/alert.css';
import { TRAvatar } from '../../../ui/src/components/avatar/index.tsx';
import '../../../ui/src/components/avatar/avatar.css';
import { TRBadge } from '../../../ui/src/components/badge/index.tsx';
import '../../../ui/src/components/badge/badge.css';
import { TRBreadcrumbs } from '../../../ui/src/components/breadcrumbs/index.tsx';
import '../../../ui/src/components/breadcrumbs/breadcrumbs.css';
import { TRCheckbox } from '../../../ui/src/components/checkbox/index.tsx';
import '../../../ui/src/components/checkbox/checkbox.css';
import { TRLink } from '../../../ui/src/components/link/index.tsx';
import '../../../ui/src/components/link/link.css';
import { TRRadio } from '../../../ui/src/components/radio/index.tsx';
import '../../../ui/src/components/radio/radio.css';
import { TRRadioGroup } from '../../../ui/src/components/radio-group/index.tsx';
import '../../../ui/src/components/radio-group/radio-group.css';
import { TRSwitch } from '../../../ui/src/components/switch/index.tsx';
import '../../../ui/src/components/switch/switch.css';
import { TRToggle } from '../../../ui/src/components/toggle/index.tsx';
import '../../../ui/src/components/toggle/toggle.css';
import { TRFieldset } from '../../../ui/src/components/fieldset/index.tsx';
import '../../../ui/src/components/fieldset/fieldset.css';
import { TRMeter } from '../../../ui/src/components/meter/index.tsx';
import '../../../ui/src/components/meter/meter.css';
import { TRProgress } from '../../../ui/src/components/progress/index.tsx';
import '../../../ui/src/components/progress/progress.css';
import { TRSteps } from '../../../ui/src/components/steps/index.tsx';
import '../../../ui/src/components/steps/steps.css';
import { TRTabs } from '../../../ui/src/components/tabs/index.tsx';
import '../../../ui/src/components/tabs/tabs.css';
import { TRTextarea } from '../../../ui/src/components/textarea/index.tsx';
import '../../../ui/src/components/textarea/textarea.css';
import { TRToggleGroup } from '../../../ui/src/components/toggle-group/index.tsx';
import '../../../ui/src/components/toggle-group/toggle-group.css';
import { TRCheckboxGroup } from '../../../ui/src/components/checkbox-group/index.tsx';
import '../../../ui/src/components/checkbox-group/checkbox-group.css';
import { TRAccordion } from '../../../ui/src/components/accordion/index.tsx';
import '../../../ui/src/components/accordion/accordion.css';
import { TRAnimatedNumber } from '../../../ui/src/components/animated-number/index.tsx';
import '../../../ui/src/components/animated-number/animated-number.css';
import { TRCollapsible } from '../../../ui/src/components/collapsible/index.tsx';
import '../../../ui/src/components/collapsible/collapsible.css';
import { TRCopyButton } from '../../../ui/src/components/copy-button/index.tsx';
import '../../../ui/src/components/copy-button/copy-button.css';
import { TRCode } from '../../../ui/src/components/code/index.tsx';
import '../../../ui/src/components/code/code.css';
import { TRCodeBlock } from '../../../ui/src/components/code-block/index.tsx';
import '../../../ui/src/components/code-block/code-block.css';
import { TRSeparator } from '../../../ui/src/components/separator/index.tsx';
import '../../../ui/src/components/separator/separator.css';
import { TRSkeleton } from '../../../ui/src/components/skeleton/index.tsx';
import '../../../ui/src/components/skeleton/skeleton.css';
import { TRButton } from '../../../ui/src/components/button/index.tsx';
import '../../../ui/src/components/button/button.css';
import { TRCard } from '../../../ui/src/components/card/index.tsx';
import '../../../ui/src/components/card/card.css';
import { TRField } from '../../../ui/src/components/field/index.tsx';
import '../../../ui/src/components/field/field.css';
import { TRIconButton } from '../../../ui/src/components/icon-button/index.tsx';
import '../../../ui/src/components/icon-button/icon-button.css';
import { TRInput } from '../../../ui/src/components/input/index.tsx';
import '../../../ui/src/components/input/input.css';
import { TRSpinner } from '../../../ui/src/components/spinner/index.tsx';
import '../../../ui/src/components/spinner/spinner.css';
import { TRText } from '../../../ui/src/components/text/index.tsx';
import '../../../ui/src/components/text/text.css';
import { TRMenu } from '../../../ui/src/components/menu/index.tsx';
import '../../../ui/src/components/menu/menu.css';
import { TRSelect } from '../../../ui/src/components/select/index.tsx';
import '../../../ui/src/components/select/select.css';
import { TRDialog } from '../../../ui/src/components/dialog/index.tsx';
import '../../../ui/src/components/dialog/dialog.css';
import '../../../ui/src/core/core.css';
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
  const uiSize = arg('uiSize', 'md') as 'sm' | 'md' | 'lg';
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
            value={['install']}
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
        return <TRAnimatedNumber value={12345} />;
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
            <TRCollapsible.Panel>{copy.description}</TRCollapsible.Panel>
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
            <TRSelect.Trigger uiSize={uiSize}>
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
      case 'meter':
        return (
          <TRMeter.Root value={75} variant={statusVariant}>
            <TRMeter.Label>{copy.meterLabel}</TRMeter.Label>
            <TRMeter.Value />
            <TRMeter.Track>
              <TRMeter.Indicator />
            </TRMeter.Track>
          </TRMeter.Root>
        );
      case 'progress':
        return (
          <TRProgress.Root uiSize={uiSize} value={60} variant={statusVariant}>
            <TRProgress.Track>
              <TRProgress.Indicator />
            </TRProgress.Track>
          </TRProgress.Root>
        );
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
            padding={arg('padding', 'md') as 'none' | 'sm' | 'md' | 'lg'}
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
  flushSync(() => root.render(<Fixture key={search} />));
};
root.render(<Fixture key={query.toString()} />);
