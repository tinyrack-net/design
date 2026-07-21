import { TRSeparator, type TRSeparatorProps } from '@tinyrack/ui/components/separator';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type SeparatorStoryArgs = {
  orientation: NonNullable<TRSeparatorProps['orientation']>;
};

const meta = {
  title: 'Components/Separator',
  component: TRSeparator,
  parameters: { layout: 'centered' },
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  render: ({ orientation }) =>
    orientation === 'vertical' ? (
      <div className="flex h-16 items-center gap-4">
        <span>CPU</span>
        <TRSeparator orientation="vertical" />
        <span>Memory</span>
      </div>
    ) : (
      <div className="grid w-80 gap-3">
        <span>Overview</span>
        <TRSeparator />
        <span>Network</span>
      </div>
    ),
} satisfies Meta<SeparatorStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
