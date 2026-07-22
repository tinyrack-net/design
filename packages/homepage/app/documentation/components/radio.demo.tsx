import type { TRRadioUiSize } from '@tinyrack/ui/components/radio';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: {
    primary: 'Primary rack',
    alternate: 'Secondary rack',
    group: 'Deployment rack',
    selected: 'Selected',
    selection: ['Unselected', 'Selected'],
    availability: ['Editable', 'Read only', 'Disabled'],
    sizes: 'Radio sizes',
    plan: 'Support plan',
    plans: [
      'Standard · Community support',
      'Priority · 4-hour response',
      'Critical · 24/7 response',
    ],
    selectedPlan: 'Selected plan',
  },
  ko: {
    primary: '기본 랙',
    alternate: '보조 랙',
    group: '배포 랙',
    selected: '선택한 값',
    selection: ['선택 안 함', '선택함'],
    availability: ['편집할 수 있어요', '읽기 전용이에요', '사용할 수 없어요'],
    sizes: '라디오 크기',
    plan: '지원 요금제',
    plans: ['표준 · 커뮤니티 지원', '우선 · 4시간 내 응답', '긴급 · 연중무휴 응답'],
    selectedPlan: '선택한 요금제',
  },
  ja: {
    primary: 'プライマリラック',
    alternate: 'セカンダリラック',
    group: 'デプロイ先ラック',
    selected: '選択中',
    selection: ['未選択', '選択済み'],
    availability: ['編集可能', '読み取り専用', '無効'],
    sizes: 'ラジオのサイズ',
    plan: 'サポートプラン',
    plans: [
      'スタンダード · コミュニティサポート',
      '優先 · 4 時間以内の応答',
      '緊急 · 24 時間 365 日対応',
    ],
    selectedPlan: '選択中のプラン',
  },
} as const;

import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  readOnly: boolean;
  uiSize: TRRadioUiSize;
  value: string;
};

type RadioPreviewProps = Omit<StoryArgs, 'uiSize' | 'value'> & {
  alternateLabel?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  uiSize?: TRRadioUiSize;
  value?: string;
};

export function RadioPreview({
  alternateLabel,
  defaultValue = 'primary',
  disabled,
  label,
  onValueChange,
  readOnly,
  uiSize = 'md',
  value,
}: RadioPreviewProps) {
  const text = copy[useDemoLocale()];
  const resolvedAlternateLabel = alternateLabel ?? text.alternate;
  const inputId = useId();
  const alternateId = `${inputId}-alternate`;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <div className="grid gap-3">
      <TRRadioGroup
        data-docs-example-item=""
        {...stateProps}
        aria-label={text.group}
        className="grid gap-2"
        name={`rack-${inputId}`}
        onValueChange={(nextValue) => {
          const nextStringValue = String(nextValue);
          setUncontrolledValue(nextStringValue);
          onValueChange?.(nextStringValue);
        }}
        readOnly={readOnly}
      >
        <label className="flex min-h-6 items-center gap-2" htmlFor={inputId}>
          <TRRadio.Root
            disabled={disabled}
            id={inputId}
            uiSize={uiSize}
            value="primary"
          >
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          <span className={disabled ? 'text-tinyrack-text-muted' : undefined}>
            {label}
          </span>
        </label>
        <label className="flex min-h-6 items-center gap-2" htmlFor={alternateId}>
          <TRRadio.Root id={alternateId} uiSize={uiSize} value="alternate">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          {resolvedAlternateLabel}
        </label>
      </TRRadioGroup>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        {text.selected}:{' '}
        {selectedValue === 'alternate' ? resolvedAlternateLabel : label}
      </output>
    </div>
  );
}

function RadioStateSample({
  disabled = false,
  label,
  readOnly = false,
  selected,
}: {
  disabled?: boolean;
  label: string;
  readOnly?: boolean;
  selected: boolean;
}) {
  const id = useId();

  return (
    <TRRadioGroup aria-label={label} value={selected ? 'sample' : 'other'}>
      <label className="flex min-h-6 items-center gap-2" htmlFor={id}>
        <TRRadio.Root
          data-docs-example-item=""
          disabled={disabled}
          id={id}
          readOnly={readOnly}
          value="sample"
        >
          <TRRadio.Indicator aria-hidden="true" />
        </TRRadio.Root>
        <span className={disabled ? 'text-tinyrack-text-muted' : undefined}>
          {label}
        </span>
      </label>
    </TRRadioGroup>
  );
}

export function RadioStateComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RadioStateSample label={text.selection[0]} selected={false} />
      <RadioStateSample label={text.selection[1]} selected />
    </div>
  );
}

export function RadioAvailabilityComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <RadioStateSample label={text.availability[0]} selected />
      <RadioStateSample label={text.availability[1]} readOnly selected />
      <RadioStateSample disabled label={text.availability[2]} selected />
    </div>
  );
}

export function RadioSizeComparison() {
  const text = copy[useDemoLocale()];
  const groupId = useId();

  return (
    <TRRadioGroup aria-label={text.sizes} className="flex items-end gap-6" value="sm">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <label
          className="grid min-h-10 place-items-center gap-1"
          htmlFor={`${groupId}-${uiSize}`}
          key={uiSize}
        >
          <TRRadio.Root
            data-docs-example-item=""
            id={`${groupId}-${uiSize}`}
            uiSize={uiSize}
            value={uiSize}
          >
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          <span className="text-tinyrack-sm">{uiSize}</span>
        </label>
      ))}
    </TRRadioGroup>
  );
}

export function RadioPlanExample() {
  const text = copy[useDemoLocale()];
  const [value, setValue] = useState('standard');
  const groupId = useId();

  return (
    <div className="grid gap-3">
      <TRRadioGroup
        data-docs-example-item=""
        aria-label={text.plan}
        className="grid gap-2"
        name="support-plan"
        onValueChange={(nextValue) => setValue(String(nextValue))}
        value={value}
      >
        {(['standard', 'priority', 'critical'] as const).map((optionValue, index) => (
          <label
            className="flex min-h-6 items-center gap-2"
            htmlFor={`${groupId}-${optionValue}`}
            key={optionValue}
          >
            <TRRadio.Root id={`${groupId}-${optionValue}`} value={optionValue}>
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            {text.plans[index]}
          </label>
        ))}
      </TRRadioGroup>
      <output aria-live="polite">
        {text.selectedPlan}: {value}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Radio',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Primary rack',
    readOnly: false,
    uiSize: 'md',
    value: 'primary',
  },
  localizedArgs: {
    ja: { label: copy.ja.primary },
    ko: { label: copy.ko.primary },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return <RadioPreview {...args} onValueChange={(value) => updateArgs({ value })} />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
