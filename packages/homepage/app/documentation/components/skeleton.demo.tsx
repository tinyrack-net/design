import { TRSkeleton, type TRSkeletonShape } from '@tinyrack/ui/components/skeleton';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type SkeletonStoryArgs = {
  animate: boolean;
  circleSize: number;
  height: number;
  shape: TRSkeletonShape;
  width: number;
};

const meta = {
  title: 'Components/Skeleton',
  component: TRSkeleton,
  parameters: { layout: 'centered' },
  args: {
    animate: true,
    circleSize: 48,
    height: 48,
    shape: 'rectangle',
    width: 240,
  },
  argTypes: {
    animate: { control: 'boolean' },
    circleSize: {
      control: { type: 'range', min: 12, max: 240, step: 4 },
      when: (args) => args['shape'] === 'circle',
    },
    height: {
      control: { type: 'range', min: 12, max: 240, step: 4 },
      when: (args) => args['shape'] !== 'circle',
    },
    shape: { control: 'select', options: ['text', 'rectangle', 'circle'] },
    width: {
      control: { type: 'range', min: 12, max: 480, step: 4 },
      when: (args) => args['shape'] !== 'circle',
    },
  },
  render: ({ animate, circleSize, height, shape, width }) => (
    <TRSkeleton
      animate={animate}
      shape={shape}
      style={
        shape === 'circle'
          ? { height: circleSize, width: circleSize }
          : { height, width }
      }
    />
  ),
} satisfies Meta<SkeletonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
