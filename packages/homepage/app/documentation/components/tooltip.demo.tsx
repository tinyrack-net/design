import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { TRTooltip } from '@tinyrack/ui/components/tooltip';
import { Info } from 'lucide-react';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type TooltipStoryArgs = {
  align: 'start' | 'center' | 'end';
  content: string;
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
  trigger: string;
};

type TooltipExampleProps = Partial<TooltipStoryArgs> & {
  closeDelay?: number;
  delay?: number;
  onOpenChange?: (open: boolean) => void;
  triggerMode?: 'text' | 'icon';
};

export function TooltipExample({
  align = 'center',
  closeDelay = 0,
  content = 'Rack temperature: 24°C',
  delay = 400,
  open = false,
  side = 'top',
  trigger = 'Hover for details',
  triggerMode = 'text',
  onOpenChange,
}: TooltipExampleProps) {
  const locale = useDemoLocale();
  const visibleContent = content === 'Rack temperature: 24°C' ? (locale === 'ko' ? '랙 온도: 24°C' : locale === 'ja' ? 'ラック温度: 24°C' : content) : content;
  const visibleTrigger = trigger === 'Hover for details' ? (locale === 'ko' ? '세부 정보 보기' : locale === 'ja' ? '詳細を表示' : trigger) : trigger;
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <div data-docs-example-item=""><TRTooltip.Provider closeDelay={closeDelay} delay={delay}>
      <TRTooltip.Root {...stateProps}>
        {triggerMode === 'icon' ? (
          <TRTooltip.Trigger
            render={
              <TRIconButton aria-label={visibleTrigger}>
                <Info aria-hidden="true" />
              </TRIconButton>
            }
          />
        ) : (
          <TRTooltip.Trigger>{visibleTrigger}</TRTooltip.Trigger>
        )}
        <TRTooltip.Portal>
          <TRTooltip.Positioner align={align} side={side}>
            <TRTooltip.Popup>
              {visibleContent}
              <TRTooltip.Arrow />
            </TRTooltip.Popup>
          </TRTooltip.Positioner>
        </TRTooltip.Portal>
      </TRTooltip.Root>
    </TRTooltip.Provider></div>
  );
}

const delayGroupItems = [
  ['CPU status', '42% utilization'],
  ['Memory status', '68% utilization'],
  ['Storage status', '2.4 TB available'],
] as const;

export function TooltipDelayGroupExample() {
  return (
    <TRTooltip.Provider closeDelay={100} delay={500}>
      <div className="flex flex-wrap gap-3">
        {delayGroupItems.map(([label, content]) => (
          <div data-docs-example-item="" key={label}><TRTooltip.Root>
            <TRTooltip.Trigger
              render={
                <TRIconButton aria-label={label}>
                  <Info aria-hidden="true" />
                </TRIconButton>
              }
            />
            <TRTooltip.Portal>
              <TRTooltip.Positioner side="top">
                <TRTooltip.Popup>
                  {content}
                  <TRTooltip.Arrow />
                </TRTooltip.Popup>
              </TRTooltip.Positioner>
            </TRTooltip.Portal>
          </TRTooltip.Root></div>
        ))}
      </div>
    </TRTooltip.Provider>
  );
}

type SharedTooltipPayload = { content: string };

export function TooltipHandleViewportExample() {
  const [handle] = useState(() => TRTooltip.createHandle<SharedTooltipPayload>());
  const items = [
    { content: '42% utilization', id: 'tooltip-cpu', label: 'CPU' },
    { content: '68% utilization', id: 'tooltip-memory', label: 'Memory' },
  ];

  return (
    <TRTooltip.Provider delay={200}>
      <div className="flex gap-3" data-docs-example-item="">
        {items.map((item) => (
          <TRTooltip.Trigger
            handle={handle}
            id={item.id}
            key={item.id}
            payload={{ content: item.content }}
          >
            {item.label}
          </TRTooltip.Trigger>
        ))}
      </div>
      <TRTooltip.Root handle={handle}>
        {({ payload }) => (
          <TRTooltip.Portal>
            <TRTooltip.Positioner side="bottom">
              <TRTooltip.Popup>
                <TRTooltip.Viewport>{payload?.content}</TRTooltip.Viewport>
                <TRTooltip.Arrow />
              </TRTooltip.Popup>
            </TRTooltip.Positioner>
          </TRTooltip.Portal>
        )}
      </TRTooltip.Root>
    </TRTooltip.Provider>
  );
}

export function TooltipAlignComparison() {
  return <div className="grid gap-4 sm:grid-cols-3">{(['start', 'center', 'end'] as const).map((align) => <TooltipExample align={align} content={align} delay={0} key={align} open side="top" trigger={align} />)}</div>;
}

export function TooltipSideComparison() {
  return <div className="grid gap-4 sm:grid-cols-2">{(['top', 'right', 'bottom', 'left'] as const).map((side) => <TooltipExample content={side} delay={0} key={side} open side={side} trigger={side} />)}</div>;
}

export const tooltipBasicSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/icon-button.css';
import '@tinyrack/ui/components/tooltip.css';
import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { TRTooltip } from '@tinyrack/ui/components/tooltip';
import { Info } from 'lucide-react';

<TRTooltip.Provider closeDelay={100} delay={400}>
  <TRTooltip.Root defaultOpen>
    <TRTooltip.Trigger render={<TRIconButton aria-label="Rack temperature details"><Info aria-hidden="true" /></TRIconButton>} />
    <TRTooltip.Portal>
      <TRTooltip.Positioner side="top">
        <TRTooltip.Popup>Rack temperature: 24°C<TRTooltip.Arrow /></TRTooltip.Popup>
      </TRTooltip.Positioner>
    </TRTooltip.Portal>
  </TRTooltip.Root>
</TRTooltip.Provider>`;

export const tooltipSidesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/tooltip.css';
import { TRTooltip } from '@tinyrack/ui/components/tooltip';

<TRTooltip.Provider>
  {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
    <TRTooltip.Root key={side}>
      <TRTooltip.Trigger>{side}</TRTooltip.Trigger>
      <TRTooltip.Portal><TRTooltip.Positioner side={side}><TRTooltip.Popup>{side} tooltip<TRTooltip.Arrow /></TRTooltip.Popup></TRTooltip.Positioner></TRTooltip.Portal>
    </TRTooltip.Root>
  ))}
</TRTooltip.Provider>`;

export const tooltipLongContentSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/tooltip.css';
import { TRTooltip } from '@tinyrack/ui/components/tooltip';

<TRTooltip.Provider delay={0}>
  <TRTooltip.Root defaultOpen>
    <TRTooltip.Trigger>Maintenance details</TRTooltip.Trigger>
    <TRTooltip.Portal>
      <TRTooltip.Positioner align="end" side="right">
        <TRTooltip.Popup>MaintenanceWindowRequiresOperatorConfirmationBeforeRestartingServices<TRTooltip.Arrow /></TRTooltip.Popup>
      </TRTooltip.Positioner>
    </TRTooltip.Portal>
  </TRTooltip.Root>
</TRTooltip.Provider>`;

export const tooltipDelayGroupSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/tooltip.css';
import { TRTooltip } from '@tinyrack/ui/components/tooltip';

<TRTooltip.Provider closeDelay={100} delay={500}>
  {['CPU', 'Memory'].map((label) => (
    <TRTooltip.Root key={label}>
      <TRTooltip.Trigger>{label}</TRTooltip.Trigger>
      <TRTooltip.Portal><TRTooltip.Positioner><TRTooltip.Popup>{label} status<TRTooltip.Arrow /></TRTooltip.Popup></TRTooltip.Positioner></TRTooltip.Portal>
    </TRTooltip.Root>
  ))}
</TRTooltip.Provider>`;

export const tooltipHandleViewportSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/tooltip.css';
import { TRTooltip } from '@tinyrack/ui/components/tooltip';
import { useState } from 'react';

function SharedTooltip() {
  const [handle] = useState(() => TRTooltip.createHandle<{ content: string }>());
  return (
    <TRTooltip.Provider>
      <TRTooltip.Trigger handle={handle} id="cpu" payload={{ content: '42% utilization' }}>CPU</TRTooltip.Trigger>
      <TRTooltip.Trigger handle={handle} id="memory" payload={{ content: '68% utilization' }}>Memory</TRTooltip.Trigger>
      <TRTooltip.Root handle={handle}>
        {({ payload }) => <TRTooltip.Portal><TRTooltip.Positioner><TRTooltip.Popup><TRTooltip.Viewport>{payload?.content}</TRTooltip.Viewport><TRTooltip.Arrow /></TRTooltip.Popup></TRTooltip.Positioner></TRTooltip.Portal>}
      </TRTooltip.Root>
    </TRTooltip.Provider>
  );
}`;

const meta = {
  title: 'Components/Tooltip',
  excludeStories: /.*(?:Example|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    align: 'center',
    content: 'Rack temperature: 24°C',
    open: true,
    side: 'top',
    trigger: 'Rack temperature details',
  },
  localizedArgs: {
    ja: { content: 'ラック温度: 24°C', trigger: '詳細を表示' },
    ko: { content: '랙 온도: 24°C', trigger: '세부 정보 보기' },
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    content: { control: 'text' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    trigger: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TooltipStoryArgs>();

    return <TooltipExample {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<TooltipStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
