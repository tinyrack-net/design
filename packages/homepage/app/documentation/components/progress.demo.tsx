import {
  TRProgress,
  type TRProgressUiSize,
  type TRProgressVariant,
} from '@tinyrack/ui/components/progress';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type ProgressStoryArgs = {
  format: 'number' | 'percent';
  indeterminate: boolean;
  label: string;
  max: number;
  min: number;
  uiSize: TRProgressUiSize;
  value: number;
  variant: TRProgressVariant;
};

const meta = {
  title: 'Components/Progress',
  parameters: { layout: 'centered' },
  args: {
    format: 'percent',
    indeterminate: false,
    label: 'Deployment',
    max: 100,
    min: 0,
    uiSize: 'md',
    value: 68,
    variant: 'success',
  },
  argTypes: {
    format: {
      control: 'select',
      options: ['number', 'percent'],
      when: (args) => args['indeterminate'] !== true,
    },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    max: { control: 'number' },
    min: { control: 'number' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      when: (args) => args['indeterminate'] !== true,
    },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  localizedArgs: {
    ja: { label: 'デプロイ' },
    ko: { label: '배포' },
  },
  render: ({ format, indeterminate, label, max, min, value, ...props }) => {
    const normalizedMax = Math.max(min + 1, max);
    const normalizedValue = Math.min(normalizedMax, Math.max(min, value));
    return (
      <TRProgress.Root
        className="w-96 max-w-full"
        format={format === 'percent' ? { style: 'unit', unit: 'percent' } : {}}
        max={normalizedMax}
        min={min}
        value={indeterminate ? null : normalizedValue}
        {...props}
      >
        <TRProgress.Label>{label}</TRProgress.Label>
        <TRProgress.Track>
          <TRProgress.Indicator />
        </TRProgress.Track>
        {indeterminate ? null : <TRProgress.Value />}
      </TRProgress.Root>
    );
  },
} satisfies Meta<ProgressStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
