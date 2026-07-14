import {
  Progress,
  type ProgressSize,
  type ProgressVariant,
} from '@tinyrack/ui/components/progress';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type ProgressStoryArgs = {
  indeterminate: boolean;
  label: string;
  size: ProgressSize;
  value: number;
  variant: ProgressVariant;
};

const meta = {
  title: 'Components/Progress',
  parameters: { layout: 'centered' },
  args: {
    indeterminate: false,
    label: 'Deployment',
    size: 'md',
    value: 68,
    variant: 'success',
  },
  argTypes: {
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: ({ indeterminate, label, value, ...props }) => (
    <Progress.Root
      className="w-96 max-w-full"
      value={indeterminate ? null : value}
      {...props}
    >
      <Progress.Label>{label}</Progress.Label>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
      {indeterminate ? null : <Progress.Value />}
    </Progress.Root>
  ),
} satisfies Meta<ProgressStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
