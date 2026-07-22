import { TRPopover } from '@tinyrack/ui/components/popover';
import { TRSelect } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';
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

type PopoverStoryArgs = {
  align: 'start' | 'center' | 'end';
  alignOffset: number;
  description: string;
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
  sideOffset: number;
  title: string;
};

type PopoverExampleProps = Partial<PopoverStoryArgs> & {
  onOpenChange?: (open: boolean) => void;
};

export const popoverBasicSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';

export function PopoverExample() {
  return (
    <TRPopover.Root>
      <TRPopover.Trigger>Rack details</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner sideOffset={8}>
          <TRPopover.Popup>
            <TRPopover.Arrow />
            <TRPopover.Title>Rack A</TRPopover.Title>
            <TRPopover.Description>All nodes online.</TRPopover.Description>
            <TRPopover.Close>Close</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  );
}`;

export const popoverSidesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';

const sides = ['top', 'right', 'bottom', 'left'] as const;

export function PopoverSides() {
  return sides.map((side) => (
    <TRPopover.Root key={side}>
      <TRPopover.Trigger>{side}</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner side={side} sideOffset={8}>
          <TRPopover.Popup>
            <TRPopover.Arrow />
            <TRPopover.Title>{side}</TRPopover.Title>
            <TRPopover.Description>Anchored content.</TRPopover.Description>
            <TRPopover.Close>Close</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  ));
}`;

export const popoverAlignmentsSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';

{(['start', 'center', 'end'] as const).map((align) => (
  <TRPopover.Root key={align}>
    <TRPopover.Trigger>{align}</TRPopover.Trigger>
    <TRPopover.Portal><TRPopover.Positioner align={align} sideOffset={8}><TRPopover.Popup>
      <TRPopover.Title>{align}</TRPopover.Title><TRPopover.Description>Alignment preview.</TRPopover.Description><TRPopover.Close>Close</TRPopover.Close>
    </TRPopover.Popup></TRPopover.Positioner></TRPopover.Portal>
  </TRPopover.Root>
))}`;

export const popoverCollisionSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';
import { useState } from 'react';

export function ControlledPopover() {
  const [open, setOpen] = useState(false);

  return (
    <TRPopover.Root onOpenChange={setOpen} open={open}>
      <TRPopover.Trigger>Rack details</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner
          align="end"
          alignOffset={12}
          collisionAvoidance={{ align: 'flip', side: 'flip' }}
          side="right"
          sideOffset={16}
        >
          <TRPopover.Popup>
            <TRPopover.Arrow />
            <TRPopover.Title>Controlled edge popover</TRPopover.Title>
            <TRPopover.Description>Collision-aware content.</TRPopover.Description>
            <TRPopover.Close>Close</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  );
}`;

export const popoverHandleSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';

const popoverHandle = TRPopover.createHandle<{ rack: string }>();

export function DetachedPopover() {
  return (
    <>
      <TRPopover.Trigger handle={popoverHandle} payload={{ rack: 'Rack Delta' }}>
        Detached rack details
      </TRPopover.Trigger>
      <TRPopover.Root handle={popoverHandle}>
        {({ payload }) => (
          <TRPopover.Portal>
            <TRPopover.Positioner sideOffset={8}>
              <TRPopover.Popup>
                <TRPopover.Title>{payload?.rack}</TRPopover.Title>
                <TRPopover.Description>
                  Opened by an external trigger.
                </TRPopover.Description>
                <TRPopover.Close>Close</TRPopover.Close>
              </TRPopover.Popup>
            </TRPopover.Positioner>
          </TRPopover.Portal>
        )}
      </TRPopover.Root>
    </>
  );
}`;

const popoverSourceKo = (source: string) =>
  source
    .replaceAll('Rack details', '랙 세부 정보')
    .replaceAll('Rack A', '랙 A')
    .replaceAll('All nodes online.', '모든 노드가 온라인이에요.')
    .replaceAll('Anchored content.', '고정된 콘텐츠예요.')
    .replaceAll('Alignment preview.', '정렬 미리 보기예요.')
    .replaceAll('Controlled edge popover', '제어형 가장자리 popover예요')
    .replaceAll('Collision-aware content.', '충돌을 고려한 콘텐츠예요.')
    .replaceAll('Rack Delta', '랙 델타예요')
    .replaceAll('Detached rack details', '분리된 랙 세부 정보예요')
    .replaceAll('Opened by an external trigger.', '외부 트리거에서 열었어요.')
    .replaceAll('Close', '닫기');
const popoverSourceJa = (source: string) =>
  source
    .replaceAll('Rack details', 'ラックの詳細')
    .replaceAll('Rack A', 'ラック A')
    .replaceAll('All nodes online.', 'すべてのノードがオンラインです。')
    .replaceAll('Anchored content.', 'トリガーを基準に配置されたコンテンツです。')
    .replaceAll('Alignment preview.', '配置のプレビューです。')
    .replaceAll('Controlled edge popover', '画面端に配置した制御付きポップオーバー')
    .replaceAll('Collision-aware content.', '衝突を考慮したコンテンツです。')
    .replaceAll('Rack Delta', 'ラックデルタ')
    .replaceAll('Detached rack details', '外部トリガーで開くラックの詳細')
    .replaceAll('Opened by an external trigger.', '外部トリガーから開きました。')
    .replaceAll('Close', '閉じる');
export const popoverBasicSourceKo = popoverSourceKo(popoverBasicSource);
export const popoverSidesSourceKo = popoverSourceKo(popoverSidesSource);
export const popoverAlignmentsSourceKo = popoverSourceKo(popoverAlignmentsSource);
export const popoverCollisionSourceKo = popoverSourceKo(popoverCollisionSource);
export const popoverHandleSourceKo = popoverSourceKo(popoverHandleSource);
export const popoverBasicSourceJa = popoverSourceJa(popoverBasicSource);
export const popoverSidesSourceJa = popoverSourceJa(popoverSidesSource);
export const popoverAlignmentsSourceJa = popoverSourceJa(popoverAlignmentsSource);
export const popoverCollisionSourceJa = popoverSourceJa(popoverCollisionSource);
export const popoverHandleSourceJa = popoverSourceJa(popoverHandleSource);

export function PopoverExample({
  align = 'center',
  alignOffset = 0,
  description = 'All nodes online.',
  open = false,
  side = 'bottom',
  sideOffset = 8,
  title = 'Rack A',
  onOpenChange,
}: PopoverExampleProps) {
  const locale = useDemoLocale();
  const copy = {
    en: {
      close: 'Close',
      dashboard: 'Dashboard theme',
      dark: 'Dark',
      description: 'All nodes online.',
      details: 'Rack details',
      light: 'Light',
      system: 'System',
      theme: 'Theme',
      title: 'Rack A',
    },
    ko: {
      close: '닫기',
      dashboard: '대시보드 테마예요',
      dark: '어두운 테마예요',
      description: '모든 노드가 온라인이에요.',
      details: '랙 세부 정보',
      light: '밝은 테마예요',
      system: '시스템 테마예요',
      theme: '테마예요',
      title: '랙 A',
    },
    ja: {
      close: '閉じる',
      dashboard: 'ダッシュボードテーマ',
      dark: 'ダーク',
      description: 'すべてのノードがオンラインです。',
      details: 'ラックの詳細',
      light: 'ライト',
      system: 'システム',
      theme: 'テーマ',
      title: 'ラック A',
    },
  }[locale];
  const displayDescription =
    description === 'All nodes online.' ? copy.description : description;
  const displayTitle = title === 'Rack A' ? copy.title : title;
  const [theme, setTheme] = useState('system');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <div data-docs-example-item="">
      <TRPopover.Root {...stateProps}>
        <TRPopover.Trigger>{copy.details}</TRPopover.Trigger>
        <TRPopover.Portal>
          <TRPopover.Positioner
            align={align}
            alignOffset={alignOffset}
            collisionAvoidance={{ align: 'flip', side: 'flip' }}
            side={side}
            sideOffset={sideOffset}
          >
            <TRPopover.Popup>
              <TRPopover.Arrow />
              <TRPopover.Title>{displayTitle}</TRPopover.Title>
              <TRPopover.Description>{displayDescription}</TRPopover.Description>
              <TRSelect.Root
                items={{ system: copy.system, light: copy.light, dark: copy.dark }}
                onValueChange={(value) =>
                  setTheme((value as string | null) ?? 'system')
                }
                value={theme}
              >
                <TRSelect.Label>{copy.dashboard}</TRSelect.Label>
                <TRSelect.Trigger aria-label={copy.dashboard}>
                  <TRSelect.Value />
                  <TRSelect.Icon aria-hidden="true">
                    <ChevronDown />
                  </TRSelect.Icon>
                </TRSelect.Trigger>
                <TRSelect.Portal>
                  <TRSelect.Positioner>
                    <TRSelect.Popup>
                      <TRSelect.List>
                        <TRSelect.Item value="system">
                          <TRSelect.ItemText>{copy.system}</TRSelect.ItemText>
                        </TRSelect.Item>
                        <TRSelect.Item value="light">
                          <TRSelect.ItemText>{copy.light}</TRSelect.ItemText>
                        </TRSelect.Item>
                        <TRSelect.Item value="dark">
                          <TRSelect.ItemText>{copy.dark}</TRSelect.ItemText>
                        </TRSelect.Item>
                      </TRSelect.List>
                    </TRSelect.Popup>
                  </TRSelect.Positioner>
                </TRSelect.Portal>
              </TRSelect.Root>
              <output aria-live="polite">
                {copy.theme}: {theme}
              </output>
              <TRPopover.Close>{copy.close}</TRPopover.Close>
            </TRPopover.Popup>
          </TRPopover.Positioner>
        </TRPopover.Portal>
      </TRPopover.Root>
    </div>
  );
}

export function PopoverControlledLifecycle() {
  const locale = useDemoLocale();
  const copy = {
    en: [
      'Collision handling keeps this long surface inside the viewport.',
      'Controlled edge popover',
      'TRPopover is ',
      'open',
      'closed',
    ],
    ko: [
      '충돌 처리가 긴 표면을 viewport 안에 유지해요.',
      '제어형 가장자리 popover예요',
      'TRPopover가 ',
      '열려 있어요',
      '닫혀 있어요',
    ],
    ja: [
      '衝突回避により、縦長のポップオーバーをビューポート内に収めます。',
      '画面端に配置した制御付きポップオーバー',
      'TRPopover は ',
      '開いています',
      '閉じています',
    ],
  }[locale];
  const [open, setOpen] = useState(false);
  return (
    <div className="grid w-full justify-items-end gap-3">
      <PopoverExample
        align="end"
        alignOffset={12}
        description={copy[0] ?? ''}
        onOpenChange={setOpen}
        open={open}
        side="right"
        sideOffset={16}
        title={copy[1] ?? ''}
      />
      <output aria-live="polite">
        {copy[2]}
        {open ? copy[3] : copy[4]}
      </output>
    </div>
  );
}

const popoverHandle = TRPopover.createHandle<{ rack: string }>();

export function PopoverHandleExample() {
  const locale = useDemoLocale();
  const copy = {
    en: [
      'Rack Delta',
      'Detached rack details',
      'Opened by an external trigger.',
      'Close',
    ],
    ko: [
      '랙 델타예요',
      '분리된 랙 세부 정보예요',
      '외부 트리거에서 열었어요.',
      '닫으세요',
    ],
    ja: [
      'ラックデルタ',
      '外部トリガーで開くラックの詳細',
      '外部トリガーから開きました。',
      '閉じる',
    ],
  }[locale];
  return (
    <div className="grid justify-items-start gap-3" data-docs-example-item="">
      <TRPopover.Trigger handle={popoverHandle} payload={{ rack: copy[0] }}>
        {copy[1]}
      </TRPopover.Trigger>
      <TRPopover.Root handle={popoverHandle}>
        {({ payload }) => (
          <TRPopover.Portal>
            <TRPopover.Positioner sideOffset={8}>
              <TRPopover.Popup>
                <TRPopover.Title>{payload?.rack}</TRPopover.Title>
                <TRPopover.Description>{copy[2]}</TRPopover.Description>
                <TRPopover.Close>{copy[3]}</TRPopover.Close>
              </TRPopover.Popup>
            </TRPopover.Positioner>
          </TRPopover.Portal>
        )}
      </TRPopover.Root>
    </div>
  );
}

export function PopoverAlignments() {
  return (
    <div className="flex flex-wrap gap-3" data-docs-example-item-count={3}>
      {(['start', 'center', 'end'] as const).map((align) => (
        <PopoverExample align={align} key={align} title={align} />
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/Popover',
  excludeStories: /.*(?:Example|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    align: 'center',
    alignOffset: 0,
    description: 'All nodes online.',
    open: false,
    side: 'bottom',
    sideOffset: 8,
    title: 'Rack A',
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    alignOffset: { control: { type: 'range', min: -24, max: 24, step: 2 } },
    description: { control: 'text' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    sideOffset: { control: { type: 'range', min: 0, max: 32, step: 2 } },
    title: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<PopoverStoryArgs>();

    return <PopoverExample {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<PopoverStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
