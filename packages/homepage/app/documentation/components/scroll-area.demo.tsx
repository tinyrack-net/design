import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';
import { TRDirectionProvider } from '@tinyrack/ui/providers/direction';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  autoHide: boolean;
  content: string;
  orientation: 'both' | 'horizontal' | 'vertical';
  variant: 'surface' | 'plain';
};

export function ScrollAreaPreview({
  autoHide,
  content,
  orientation,
  variant,
}: StoryArgs) {
  const hasHorizontal = orientation === 'horizontal' || orientation === 'both';
  const hasVertical = orientation === 'vertical' || orientation === 'both';
  const entries = Array.from(
    { length: hasVertical ? 12 : 3 },
    (_, index) => `${content} ${index + 1}`,
  );

  return (
    <TRScrollArea.Root
      autoHide={autoHide}
      style={{ height: '10rem', width: 'min(20rem, 100%)' }}
      variant={variant}
    >
      <TRScrollArea.Viewport aria-label={content} tabIndex={0}>
        <TRScrollArea.Content
          style={
            hasHorizontal
              ? {
                  display: 'grid',
                  gap: '0.75rem',
                  gridTemplateColumns: 'repeat(3, 14rem)',
                  minHeight: orientation === 'both' ? '20rem' : undefined,
                  width: 'max-content',
                }
              : undefined
          }
        >
          {entries.map((entry) => (
            <p
              key={entry}
              style={hasHorizontal ? { margin: 0, whiteSpace: 'nowrap' } : undefined}
            >
              {entry}
            </p>
          ))}
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      {hasVertical ? (
        <TRScrollArea.Scrollbar orientation="vertical">
          <TRScrollArea.Thumb />
        </TRScrollArea.Scrollbar>
      ) : null}
      {hasHorizontal ? (
        <TRScrollArea.Scrollbar orientation="horizontal">
          <TRScrollArea.Thumb />
        </TRScrollArea.Scrollbar>
      ) : null}
      {hasHorizontal && hasVertical ? <TRScrollArea.Corner /> : null}
    </TRScrollArea.Root>
  );
}

export function ScrollAreaRTLPreview() {
  return (
    <TRDirectionProvider direction="rtl">
      <div dir="rtl">
        <ScrollAreaPreview
          autoHide={false}
          content="سجل الخادم"
          orientation="horizontal"
          variant="surface"
        />
      </div>
    </TRDirectionProvider>
  );
}

export const scrollAreaVerticalSource = `import '@tinyrack/ui/components/scroll-area.css';
import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';

const events = Array.from({ length: 12 }, (_, index) => 'Rack event ' + (index + 1));

export function VerticalEventLog() {
  return (
    <TRScrollArea.Root style={{ height: '10rem', width: '20rem' }}>
      <TRScrollArea.Viewport aria-label="Rack event log">
        <TRScrollArea.Content>
          {events.map((event) => <p key={event}>{event}</p>)}
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>
  );
}`;

export const scrollAreaHorizontalSource = `import '@tinyrack/ui/components/scroll-area.css';
import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';

export function HorizontalEventLog() {
  return (
    <TRScrollArea.Root variant="plain" style={{ height: '10rem', width: '20rem' }}>
      <TRScrollArea.Viewport aria-label="Deployment stages">
        <TRScrollArea.Content style={{ display: 'flex', gap: '0.75rem', width: 'max-content' }}>
          {['Build', 'Test', 'Stage', 'Deploy'].map((stage) => (
            <article key={stage} style={{ width: '12rem' }}>{stage}</article>
          ))}
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="horizontal">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>
  );
}`;

export const scrollAreaBothSource = `import '@tinyrack/ui/components/scroll-area.css';
import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';

export function RackMatrix() {
  return (
    <TRScrollArea.Root style={{ height: '10rem', width: '20rem' }}>
      <TRScrollArea.Viewport aria-label="Rack matrix">
        <TRScrollArea.Content style={{ minHeight: '20rem', width: '42rem' }}>
          Wide and tall rack matrix
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical"><TRScrollArea.Thumb /></TRScrollArea.Scrollbar>
      <TRScrollArea.Scrollbar orientation="horizontal"><TRScrollArea.Thumb /></TRScrollArea.Scrollbar>
      <TRScrollArea.Corner />
    </TRScrollArea.Root>
  );
}`;

export const scrollAreaAutoHideSource = `import '@tinyrack/ui/components/scroll-area.css';
import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';

export function AutoHideEventLog() {
  return (
    <TRScrollArea.Root autoHide style={{ height: '10rem', width: '20rem' }}>
      <TRScrollArea.Viewport aria-label="Rack events">
        <TRScrollArea.Content style={{ height: '24rem' }}>Rack events</TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical"><TRScrollArea.Thumb /></TRScrollArea.Scrollbar>
    </TRScrollArea.Root>
  );
}`;

export const scrollAreaRTLSource = `import '@tinyrack/ui/components/scroll-area.css';
import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';
import { TRDirectionProvider } from '@tinyrack/ui/providers/direction';

export function RTLLog() {
  return (
    <TRDirectionProvider direction="rtl">
      <div dir="rtl">
        <TRScrollArea.Root style={{ height: '10rem', width: '20rem' }}>
          <TRScrollArea.Viewport aria-label="سجل الخادم">
            <TRScrollArea.Content style={{ width: '42rem' }}>سجل الخادم</TRScrollArea.Content>
          </TRScrollArea.Viewport>
          <TRScrollArea.Scrollbar orientation="horizontal"><TRScrollArea.Thumb /></TRScrollArea.Scrollbar>
        </TRScrollArea.Root>
      </div>
    </TRDirectionProvider>
  );
}`;

const meta = {
  title: 'Components/Scroll Area',
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    autoHide: false,
    content: 'Rack event log',
    orientation: 'both',
    variant: 'surface',
  },
  argTypes: {
    autoHide: { control: 'boolean' },
    content: { control: 'text' },
    orientation: { options: ['vertical', 'horizontal', 'both'], control: 'radio' },
    variant: { options: ['surface', 'plain'], control: 'radio' },
  },
  render: (args) => <ScrollAreaPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
