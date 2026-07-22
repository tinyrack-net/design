import {
  TRCopyButton,
  type TRCopyButtonStatus,
} from '@tinyrack/ui/components/copy-button';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: { status: 'Status', idle: 'Copy command', copied: 'Copied', unavailable: 'Copy unavailable', importIdle: 'Copy import', importCopied: 'Import copied', importUnavailable: 'Import unavailable', cleanup: 'Copy cleanup command' },
  ko: { status: '상태', idle: '명령어 복사', copied: '복사했어요', unavailable: '복사할 수 없어요', importIdle: '가져오기 구문 복사', importCopied: '가져오기 구문을 복사했어요', importUnavailable: '가져오기 구문을 복사할 수 없어요', cleanup: '정리 명령어 복사' },
  ja: { status: '状態', idle: 'コマンドをコピー', copied: 'コピーしました', unavailable: 'コピーできません', importIdle: 'インポート文をコピー', importCopied: 'インポート文をコピーしました', importUnavailable: 'インポート文をコピーできません', cleanup: 'クリーンアップコマンドをコピー' },
} as const;

type StoryArgs = {
  appearance: 'solid' | 'outline' | 'ghost';
  copiedLabel: string;
  disabled: boolean;
  idleLabel: string;
  loading: boolean;
  loadingLabel: string;
  resetDelay: number;
  uiSize: 'sm' | 'md' | 'lg';
  unavailableLabel: string;
  value: string;
  variant: 'secondary' | 'primary' | 'danger';
};

type CopyButtonPreviewProps = Pick<StoryArgs, 'value'> &
  Partial<Omit<StoryArgs, 'value'>> & {
    statusLabel?: string;
  };

export function CopyButtonPreview({
  statusLabel,
  value,
  ...args
}: CopyButtonPreviewProps) {
  const locale = useDemoLocale();
  const labels = copy[locale];
  const [status, setStatus] = useState<TRCopyButtonStatus>('idle');
  return (
    <div className="grid justify-items-start gap-2" data-docs-example-item="">
      <TRCopyButton copiedLabel={labels.copied} idleLabel={labels.idle} unavailableLabel={labels.unavailable} {...args} onStatusChange={setStatus} value={value} />
      <p>
        {statusLabel ?? labels.status}: {status}
      </p>
    </div>
  );
}

export function CopyButtonCombinationPreview() {
  const locale = useDemoLocale();
  const labels = copy[locale];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TRCopyButton
        data-docs-example-item=""
        appearance="solid"
        copiedLabel={labels.copied}
        idleLabel={labels.idle}
        resetDelay={750}
        uiSize="sm"
        value="solid-primary"
        variant="primary"
      />
      <TRCopyButton
        data-docs-example-item=""
        appearance="outline"
        copiedLabel={labels.importCopied}
        idleLabel={labels.importIdle}
        unavailableLabel={labels.importUnavailable}
        value="import { TRButton } from '@tinyrack/ui/components/button';"
        variant="secondary"
      />
      <TRCopyButton
        data-docs-example-item=""
        appearance="ghost"
        idleLabel={labels.cleanup}
        uiSize="lg"
        value="pnpm clean"
        variant="danger"
      />
    </div>
  );
}

const meta = {
  title: 'Components/CopyButton',
  component: TRCopyButton,
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'outline',
    copiedLabel: 'Copied',
    disabled: false,
    idleLabel: 'Copy command',
    loading: false,
    loadingLabel: 'Copying command',
    resetDelay: 2000,
    uiSize: 'md',
    unavailableLabel: 'Copy unavailable',
    value: 'pnpm add @tinyrack/ui',
    variant: 'secondary',
  },
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    copiedLabel: { control: 'text' },
    disabled: { control: 'boolean' },
    idleLabel: { control: 'text' },
    loading: { control: 'boolean' },
    loadingLabel: { control: 'text', when: (args) => args['loading'] === true },
    resetDelay: { control: { type: 'range', min: 500, max: 5000, step: 250 } },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    unavailableLabel: { control: 'text' },
    variant: { control: 'select', options: ['secondary', 'primary', 'danger'] },
  },
  render: (args) => <CopyButtonPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
