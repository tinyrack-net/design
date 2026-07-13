import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '../../src/components/scroll-area/index.js';

type StoryArgs = {
  content: string;
  orientation: 'both' | 'horizontal' | 'vertical';
};

export function ScrollAreaPreview({ content, orientation }: StoryArgs) {
  const hasHorizontal = orientation === 'horizontal' || orientation === 'both';
  const hasVertical = orientation === 'vertical' || orientation === 'both';

  return (
    <ScrollArea.Root className="h-40 w-80">
      <ScrollArea.Viewport>
        <ScrollArea.Content
          className={
            hasHorizontal ? 'grid min-h-80 w-max grid-cols-3 gap-3' : undefined
          }
        >
          {Array.from({ length: 12 }, (_, index) => `${content} ${index + 1}`).map(
            (entry) => (
              <p
                className={hasHorizontal ? 'w-56 whitespace-nowrap' : undefined}
                key={entry}
              >
                {entry}
              </p>
            ),
          )}
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
      <ScrollArea.Corner />
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
  },
  argTypes: {
    content: { control: 'text' },
    orientation: { options: ['vertical', 'horizontal', 'both'], control: 'radio' },
  },
  render: (args) => <ScrollAreaPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
