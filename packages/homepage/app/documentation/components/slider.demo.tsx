import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRSlider, type TRSliderUiSize } from '@tinyrack/ui/components/slider';
import { useId, useRef, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  orientation: 'horizontal' | 'vertical';
  uiSize: TRSliderUiSize;
  value: number | null;
};

type SliderPreviewProps = Omit<StoryArgs, 'uiSize' | 'value'> & {
  'data-docs-example-item'?: string;
  defaultValue?: number;
  onValueChange?: (value: readonly number[]) => void;
  uiSize?: TRSliderUiSize;
  value?: number;
};

const copy = {
  en: {
    capacity: 'Reserved capacity',
    capacityDescription: 'Reserve at least 60% capacity.',
    capacityError: 'Increase reserved capacity to 60% or more.',
    disabled: 'Disabled volume',
    end: 'End',
    ends: (value: string) => `Ends at ${value}`,
    horizontal: 'Horizontal volume',
    maintenance: 'Maintenance window',
    reserve: 'Reserve capacity',
    reserved: (value: number) => `Reserved ${value}% capacity.`,
    save: 'Save volume',
    saved: (value: number) => `Saved volume ${value}.`,
    start: 'Start',
    starts: (value: string) => `Starts at ${value}`,
    vertical: 'Vertical volume',
    volume: 'Volume',
  },
  ko: {
    capacity: '예약 용량',
    capacityDescription: '용량을 60% 이상 예약하세요.',
    capacityError: '예약 용량을 60% 이상으로 높이세요.',
    disabled: '사용할 수 없는 볼륨',
    end: '끝',
    ends: (value: string) => `${value}에 끝나요`,
    horizontal: '가로 볼륨',
    maintenance: '유지보수 구간',
    reserve: '용량 예약',
    reserved: (value: number) => `용량 ${value}%를 예약했어요.`,
    save: '볼륨 저장',
    saved: (value: number) => `저장한 볼륨 값: ${value}`,
    start: '시작',
    starts: (value: string) => `${value}에 시작해요`,
    vertical: '세로 볼륨',
    volume: '볼륨',
  },
  ja: {
    capacity: '予約容量',
    capacityDescription: '容量を 60% 以上予約してください。',
    capacityError: '予約容量を 60% 以上に増やしてください。',
    disabled: '無効な音量',
    end: '終了',
    ends: (value: string) => `${value} で終了します`,
    horizontal: '横向きの音量',
    maintenance: 'メンテナンス範囲',
    reserve: '容量を予約',
    reserved: (value: number) => `容量を ${value}% 予約しました。`,
    save: '音量を保存',
    saved: (value: number) => `音量 ${value} を保存しました。`,
    start: '開始',
    starts: (value: string) => `${value} で開始します`,
    vertical: '縦向きの音量',
    volume: '音量',
  },
} as const;

export function SliderPreview({
  'data-docs-example-item': docsExampleItem,
  defaultValue,
  disabled,
  label,
  onValueChange,
  orientation,
  uiSize = 'md',
  value,
}: SliderPreviewProps) {
  const stateProps =
    value === undefined ? { defaultValue: [defaultValue ?? 0] } : { value: [value] };
  return (
    <TRSlider.Root
      data-docs-example-item={docsExampleItem}
      {...stateProps}
      disabled={disabled}
      name="volume"
      onValueChange={(nextValue) =>
        onValueChange?.(Array.isArray(nextValue) ? nextValue : [nextValue as number])
      }
      orientation={orientation}
      uiSize={uiSize}
    >
      <TRSlider.Label>{label}</TRSlider.Label>
      <TRSlider.Value />
      <TRSlider.Control>
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb aria-label={label} />
      </TRSlider.Control>
    </TRSlider.Root>
  );
}

export function SliderStateComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-6 sm:grid-cols-2" data-docs-example-item-count={2}>
      <SliderPreview
        defaultValue={48}
        data-docs-example-item=""
        disabled={false}
        label={text.horizontal}
        orientation="horizontal"
      />
      <SliderPreview
        defaultValue={36}
        data-docs-example-item=""
        disabled={false}
        label={text.vertical}
        orientation="vertical"
      />
    </div>
  );
}

export function SliderSizeComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid w-full min-w-0 gap-6" data-docs-example-item-count={3}>
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <SliderPreview
          defaultValue={48}
          data-docs-example-item=""
          disabled={false}
          key={uiSize}
          label={`${uiSize.toUpperCase()} ${text.volume}`}
          orientation="horizontal"
          uiSize={uiSize}
        />
      ))}
    </div>
  );
}

export function SliderAvailabilityPreview() {
  const text = copy[useDemoLocale()];
  return (
    <SliderPreview
      data-docs-example-item=""
      defaultValue={82}
      disabled
      label={text.disabled}
      orientation="horizontal"
    />
  );
}

export function SliderRangePreview() {
  const locale = useDemoLocale();
  const text = copy[locale];
  return (
    <TRSlider.Root
      data-docs-example-item=""
      defaultValue={[20, 80]}
      format={{ maximumFractionDigits: 0, style: 'unit', unit: 'percent' }}
      locale={locale}
      minStepsBetweenValues={10}
      name="window"
    >
      <TRSlider.Label>{text.maintenance}</TRSlider.Label>
      <TRSlider.Value />
      <TRSlider.Control>
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb
          aria-label={text.start}
          getAriaValueText={text.starts}
          index={0}
        />
        <TRSlider.Thumb aria-label={text.end} getAriaValueText={text.ends} index={1} />
      </TRSlider.Control>
    </TRSlider.Root>
  );
}

export function SliderFormPreview() {
  const text = copy[useDemoLocale()];
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [value, setValue] = useState(48);
  return (
    <TRForm
      data-docs-example-item=""
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(value);
      }}
    >
      <SliderPreview
        disabled={false}
        label={text.volume}
        onValueChange={(values) => setValue(values[0] ?? 0)}
        orientation="horizontal"
        value={value}
      />
      <TRButton type="submit">{text.save}</TRButton>
      <output aria-live="polite">
        {submitted === null ? '' : text.saved(submitted)}
      </output>
    </TRForm>
  );
}

export function SliderValidationPreview() {
  const text = copy[useDemoLocale()];
  const errorId = useId();
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [value, setValue] = useState(30);
  const invalid = attempted && value < 60;

  return (
    <TRForm
      data-docs-example-item=""
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        if (value < 60) {
          setSubmitted(null);
          thumbInputRef.current?.focus();
          return;
        }
        setSubmitted(value);
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRSlider.Root
          name="capacity"
          onValueChange={(nextValue) => {
            setValue(
              Array.isArray(nextValue) ? (nextValue[0] ?? 0) : Number(nextValue),
            );
            setSubmitted(null);
          }}
          value={[value]}
        >
          <TRSlider.Label>{text.capacity}</TRSlider.Label>
          <TRSlider.Value />
          <TRSlider.Control>
            <TRSlider.Track>
              <TRSlider.Indicator />
            </TRSlider.Track>
            <TRSlider.Thumb
              aria-label={text.capacity}
              aria-describedby={invalid ? errorId : undefined}
              inputRef={thumbInputRef}
            />
          </TRSlider.Control>
        </TRSlider.Root>
        <TRField.Description>{text.capacityDescription}</TRField.Description>
        {invalid ? (
          <TRField.Error id={errorId} match>
            {text.capacityError}
          </TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">{text.reserve}</TRButton>
      <output aria-live="polite">
        {submitted === null ? '' : text.reserved(submitted)}
      </output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Slider',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Volume',
    orientation: 'horizontal',
    uiSize: 'md',
    value: 48,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <SliderPreview
        {...args}
        onValueChange={(values) => updateArgs({ value: values[0] ?? 0 })}
        value={args.value ?? 0}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
