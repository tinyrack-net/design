import { TRSkeleton, type TRSkeletonShape } from '@tinyrack/ui/components/skeleton';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type SkeletonStoryArgs = {
  announced: boolean;
  animate: boolean;
  circleSize: number;
  height: number;
  label: string;
  shape: TRSkeletonShape;
  width: number;
};

const meta = {
  title: 'Components/Skeleton',
  component: TRSkeleton,
  parameters: { layout: 'centered' },
  args: {
    announced: false,
    animate: true,
    circleSize: 48,
    height: 48,
    label: 'Loading server',
    shape: 'rectangle',
    width: 240,
  },
  argTypes: {
    announced: { control: 'boolean' },
    animate: { control: 'boolean' },
    circleSize: {
      control: { type: 'range', min: 12, max: 240, step: 4 },
      when: (args) => args['shape'] === 'circle',
    },
    height: {
      control: { type: 'range', min: 12, max: 240, step: 4 },
      when: (args) => args['shape'] !== 'circle',
    },
    label: { control: 'text', when: (args) => args['announced'] === true },
    shape: { control: 'select', options: ['text', 'rectangle', 'circle'] },
    width: {
      control: { type: 'range', min: 12, max: 480, step: 4 },
      when: (args) => args['shape'] !== 'circle',
    },
  },
  render: ({ animate, announced, circleSize, height, label, shape, width }) => (
    <TRSkeleton
      animate={animate}
      aria-label={announced ? label : undefined}
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
