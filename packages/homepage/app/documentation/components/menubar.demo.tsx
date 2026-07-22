import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const menubarCopy = {
  en: {
    app: 'Application menu',
    none: 'No command selected',
    file: 'File',
    edit: 'Edit',
    view: 'View',
    newRack: 'New',
    open: 'Open',
    rename: 'Rename',
    duplicate: 'Duplicate unavailable',
    status: 'Show status',
    shortcuts: 'Keyboard shortcuts',
    horizontal: 'Horizontal tools',
    vertical: 'Vertical tools',
    enabled: 'Enabled menubar',
    itemDisabled: 'One menu disabled',
    disabled: 'Disabled menubar',
    looping: 'Looping focus',
    bounded: 'Bounded focus',
  },
  ko: {
    app: '애플리케이션 메뉴',
    none: '명령을 선택하지 않았어요',
    file: '파일',
    edit: '편집해요',
    view: '보기를 바꿔요',
    newRack: '새 랙',
    open: '열어요',
    rename: '이름을 바꿔요',
    duplicate: '복제할 수 없어요',
    status: '상태를 보여요',
    shortcuts: '키보드 단축키',
    horizontal: '가로 도구예요',
    vertical: '세로 도구예요',
    enabled: '사용할 수 있는 메뉴 막대예요',
    itemDisabled: '한 메뉴를 사용할 수 없어요',
    disabled: '메뉴 막대를 사용할 수 없어요',
    looping: '초점이 순환해요',
    bounded: '초점이 경계에서 멈춰요',
  },
  ja: {
    app: 'アプリケーションメニュー',
    none: 'コマンドは未選択です',
    file: 'ファイル',
    edit: '編集',
    view: '表示',
    newRack: '新規',
    open: '開く',
    rename: '名前を変更',
    duplicate: '複製は利用できません',
    status: 'ステータスを表示',
    shortcuts: 'キーボードショートカット',
    horizontal: '横方向のツール',
    vertical: '縦方向のツール',
    enabled: '有効なメニューバー',
    itemDisabled: '1つのメニューが無効',
    disabled: '無効なメニューバー',
    looping: 'フォーカスを循環',
    bounded: '境界で停止',
  },
} as const;

function CompactMenubar({
  disabled = false,
  disabledItem = false,
  firstLabel,
  label,
  loopFocus = true,
  orientation = 'horizontal',
  secondLabel,
}: {
  disabled?: boolean;
  disabledItem?: boolean;
  firstLabel?: string;
  label: string;
  loopFocus?: boolean;
  orientation?: 'horizontal' | 'vertical';
  secondLabel?: string;
}) {
  const text = menubarCopy[useDemoLocale()];
  return (
    <section data-docs-example-item="">
      <strong>{label}</strong>
      <TRMenubar
        aria-label={label}
        disabled={disabled}
        loopFocus={loopFocus}
        orientation={orientation}
      >
        <TRMenu.Root disabled={disabledItem}>
          <TRMenu.Trigger>{firstLabel ?? text.file}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.Item>{text.newRack}</TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
        <TRMenu.Root>
          <TRMenu.Trigger>{secondLabel ?? text.edit}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.Item>{text.rename}</TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      </TRMenubar>
    </section>
  );
}

export function MenubarBasicPreview() {
  const text = menubarCopy[useDemoLocale()];
  return <CompactMenubar label={text.app} />;
}
export function MenubarStateComparison() {
  const text = menubarCopy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <CompactMenubar label={text.enabled} />
      <CompactMenubar
        disabledItem
        firstLabel={text.view}
        label={text.itemDisabled}
        secondLabel={text.shortcuts}
      />
      <CompactMenubar
        disabled
        firstLabel={text.disabled}
        label={text.disabled}
        secondLabel={text.duplicate}
      />
    </div>
  );
}
export function MenubarKeyboardComparison() {
  const text = menubarCopy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CompactMenubar label={text.looping} loopFocus />
      <CompactMenubar label={text.bounded} loopFocus={false} />
    </div>
  );
}

type StoryArgs = {
  disabled: boolean;
  loopFocus: boolean;
  orientation: 'horizontal' | 'vertical';
};

export function MenubarPreview({ disabled, loopFocus, orientation }: StoryArgs) {
  const text = menubarCopy[useDemoLocale()];
  const [result, setResult] = useState<string>(text.none);

  return (
    <div>
      <TRMenubar
        data-docs-example-item=""
        aria-label={text.app}
        disabled={disabled}
        loopFocus={loopFocus}
        orientation={orientation}
      >
        <TRMenu.Root>
          <TRMenu.Trigger>{text.file}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup data-menubar-popup="">
                <TRMenu.Item onClick={() => setResult(text.newRack)}>
                  {text.newRack}
                </TRMenu.Item>
                <TRMenu.Item onClick={() => setResult(text.open)}>
                  {text.open}
                </TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
        <TRMenu.Root>
          <TRMenu.Trigger>{text.edit}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup data-menubar-popup="">
                <TRMenu.Item onClick={() => setResult(text.rename)}>
                  {text.rename}
                </TRMenu.Item>
                <TRMenu.Item disabled>{text.duplicate}</TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
        <TRMenu.Root>
          <TRMenu.Trigger>{text.view}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup data-menubar-popup="">
                <TRMenu.CheckboxItem defaultChecked>
                  <TRMenu.CheckboxItemIndicator aria-hidden="true">
                    ✓
                  </TRMenu.CheckboxItemIndicator>
                  {text.status}
                </TRMenu.CheckboxItem>
                <TRMenu.LinkItem href="#shortcuts">{text.shortcuts}</TRMenu.LinkItem>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      </TRMenubar>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}
      </output>
    </div>
  );
}

export function MenubarConfigurationMatrix() {
  const text = menubarCopy[useDemoLocale()];
  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2">
      <section className="grid content-start gap-2" data-docs-example-item="">
        <strong>{text.vertical}</strong>
        <TRMenubar aria-label="Vertical tools" orientation="vertical">
          <TRMenu.Root>
            <TRMenu.Trigger>File</TRMenu.Trigger>
            <TRMenu.Portal>
              <TRMenu.Positioner>
                <TRMenu.Popup>
                  <TRMenu.Item>New</TRMenu.Item>
                </TRMenu.Popup>
              </TRMenu.Positioner>
            </TRMenu.Portal>
          </TRMenu.Root>
          <TRMenu.Root>
            <TRMenu.Trigger>Edit</TRMenu.Trigger>
            <TRMenu.Portal>
              <TRMenu.Positioner>
                <TRMenu.Popup>
                  <TRMenu.Item>Rename</TRMenu.Item>
                </TRMenu.Popup>
              </TRMenu.Positioner>
            </TRMenu.Portal>
          </TRMenu.Root>
        </TRMenubar>
      </section>
      <section className="grid content-start gap-2" data-docs-example-item="">
        <strong>{text.horizontal}</strong>
        <TRMenubar aria-label={text.horizontal} orientation="horizontal">
          <TRMenu.Root>
            <TRMenu.Trigger>File</TRMenu.Trigger>
            <TRMenu.Portal>
              <TRMenu.Positioner>
                <TRMenu.Popup>
                  <TRMenu.Item>New</TRMenu.Item>
                </TRMenu.Popup>
              </TRMenu.Positioner>
            </TRMenu.Portal>
          </TRMenu.Root>
        </TRMenubar>
      </section>
    </div>
  );
}

const menubarBasicSourceEn = `import '@tinyrack/ui/components/menubar.css';
import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';

export function BasicMenubar() {
  return <TRMenubar aria-label="Application menu">
    <TRMenu.Root>
      <TRMenu.Trigger>File</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Positioner>
          <TRMenu.Popup>
            <TRMenu.Item>New</TRMenu.Item>
            <TRMenu.Item>Open</TRMenu.Item>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
    </TRMenu.Root>
  </TRMenubar>;
}`;

const menubarApplicationSourceEn = `import { useState } from 'react';
import '@tinyrack/ui/components/menubar.css';
import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';

export function ApplicationMenu() {
  const [result, setResult] = useState('No command selected');

  return <div>
    <TRMenubar aria-label="Application menu" orientation="horizontal">
      <TRMenu.Root>
        <TRMenu.Trigger>File</TRMenu.Trigger>
        <TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup>
          <TRMenu.Item onClick={() => setResult('New rack selected')}>New</TRMenu.Item>
          <TRMenu.Item onClick={() => setResult('Open selected')}>Open</TRMenu.Item>
        </TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal>
      </TRMenu.Root>
      <TRMenu.Root>
        <TRMenu.Trigger>Edit</TRMenu.Trigger>
        <TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup>
          <TRMenu.Item onClick={() => setResult('Rename selected')}>Rename</TRMenu.Item>
          <TRMenu.Item disabled>Duplicate unavailable</TRMenu.Item>
        </TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal>
      </TRMenu.Root>
      <TRMenu.Root>
        <TRMenu.Trigger>View</TRMenu.Trigger>
        <TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup>
          <TRMenu.CheckboxItem defaultChecked>
            <TRMenu.CheckboxItemIndicator aria-hidden="true">✓</TRMenu.CheckboxItemIndicator>
            Show status
          </TRMenu.CheckboxItem>
          <TRMenu.LinkItem href="#shortcuts">Keyboard shortcuts</TRMenu.LinkItem>
        </TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal>
      </TRMenu.Root>
    </TRMenubar>
    <output aria-live="polite">{result}</output>
  </div>;
}`;

const menubarConfigurationsSourceEn = `import '@tinyrack/ui/components/menubar.css';
import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';

export function MenubarConfigurations() {
  return <div className="grid gap-6 sm:grid-cols-2">
    <TRMenubar aria-label="Vertical tools" orientation="vertical">
      <TRMenu.Root><TRMenu.Trigger>File</TRMenu.Trigger><TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup><TRMenu.Item>New</TRMenu.Item></TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal></TRMenu.Root>
      <TRMenu.Root><TRMenu.Trigger>Edit</TRMenu.Trigger><TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup><TRMenu.Item>Rename</TRMenu.Item></TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal></TRMenu.Root>
    </TRMenubar>
    <TRMenubar aria-label="Unavailable tools" disabled>
      <TRMenu.Root><TRMenu.Trigger>File</TRMenu.Trigger><TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup><TRMenu.Item>New</TRMenu.Item></TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal></TRMenu.Root>
    </TRMenubar>
  </div>;
}`;

const menubarBasicSourceKo = `import '@tinyrack/ui/components/menubar.css';
import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';
export function BasicMenubar() { return <TRMenubar aria-label="애플리케이션 메뉴예요"><TRMenu.Root><TRMenu.Trigger>파일을 열어요</TRMenu.Trigger><TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup><TRMenu.Item>새 랙을 만들어요</TRMenu.Item></TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal></TRMenu.Root></TRMenubar>; }`;
const menubarBasicSourceJa = `import '@tinyrack/ui/components/menubar.css';
import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';
export function BasicMenubar() { return <TRMenubar aria-label="アプリケーションメニュー"><TRMenu.Root><TRMenu.Trigger>ファイル</TRMenu.Trigger><TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup><TRMenu.Item>新規</TRMenu.Item></TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal></TRMenu.Root></TRMenubar>; }`;
const menubarApplicationSourceKo = menubarBasicSourceKo;
const menubarApplicationSourceJa = menubarBasicSourceJa;
const menubarConfigurationsSourceKo = `import '@tinyrack/ui/components/menubar.css';
import { TRMenubar } from '@tinyrack/ui/components/menubar';
export function Orientations() { return <><TRMenubar aria-label="가로로 탐색해요" orientation="horizontal" /><TRMenubar aria-label="세로로 탐색해요" orientation="vertical" /></>; }`;
const menubarConfigurationsSourceJa = `import '@tinyrack/ui/components/menubar.css';
import { TRMenubar } from '@tinyrack/ui/components/menubar';
export function Orientations() { return <><TRMenubar aria-label="横方向" orientation="horizontal" /><TRMenubar aria-label="縦方向" orientation="vertical" /></>; }`;

export const menubarBasicSource = {
  en: menubarBasicSourceEn,
  ja: menubarBasicSourceJa,
  ko: menubarBasicSourceKo,
} as const;
export const menubarApplicationSource = {
  en: menubarApplicationSourceEn,
  ja: menubarApplicationSourceJa,
  ko: menubarApplicationSourceKo,
} as const;
export const menubarConfigurationsSource = {
  en: menubarConfigurationsSourceEn,
  ja: menubarConfigurationsSourceJa,
  ko: menubarConfigurationsSourceKo,
} as const;

const meta = {
  title: 'Components/Menubar',
  excludeStories: /.*(?:Preview|Matrix|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    loopFocus: true,
    orientation: 'horizontal',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: (args) => <MenubarPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
