import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, type SkeletonShape } from '../../src/components/skeleton/index.js';

type SkeletonStoryArgs = {
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
    animate: true,
    height: 48,
    label: 'Loading server',
    shape: 'rectangle',
    width: 240,
  },
  argTypes: {
    animate: { control: 'boolean' },
    height: { control: { type: 'range', min: 12, max: 240, step: 4 } },
    label: { control: 'text' },
    shape: { control: 'select', options: ['text', 'rectangle', 'circle'] },
    width: { control: { type: 'range', min: 12, max: 480, step: 4 } },
  },
  render: ({ animate, height, label, shape, width }) => (
    <Skeleton
      animate={animate}
      aria-label={label}
      shape={shape}
      style={{ height, width }}
    />
  ),
} satisfies Meta<SkeletonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
