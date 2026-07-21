import { TRCopyButton } from '@tinyrack/ui/components/copy-button';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  appearance: 'solid' | 'outline' | 'ghost';
  copiedLabel: string;
  idleLabel: string;
  resetDelay: number;
  size: 'sm' | 'md' | 'lg';
  unavailableLabel: string;
  value: string;
  variant: 'secondary' | 'primary' | 'danger';
};

export function CopyButtonPreview(args: StoryArgs) {
  const [status, setStatus] = useState('idle');
  return (
    <div className="grid justify-items-start gap-2">
      <TRCopyButton {...args} onStatusChange={setStatus} />
      <output aria-live="polite">Status: {status}</output>
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
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'outline',
    copiedLabel: 'Copied',
    idleLabel: 'Copy command',
    resetDelay: 2000,
    size: 'md',
    unavailableLabel: 'Copy unavailable',
    value: 'pnpm add @tinyrack/ui',
    variant: 'secondary',
  },
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    copiedLabel: { control: 'text' },
    idleLabel: { control: 'text' },
    resetDelay: { control: { type: 'range', min: 500, max: 5000, step: 250 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    unavailableLabel: { control: 'text' },
    value: { control: 'text' },
    variant: { control: 'select', options: ['secondary', 'primary', 'danger'] },
  },
  render: (args) => <CopyButtonPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
