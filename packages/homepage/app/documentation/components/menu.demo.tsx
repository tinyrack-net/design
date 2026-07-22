import { TRMenu } from '@tinyrack/ui/components/menu';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const menuCopy = {
  en: {
    actions: 'Actions',
    restart: 'Restart',
    delete: 'Delete',
    enabled: 'Enabled command',
    disabled: 'Disabled command',
    link: 'Navigation link',
    checkbox: 'Show labels',
    radio: 'Compact density',
    sides: ['Top', 'Right', 'Bottom', 'Left'],
    aligns: ['Start', 'Center', 'End'],
    orientations: ['Vertical navigation', 'Horizontal navigation'],
    keyboard: 'Keyboard menu',
    first: 'First command',
    second: 'Second command',
    handle: 'Detached rack actions',
    detached: 'Rack Delta',
    inspect: 'Inspect rack',
    noneDetached: 'No detached action selected',
    inspected: 'inspected',
    none: 'No action selected',
    group: 'Rack actions',
    stop: 'Stop',
    compact: 'Compact view',
    comfortable: 'Comfortable density',
    details: 'Rack details',
    move: 'Move to',
    production: 'Production',
    staging: 'Staging',
  },
  ko: {
    actions: '작업 열기',
    restart: '다시 시작',
    delete: '삭제',
    enabled: '사용 가능한 명령',
    disabled: '사용할 수 없는 명령',
    link: '이동 링크',
    checkbox: '레이블 표시',
    radio: '조밀한 밀도',
    sides: ['위쪽', '오른쪽', '아래쪽', '왼쪽'],
    aligns: ['시작', '가운데', '끝'],
    orientations: ['세로 탐색', '가로 탐색'],
    keyboard: '키보드 메뉴',
    first: '첫 번째 명령',
    second: '두 번째 명령',
    handle: '분리된 랙 작업 열기',
    detached: '랙 델타',
    inspect: '랙 살펴보기',
    noneDetached: '분리된 작업을 선택하지 않았어요',
    inspected: '살펴봤어요',
    none: '작업을 선택하지 않았어요',
    group: '랙 작업',
    stop: '중지',
    compact: '조밀한 보기',
    comfortable: '여유 있는 밀도',
    details: '랙 세부 정보',
    move: '이동',
    production: '프로덕션',
    staging: '스테이징',
  },
  ja: {
    actions: '操作を開く',
    restart: '再起動',
    delete: '削除',
    enabled: '有効なコマンド',
    disabled: '無効なコマンド',
    link: 'ナビゲーションリンク',
    checkbox: 'ラベルを表示',
    radio: 'コンパクト表示',
    sides: ['上に開く', '右に開く', '下に開く', '左に開く'],
    aligns: ['開始位置', '中央', '終了位置'],
    orientations: ['縦方向の操作', '横方向の操作'],
    keyboard: 'キーボードメニュー',
    first: '最初のコマンド',
    second: '2 番目のコマンド',
    handle: '外部トリガーで開くラック操作',
    detached: 'ラック・デルタ',
    inspect: 'ラックを確認',
    noneDetached: '分離した操作は未選択です',
    inspected: 'を確認しました',
    none: '操作は未選択です',
    group: 'ラック操作',
    stop: '停止',
    compact: 'コンパクト表示',
    comfortable: 'ゆったり表示',
    details: 'ラック詳細',
    move: '移動先',
    production: '本番',
    staging: 'ステージング',
  },
} as const;

function MenuSpecimen({
  align = 'center',
  disabled = false,
  label,
  orientation = 'vertical',
  side = 'bottom',
}: {
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
  label: string;
  orientation?: 'horizontal' | 'vertical';
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  const text = menuCopy[useDemoLocale()];
  return (
    <div data-docs-example-item="">
      <TRMenu.Root orientation={orientation}>
        <TRMenu.Trigger>{label}</TRMenu.Trigger>
        <TRMenu.Portal>
          <TRMenu.Positioner align={align} side={side} sideOffset={8}>
            <TRMenu.Popup>
              <TRMenu.Item disabled={disabled}>{text.restart}</TRMenu.Item>
              <TRMenu.Item>{text.delete}</TRMenu.Item>
            </TRMenu.Popup>
          </TRMenu.Positioner>
        </TRMenu.Portal>
      </TRMenu.Root>
    </div>
  );
}

export function MenuBasicPreview() {
  const text = menuCopy[useDemoLocale()];
  return <MenuSpecimen label={text.actions} />;
}

export function MenuItemStateComparison() {
  const text = menuCopy[useDemoLocale()];
  return (
    <div className="flex flex-wrap gap-3">
      <MenuSpecimen label={text.enabled} />
      <MenuSpecimen disabled label={text.disabled} />
      <div data-docs-example-item="">
        <TRMenu.Root>
          <TRMenu.Trigger>{text.link}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.LinkItem href="#rack-details">{text.details}</TRMenu.LinkItem>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      </div>
    </div>
  );
}

export function MenuSelectionItemComparison() {
  const text = menuCopy[useDemoLocale()];
  return (
    <div className="flex flex-wrap gap-3">
      <div data-docs-example-item="">
        <TRMenu.Root>
          <TRMenu.Trigger>{text.checkbox}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.CheckboxItem defaultChecked>
                  <TRMenu.CheckboxItemIndicator>✓</TRMenu.CheckboxItemIndicator>
                  {text.checkbox}
                </TRMenu.CheckboxItem>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      </div>
      <div data-docs-example-item="">
        <TRMenu.Root>
          <TRMenu.Trigger>{text.radio}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.RadioGroup defaultValue="compact">
                  <TRMenu.RadioItem value="compact">
                    <TRMenu.RadioItemIndicator>●</TRMenu.RadioItemIndicator>
                    {text.radio}
                  </TRMenu.RadioItem>
                </TRMenu.RadioGroup>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      </div>
    </div>
  );
}

export function MenuSideComparison() {
  const text = menuCopy[useDemoLocale()];
  return (
    <div className="flex flex-wrap gap-3">
      {(['top', 'right', 'bottom', 'left'] as const).map((side, index) => (
        <MenuSpecimen key={side} label={text.sides[index] ?? side} side={side} />
      ))}
    </div>
  );
}
export function MenuAlignComparison() {
  const text = menuCopy[useDemoLocale()];
  return (
    <div className="flex flex-wrap gap-3">
      {(['start', 'center', 'end'] as const).map((align, index) => (
        <MenuSpecimen align={align} key={align} label={text.aligns[index] ?? align} />
      ))}
    </div>
  );
}
export function MenuOrientationComparison() {
  const text = menuCopy[useDemoLocale()];
  return (
    <div className="flex flex-wrap gap-3">
      <MenuSpecimen label={text.orientations[0]} orientation="vertical" />
      <MenuSpecimen label={text.orientations[1]} orientation="horizontal" />
    </div>
  );
}
export function MenuKeyboardPreview() {
  const text = menuCopy[useDemoLocale()];
  return (
    <div data-docs-example-item="">
      <TRMenu.Root loopFocus>
        <TRMenu.Trigger>{text.keyboard}</TRMenu.Trigger>
        <TRMenu.Portal>
          <TRMenu.Positioner>
            <TRMenu.Popup>
              <TRMenu.Item>{text.first}</TRMenu.Item>
              <TRMenu.Item>{text.second}</TRMenu.Item>
            </TRMenu.Popup>
          </TRMenu.Positioner>
        </TRMenu.Portal>
      </TRMenu.Root>
    </div>
  );
}

type MenuStoryArgs = { disabledItem: boolean; open: boolean };

type MenuExampleProps = Partial<MenuStoryArgs> & {
  onOpenChange?: (open: boolean) => void;
};

const menuHandle = TRMenu.createHandle<{ rack: string }>();

export function MenuHandleExample() {
  const text = menuCopy[useDemoLocale()];
  const [result, setResult] = useState<string>(text.noneDetached);
  return (
    <div className="grid gap-3" data-docs-example-item="">
      <TRMenu.Trigger handle={menuHandle} payload={{ rack: text.detached }}>
        {text.handle}
      </TRMenu.Trigger>
      <TRMenu.Root handle={menuHandle}>
        {({ payload }) => (
          <TRMenu.Portal>
            <TRMenu.Backdrop />
            <TRMenu.Positioner sideOffset={8}>
              <TRMenu.Popup>
                <TRMenu.Arrow />
                <TRMenu.Viewport>
                  <TRMenu.Group>
                    <TRMenu.GroupLabel>
                      {payload?.rack ?? text.detached}
                    </TRMenu.GroupLabel>
                    <TRMenu.Item
                      onClick={() =>
                        setResult(`${payload?.rack ?? text.detached} ${text.inspected}`)
                      }
                    >
                      {text.inspect}
                    </TRMenu.Item>
                  </TRMenu.Group>
                </TRMenu.Viewport>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        )}
      </TRMenu.Root>
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export function MenuExample({
  disabledItem = false,
  onOpenChange,
  open,
}: MenuExampleProps) {
  const text = menuCopy[useDemoLocale()];
  const [compact, setCompact] = useState(false);
  const [density, setDensity] = useState('comfortable');
  const [result, setResult] = useState<string>(text.none);

  return (
    <TRMenu.Root onOpenChange={onOpenChange} open={open}>
      <TRMenu.Trigger>{text.actions}</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Backdrop />
        <TRMenu.Positioner sideOffset={8}>
          <TRMenu.Popup>
            <TRMenu.Arrow />
            <TRMenu.Viewport>
              <TRMenu.Group>
                <TRMenu.GroupLabel>{text.group}</TRMenu.GroupLabel>
                <TRMenu.Item onClick={() => setResult(text.restart)}>
                  {text.restart}
                </TRMenu.Item>
                <TRMenu.Item
                  disabled={disabledItem}
                  onClick={() => setResult(text.stop)}
                >
                  {text.stop}
                </TRMenu.Item>
              </TRMenu.Group>
              <TRMenu.CheckboxItem checked={compact} onCheckedChange={setCompact}>
                <TRMenu.CheckboxItemIndicator aria-hidden="true">
                  ✓
                </TRMenu.CheckboxItemIndicator>
                {text.compact}
              </TRMenu.CheckboxItem>
              <TRMenu.RadioGroup onValueChange={setDensity} value={density}>
                <TRMenu.RadioItem value="comfortable">
                  <TRMenu.RadioItemIndicator aria-hidden="true">
                    ●
                  </TRMenu.RadioItemIndicator>
                  {text.comfortable}
                </TRMenu.RadioItem>
                <TRMenu.RadioItem value="compact">
                  <TRMenu.RadioItemIndicator aria-hidden="true">
                    ●
                  </TRMenu.RadioItemIndicator>
                  {text.compact}
                </TRMenu.RadioItem>
              </TRMenu.RadioGroup>
              <TRMenu.Separator />
              <TRMenu.LinkItem closeOnClick href="#rack-details">
                {text.details}
              </TRMenu.LinkItem>
              <TRMenu.SubmenuRoot>
                <TRMenu.SubmenuTrigger>{text.move}</TRMenu.SubmenuTrigger>
                <TRMenu.Portal>
                  <TRMenu.Positioner>
                    <TRMenu.Popup>
                      <TRMenu.Arrow />
                      <TRMenu.Item onClick={() => setResult(text.production)}>
                        {text.production}
                      </TRMenu.Item>
                      <TRMenu.Item onClick={() => setResult(text.staging)}>
                        {text.staging}
                      </TRMenu.Item>
                    </TRMenu.Popup>
                  </TRMenu.Positioner>
                </TRMenu.Portal>
              </TRMenu.SubmenuRoot>
            </TRMenu.Viewport>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}; compact {compact ? 'on' : 'off'}; density {density}
      </output>
    </TRMenu.Root>
  );
}

const meta = {
  title: 'Components/Menu',
  parameters: { layout: 'centered' },
  args: { disabledItem: false, open: false },
  argTypes: {
    disabledItem: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<MenuStoryArgs>();

    return <MenuExample {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<MenuStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
