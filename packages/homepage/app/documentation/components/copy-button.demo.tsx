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
  statusLabel = 'Status',
  value,
  ...args
}: CopyButtonPreviewProps) {
  const [status, setStatus] = useState<TRCopyButtonStatus>('idle');
  return (
    <div className="grid justify-items-start gap-2">
      <TRCopyButton {...args} onStatusChange={setStatus} value={value} />
      <p>
        {statusLabel}: {status}
      </p>
    </div>
  );
}

export function CopyButtonCombinationPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TRCopyButton
        appearance="solid"
        resetDelay={750}
        uiSize="sm"
        value="solid-primary"
        variant="primary"
      />
      <TRCopyButton
        appearance="outline"
        copiedLabel="Import copied"
        idleLabel="Copy import"
        unavailableLabel="Import unavailable"
        value="import { TRButton } from '@tinyrack/ui/components/button';"
        variant="secondary"
      />
      <TRCopyButton
        appearance="ghost"
        idleLabel="Copy cleanup command"
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
