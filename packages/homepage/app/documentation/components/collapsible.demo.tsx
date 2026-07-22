import { TRCollapsible } from '@tinyrack/ui/components/collapsible';
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

type CollapsibleStoryArgs = {
  disabled: boolean;
  lifecycle: 'unmount' | 'keepMounted' | 'hiddenUntilFound';
  open: boolean;
  trigger: string;
};

type CollapsiblePreviewProps = CollapsibleStoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

export function CollapsiblePreview({
  disabled,
  lifecycle,
  onOpenChange,
  open,
  trigger,
}: CollapsiblePreviewProps) {
  const locale = useDemoLocale();
  const panel =
    locale === 'ko'
      ? '재시도와 제한 시간 컨트롤이에요.'
      : locale === 'ja'
        ? '再試行とタイムアウトのコントロールです。'
        : 'Retry and timeout controls.';
  return (
    <div className="grid w-full min-w-0 max-w-96 gap-3" data-docs-example-item="">
      <TRCollapsible.Root
        className="w-full"
        disabled={disabled}
        onOpenChange={onOpenChange}
        open={open}
      >
        <TRCollapsible.Trigger>{trigger}</TRCollapsible.Trigger>
        <TRCollapsible.Panel
          hiddenUntilFound={lifecycle === 'hiddenUntilFound'}
          keepMounted={lifecycle === 'keepMounted'}
        >
          {panel}
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Details: {open ? 'shown' : 'hidden'}
        {' · '}Lifecycle: {lifecycle}
        {' · '}DOM: {open || lifecycle !== 'unmount' ? 'mounted' : 'unmounted'}
      </output>
    </div>
  );
}

export function CollapsibleInteractiveExample() {
  const [open, setOpen] = useState(false);
  const locale = useDemoLocale();

  return (
    <CollapsiblePreview
      disabled={false}
      lifecycle="hiddenUntilFound"
      onOpenChange={setOpen}
      open={open}
      trigger={
        locale === 'ko'
          ? '고급 설정'
          : locale === 'ja'
            ? '詳細設定'
            : 'Advanced settings'
      }
    />
  );
}

export function CollapsibleLifecycleComparison() {
  return (
    <div className="grid gap-4">
      <TRCollapsible.Root data-docs-example-item="" defaultOpen>
        <TRCollapsible.Trigger>Open by default</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Visible detail.</TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root data-docs-example-item="">
        <TRCollapsible.Trigger>Persistent settings</TRCollapsible.Trigger>
        <TRCollapsible.Panel keepMounted>
          Mounted even while hidden.
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root data-docs-example-item="">
        <TRCollapsible.Trigger>Findable release notes</TRCollapsible.Trigger>
        <TRCollapsible.Panel hiddenUntilFound>
          Browser find can reveal this content.
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root data-docs-example-item="" disabled>
        <TRCollapsible.Trigger>Unavailable</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Cannot open.</TRCollapsible.Panel>
      </TRCollapsible.Root>
    </div>
  );
}

export const collapsibleBasicSource = `import { useState } from 'react';
import '@tinyrack/ui/components/collapsible.css';
import { TRCollapsible } from '@tinyrack/ui/components/collapsible';

export function CollapsibleExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-3">
      <TRCollapsible.Root onOpenChange={setOpen} open={open}>
        <TRCollapsible.Trigger>Advanced settings</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Retry and timeout controls.</TRCollapsible.Panel>
      </TRCollapsible.Root>
      <output aria-live="polite">
        Details: {open ? 'shown' : 'hidden'}
      </output>
    </div>
  );
}`;

export const collapsibleLifecycleSource = `import '@tinyrack/ui/components/collapsible.css';
import { TRCollapsible } from '@tinyrack/ui/components/collapsible';

export function CollapsibleLifecycleExample() {
  return (
    <div className="grid gap-4">
      <TRCollapsible.Root defaultOpen>
        <TRCollapsible.Trigger>Open by default</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Visible detail.</TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root>
        <TRCollapsible.Trigger>Persistent settings</TRCollapsible.Trigger>
        <TRCollapsible.Panel keepMounted>
          Mounted even while hidden.
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root>
        <TRCollapsible.Trigger>Findable release notes</TRCollapsible.Trigger>
        <TRCollapsible.Panel hiddenUntilFound>
          Browser find can reveal this content.
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRCollapsible.Root disabled>
        <TRCollapsible.Trigger>Unavailable</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Cannot open.</TRCollapsible.Panel>
      </TRCollapsible.Root>
    </div>
  );
}`;

const meta = {
  title: 'Components/Collapsible',
  excludeStories: /.*(?:Preview|Example|Comparison|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    lifecycle: 'unmount',
    open: false,
    trigger: 'Advanced settings',
  },
  localizedArgs: { ja: { trigger: '詳細設定' }, ko: { trigger: '고급 설정' } },
  argTypes: {
    disabled: { control: 'boolean' },
    lifecycle: {
      control: 'select',
      options: ['unmount', 'keepMounted', 'hiddenUntilFound'],
    },
    trigger: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<CollapsibleStoryArgs>();

    return (
      <CollapsiblePreview {...args} onOpenChange={(open) => updateArgs({ open })} />
    );
  },
} satisfies Meta<CollapsibleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
