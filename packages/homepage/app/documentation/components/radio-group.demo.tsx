import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRForm } from '@tinyrack/ui/components/form';
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
    rack: 'Rack',
    options: ['Alpha', 'Beta', 'Gamma'],
    states: ['Editable', 'Read only', 'Disabled'],
    primary: 'Primary rack',
    error: 'Choose a primary rack to continue.',
    continue: 'Continue',
    result: 'Primary rack',
    resetMessage: 'Reset to alpha.',
    submitted: 'Submitted',
    submit: 'Submit external group',
    reset: 'Reset',
    outside: 'Rack outside the form',
    selected: 'Selected rack',
  },
  ko: {
    rack: '랙',
    options: ['알파', '베타', '감마'],
    states: ['편집 가능', '읽기 전용', '사용 불가'],
    primary: '기본 랙',
    error: '계속하려면 기본 랙을 선택하세요.',
    continue: '계속',
    result: '기본 랙',
    resetMessage: '알파로 초기화했어요.',
    submitted: '제출한 값',
    submit: '외부 그룹 제출',
    reset: '초기화',
    outside: '폼 밖의 랙',
    selected: '선택한 랙',
  },
  ja: {
    rack: 'ラック',
    options: ['アルファ', 'ベータ', 'ガンマ'],
    states: ['編集可能', '読み取り専用', '無効'],
    primary: 'プライマリラック',
    error: '続行するにはプライマリラックを選択してください。',
    continue: '続行',
    result: 'プライマリラック',
    resetMessage: 'アルファにリセットしました。',
    submitted: '送信値',
    submit: 'フォーム外の選択内容を送信',
    reset: 'リセット',
    outside: 'フォーム外のラック',
    selected: '選択中のラック',
  },
} as const;

import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  readOnly: boolean;
  value: string;
};

type RadioGroupPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: string;
  form?: string;
  label?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  value?: string;
};

const optionValues = ['alpha', 'beta', 'gamma'] as const;

export function RadioGroupPreview({
  defaultValue,
  disabled,
  form,
  label,
  name = 'rack',
  onValueChange,
  readOnly,
  required = false,
  value,
}: RadioGroupPreviewProps) {
  const text = copy[useDemoLocale()];
  const resolvedLabel = label ?? text.rack;
  const radioOptions = optionValues.map((optionValue, index) => ({
    label: text.options[index] ?? optionValue,
    value: optionValue,
  }));
  const baseId = useId();
  const legendId = `${baseId}-legend`;
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <TRFieldset.Root
      className="w-full max-w-80"
      data-docs-example-item=""
      disabled={disabled}
    >
      <TRFieldset.Legend id={legendId}>{resolvedLabel}</TRFieldset.Legend>
      <TRRadioGroup
        {...stateProps}
        aria-labelledby={legendId}
        disabled={disabled}
        form={form}
        name={name}
        onValueChange={(nextValue) => onValueChange?.(nextValue as string)}
        readOnly={readOnly}
        required={required}
      >
        {radioOptions.map((option) => (
          // biome-ignore lint/a11y/noLabelWithoutControl: TRRadio.Root renders the native radio input inside this label.
          <label
            className={`flex items-center gap-2 ${
              disabled
                ? 'cursor-not-allowed'
                : readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer'
            }`}
            key={option.value}
          >
            <TRRadio.Root aria-label={option.label} value={option.value}>
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            <span
              style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
            >
              {option.label}
            </span>
          </label>
        ))}
      </TRRadioGroup>
    </TRFieldset.Root>
  );
}

export const radioGroupBasicSource = `import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';

const rackOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
] as const;

export function DeploymentRack() {
  return (
    <TRFieldset.Root>
      <TRFieldset.Legend>Deployment rack</TRFieldset.Legend>
      <TRRadioGroup defaultValue="alpha" name="rack">
        {rackOptions.map((option) => (
          <label
            className="flex items-center gap-2"
            htmlFor={'rack-' + option.value}
            key={option.value}
          >
            <TRRadio.Root id={'rack-' + option.value} value={option.value}>
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            <span>{option.label}</span>
          </label>
        ))}
      </TRRadioGroup>
    </TRFieldset.Root>
  );
}`;

export function RadioGroupStateComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <RadioGroupPreview
        defaultValue="alpha"
        disabled={false}
        label={text.states[0]}
        readOnly={false}
        required={false}
      />
      <RadioGroupPreview
        defaultValue="beta"
        disabled={false}
        label={text.states[1]}
        readOnly
        required={false}
      />
      <RadioGroupPreview
        defaultValue="gamma"
        disabled
        label={text.states[2]}
        readOnly={false}
        required={false}
      />
    </div>
  );
}

export const radioGroupStatesSource = `import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
import { useId } from 'react';

const rackOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
] as const;

function RackGroup({
  defaultValue,
  disabled = false,
  label,
  readOnly = false,
}: {
  defaultValue: string;
  disabled?: boolean;
  label: string;
  readOnly?: boolean;
}) {
  const baseId = useId();
  const legendId = baseId + '-legend';

  return (
    <TRFieldset.Root className="w-full max-w-80" disabled={disabled}>
      <TRFieldset.Legend id={legendId}>{label}</TRFieldset.Legend>
      <TRRadioGroup
        aria-labelledby={legendId}
        defaultValue={defaultValue}
        disabled={disabled}
        name={baseId + '-rack'}
        readOnly={readOnly}
      >
        {rackOptions.map((option) => (
          <label className="flex items-center gap-2" key={option.value}>
            <TRRadio.Root aria-label={option.label} value={option.value}>
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            <span>{option.label}</span>
          </label>
        ))}
      </TRRadioGroup>
    </TRFieldset.Root>
  );
}

export function RadioGroupStates() {
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <RackGroup defaultValue="alpha" label="Editable" />
      <RackGroup defaultValue="beta" disabled label="Disabled" />
      <RackGroup defaultValue="gamma" label="Read only" readOnly />
    </div>
  );
}`;

export function RadioGroupValidationPreview() {
  const text = copy[useDemoLocale()];
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.length === 0;

  return (
    <TRForm
      className="grid min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <RadioGroupPreview
          disabled={false}
          label={text.primary}
          onValueChange={setValue}
          readOnly={false}
          required
          value={value}
        />
        {invalid ? <TRField.Error match>{text.error}</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">{text.continue}</TRButton>
      <output aria-live="polite">
        {attempted && value ? `${text.result}: ${value}.` : ''}
      </output>
    </TRForm>
  );
}

export function RadioGroupExternalFormPreview() {
  const text = copy[useDemoLocale()];
  const formId = useId();
  const [result, setResult] = useState('');

  return (
    <div className="grid min-w-0 gap-3">
      <TRForm
        className="flex flex-wrap gap-2"
        id={formId}
        onReset={() => setResult(text.resetMessage)}
        onSubmit={(event) => {
          event.preventDefault();
          setResult(
            `${text.submitted}: ${new FormData(event.currentTarget).get('rack')}`,
          );
        }}
      >
        <TRButton type="submit">{text.submit}</TRButton>
        <TRButton type="reset" variant="secondary">
          {text.reset}
        </TRButton>
      </TRForm>
      <RadioGroupPreview
        defaultValue="alpha"
        disabled={false}
        form={formId}
        label={text.outside}
        name="rack"
        readOnly={false}
        required
      />
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export const radioGroupValidationSource = `import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
import { useId, useState } from 'react';

const rackOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
] as const;

export function RequiredRack() {
  const baseId = useId();
  const legendId = baseId + '-legend';
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value === '';

  return (
    <TRForm
      className="grid min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRFieldset.Root className="w-full max-w-80">
          <TRFieldset.Legend id={legendId}>Primary rack</TRFieldset.Legend>
          <TRRadioGroup
            aria-labelledby={legendId}
            name="rack"
            onValueChange={(nextValue) => setValue(nextValue as string)}
            required
            value={value}
          >
            {rackOptions.map((option) => (
              <label className="flex items-center gap-2" key={option.value}>
                <TRRadio.Root aria-label={option.label} value={option.value}>
                  <TRRadio.Indicator aria-hidden="true" />
                </TRRadio.Root>
                <span>{option.label}</span>
              </label>
            ))}
          </TRRadioGroup>
        </TRFieldset.Root>
        {invalid ? (
          <TRField.Error match>Choose a primary rack to continue.</TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">
        {attempted && value ? 'Primary rack: ' + value + '.' : ''}
      </output>
    </TRForm>
  );
}`;

export const radioGroupExternalFormSource = `import { TRButton } from '@tinyrack/ui/components/button';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
import { useId, useState } from 'react';

export function ExternalRackForm() {
  const formId = useId();
  const [result, setResult] = useState('');

  return (
    <div className="grid gap-3">
      <TRForm
        id={formId}
        onReset={() => setResult('Reset to alpha.')}
        onSubmit={(event) => {
          event.preventDefault();
          setResult('Submitted: ' + new FormData(event.currentTarget).get('rack'));
        }}
      >
        <TRButton type="submit">Submit</TRButton>
        <TRButton type="reset">Reset</TRButton>
      </TRForm>
      <TRFieldset.Root>
        <TRFieldset.Legend>Rack outside the form</TRFieldset.Legend>
        <TRRadioGroup defaultValue="alpha" form={formId} name="rack" required>
          <label htmlFor="external-rack-alpha">
            <TRRadio.Root id="external-rack-alpha" value="alpha">
              <TRRadio.Indicator />
            </TRRadio.Root>
            Alpha
          </label>
          <label htmlFor="external-rack-beta">
            <TRRadio.Root id="external-rack-beta" value="beta">
              <TRRadio.Indicator />
            </TRRadio.Root>
            Beta
          </label>
        </TRRadioGroup>
      </TRFieldset.Root>
      <output aria-live="polite">{result}</output>
    </div>
  );
}`;

const meta = {
  title: 'Components/Radio Group',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    readOnly: false,
    value: 'alpha',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  render: function Render(args) {
    const text = copy[useDemoLocale()];
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <div className="grid gap-3">
        <RadioGroupPreview {...args} onValueChange={(value) => updateArgs({ value })} />
        <output aria-live="polite">
          {text.selected}: {args.value}
        </output>
      </div>
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
