import { TRMeter, type TRMeterVariant } from '@tinyrack/ui/components/meter';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const meterCopy = {
  en: {
    storage: 'Storage usage',
    range: 'Rack inlet temperature range',
    suffix: 'within the safe temperature range',
  },
  ko: {
    storage: '저장 공간 사용량',
    range: '랙 흡입구 온도 범위',
    suffix: '안전 온도 범위 내',
  },
  ja: {
    storage: 'ストレージ使用量',
    range: 'ラック吸気温度の範囲',
    suffix: '安全な温度範囲内',
  },
} as const;

type StoryArgs = {
  label: string;
  locale: 'en-US' | 'ja-JP' | 'ko-KR';
  max: number;
  min: number;
  unit: 'byte' | 'gigabyte' | 'megabyte';
  value: number;
  variant: TRMeterVariant;
};

export function MeterPreview({
  label,
  locale,
  max,
  min,
  unit,
  value,
  variant,
}: StoryArgs) {
  const format = { style: 'unit' as const, unit, unitDisplay: 'short' as const };
  const normalizedMin = Number.isFinite(min) ? min : 0;
  const normalizedMax = Math.max(normalizedMin + 1, Number.isFinite(max) ? max : 100);
  const normalizedValue = Math.min(
    normalizedMax,
    Math.max(normalizedMin, Number.isFinite(value) ? value : normalizedMin),
  );

  return (
    <TRMeter.Root
      className="w-96 max-w-full"
      format={format}
      locale={locale}
      max={normalizedMax}
      min={normalizedMin}
      value={normalizedValue}
      variant={variant}
    >
      <TRMeter.Label>{label}</TRMeter.Label>
      <TRMeter.Track>
        <TRMeter.Indicator />
      </TRMeter.Track>
      <TRMeter.Value />
    </TRMeter.Root>
  );
}

export function MeterVariantMatrix() {
  const variants: TRMeterVariant[] = [
    'neutral',
    'info',
    'success',
    'warning',
    'danger',
  ];
  return (
    <div className="grid w-full gap-4">
      {variants.map((variant, index) => (
        <TRMeter.Root
          data-docs-example-item=""
          key={variant}
          value={20 + index * 16}
          variant={variant}
        >
          <TRMeter.Label>{variant}</TRMeter.Label>
          <TRMeter.Value />
          <TRMeter.Track>
            <TRMeter.Indicator />
          </TRMeter.Track>
        </TRMeter.Root>
      ))}
    </div>
  );
}

export function MeterCustomRangePreview({
  ariaSuffix,
  label,
  locale,
}: {
  ariaSuffix?: string;
  label?: string;
  locale?: 'en-US' | 'ja-JP' | 'ko-KR';
} = {}) {
  const demoLocale = useDemoLocale();
  const copy = meterCopy[demoLocale];
  const resolvedLocale =
    locale ?? { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP' }[demoLocale];
  return (
    <TRMeter.Root
      data-docs-example-item=""
      format={{ style: 'unit', unit: 'celsius', unitDisplay: 'short' }}
      getAriaValueText={(formatted) => `${formatted} ${ariaSuffix ?? copy.suffix}`}
      locale={resolvedLocale}
      max={80}
      min={20}
      value={50}
      variant="success"
    >
      <TRMeter.Label>{label ?? copy.range}</TRMeter.Label>
      <TRMeter.Value />
      <TRMeter.Track>
        <TRMeter.Indicator />
      </TRMeter.Track>
    </TRMeter.Root>
  );
}

const meta = {
  title: 'Components/Meter',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Storage usage',
    locale: 'en-US' as StoryArgs['locale'],
    max: 128,
    min: 0,
    unit: 'gigabyte',
    value: 64,
    variant: 'info',
  },
  argTypes: {
    label: { control: 'text' },
    locale: { control: 'select', options: ['en-US', 'ko-KR', 'ja-JP'] },
    max: { control: { type: 'number', min: 1, max: 1024, step: 1 } },
    min: { control: { type: 'number', min: 0, max: 1023, step: 1 } },
    unit: { control: 'select', options: ['byte', 'megabyte', 'gigabyte'] },
    value: { control: { type: 'range', min: 0, max: 128, step: 1 } },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  localizedArgs: {
    ja: { label: 'ストレージ使用量', locale: 'ja-JP' },
    ko: { label: '저장 공간 사용량', locale: 'ko-KR' },
  },
  render: (args) => <MeterPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
