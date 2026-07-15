import { Button } from '@tinyrack/ui/components/button';
import { ScrollArea } from '@tinyrack/ui/components/scroll-area';
import { useCallback, useEffect, useRef } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  autoHide: boolean;
  content: string;
  orientation: 'both' | 'horizontal' | 'vertical';
  scrollPosition?: 'start' | 'middle' | 'end';
  variant: 'surface' | 'plain';
};

export function ScrollAreaPreview({
  autoHide,
  content,
  orientation,
  scrollPosition = 'start',
  showControls = false,
  variant,
}: StoryArgs & { showControls?: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const hasHorizontal = orientation === 'horizontal' || orientation === 'both';
  const hasVertical = orientation === 'vertical' || orientation === 'both';
  const entries = Array.from(
    { length: hasVertical ? 12 : 3 },
    (_, index) => `${content} ${index + 1}`,
  );

  const move = useCallback((position: 'start' | 'middle' | 'end') => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const factor = position === 'start' ? 0 : position === 'middle' ? 0.5 : 1;
    viewport.scrollTo({
      left: (viewport.scrollWidth - viewport.clientWidth) * factor,
      top: (viewport.scrollHeight - viewport.clientHeight) * factor,
    });
  }, []);

  useEffect(() => move(scrollPosition), [move, scrollPosition]);

  return (
    <div className="grid gap-3">
      {showControls ? (
        <div className="flex flex-wrap gap-2">
          <Button appearance="outline" onClick={() => move('start')} size="sm">
            Start
          </Button>
          <Button appearance="outline" onClick={() => move('end')} size="sm">
            End
          </Button>
        </div>
      ) : null}
      <ScrollArea.Root
        autoHide={autoHide}
        style={{ height: '10rem', width: 'min(20rem, 100%)' }}
        variant={variant}
      >
        <ScrollArea.Viewport aria-label={content} ref={viewportRef} tabIndex={0}>
          <ScrollArea.Content
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
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        {hasVertical ? (
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        ) : null}
        {hasHorizontal ? (
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        ) : null}
        {hasHorizontal && hasVertical ? <ScrollArea.Corner /> : null}
      </ScrollArea.Root>
    </div>
  );
}

const meta = {
  title: 'Components/Scroll Area',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    autoHide: false,
    content: 'Rack event log',
    orientation: 'both',
    scrollPosition: 'start',
    variant: 'surface',
  },
  argTypes: {
    autoHide: { control: 'boolean' },
    content: { control: 'text' },
    orientation: { options: ['vertical', 'horizontal', 'both'], control: 'radio' },
    scrollPosition: { options: ['start', 'middle', 'end'], control: 'radio' },
    variant: { options: ['surface', 'plain'], control: 'radio' },
  },
  render: (args) => <ScrollAreaPreview {...args} showControls />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
