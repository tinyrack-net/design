import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';
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

const meta = {
  title: 'Components/Scroll Area',
  excludeStories: /.*Preview$/,
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
