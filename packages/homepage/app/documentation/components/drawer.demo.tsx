import { TRDrawer } from '@tinyrack/ui/components/drawer';
import { TRInput } from '@tinyrack/ui/components/input';
import { TRSelect } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';
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
  activeSnapPoint: 'compact' | 'medium' | 'full';
  label: string;
  open: boolean;
  swipeDirection: 'down' | 'up' | 'left' | 'right';
};

type DrawerPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
  onSnapPointChange?: (snapPoint: StoryArgs['activeSnapPoint']) => void;
};

const drawerHandle = TRDrawer.createHandle<{ title: string }>();

export const drawerBasicSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';

export function SettingsDrawer() {
  return (
    <TRDrawer.Root>
      <TRDrawer.Trigger>Open settings</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Rack settings</TRDrawer.Title>
              <TRDrawer.Description>Update deployment preferences.</TRDrawer.Description>
              <TRDrawer.Close>Close</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>
  );
}`;

export const drawerSnapPointsSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';

export function SnapPointDrawer() {
  return (
    <TRDrawer.Root defaultSnapPoint={0.35} snapPoints={[0.35, 0.7, 1]}>
      <TRDrawer.Trigger>Open snap drawer</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Rack settings</TRDrawer.Title>
              <TRDrawer.Description>Drag between three snap points.</TRDrawer.Description>
              <TRDrawer.Close>Close</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>
  );
}`;

export const drawerDirectionsSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';

export function DirectionalDrawer() {
  return (['down', 'up', 'left', 'right'] as const).map((swipeDirection) => (
    <TRDrawer.Root key={swipeDirection} swipeDirection={swipeDirection}>
      <TRDrawer.Trigger>Open {swipeDirection} drawer</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Side drawer</TRDrawer.Title>
              <TRDrawer.Close>Close</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>
  ));
}`;

export const drawerProviderHandleSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';

const drawerHandle = TRDrawer.createHandle<{ title: string }>();

export function DetachedDrawer() {
  return (
    <TRDrawer.Provider>
      <TRDrawer.IndentBackground />
      <TRDrawer.Indent>
        <TRDrawer.Trigger handle={drawerHandle} payload={{ title: 'Rack actions' }}>
          Open detached drawer
        </TRDrawer.Trigger>
      </TRDrawer.Indent>
      <TRDrawer.Root handle={drawerHandle}>
        {({ payload }) => (
          <TRDrawer.Portal>
            <TRDrawer.Backdrop />
            <TRDrawer.Viewport>
              <TRDrawer.Popup>
                <TRDrawer.Content>
                  <TRDrawer.Title>{payload?.title}</TRDrawer.Title>
                  <TRDrawer.Close>Close</TRDrawer.Close>
                </TRDrawer.Content>
              </TRDrawer.Popup>
            </TRDrawer.Viewport>
          </TRDrawer.Portal>
        )}
      </TRDrawer.Root>
    </TRDrawer.Provider>
  );
}`;

export const drawerVirtualKeyboardSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';
import { TRInput } from '@tinyrack/ui/components/input';

export function KeyboardAwareDrawer() {
  return (
    <TRDrawer.Root>
      <TRDrawer.Trigger>Edit rack</TRDrawer.Trigger>
      <TRDrawer.VirtualKeyboardProvider>
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup>
              <TRDrawer.Content>
                <TRDrawer.Title>Edit rack</TRDrawer.Title>
                <label htmlFor="rack-name">Rack name</label>
                <TRInput id="rack-name" name="rackName" />
                <TRDrawer.Close>Save</TRDrawer.Close>
              </TRDrawer.Content>
            </TRDrawer.Popup>
          </TRDrawer.Viewport>
        </TRDrawer.Portal>
      </TRDrawer.VirtualKeyboardProvider>
    </TRDrawer.Root>
  );
}`;

const drawerSourceKo = (source: string) =>
  source
    .replaceAll('Open settings', '설정 열기')
    .replaceAll('Rack settings', '랙 설정')
    .replaceAll('Update deployment preferences.', '배포 환경 설정을 변경하세요.')
    .replaceAll('Open snap drawer', 'Snap drawer를 여세요')
    .replaceAll('Drag between three snap points.', '세 snap point 사이를 drag해요.')
    .replaceAll('Side drawer', '측면 drawer예요')
    .replaceAll('Rack actions', '랙 작업이에요')
    .replaceAll('Open detached drawer', '분리된 drawer를 여세요')
    .replaceAll('Edit rack', '랙을 편집하세요')
    .replaceAll('Rack name', '랙 이름')
    .replaceAll('Close', '닫기')
    .replaceAll('Save', '저장');
const drawerSourceJa = (source: string) =>
  source
    .replaceAll('Open settings', '設定を開く')
    .replaceAll('Rack settings', 'ラック設定')
    .replaceAll('Update deployment preferences.', 'デプロイ設定を更新します。')
    .replaceAll('Open snap drawer', 'Snap drawer を開く')
    .replaceAll(
      'Drag between three snap points.',
      '3 つの snap point 間を drag します。',
    )
    .replaceAll('Side drawer', 'サイド drawer')
    .replaceAll('Rack actions', 'ラック操作')
    .replaceAll('Open detached drawer', '分離した drawer を開く')
    .replaceAll('Edit rack', 'ラックを編集')
    .replaceAll('Rack name', 'ラック名')
    .replaceAll('Close', '閉じる')
    .replaceAll('Save', '保存');
export const drawerBasicSourceKo = drawerSourceKo(drawerBasicSource);
export const drawerSnapPointsSourceKo = drawerSourceKo(drawerSnapPointsSource);
export const drawerDirectionsSourceKo = drawerSourceKo(drawerDirectionsSource);
export const drawerProviderHandleSourceKo = drawerSourceKo(drawerProviderHandleSource);
export const drawerVirtualKeyboardSourceKo = drawerSourceKo(
  drawerVirtualKeyboardSource,
);
export const drawerBasicSourceJa = drawerSourceJa(drawerBasicSource);
export const drawerSnapPointsSourceJa = drawerSourceJa(drawerSnapPointsSource);
export const drawerDirectionsSourceJa = drawerSourceJa(drawerDirectionsSource);
export const drawerProviderHandleSourceJa = drawerSourceJa(drawerProviderHandleSource);
export const drawerVirtualKeyboardSourceJa = drawerSourceJa(
  drawerVirtualKeyboardSource,
);

export function DrawerProviderHandlePreview() {
  const locale = useDemoLocale();
  const copy = {
    en: [
      'Provider-coordinated page surface',
      'Detached rack actions',
      'Open detached drawer',
      'The trigger and drawer share an imperative handle.',
      'Close',
    ],
    ko: [
      'Provider가 조정하는 페이지 표면이에요',
      '분리된 랙 작업이에요',
      '분리된 drawer를 여세요',
      '트리거와 drawer가 imperative handle을 공유해요.',
      '닫으세요',
    ],
    ja: [
      'Provider が調整するページ表面',
      '外部トリガーで開くラック操作',
      '分離した drawer を開く',
      'トリガーと drawer が imperative handle を共有します。',
      '閉じる',
    ],
  }[locale];
  return (
    <TRDrawer.Provider>
      <div
        className="relative min-h-48 w-full overflow-hidden rounded-md"
        data-docs-example-item=""
      >
        <TRDrawer.IndentBackground />
        <TRDrawer.Indent>
          <div className="grid min-h-48 content-center gap-3 rounded-md border border-tinyrack p-4">
            <span>{copy[0]}</span>
            <TRDrawer.Trigger handle={drawerHandle} payload={{ title: copy[1] }}>
              {copy[2]}
            </TRDrawer.Trigger>
          </div>
        </TRDrawer.Indent>
        <TRDrawer.Root handle={drawerHandle} swipeDirection="down">
          {({ payload }) => (
            <>
              <TRDrawer.SwipeArea />
              <TRDrawer.Portal>
                <TRDrawer.Backdrop />
                <TRDrawer.Viewport>
                  <TRDrawer.Popup>
                    <TRDrawer.Content>
                      <TRDrawer.Title>{payload?.title ?? copy[1]}</TRDrawer.Title>
                      <TRDrawer.Description>{copy[3]}</TRDrawer.Description>
                      <TRDrawer.Close>{copy[4]}</TRDrawer.Close>
                    </TRDrawer.Content>
                  </TRDrawer.Popup>
                </TRDrawer.Viewport>
              </TRDrawer.Portal>
            </>
          )}
        </TRDrawer.Root>
      </div>
    </TRDrawer.Provider>
  );
}

export function DrawerPreview({
  label,
  open,
  onOpenChange,
  activeSnapPoint,
  onSnapPointChange,
  swipeDirection,
}: DrawerPreviewProps) {
  const locale = useDemoLocale();
  const copy = {
    en: {
      back: 'Back',
      close: 'Close',
      confirm: 'Confirm environment',
      description: 'Update deployment preferences.',
      environment: 'Environment',
      nested: 'Nested drawers indent their parent surface.',
      openNested: 'Open nested confirmation',
      production: 'Production',
      staging: 'Staging',
      title: 'Rack settings',
    },
    ko: {
      back: '돌아가세요',
      close: '닫으세요',
      confirm: '환경을 확인하세요',
      description: '배포 환경 설정을 변경하세요.',
      environment: '환경이에요',
      nested: '중첩 drawer는 상위 표면을 들여 써요.',
      openNested: '중첩 확인을 여세요',
      production: '프로덕션이에요',
      staging: '스테이징이에요',
      title: '랙 설정이에요',
    },
    ja: {
      back: '戻る',
      close: '閉じる',
      confirm: '環境を確認',
      description: 'デプロイ設定を更新します。',
      environment: '環境',
      nested: 'ネストした drawer は親の表面をインデントします。',
      openNested: 'ネストした確認を開く',
      production: '本番',
      staging: 'ステージング',
      title: 'ラック設定',
    },
  }[locale];
  const snapPointValues = { compact: 0.35, medium: 0.7, full: 1 } as const;
  const snapPoint = snapPointValues[activeSnapPoint];
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };
  const snapStateProps =
    onSnapPointChange === undefined
      ? { defaultSnapPoint: snapPoint }
      : {
          onSnapPointChange: (nextSnapPoint: number | string | null) => {
            const nextEntry = Object.entries(snapPointValues).find(
              ([, value]) => value === nextSnapPoint,
            );
            onSnapPointChange(
              (nextEntry?.[0] as StoryArgs['activeSnapPoint'] | undefined) ?? 'full',
            );
          },
          snapPoint,
        };

  return (
    <div data-docs-example-item="">
      <TRDrawer.Root
        {...stateProps}
        {...snapStateProps}
        snapPoints={Object.values(snapPointValues)}
        swipeDirection={swipeDirection}
      >
        <TRDrawer.Trigger>{label}</TRDrawer.Trigger>
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup>
              <TRDrawer.Content>
                <TRDrawer.Title>{copy.title}</TRDrawer.Title>
                <TRDrawer.Description>{copy.description}</TRDrawer.Description>
                <TRSelect.Root
                  defaultValue="production"
                  items={{ production: copy.production, staging: copy.staging }}
                >
                  <TRSelect.Label>{copy.environment}</TRSelect.Label>
                  <TRSelect.Trigger aria-label={copy.environment}>
                    <TRSelect.Value />
                    <TRSelect.Icon aria-hidden="true">
                      <ChevronDown />
                    </TRSelect.Icon>
                  </TRSelect.Trigger>
                  <TRSelect.Portal>
                    <TRSelect.Positioner>
                      <TRSelect.Popup>
                        <TRSelect.List>
                          <TRSelect.Item value="production">
                            <TRSelect.ItemText>{copy.production}</TRSelect.ItemText>
                          </TRSelect.Item>
                          <TRSelect.Item value="staging">
                            <TRSelect.ItemText>{copy.staging}</TRSelect.ItemText>
                          </TRSelect.Item>
                        </TRSelect.List>
                      </TRSelect.Popup>
                    </TRSelect.Positioner>
                  </TRSelect.Portal>
                </TRSelect.Root>
                <TRDrawer.Root>
                  <TRDrawer.Trigger>{copy.openNested}</TRDrawer.Trigger>
                  <TRDrawer.Portal>
                    <TRDrawer.Backdrop />
                    <TRDrawer.Viewport>
                      <TRDrawer.Popup>
                        <TRDrawer.Content>
                          <TRDrawer.Title>{copy.confirm}</TRDrawer.Title>
                          <TRDrawer.Description>{copy.nested}</TRDrawer.Description>
                          <TRDrawer.Close>{copy.back}</TRDrawer.Close>
                        </TRDrawer.Content>
                      </TRDrawer.Popup>
                    </TRDrawer.Viewport>
                  </TRDrawer.Portal>
                </TRDrawer.Root>
                <TRDrawer.Close>{copy.close}</TRDrawer.Close>
              </TRDrawer.Content>
            </TRDrawer.Popup>
          </TRDrawer.Viewport>
        </TRDrawer.Portal>
      </TRDrawer.Root>
    </div>
  );
}

export function DrawerDirectionPreview() {
  const locale = useDemoLocale();
  const label = {
    en: 'Open {direction} drawer',
    ko: '{direction} 방향 drawer를 여세요',
    ja: '{direction} 方向の drawer を開く',
  }[locale];
  return (
    <div className="grid gap-4 sm:grid-cols-2" data-docs-example-item-count={4}>
      {(['down', 'up', 'left', 'right'] as const).map((direction) => (
        <DrawerPreview
          activeSnapPoint="full"
          key={direction}
          label={label.replace('{direction}', direction)}
          open={false}
          swipeDirection={direction}
        />
      ))}
    </div>
  );
}

export function DrawerVirtualKeyboardPreview() {
  const locale = useDemoLocale();
  const copy = {
    en: ['Edit rack', 'Rack name', 'Save'],
    ko: ['랙을 편집하세요', '랙 이름이에요', '저장하세요'],
    ja: ['ラックを編集', 'ラック名', '保存'],
  }[locale];
  return (
    <div data-docs-example-item="">
      <TRDrawer.Root swipeDirection="down">
        <TRDrawer.Trigger>{copy[0]}</TRDrawer.Trigger>
        <TRDrawer.VirtualKeyboardProvider>
          <TRDrawer.Portal>
            <TRDrawer.Backdrop />
            <TRDrawer.Viewport>
              <TRDrawer.Popup>
                <TRDrawer.Content>
                  <TRDrawer.Title>{copy[0]}</TRDrawer.Title>
                  <label className="grid gap-2" htmlFor="drawer-rack-name">
                    {copy[1]}
                  </label>
                  <TRInput
                    className="border border-tinyrack p-2"
                    defaultValue="rack-alpha"
                    id="drawer-rack-name"
                  />
                  <TRDrawer.Close>{copy[2]}</TRDrawer.Close>
                </TRDrawer.Content>
              </TRDrawer.Popup>
            </TRDrawer.Viewport>
          </TRDrawer.Portal>
        </TRDrawer.VirtualKeyboardProvider>
      </TRDrawer.Root>
    </div>
  );
}

const meta = {
  title: 'Components/Drawer',
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    activeSnapPoint: 'full',
    label: 'Open settings',
    open: false,
    swipeDirection: 'down',
  },
  argTypes: {
    label: { control: 'text' },
    swipeDirection: {
      control: 'select',
      options: ['down', 'up', 'left', 'right'],
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <DrawerPreview
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
        onSnapPointChange={(activeSnapPoint) => updateArgs({ activeSnapPoint })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
