import { TRButton } from '@tinyrack/ui/components/button';
import {
  TRContextMenu,
  type TRContextMenuItemVariant,
} from '@tinyrack/ui/components/context-menu';
import { Check, ChevronRight, CircleDot, Server } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const contextCopy = {
  en: {
    hint: 'Right-click the rack row, or focus it and press Shift+F10.',
    inventory: 'Rack inventory',
    onlineCount: '3 online',
    online: 'Online',
    open: 'Open actions',
    more: 'More actions',
    details: 'Open details',
    copy: 'Copy address',
    restart: 'Restart',
    move: 'Move to',
    production: 'Production',
    staging: 'Staging',
    remove: 'Remove rack',
    enabled: 'Enabled command',
    disabled: 'Disabled command',
    link: 'Navigation link',
    normal: 'Default action',
    danger: 'Danger action',
    pointer: 'Pointer coordinates',
    anchor: 'Explicit anchor',
    keyboard: 'Keyboard target',
    fallback: 'Touch action button',
    canvasHint: 'Right-click the canvas to change how racks are displayed.',
    canvas: 'Rack canvas',
    view: 'View',
    labels: 'Show labels',
    density: 'Density',
    comfortable: 'Comfortable',
    compact: 'Compact',
    reset: 'Reset view',
    shown: 'Labels shown',
    hidden: 'Labels hidden',
  },
  ko: {
    hint: '랙 행을 오른쪽 클릭하거나 초점을 둔 뒤 Shift+F10을 누르세요.',
    inventory: '랙 목록이에요',
    onlineCount: '3개가 온라인이에요',
    online: '온라인이에요',
    open: '작업 메뉴를 열어요',
    more: '작업 더 보기',
    details: '세부 정보 열기',
    copy: '주소 복사',
    restart: '다시 시작',
    move: '이동해요',
    production: '프로덕션으로 이동해요',
    staging: '스테이징으로 이동해요',
    remove: '랙 제거',
    enabled: '실행할 수 있어요',
    disabled: '실행할 수 없어요',
    link: '이동 링크예요',
    normal: '기본 작업이에요',
    danger: '위험 작업이에요',
    pointer: '포인터 좌표를 써요',
    anchor: '명시한 anchor를 써요',
    keyboard: '키보드 대상이에요',
    fallback: '터치 작업 버튼이에요',
    canvasHint: '랙 표시 방법을 바꾸려면 캔버스를 오른쪽 클릭하세요.',
    canvas: '랙 캔버스예요',
    view: '보기를 바꿔요',
    labels: '레이블을 보여요',
    density: '밀도를 골라요',
    comfortable: '여유 있게 보여요',
    compact: '조밀하게 보여요',
    reset: '보기를 초기화해요',
    shown: '레이블을 보여요',
    hidden: '레이블을 숨겨요',
  },
  ja: {
    hint: 'ラック行を右クリックするか、フォーカスして Shift+F10 を押してください。',
    inventory: 'ラック一覧',
    onlineCount: '3 台がオンライン',
    online: 'オンライン',
    open: '操作メニューを開く',
    more: 'その他の操作',
    details: '詳細を開く',
    copy: 'アドレスをコピー',
    restart: '再起動',
    move: '移動先',
    production: '本番',
    staging: 'ステージング',
    remove: 'ラックを削除',
    enabled: '有効なコマンド',
    disabled: '無効なコマンド',
    link: 'ナビゲーションリンク',
    normal: '標準操作',
    danger: '危険な操作',
    pointer: 'ポインター座標',
    anchor: '明示的なアンカー',
    keyboard: 'キーボード対象',
    fallback: 'タッチ用ボタン',
    canvasHint: 'ラックの表示方法を変えるにはキャンバスを右クリックしてください。',
    canvas: 'ラックキャンバス',
    view: '表示',
    labels: 'ラベルを表示',
    density: '密度',
    comfortable: 'ゆったり',
    compact: 'コンパクト',
    reset: '表示をリセット',
    shown: 'ラベルを表示中',
    hidden: 'ラベルを非表示',
  },
} as const;

function ContextSpecimen({
  disabled = false,
  label,
  orientation = 'vertical',
  variant = 'default',
}: {
  disabled?: boolean;
  label: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: TRContextMenuItemVariant;
}) {
  return (
    <div className="rounded border p-3" data-docs-example-item="">
      <TRContextMenu.Root orientation={orientation}>
        <TRContextMenu.Trigger tabIndex={0}>{label}</TRContextMenu.Trigger>
        <TRContextMenu.Portal>
          <TRContextMenu.Positioner>
            <TRContextMenu.Popup>
              <TRContextMenu.Item disabled={disabled} variant={variant}>
                {label}
              </TRContextMenu.Item>
            </TRContextMenu.Popup>
          </TRContextMenu.Positioner>
        </TRContextMenu.Portal>
      </TRContextMenu.Root>
    </div>
  );
}

export function ContextMenuStateComparison() {
  const text = contextCopy[useDemoLocale()];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <ContextSpecimen label={text.enabled} />
      <ContextSpecimen disabled label={text.disabled} />
      <div data-docs-example-item="">
        <TRContextMenu.Root>
          <TRContextMenu.Trigger tabIndex={0}>{text.link}</TRContextMenu.Trigger>
          <TRContextMenu.Portal>
            <TRContextMenu.Positioner>
              <TRContextMenu.Popup>
                <TRContextMenu.LinkItem href="#rack-details">
                  {text.link}
                </TRContextMenu.LinkItem>
              </TRContextMenu.Popup>
            </TRContextMenu.Positioner>
          </TRContextMenu.Portal>
        </TRContextMenu.Root>
      </div>
    </div>
  );
}
export function ContextMenuVariantComparison() {
  const text = contextCopy[useDemoLocale()];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ContextSpecimen label={text.normal} />
      <ContextSpecimen label={text.danger} variant="danger" />
    </div>
  );
}
export function ContextMenuOpeningComparison() {
  const text = contextCopy[useDemoLocale()];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <ContextSpecimen label={text.pointer} />
      <ContextSpecimen label={text.keyboard} />
      <ContextSpecimen label={text.fallback} />
    </div>
  );
}
export function ContextMenuPositionComparison() {
  const text = contextCopy[useDemoLocale()];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ContextSpecimen label={text.pointer} />
      <ContextSpecimen label={text.anchor} />
    </div>
  );
}
export function ContextMenuOrientationComparison() {
  const text = contextCopy[useDemoLocale()];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ContextSpecimen label={text.view} orientation="vertical" />
      <ContextSpecimen label={text.density} orientation="horizontal" />
    </div>
  );
}

import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  label: string;
  open: boolean;
  disabledItem: boolean;
  variant: TRContextMenuItemVariant;
};

type ContextMenuPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

const rackAddress = '10.42.0.18';

export function ContextMenuPreview({
  label,
  open,
  disabledItem,
  variant,
  onOpenChange,
}: ContextMenuPreviewProps) {
  const locale = useDemoLocale();
  const text = contextCopy[locale];
  const targetLabel =
    locale === 'en'
      ? `${label}, online rack. Open context menu for actions.`
      : `${label}, ${text.open}`;
  const fallbackLabel =
    locale === 'en' ? `Open actions for ${label}` : `${label}, ${text.open}`;
  const triggerRef = useRef<HTMLDivElement>(null);
  const previousOpen = useRef(false);
  const [result, setResult] = useState('');
  const stateProps =
    onOpenChange === undefined
      ? { defaultOpen: open }
      : {
          onOpenChange(nextOpen: boolean) {
            previousOpen.current = nextOpen;
            onOpenChange(nextOpen);
          },
          open,
        };

  const openAtTrigger = useCallback((anchor?: HTMLElement) => {
    const trigger = triggerRef.current;
    const rect = (anchor ?? trigger)?.getBoundingClientRect();
    if (trigger === null || trigger === undefined || rect === undefined) return;

    trigger.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        button: 2,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      }),
    );
  }, []);

  useEffect(() => {
    if (open && !previousOpen.current) openAtTrigger();
    previousOpen.current = open;
  }, [open, openAtTrigger]);

  return (
    <div className="grid w-full max-w-xl gap-3" data-docs-example-item="">
      <p className="m-0 text-sm text-tinyrack-text-muted">{text.hint}</p>
      <div className="overflow-hidden rounded-tinyrack-lg border border-tinyrack-border bg-tinyrack-surface">
        <div className="flex items-center justify-between border-b border-tinyrack-border px-4 py-3">
          <span className="font-semibold">{text.inventory}</span>
          <span className="text-sm text-tinyrack-text-muted">{text.onlineCount}</span>
        </div>
        <div className="grid gap-2 p-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <TRContextMenu.Root {...stateProps}>
            <TRContextMenu.Trigger
              aria-label={targetLabel}
              className="grid h-auto min-w-0 w-full appearance-none grid-cols-[auto_minmax(0,1fr)_auto] items-center justify-start gap-3 whitespace-normal rounded-tinyrack-md border-0 bg-transparent p-3 text-left text-tinyrack-text hover:bg-tinyrack-surface-hover"
              ref={triggerRef}
              render={<TRButton appearance="ghost" type="button" />}
            >
              <Server aria-hidden="true" size="1.25em" />
              <span className="grid min-w-0 gap-1">
                <span className="truncate font-medium">{label}</span>
                <span className="truncate text-sm text-tinyrack-text-muted">
                  {rackAddress} · Seoul
                </span>
              </span>
              <span className="text-sm text-tinyrack-success">{text.online}</span>
            </TRContextMenu.Trigger>
            <TRButton
              appearance="outline"
              aria-label={fallbackLabel}
              onClick={(event) => openAtTrigger(event.currentTarget)}
              uiSize="sm"
              type="button"
            >
              {text.more}
            </TRButton>
            <TRContextMenu.Portal>
              <TRContextMenu.Backdrop />
              <TRContextMenu.Positioner>
                <TRContextMenu.Popup>
                  <TRContextMenu.Arrow />
                  <TRContextMenu.Group>
                    <TRContextMenu.GroupLabel>{label}</TRContextMenu.GroupLabel>
                    <TRContextMenu.LinkItem
                      href="#rack-details"
                      onClick={() => setResult(`${label}: ${text.details}`)}
                    >
                      {text.details}
                    </TRContextMenu.LinkItem>
                    <TRContextMenu.Item
                      onClick={() =>
                        setResult(
                          locale === 'en'
                            ? `${rackAddress} copied.`
                            : `${rackAddress}: ${text.copy}`,
                        )
                      }
                    >
                      {text.copy}
                    </TRContextMenu.Item>
                    <TRContextMenu.Item
                      disabled={disabledItem}
                      onClick={() =>
                        setResult(
                          locale === 'en'
                            ? `Restart requested for ${label}.`
                            : `${label}: ${text.restart}`,
                        )
                      }
                    >
                      {text.restart}
                    </TRContextMenu.Item>
                  </TRContextMenu.Group>
                  <TRContextMenu.Separator />
                  <TRContextMenu.SubmenuRoot>
                    <TRContextMenu.SubmenuTrigger>
                      {text.move}
                      <ChevronRight aria-hidden="true" size="1em" />
                    </TRContextMenu.SubmenuTrigger>
                    <TRContextMenu.Portal>
                      <TRContextMenu.Positioner>
                        <TRContextMenu.Popup>
                          <TRContextMenu.Arrow />
                          <TRContextMenu.Item
                            onClick={() => setResult(`${label}: ${text.production}`)}
                          >
                            {text.production}
                          </TRContextMenu.Item>
                          <TRContextMenu.Item
                            onClick={() => setResult(`${label}: ${text.staging}`)}
                          >
                            {text.staging}
                          </TRContextMenu.Item>
                        </TRContextMenu.Popup>
                      </TRContextMenu.Positioner>
                    </TRContextMenu.Portal>
                  </TRContextMenu.SubmenuRoot>
                  <TRContextMenu.Separator />
                  <TRContextMenu.Item
                    onClick={() => setResult(`${label}: ${text.remove}`)}
                    variant={variant}
                  >
                    {text.remove}
                  </TRContextMenu.Item>
                </TRContextMenu.Popup>
              </TRContextMenu.Positioner>
            </TRContextMenu.Portal>
          </TRContextMenu.Root>
        </div>
      </div>
      <output aria-live="polite" className="text-sm text-tinyrack-text-muted">
        {result}
      </output>
    </div>
  );
}

export function ContextMenuViewOptionsPreview() {
  const text = contextCopy[useDemoLocale()];
  const [showLabels, setShowLabels] = useState(true);
  const [density, setDensity] = useState('comfortable');

  return (
    <div className="grid w-full max-w-xl gap-3" data-docs-example-item="">
      <p className="m-0 text-sm text-tinyrack-text-muted">{text.canvasHint}</p>
      <TRContextMenu.Root>
        <TRContextMenu.Trigger
          aria-label={text.canvas}
          className="grid h-auto min-h-48 w-full appearance-none content-center justify-start gap-4 whitespace-normal rounded-tinyrack-lg border border-tinyrack-border bg-tinyrack-surface p-4 text-left text-tinyrack-text"
          render={<TRButton appearance="ghost" type="button" />}
        >
          <span className="text-sm font-medium text-tinyrack-text-muted">
            {text.canvas}
          </span>
          <span
            className={
              density === 'compact'
                ? 'grid grid-cols-3 gap-1'
                : 'grid grid-cols-3 gap-3'
            }
          >
            {['Alpha', 'Beta', 'Gamma'].map((rack) => (
              <span
                className="grid place-items-center gap-2 rounded-tinyrack-md border border-tinyrack-border bg-tinyrack-canvas p-3"
                key={rack}
              >
                <Server aria-hidden="true" size="1.25em" />
                <span className={showLabels ? 'text-sm' : 'sr-only'}>{rack}</span>
              </span>
            ))}
          </span>
        </TRContextMenu.Trigger>
        <TRContextMenu.Portal>
          <TRContextMenu.Backdrop />
          <TRContextMenu.Positioner>
            <TRContextMenu.Popup>
              <TRContextMenu.Arrow />
              <TRContextMenu.Group>
                <TRContextMenu.GroupLabel>{text.view}</TRContextMenu.GroupLabel>
                <TRContextMenu.CheckboxItem
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                >
                  <TRContextMenu.CheckboxItemIndicator aria-hidden="true">
                    <Check size="1em" />
                  </TRContextMenu.CheckboxItemIndicator>
                  {text.labels}
                </TRContextMenu.CheckboxItem>
              </TRContextMenu.Group>
              <TRContextMenu.Group>
                <TRContextMenu.GroupLabel>{text.density}</TRContextMenu.GroupLabel>
                <TRContextMenu.RadioGroup onValueChange={setDensity} value={density}>
                  <TRContextMenu.RadioItem value="comfortable">
                    <TRContextMenu.RadioItemIndicator aria-hidden="true">
                      <CircleDot size="1em" />
                    </TRContextMenu.RadioItemIndicator>
                    {text.comfortable}
                  </TRContextMenu.RadioItem>
                  <TRContextMenu.RadioItem value="compact">
                    <TRContextMenu.RadioItemIndicator aria-hidden="true">
                      <CircleDot size="1em" />
                    </TRContextMenu.RadioItemIndicator>
                    {text.compact}
                  </TRContextMenu.RadioItem>
                </TRContextMenu.RadioGroup>
              </TRContextMenu.Group>
              <TRContextMenu.Separator />
              <TRContextMenu.Item
                onClick={() => {
                  setShowLabels(true);
                  setDensity('comfortable');
                }}
              >
                {text.reset}
              </TRContextMenu.Item>
            </TRContextMenu.Popup>
          </TRContextMenu.Positioner>
        </TRContextMenu.Portal>
      </TRContextMenu.Root>
      <output aria-live="polite" className="text-sm text-tinyrack-text-muted">
        {showLabels ? text.shown : text.hidden} · {density}
      </output>
    </div>
  );
}

const contextMenuBasicSourceEn = `import '@tinyrack/ui/components/context-menu.css';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRContextMenu } from '@tinyrack/ui/components/context-menu';
import { ChevronRight, Server } from 'lucide-react';
import { useRef } from 'react';

export function RackRowActions() {
  const triggerRef = useRef<HTMLDivElement>(null);

  function openActions(anchor: HTMLElement) {
    const trigger = triggerRef.current;
    const rect = anchor.getBoundingClientRect();
    if (!trigger) return;

    trigger.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    }));
  }

  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
      <TRContextMenu.Root>
        <TRContextMenu.Trigger
          aria-label="Rack Alpha, online rack. Open context menu for actions."
          className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"
          ref={triggerRef}
          render={<TRButton appearance="ghost" type="button" />}
        >
          <Server aria-hidden="true" />
          <span>Rack Alpha</span>
          <span>10.42.0.18 · Seoul</span>
          <span>Online</span>
        </TRContextMenu.Trigger>
        <TRButton
          appearance="outline"
          aria-label="Open actions for Rack Alpha"
          onClick={(event) => openActions(event.currentTarget)}
          type="button"
          uiSize="sm"
        >
          More actions
        </TRButton>
        <TRContextMenu.Portal>
          <TRContextMenu.Backdrop />
          <TRContextMenu.Positioner>
            <TRContextMenu.Popup>
              <TRContextMenu.Arrow />
              <TRContextMenu.Group>
                <TRContextMenu.GroupLabel>Rack Alpha</TRContextMenu.GroupLabel>
                <TRContextMenu.LinkItem href="/racks/alpha">Open details</TRContextMenu.LinkItem>
                <TRContextMenu.Item>Copy address</TRContextMenu.Item>
                <TRContextMenu.Item>Restart</TRContextMenu.Item>
              </TRContextMenu.Group>
              <TRContextMenu.Separator />
              <TRContextMenu.SubmenuRoot>
                <TRContextMenu.SubmenuTrigger>
                  Move to <ChevronRight aria-hidden="true" />
                </TRContextMenu.SubmenuTrigger>
                <TRContextMenu.Portal>
                  <TRContextMenu.Positioner>
                    <TRContextMenu.Popup>
                      <TRContextMenu.Arrow />
                      <TRContextMenu.Item>Production</TRContextMenu.Item>
                      <TRContextMenu.Item>Staging</TRContextMenu.Item>
                    </TRContextMenu.Popup>
                  </TRContextMenu.Positioner>
                </TRContextMenu.Portal>
              </TRContextMenu.SubmenuRoot>
              <TRContextMenu.Separator />
              <TRContextMenu.Item variant="danger">Remove rack</TRContextMenu.Item>
            </TRContextMenu.Popup>
          </TRContextMenu.Positioner>
        </TRContextMenu.Portal>
      </TRContextMenu.Root>
    </div>
  );
}`;

const contextMenuSelectionSourceEn = `import '@tinyrack/ui/components/context-menu.css';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRContextMenu } from '@tinyrack/ui/components/context-menu';
import { Check, CircleDot } from 'lucide-react';
import { useState } from 'react';

export function CanvasViewOptions() {
  const [showLabels, setShowLabels] = useState(true);
  const [density, setDensity] = useState('comfortable');

  return (
    <TRContextMenu.Root>
      <TRContextMenu.Trigger
        aria-label="Rack canvas view options"
        render={<TRButton appearance="ghost" type="button" />}
      >
        Rack canvas
      </TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Backdrop />
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup>
            <TRContextMenu.Arrow />
            <TRContextMenu.Group>
              <TRContextMenu.GroupLabel>View</TRContextMenu.GroupLabel>
              <TRContextMenu.CheckboxItem
                checked={showLabels}
                onCheckedChange={setShowLabels}
              >
                <TRContextMenu.CheckboxItemIndicator aria-hidden="true">
                  <Check />
                </TRContextMenu.CheckboxItemIndicator>
                Show labels
              </TRContextMenu.CheckboxItem>
            </TRContextMenu.Group>
            <TRContextMenu.Group>
              <TRContextMenu.GroupLabel>Density</TRContextMenu.GroupLabel>
              <TRContextMenu.RadioGroup onValueChange={setDensity} value={density}>
                <TRContextMenu.RadioItem value="comfortable">
                  <TRContextMenu.RadioItemIndicator aria-hidden="true">
                    <CircleDot />
                  </TRContextMenu.RadioItemIndicator>
                  Comfortable
                </TRContextMenu.RadioItem>
                <TRContextMenu.RadioItem value="compact">
                  <TRContextMenu.RadioItemIndicator aria-hidden="true">
                    <CircleDot />
                  </TRContextMenu.RadioItemIndicator>
                  Compact
                </TRContextMenu.RadioItem>
              </TRContextMenu.RadioGroup>
            </TRContextMenu.Group>
            <TRContextMenu.Separator />
            <TRContextMenu.Item
              onClick={() => {
                setShowLabels(true);
                setDensity('comfortable');
              }}
            >
              Reset view
            </TRContextMenu.Item>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>
  );
}`;

const contextMenuBasicSourceKo = `import '@tinyrack/ui/components/context-menu.css';
import { TRContextMenu } from '@tinyrack/ui/components/context-menu';
export function RackActions() { return <TRContextMenu.Root><TRContextMenu.Trigger tabIndex={0}>랙 작업을 열어요</TRContextMenu.Trigger><TRContextMenu.Portal><TRContextMenu.Positioner><TRContextMenu.Popup><TRContextMenu.Item>주소를 복사해요</TRContextMenu.Item><TRContextMenu.Item variant="danger">랙을 제거해요</TRContextMenu.Item></TRContextMenu.Popup></TRContextMenu.Positioner></TRContextMenu.Portal></TRContextMenu.Root>; }`;
const contextMenuBasicSourceJa = `import '@tinyrack/ui/components/context-menu.css';
import { TRContextMenu } from '@tinyrack/ui/components/context-menu';
export function RackActions() { return <TRContextMenu.Root><TRContextMenu.Trigger tabIndex={0}>ラック操作</TRContextMenu.Trigger><TRContextMenu.Portal><TRContextMenu.Positioner><TRContextMenu.Popup><TRContextMenu.Item>アドレスをコピー</TRContextMenu.Item><TRContextMenu.Item variant="danger">ラックを削除</TRContextMenu.Item></TRContextMenu.Popup></TRContextMenu.Positioner></TRContextMenu.Portal></TRContextMenu.Root>; }`;
const contextMenuSelectionSourceKo = `import { TRContextMenu } from '@tinyrack/ui/components/context-menu';
export function ViewOptions() { return <TRContextMenu.CheckboxItem defaultChecked><TRContextMenu.CheckboxItemIndicator>✓</TRContextMenu.CheckboxItemIndicator>레이블을 보여요</TRContextMenu.CheckboxItem>; }`;
const contextMenuSelectionSourceJa = `import { TRContextMenu } from '@tinyrack/ui/components/context-menu';
export function ViewOptions() { return <TRContextMenu.CheckboxItem defaultChecked><TRContextMenu.CheckboxItemIndicator>✓</TRContextMenu.CheckboxItemIndicator>ラベルを表示</TRContextMenu.CheckboxItem>; }`;

export const contextMenuBasicSource = {
  en: contextMenuBasicSourceEn,
  ja: contextMenuBasicSourceJa,
  ko: contextMenuBasicSourceKo,
} as const;
export const contextMenuSelectionSource = {
  en: contextMenuSelectionSourceEn,
  ja: contextMenuSelectionSourceJa,
  ko: contextMenuSelectionSourceKo,
} as const;

const meta = {
  title: 'Components/Context Menu',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Rack Alpha',
    open: false,
    disabledItem: false,
    variant: 'default',
  },
  localizedArgs: {
    ja: { label: 'ラックアルファ' },
    ko: { label: '알파 랙이에요' },
  },
  argTypes: {
    label: { control: 'text' },
    disabledItem: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'danger'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <ContextMenuPreview {...args} onOpenChange={(open) => updateArgs({ open })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
