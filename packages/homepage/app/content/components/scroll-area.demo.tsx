import { ScrollArea } from '@tinyrack/ui/components/scroll-area';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  content: string;
  orientation: 'both' | 'horizontal' | 'vertical';
  variant: 'surface' | 'plain';
};

export function ScrollAreaPreview({ content, orientation, variant }: StoryArgs) {
  const hasHorizontal = orientation === 'horizontal' || orientation === 'both';
  const hasVertical = orientation === 'vertical' || orientation === 'both';
  const entries = Array.from(
    { length: hasVertical ? 12 : 3 },
    (_, index) => `${content} ${index + 1}`,
  );

  return (
    <ScrollArea.Root
      style={{ height: '10rem', width: 'min(20rem, 100%)' }}
      variant={variant}
    >
      <ScrollArea.Viewport aria-label={content}>
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
  );
}

const meta = {
  title: 'Components/Scroll Area',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    content: 'Rack event log',
    orientation: 'both',
    variant: 'surface',
  },
  argTypes: {
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
