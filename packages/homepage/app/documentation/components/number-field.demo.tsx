import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRNumberField } from '@tinyrack/ui/components/number-field';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  max: number;
  min: number;
  readOnly: boolean;
  step: number;
  value: number | null;
};

type NumberFieldPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  required?: boolean;
  value?: number | null;
};

export function NumberFieldPreview({
  defaultValue,
  disabled,
  label,
  max,
  min,
  onValueChange,
  readOnly,
  required,
  step,
  value,
}: NumberFieldPreviewProps) {
  const locale = useDemoLocale();
  const action = {
    en: { decrease: 'Decrease', increase: 'Increase' },
    ja: { decrease: '減らす', increase: '増やす' },
    ko: { decrease: '감소', increase: '증가' },
  }[locale];
  const inputId = useId();
  const labelId = useId();
  const normalizedMin = Number.isFinite(min) ? min : 0;
  const normalizedMax = Math.max(
    normalizedMin,
    Number.isFinite(max) ? max : normalizedMin,
  );
  const normalizedStep = Number.isFinite(step) && step > 0 ? step : 1;
  const clampValue = (nextValue: number) =>
    Math.min(normalizedMax, Math.max(normalizedMin, nextValue));
  const stateProps =
    value === undefined
      ? {
          defaultValue:
            defaultValue === undefined ? undefined : clampValue(defaultValue),
        }
      : { value: value === null ? null : clampValue(value) };

  return (
    <TRNumberField.Root
      {...stateProps}
      data-docs-example-item=""
      disabled={disabled}
      max={normalizedMax}
      min={normalizedMin}
      name="replicas"
      onValueChange={onValueChange}
      readOnly={readOnly}
      required={required}
      step={normalizedStep}
    >
      <TRNumberField.ScrubArea>
        <label htmlFor={inputId} id={labelId}>
          {label}
        </label>
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label={action.decrease}>−</TRNumberField.Decrement>
        <TRNumberField.Input aria-labelledby={labelId} id={inputId} />
        <TRNumberField.Increment aria-label={action.increase}>+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}

export function NumberFieldFormatPreview() {
  const locale = useDemoLocale();
  const copy = {
    en: { decrease: 'Decrease by 16 gigabytes', increase: 'Increase by 16 gigabytes', label: 'Storage capacity' },
    ja: { decrease: '16 ギガバイト減らす', increase: '16 ギガバイト増やす', label: 'ストレージ容量' },
    ko: { decrease: '16기가바이트 감소', increase: '16기가바이트 증가', label: '저장 용량' },
  }[locale];
  return (
    <TRNumberField.Root
      data-docs-example-item=""
      defaultValue={64}
      format={{ style: 'unit', unit: 'gigabyte', unitDisplay: 'short' }}
      max={256}
      min={16}
      name="storage"
      step={16}
    >
      <TRNumberField.ScrubArea>
        <label htmlFor="storage-capacity">{copy.label}</label>
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label={copy.decrease}>
          −
        </TRNumberField.Decrement>
        <TRNumberField.Input id="storage-capacity" />
        <TRNumberField.Increment aria-label={copy.increase}>
          +
        </TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}

export function NumberFieldStateComparison() {
  const copy = {
    en: { disabled: 'Disabled replicas', editable: 'Editable replicas', readOnly: 'Read-only replicas' },
    ja: { disabled: '無効なレプリカ', editable: '編集可能なレプリカ', readOnly: '読み取り専用のレプリカ' },
    ko: { disabled: '비활성 복제본', editable: '편집 가능한 복제본', readOnly: '읽기 전용 복제본' },
  }[useDemoLocale()];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <NumberFieldPreview
        defaultValue={3}
        disabled={false}
        label={copy.editable}
        max={20}
        min={0}
        readOnly={false}
        step={1}
      />
      <NumberFieldPreview
        defaultValue={8}
        disabled
        label={copy.disabled}
        max={20}
        min={0}
        readOnly={false}
        step={1}
      />
      <NumberFieldPreview
        defaultValue={12}
        disabled={false}
        label={copy.readOnly}
        max={20}
        min={0}
        readOnly
        step={1}
      />
    </div>
  );
}

export function NumberFieldValidationPreview() {
  const locale = useDemoLocale();
  const copy = {
    en: { button: 'Create service', error: 'Choose a replica count.', label: 'Replica count', result: (value: number) => `Creating ${value} replicas.` },
    ja: { button: 'サービスを作成', error: 'レプリカ数を選択してください。', label: 'レプリカ数', result: (value: number) => `${value} 個のレプリカを作成しています。` },
    ko: { button: '서비스 만들기', error: '복제본 수를 선택하세요.', label: '복제본 수', result: (value: number) => `복제본 ${value}개를 만들고 있어요.` },
  }[locale];
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const invalid = attempted && value === null;

  return (
    <TRForm
      className="grid w-80 max-w-full gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <NumberFieldPreview
          disabled={false}
          label={copy.label}
          max={20}
          min={0}
          onValueChange={setValue}
          readOnly={false}
          required
          step={1}
          value={value}
        />
        {invalid ? <TRField.Error match>{copy.error}</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">{copy.button}</TRButton>
      <output aria-live="polite">
        {attempted && value !== null ? copy.result(value) : ''}
      </output>
    </TRForm>
  );
}

export function NumberFieldLocalePreview() {
  const copy = {
    en: { decrease: 'Decrease budget', increase: 'Increase budget', label: 'Budget (de-DE)' },
    ja: { decrease: '予算を減らす', increase: '予算を増やす', label: '予算 (de-DE)' },
    ko: { decrease: '예산 감소', increase: '예산 증가', label: '예산 (de-DE)' },
  }[useDemoLocale()];
  return (
    <TRNumberField.Root
      data-docs-example-item=""
      defaultValue={1234.5}
      format={{ minimumFractionDigits: 2 }}
      locale="de-DE"
      name="budget"
      step={0.25}
    >
      <TRNumberField.ScrubArea>
        <label htmlFor="localized-budget">{copy.label}</label>
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label={copy.decrease}>
          −
        </TRNumberField.Decrement>
        <TRNumberField.Input id="localized-budget" />
        <TRNumberField.Increment aria-label={copy.increase}>
          +
        </TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}

export function NumberFieldResetPreview() {
  const copy = {
    en: { label: 'Replicas', reset: 'Reset', resetResult: 'Reset to 4 replicas.', submit: 'Submit' },
    ja: { label: 'レプリカ', reset: 'リセット', resetResult: '4 個のレプリカに戻しました。', submit: '送信' },
    ko: { label: '복제본', reset: '초기화', resetResult: '복제본 4개로 되돌렸어요.', submit: '제출' },
  }[useDemoLocale()];
  const [result, setResult] = useState('');

  return (
    <TRForm
      className="grid w-80 max-w-full gap-3"
      onReset={() => setResult(copy.resetResult)}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(
          `Submitted ${new FormData(event.currentTarget).get('replicas')} replicas.`,
        );
      }}
    >
      <NumberFieldPreview
        defaultValue={4}
        disabled={false}
        label={copy.label}
        max={20}
        min={0}
        readOnly={false}
        step={1}
      />
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">{copy.submit}</TRButton>
        <TRButton type="reset" variant="secondary">
          {copy.reset}
        </TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

export const numberFieldBasicSource = `import { TRNumberField } from '@tinyrack/ui/components/number-field';

export function ReplicaCount() {
  return (
    <TRNumberField.Root defaultValue={3} max={20} min={0} name="replicas">
      <TRNumberField.ScrubArea>
        <label htmlFor="replica-count">Replicas</label>
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease">−</TRNumberField.Decrement>
        <TRNumberField.Input id="replica-count" />
        <TRNumberField.Increment aria-label="Increase">+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}`;

export const numberFieldStatesSource = `import { TRNumberField } from '@tinyrack/ui/components/number-field';
import { useId } from 'react';

type NumberFieldSampleProps = {
  disabled?: boolean;
  label: string;
  readOnly?: boolean;
  value: number;
};

function NumberFieldSample({ disabled = false, label, readOnly = false, value }: NumberFieldSampleProps) {
  const id = useId();
  return (
    <TRNumberField.Root defaultValue={value} disabled={disabled} readOnly={readOnly}>
      <TRNumberField.ScrubArea><label htmlFor={id}>{label}</label></TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label={\`Decrease \${label}\`}>−</TRNumberField.Decrement>
        <TRNumberField.Input id={id} />
        <TRNumberField.Increment aria-label={\`Increase \${label}\`}>+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}

export function NumberFieldStates() {
  return (
    <div>
      <NumberFieldSample label="Editable replicas" value={3} />
      <NumberFieldSample disabled label="Disabled replicas" value={8} />
      <NumberFieldSample label="Read-only replicas" readOnly value={12} />
    </div>
  );
}`;

export const numberFieldValidationSource = `import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRNumberField } from '@tinyrack/ui/components/number-field';
import { useState } from 'react';

export function ReplicaForm() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const invalid = attempted && value === null;

  return (
    <TRForm noValidate onSubmit={(event) => { event.preventDefault(); setAttempted(true); }}>
      <TRField.Root invalid={invalid}>
        <TRNumberField.Root max={20} min={0} name="replicas" onValueChange={setValue} required value={value}>
          <TRNumberField.Group>
            <TRNumberField.Decrement aria-label="Decrease">−</TRNumberField.Decrement>
            <TRNumberField.Input aria-label="Replica count" />
            <TRNumberField.Increment aria-label="Increase">+</TRNumberField.Increment>
          </TRNumberField.Group>
        </TRNumberField.Root>
        {invalid ? <TRField.Error match>Choose a replica count.</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">Create service</TRButton>
    </TRForm>
  );
}`;

export const numberFieldFormatSource = `import { TRNumberField } from '@tinyrack/ui/components/number-field';

export function StorageCapacity() {
  return (
    <TRNumberField.Root defaultValue={64} format={{ style: 'unit', unit: 'gigabyte' }} max={256} min={16} name="storage" step={16}>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease by 16 gigabytes">−</TRNumberField.Decrement>
        <TRNumberField.Input aria-label="Storage capacity" />
        <TRNumberField.Increment aria-label="Increase by 16 gigabytes">+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}`;

export const numberFieldLocaleSource = `import { TRNumberField } from '@tinyrack/ui/components/number-field';

export function LocalizedBudget() {
  return (
    <TRNumberField.Root defaultValue={1234.5} format={{ minimumFractionDigits: 2 }} locale="de-DE" name="budget" step={0.25}>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease budget">−</TRNumberField.Decrement>
        <TRNumberField.Input aria-label="Budget (de-DE)" />
        <TRNumberField.Increment aria-label="Increase budget">+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}`;

export const numberFieldResetSource = `import { TRButton } from '@tinyrack/ui/components/button';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRNumberField } from '@tinyrack/ui/components/number-field';

export function ResettableReplicas() {
  return (
    <TRForm>
      <TRNumberField.Root defaultValue={4} max={20} min={0} name="replicas">
        <TRNumberField.Group>
          <TRNumberField.Decrement aria-label="Decrease replicas">−</TRNumberField.Decrement>
          <TRNumberField.Input aria-label="Replicas" />
          <TRNumberField.Increment aria-label="Increase replicas">+</TRNumberField.Increment>
        </TRNumberField.Group>
      </TRNumberField.Root>
      <TRButton type="submit">Submit</TRButton>
      <TRButton type="reset" variant="secondary">Reset</TRButton>
    </TRForm>
  );
}`;

const meta = {
  title: 'Components/Number Field',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Replicas',
    max: 20,
    min: 0,
    readOnly: false,
    step: 1,
    value: 3,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    max: { control: { type: 'number' } },
    min: { control: { type: 'number' } },
    readOnly: { control: 'boolean' },
    step: { control: { type: 'number', min: 0.1 } },
  },
  localizedArgs: {
    ja: { label: 'レプリカ数' },
    ko: { label: '복제본 수' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <NumberFieldPreview {...args} onValueChange={(value) => updateArgs({ value })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
