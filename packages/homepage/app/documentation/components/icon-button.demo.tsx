import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { RefreshCwIcon, SettingsIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: { settings: 'Open rack settings', refreshing: 'Refreshing rack status', refresh: 'Refresh rack status', remove: 'Delete rack', idle: 'No action yet.', opened: 'Rack settings opened.', activations: 'Activations' },
  ko: { settings: '랙 설정 열기', refreshing: '랙 상태 새로 고치는 중', refresh: '랙 상태 새로 고침', remove: '랙 삭제', idle: '아직 실행한 동작이 없어요.', opened: '랙 설정을 열었어요.', activations: '실행 횟수' },
  ja: { settings: 'ラック設定を開く', refreshing: 'ラックの状態を更新中', refresh: 'ラックの状態を更新', remove: 'ラックを削除', idle: 'まだ操作していません。', opened: 'ラック設定を開きました。', activations: '実行回数' },
} as const;

type StoryArgs = {
  appearance: 'solid' | 'outline' | 'ghost';
  disabled: boolean;
  label: string;
  loading: boolean;
  uiSize: 'sm' | 'md' | 'lg';
  variant: 'secondary' | 'primary' | 'danger';
};

export function IconButtonPreview({ label, ...args }: StoryArgs) {
  const locale = useDemoLocale();
  const [activations, setActivations] = useState(0);
  return (
    <div className="grid justify-items-center gap-2">
      <TRIconButton
        {...args}
        aria-label={label}
        loadingLabel={`${label} in progress`}
        onClick={() => setActivations((value) => value + 1)}
      >
        <SettingsIcon aria-hidden="true" />
      </TRIconButton>
      <output aria-live="polite">{copy[locale].activations}: {activations}</output>
    </div>
  );
}

export function IconButtonSettingsExample() {
  const locale = useDemoLocale();
  const labels = copy[locale];
  const [message, setMessage] = useState<string>(labels.idle);

  return (
    <div className="grid justify-items-start gap-3" data-docs-example-item="">
      <TRIconButton
        appearance="outline"
        aria-label={labels.settings}
        onClick={() => setMessage(labels.opened)}
      >
        <SettingsIcon aria-hidden="true" />
      </TRIconButton>
      <output aria-live="polite">{message}</output>
    </div>
  );
}

export function IconButtonStates() {
  const locale = useDemoLocale();
  const labels = copy[locale];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TRIconButton data-docs-example-item="" aria-label={labels.settings} variant="primary">
        <SettingsIcon aria-hidden="true" />
      </TRIconButton>
      <TRIconButton
        data-docs-example-item=""
        appearance="outline"
        aria-label={labels.refresh}
        loading
        loadingLabel={labels.refreshing}
      >
        <RefreshCwIcon aria-hidden="true" />
      </TRIconButton>
      <TRIconButton
        data-docs-example-item=""
        appearance="ghost"
        aria-label={labels.remove}
        disabled
        variant="danger"
      >
        <Trash2Icon aria-hidden="true" />
      </TRIconButton>
    </div>
  );
}

export function IconButtonAppearances() {
  const appearances = ['solid', 'outline', 'ghost'] as const;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {appearances.map((appearance) => <TRIconButton appearance={appearance} aria-label={`${appearance} settings`} key={appearance}><SettingsIcon aria-hidden="true" /></TRIconButton>)}
    </div>
  );
}

export function IconButtonVariants() {
  return <div className="flex flex-wrap items-center gap-3">{(['secondary', 'primary', 'danger'] as const).map((variant) => <TRIconButton aria-label={`${variant} action`} key={variant} variant={variant}><SettingsIcon aria-hidden="true" /></TRIconButton>)}</div>;
}

export function IconButtonSizes() {
  return <div className="flex flex-wrap items-center gap-3">{(['sm', 'md', 'lg'] as const).map((uiSize) => <TRIconButton aria-label={`${uiSize} settings`} key={uiSize} uiSize={uiSize}><SettingsIcon aria-hidden="true" /></TRIconButton>)}</div>;
}

export const iconButtonBasicSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/icon-button.css';
import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { SettingsIcon } from 'lucide-react';
import { useState } from 'react';

export function IconButtonSettingsExample() {
  const [message, setMessage] = useState('No action yet.');

  return (
    <div className="grid justify-items-start gap-3">
      <TRIconButton
        appearance="outline"
        aria-label="Open rack settings"
        onClick={() => setMessage('Rack settings opened.')}
      >
        <SettingsIcon aria-hidden="true" />
      </TRIconButton>
      <output aria-live="polite">{message}</output>
    </div>
  );
}`;

export const iconButtonStatesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/icon-button.css';
import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { RefreshCwIcon, SettingsIcon, Trash2Icon } from 'lucide-react';

export function IconButtonStates() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TRIconButton aria-label="Open rack settings" variant="primary">
        <SettingsIcon aria-hidden="true" />
      </TRIconButton>
      <TRIconButton
        appearance="outline"
        aria-label="Refresh rack status"
        loading
        loadingLabel="Refreshing rack status"
      >
        <RefreshCwIcon aria-hidden="true" />
      </TRIconButton>
      <TRIconButton
        appearance="ghost"
        aria-label="Delete rack"
        disabled
        variant="danger"
      >
        <Trash2Icon aria-hidden="true" />
      </TRIconButton>
    </div>
  );
}`;

export const iconButtonMatrixSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/icon-button.css';
import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { SettingsIcon } from 'lucide-react';

const appearances = ['solid', 'outline', 'ghost'] as const;
export function IconButtonAppearances() {
  return <div className="flex flex-wrap items-center gap-3">
    {appearances.map((appearance) => <TRIconButton appearance={appearance} aria-label={appearance + ' settings'} key={appearance}><SettingsIcon aria-hidden="true" /></TRIconButton>)}
  </div>;
}`;

export const iconButtonVariantsSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/icon-button.css';
import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { SettingsIcon } from 'lucide-react';

export function IconButtonVariants() {
  return <div className="flex flex-wrap items-center gap-3">
    {(['secondary', 'primary', 'danger'] as const).map((variant) => <TRIconButton aria-label={variant + ' action'} key={variant} variant={variant}><SettingsIcon aria-hidden="true" /></TRIconButton>)}
  </div>;
}`;

export const iconButtonSizesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/icon-button.css';
import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { SettingsIcon } from 'lucide-react';

export function IconButtonSizes() {
  return <div className="flex flex-wrap items-center gap-3">
    {(['sm', 'md', 'lg'] as const).map((uiSize) => <TRIconButton aria-label={uiSize + ' settings'} key={uiSize} uiSize={uiSize}><SettingsIcon aria-hidden="true" /></TRIconButton>)}
  </div>;
}`;

const meta = {
  title: 'Components/IconButton',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'outline',
    disabled: false,
    label: 'Settings',
    loading: false,
    uiSize: 'md',
    variant: 'secondary',
  },
  argTypes: {
    appearance: { options: ['solid', 'outline', 'ghost'], control: 'radio' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    loading: { control: 'boolean' },
    uiSize: { options: ['sm', 'md', 'lg'], control: 'select' },
    variant: { options: ['secondary', 'primary', 'danger'], control: 'radio' },
  },
  render: (args) => <IconButtonPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
