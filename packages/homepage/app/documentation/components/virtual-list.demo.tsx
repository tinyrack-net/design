import { TRText } from '@tinyrack/ui/components/text';
import { TRVirtualList } from '@tinyrack/ui/components/virtual-list';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type StoryArgs = {
  axis: 'horizontal' | 'vertical';
  follow: 'none' | 'trailing';
  itemCount: number;
};

type DemoItem = { id: string; label: string };

const itemStyle = {
  alignItems: 'center',
  borderBlockEnd:
    'var(--tinyrack-border-width-default) solid var(--tinyrack-border-subtle)',
  boxSizing: 'border-box',
  display: 'flex',
  paddingInline: 'var(--tinyrack-space-md)',
} as const;

export function VirtualListPreview({ axis, follow, itemCount }: StoryArgs) {
  const locale = useDemoLocale();
  const itemLabel = locale === 'ko' ? '이벤트' : locale === 'ja' ? 'イベント' : 'Event';
  const listLabel =
    locale === 'ko'
      ? '가상화된 랙 이벤트'
      : locale === 'ja'
        ? '仮想化されたラックイベント'
        : 'Virtualized rack events';
  const items: DemoItem[] = Array.from(
    { length: Math.max(1, itemCount) },
    (_, index) => ({ id: `event-${index}`, label: `${itemLabel} ${index + 1}` }),
  );

  return (
    <TRVirtualList<DemoItem, string>
      axis={axis}
      estimateSize={() => (axis === 'vertical' ? 48 : 192)}
      follow={follow}
      initialPosition={
        follow === 'trailing' ? { edge: 'trailing' } : { edge: 'leading' }
      }
      itemKey={(item) => item.id}
      itemProps={() => ({
        style:
          axis === 'vertical'
            ? { ...itemStyle, height: 'var(--tinyrack-space-3xl)' }
            : { ...itemStyle, width: 'var(--tinyrack-measure-md)' },
      })}
      items={items}
      renderItem={(item) => <TRText>{item.label}</TRText>}
      rootProps={{
        'data-docs-example-item': '',
        style: {
          border:
            'var(--tinyrack-border-width-default) solid var(--tinyrack-border-subtle)',
          borderRadius: 'var(--tinyrack-radius-lg)',
          height: 'var(--tinyrack-measure-lg)',
          maxWidth: 'var(--tinyrack-measure-xl)',
          overflow: 'hidden',
          width: '100%',
        },
      }}
      viewportProps={{ 'aria-label': listLabel }}
    />
  );
}

export const virtualListBasicSource = `import '@tinyrack/ui/components/virtual-list.css';
import { TRVirtualList } from '@tinyrack/ui/components/virtual-list';

const events = Array.from({ length: 100_000 }, (_, index) => ({
  id: 'event-' + index,
  label: 'Event ' + (index + 1),
}));

export function EventLog() {
  return (
    <TRVirtualList
      items={events}
      itemKey={(event) => event.id}
      estimateSize={() => 40}
      renderItem={(event) => event.label}
      rootProps={{ style: { height: 320 } }}
      viewportProps={{ 'aria-label': 'Rack events' }}
    />
  );
}`;

export const virtualListStreamingSource = `import '@tinyrack/ui/components/virtual-list.css';
import {
  TRVirtualList,
  useTRVirtualListController,
} from '@tinyrack/ui/components/virtual-list';

export function StreamingLog({ messages }) {
  const controller = useTRVirtualListController();
  return (
    <TRVirtualList
      controller={controller}
      items={messages}
      itemKey={(message) => message.id}
      estimateSize={() => 48}
      initialPosition={{ edge: 'trailing' }}
      follow="trailing"
      renderItem={(message) => message.body}
      rootProps={{ style: { height: 320 } }}
      viewportProps={{ 'aria-label': 'Streaming messages' }}
    />
  );
}`;

export const virtualListHorizontalSource = `import '@tinyrack/ui/components/virtual-list.css';
import { TRVirtualList } from '@tinyrack/ui/components/virtual-list';

<div dir="rtl">
  <TRVirtualList
    axis="horizontal"
    items={stages}
    itemKey={(stage) => stage.id}
    estimateSize={() => 192}
    renderItem={(stage) => stage.label}
    rootProps={{ style: { height: 160, width: 480 } }}
    viewportProps={{ 'aria-label': 'Deployment stages' }}
  />
</div>`;

const meta = {
  title: 'Components/Virtual List',
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  args: { axis: 'vertical', follow: 'none', itemCount: 10_000 },
  argTypes: {
    axis: { options: ['vertical', 'horizontal'], control: 'radio' },
    follow: { options: ['none', 'trailing'], control: 'radio' },
    itemCount: { control: { type: 'number', min: 1, max: 100_000, step: 1 } },
  },
  render: (args) => <VirtualListPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
