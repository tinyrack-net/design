import { Meter } from '@tinyrack/ui/components/meter';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  label: string;
  max: number;
  min: number;
  unit: 'byte' | 'gigabyte' | 'megabyte';
  value: number;
};

export function MeterPreview({ label, max, min, unit, value }: StoryArgs) {
  const format = { style: 'unit' as const, unit, unitDisplay: 'short' as const };

  return (
    <Meter.Root format={format} max={max} min={min} value={value}>
      <Meter.Label>{label}</Meter.Label>
      <Meter.Track>
        <Meter.Indicator />
      </Meter.Track>
      <Meter.Value />
    </Meter.Root>
  );
}

const meta = {
  title: 'Components/Meter',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Storage usage',
    max: 128,
    min: 0,
    unit: 'gigabyte',
    value: 64,
  },
  argTypes: {
    label: { control: 'text' },
    max: { control: { type: 'number' } },
    min: { control: { type: 'number' } },
    unit: { control: 'select', options: ['byte', 'megabyte', 'gigabyte'] },
    value: { control: { type: 'number' } },
  },
  render: (args) => <MeterPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
