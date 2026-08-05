import { TRField } from '@tinyrack/ui/components/field';
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
    availability: ['편집 가능', '읽기 전용', '사용 불가'],
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
  const groupId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <div className="grid gap-3">
      <TRField.Root>
        <TRRadioGroup
          data-docs-example-item=""
          {...stateProps}
          aria-label={text.group}
          className="grid gap-2"
          name={`rack-${groupId}`}
          onValueChange={(nextValue) => {
            const nextStringValue = String(nextValue);
            setUncontrolledValue(nextStringValue);
            onValueChange?.(nextStringValue);
          }}
          readOnly={readOnly}
        >
          <TRField.Item className="min-h-6 items-center gap-2">
            <TRRadio.Root disabled={disabled} uiSize={uiSize} value="primary">
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            <TRField.Label
              className={`normal-case tracking-normal font-normal${
                disabled ? ' text-tinyrack-text-muted' : ''
              }`}
            >
              {label}
            </TRField.Label>
          </TRField.Item>
          <TRField.Item className="min-h-6 items-center gap-2">
            <TRRadio.Root uiSize={uiSize} value="alternate">
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            <TRField.Label className="normal-case tracking-normal font-normal">
              {resolvedAlternateLabel}
            </TRField.Label>
          </TRField.Item>
        </TRRadioGroup>
      </TRField.Root>
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
  return (
    <TRField.Root>
      <TRRadioGroup aria-label={label} value={selected ? 'sample' : 'other'}>
        <TRField.Item className="min-h-6 items-center gap-2">
          <TRRadio.Root
            data-docs-example-item=""
            disabled={disabled}
            readOnly={readOnly}
            value="sample"
          >
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          <TRField.Label
            className={`normal-case tracking-normal font-normal${
              disabled ? ' text-tinyrack-text-muted' : ''
            }`}
          >
            {label}
          </TRField.Label>
        </TRField.Item>
      </TRRadioGroup>
    </TRField.Root>
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

  return (
    <TRField.Root>
      <TRRadioGroup aria-label={text.sizes} className="flex items-end gap-6" value="sm">
        {(['md', 'lg'] as const).map((uiSize) => (
          <TRField.Item className="grid min-h-10 place-items-center gap-1" key={uiSize}>
            <TRRadio.Root data-docs-example-item="" uiSize={uiSize} value={uiSize}>
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            <TRField.Label className="text-tinyrack-sm normal-case tracking-normal font-normal">
              {uiSize}
            </TRField.Label>
          </TRField.Item>
        ))}
      </TRRadioGroup>
    </TRField.Root>
  );
}

export function RadioPlanExample() {
  const text = copy[useDemoLocale()];
  const [value, setValue] = useState('standard');

  return (
    <div className="grid gap-3">
      <TRField.Root>
        <TRRadioGroup
          data-docs-example-item=""
          aria-label={text.plan}
          className="grid gap-2"
          name="support-plan"
          onValueChange={(nextValue) => setValue(String(nextValue))}
          value={value}
        >
          {(['standard', 'priority', 'critical'] as const).map((optionValue, index) => (
            <TRField.Item className="min-h-6 items-center gap-2" key={optionValue}>
              <TRRadio.Root value={optionValue}>
                <TRRadio.Indicator aria-hidden="true" />
              </TRRadio.Root>
              <TRField.Label className="normal-case tracking-normal font-normal">
                {text.plans[index]}
              </TRField.Label>
            </TRField.Item>
          ))}
        </TRRadioGroup>
      </TRField.Root>
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
    uiSize: { control: 'select', options: ['md', 'lg'] },
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
