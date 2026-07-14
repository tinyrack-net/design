import { Skeleton, type SkeletonShape } from '@tinyrack/ui/components/skeleton';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type SkeletonStoryArgs = {
  announced: boolean;
  animate: boolean;
  height: number;
  label: string;
  shape: SkeletonShape;
  width: number;
};

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  args: {
    announced: false,
    animate: true,
    height: 48,
    label: 'Loading server',
    shape: 'rectangle',
    width: 240,
  },
  argTypes: {
    announced: { control: 'boolean' },
    animate: { control: 'boolean' },
    height: { control: { type: 'range', min: 12, max: 240, step: 4 } },
    label: { control: 'text' },
    shape: { control: 'select', options: ['text', 'rectangle', 'circle'] },
    width: { control: { type: 'range', min: 12, max: 480, step: 4 } },
  },
  render: ({ animate, announced, height, label, shape, width }) => (
    <Skeleton
      animate={animate}
      aria-label={announced ? label : undefined}
      shape={shape}
      style={{ height, width }}
    />
  ),
} satisfies Meta<SkeletonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
