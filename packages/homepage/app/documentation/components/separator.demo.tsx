import { TRSeparator, type TRSeparatorProps } from '@tinyrack/ui/components/separator';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type SeparatorStoryArgs = {
  decorative: boolean;
  orientation: NonNullable<TRSeparatorProps['orientation']>;
};

const meta = {
  title: 'Components/Separator',
  component: TRSeparator,
  parameters: { layout: 'centered' },
  args: { decorative: false, orientation: 'horizontal' },
  argTypes: {
    decorative: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  render: ({ decorative, orientation }) =>
    orientation === 'vertical' ? (
      <div className="grid justify-items-center gap-3">
        <div className="flex h-16 items-center gap-4">
          <span>CPU</span>
          <TRSeparator
            orientation={orientation}
            role={decorative ? 'presentation' : 'separator'}
          />
          <span>Memory</span>
        </div>
        <span className="text-tinyrack-xs text-tinyrack-text-muted">
          {decorative ? 'Decorative divider' : 'Semantic separator'}
        </span>
      </div>
    ) : (
      <div className="grid w-full max-w-80 gap-3">
        <span>Overview</span>
        <TRSeparator
          orientation={orientation}
          role={decorative ? 'presentation' : 'separator'}
        />
        <span>Network</span>
        <span className="text-tinyrack-xs text-tinyrack-text-muted">
          {decorative ? 'Decorative divider' : 'Semantic separator'}
        </span>
      </div>
    ),
} satisfies Meta<SeparatorStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
