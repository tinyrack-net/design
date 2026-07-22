import { TRButton } from '@tinyrack/ui/components/button';
import { TRCheckbox } from '@tinyrack/ui/components/checkbox';
import { TRCheckboxGroup } from '@tinyrack/ui/components/checkbox-group';
import { TRForm } from '@tinyrack/ui/components/form';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: {
    options: ['Metrics', 'Alerts', 'Automated backups'],
    states: ['Editable features', 'Read-only features', 'Disabled features'],
    selectAll: 'Select all',
    selected: 'Selected',
    none: 'none',
    permissions: 'Rack permissions',
    external: 'External features',
    resetMessage: 'Reset to metrics.',
    submitted: 'Submitted',
    submitExternal: 'Submit external group',
    reset: 'Reset',
    included: 'Included features',
    min: 'Select at least one feature.',
    max: 'Select no more than two features.',
    save: 'Save features',
    saved: 'Saved',
    playground: 'Rack features',
  },
  ko: {
    options: ['지표', '알림', '자동 백업'],
    states: ['편집할 수 있는 기능', '읽기 전용 기능', '사용할 수 없는 기능'],
    selectAll: '모두 선택해요',
    selected: '선택한 값',
    none: '없어요',
    permissions: '랙 권한',
    external: '외부 폼 기능',
    resetMessage: '지표로 초기화했어요.',
    submitted: '제출한 값',
    submitExternal: '외부 그룹 제출',
    reset: '초기화',
    included: '포함할 기능',
    min: '기능을 하나 이상 선택하세요.',
    max: '기능을 두 개까지만 선택하세요.',
    save: '기능 저장',
    saved: '저장한 값',
    playground: '랙 기능',
  },
  ja: {
    options: ['メトリクス', 'アラート', '自動バックアップ'],
    states: ['編集可能な機能', '読み取り専用の機能', '無効な機能'],
    selectAll: 'すべて選択',
    selected: '選択中',
    none: 'なし',
    permissions: 'ラック権限',
    external: '外部フォームの機能',
    resetMessage: 'メトリクスにリセットしました。',
    submitted: '送信値',
    submitExternal: 'フォーム外の選択内容を送信',
    reset: 'リセット',
    included: '含める機能',
    min: '機能を1つ以上選択してください。',
    max: '機能は2つまで選択してください。',
    save: '機能を保存',
    saved: '保存値',
    playground: 'ラック機能',
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
  selectedValues: string[];
};

type CheckboxGroupPreviewProps = Omit<StoryArgs, 'readOnly' | 'selectedValues'> & {
  descriptionId?: string;
  defaultSelectedValues?: string[];
  invalid?: boolean;
  onSelectedValuesChange?: (selectedValues: string[]) => void;
  readOnly?: boolean;
  selectedValues?: string[];
};

const optionValues = ['metrics', 'alerts', 'backups'] as const;

export function CheckboxGroupPreview({
  descriptionId,
  defaultSelectedValues,
  disabled,
  invalid,
  label,
  onSelectedValuesChange,
  readOnly = false,
  selectedValues,
}: CheckboxGroupPreviewProps) {
  const text = copy[useDemoLocale()];
  const checkboxGroupOptions = optionValues.map((value, index) => ({
    label: text.options[index] ?? value,
    value,
  }));
  const baseId = useId();
  const labelId = useId();
  const stateProps =
    selectedValues === undefined
      ? { defaultValue: defaultSelectedValues }
      : { value: selectedValues };

  return (
    <div className="grid gap-2" data-docs-example-item="">
      <strong id={labelId}>{label}</strong>
      <TRCheckboxGroup
        {...stateProps}
        aria-describedby={descriptionId}
        aria-invalid={invalid || undefined}
        aria-labelledby={labelId}
        disabled={disabled}
        onValueChange={onSelectedValuesChange}
      >
        {checkboxGroupOptions.map((option, index) => {
          const inputId = `${baseId}-${index}`;
          const optionLabelId = `${inputId}-label`;
          return (
            <div className="flex items-center gap-2" key={option.value}>
              <TRCheckbox.Root
                aria-labelledby={optionLabelId}
                id={inputId}
                name="rack-features"
                readOnly={readOnly}
                value={option.value}
              >
                <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
              </TRCheckbox.Root>
              <label
                className={
                  disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'
                }
                htmlFor={inputId}
                id={optionLabelId}
                style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </TRCheckboxGroup>
    </div>
  );
}

export function CheckboxGroupStateComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <CheckboxGroupPreview
        defaultSelectedValues={['metrics', 'backups']}
        disabled={false}
        label={text.states[0]}
      />
      <CheckboxGroupPreview
        defaultSelectedValues={['alerts']}
        disabled={false}
        label={text.states[1]}
        readOnly
      />
      <CheckboxGroupPreview
        defaultSelectedValues={['backups']}
        disabled
        label={text.states[2]}
      />
    </div>
  );
}

export function CheckboxGroupParentPreview() {
  const text = copy[useDemoLocale()];
  const checkboxGroupOptions = optionValues.map((value, index) => ({
    label: text.options[index] ?? value,
    value,
  }));
  const allValues = [...optionValues];
  const [value, setValue] = useState<string[]>(['metrics']);

  return (
    <TRCheckboxGroup
      data-docs-example-item=""
      allValues={allValues}
      aria-label={text.permissions}
      onValueChange={setValue}
      value={value}
    >
      {/* TRCheckbox.Root renders its native input inside this label. */}
      {/* biome-ignore lint/a11y/noLabelWithoutControl: the custom control owns the nested input */}
      <label className="flex min-h-6 items-center gap-2 font-semibold">
        <TRCheckbox.Root parent>
          <TRCheckbox.Indicator
            render={(props, state) => (
              <span {...props}>{state.indeterminate ? '−' : '✓'}</span>
            )}
          />
        </TRCheckbox.Root>
        {text.selectAll}
      </label>
      {checkboxGroupOptions.map((option) => (
        // biome-ignore lint/a11y/noLabelWithoutControl: the custom control owns the nested input
        <label className="flex min-h-6 items-center gap-2" key={option.value}>
          <TRCheckbox.Root name="permissions" value={option.value}>
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          {option.label}
        </label>
      ))}
      <output aria-live="polite">
        {text.selected}: {value.join(', ') || text.none}
      </output>
    </TRCheckboxGroup>
  );
}

export function CheckboxGroupExternalFormPreview() {
  const text = copy[useDemoLocale()];
  const checkboxGroupOptions = optionValues.map((value, index) => ({
    label: text.options[index] ?? value,
    value,
  }));
  const formId = useId();
  const groupId = useId();
  const [result, setResult] = useState('');

  return (
    <div className="grid gap-3">
      <TRForm
        id={formId}
        onReset={() => setResult(text.resetMessage)}
        onSubmit={(event) => {
          event.preventDefault();
          setResult(
            `${text.submitted}: ${new FormData(event.currentTarget).getAll('features').join(', ')}`,
          );
        }}
      >
        <div className="flex flex-wrap gap-2">
          <TRButton type="submit">{text.submitExternal}</TRButton>
          <TRButton type="reset" variant="secondary">
            {text.reset}
          </TRButton>
        </div>
      </TRForm>
      <TRCheckboxGroup
        aria-label={text.external}
        data-docs-example-item=""
        defaultValue={['metrics']}
      >
        {checkboxGroupOptions.slice(0, 2).map((option) => (
          <label
            className="flex min-h-6 items-center gap-2"
            htmlFor={`${groupId}-${option.value}`}
            key={option.value}
          >
            <TRCheckbox.Root
              form={formId}
              id={`${groupId}-${option.value}`}
              name="features"
              value={option.value}
            >
              <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
            </TRCheckbox.Root>
            {option.label}
          </label>
        ))}
      </TRCheckboxGroup>
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export function CheckboxGroupFormPreview() {
  const text = copy[useDemoLocale()];
  const errorId = useId();
  const [attempted, setAttempted] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(['metrics']);
  const [submittedValues, setSubmittedValues] = useState<string[]>([]);
  const invalid = attempted && (selectedValues.length < 1 || selectedValues.length > 2);
  const errorMessage = selectedValues.length < 1 ? text.min : text.max;

  return (
    <TRForm
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        const values = new FormData(event.currentTarget)
          .getAll('rack-features')
          .map((value) => String(value));
        setSubmittedValues(values.length >= 1 && values.length <= 2 ? values : []);
      }}
    >
      <CheckboxGroupPreview
        {...(invalid ? { descriptionId: errorId } : {})}
        disabled={false}
        invalid={invalid}
        label={text.included}
        onSelectedValuesChange={(values) => {
          setSelectedValues(values);
          setSubmittedValues([]);
        }}
        selectedValues={selectedValues}
      />
      {invalid ? (
        <p className="m-0 text-sm text-tinyrack-danger" id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <TRButton type="submit">{text.save}</TRButton>
      <output aria-live="polite">
        {submittedValues.length > 0
          ? `${text.saved}: ${submittedValues.join(', ')}.`
          : ''}
      </output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Checkbox Group',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Rack features',
    readOnly: false,
    selectedValues: ['metrics', 'backups'],
  },
  localizedArgs: {
    ja: { label: copy.ja.playground },
    ko: { label: copy.ko.playground },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <CheckboxGroupPreview
        {...args}
        onSelectedValuesChange={(selectedValues) => updateArgs({ selectedValues })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
