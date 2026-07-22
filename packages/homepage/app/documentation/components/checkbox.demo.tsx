import { TRButton } from '@tinyrack/ui/components/button';
import type { TRCheckboxUiSize } from '@tinyrack/ui/components/checkbox';
import { TRCheckbox } from '@tinyrack/ui/components/checkbox';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: {
    backup: 'Enable backups',
    sizes: 'Control size',
    states: ['Unchecked', 'Checked', 'Mixed'],
    availability: ['Editable', 'Read only', 'Disabled'],
    monitoring: 'Monitoring outside the form',
    submitted: 'Submitted',
    resetMessage: 'Reset to disabled.',
    read: 'Read form value',
    reset: 'Reset',
    agreement: 'I accept the maintenance window.',
    error: 'Accept the maintenance window to continue.',
    continue: 'Continue',
    accepted: 'Maintenance window accepted.',
  },
  ko: {
    backup: '백업 사용',
    sizes: '컨트롤 크기',
    states: ['선택 안 함', '선택함', '일부 선택'],
    availability: ['편집 가능', '읽기 전용', '사용 불가'],
    monitoring: '폼 밖에서 모니터링',
    submitted: '제출한 값',
    resetMessage: '사용 안 함으로 초기화했어요.',
    read: '폼 값 읽기',
    reset: '초기화',
    agreement: '유지보수 시간에 동의',
    error: '계속하려면 유지보수 시간에 동의하세요.',
    continue: '계속',
    accepted: '유지보수 시간에 동의했어요.',
  },
  ja: {
    backup: 'バックアップを有効にする',
    sizes: 'コントロールのサイズ',
    states: ['未選択', '選択済み', '一部選択'],
    availability: ['編集可能', '読み取り専用', '無効'],
    monitoring: 'フォーム外のモニタリング',
    submitted: '送信値',
    resetMessage: '無効にリセットしました。',
    read: 'フォーム値を確認',
    reset: 'リセット',
    agreement: 'メンテナンス時間帯に同意する',
    error: '続行するにはメンテナンス時間帯に同意してください。',
    continue: '続行',
    accepted: 'メンテナンス時間帯に同意しました。',
  },
} as const;

type StoryArgs = {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  label: string;
  readOnly: boolean;
  uiSize: TRCheckboxUiSize;
};

type CheckboxPreviewProps = Omit<StoryArgs, 'checked' | 'uiSize'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  form?: string;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
  uiSize?: TRCheckboxUiSize;
  uncheckedValue?: string;
  value?: string;
};

export function CheckboxPreview({
  checked,
  defaultChecked,
  disabled,
  form,
  indeterminate,
  label,
  name = 'backups',
  onCheckedChange,
  readOnly,
  required = false,
  uiSize = 'md',
  uncheckedValue,
  value,
}: CheckboxPreviewProps) {
  const inputId = useId();
  const stateProps = checked === undefined ? { defaultChecked } : { checked };

  return (
    <div className="flex items-center gap-2" data-docs-example-item="">
      <TRCheckbox.Root
        {...stateProps}
        disabled={disabled}
        form={form}
        id={inputId}
        indeterminate={indeterminate}
        name={name}
        onCheckedChange={onCheckedChange}
        readOnly={readOnly}
        required={required}
        uiSize={uiSize}
        uncheckedValue={uncheckedValue}
        value={value}
      >
        <TRCheckbox.Indicator
          aria-hidden="true"
          render={(props, state) => (
            <span {...props}>{state.indeterminate ? '−' : '✓'}</span>
          )}
        />
      </TRCheckbox.Root>
      <label
        className={
          disabled
            ? 'cursor-not-allowed text-tinyrack-text-muted'
            : readOnly
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
        }
        htmlFor={inputId}
      >
        {label}
      </label>
    </div>
  );
}

function CheckboxStateSample({
  checked = false,
  disabled = false,
  indeterminate = false,
  readOnly = false,
  title,
}: {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  readOnly?: boolean;
  title: string;
}) {
  return (
    <div className="grid gap-2">
      <strong>{title}</strong>
      <CheckboxPreview
        defaultChecked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        label={title}
        readOnly={readOnly}
        required={false}
      />
    </div>
  );
}

export function CheckboxStateComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <CheckboxStateSample title={text.states[0]} />
      <CheckboxStateSample checked title={text.states[1]} />
      <CheckboxStateSample indeterminate title={text.states[2]} />
    </div>
  );
}

export function CheckboxSizeComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="flex flex-wrap items-end gap-4">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <CheckboxPreview
          defaultChecked
          disabled={false}
          indeterminate={false}
          key={uiSize}
          label={`${text.sizes} ${uiSize}`}
          readOnly={false}
          uiSize={uiSize}
        />
      ))}
    </div>
  );
}

export function CheckboxAvailabilityComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <CheckboxStateSample checked title={text.availability[0]} />
      <CheckboxStateSample checked readOnly title={text.availability[1]} />
      <CheckboxStateSample checked disabled title={text.availability[2]} />
    </div>
  );
}

export function CheckboxFormValuesPreview() {
  const text = copy[useDemoLocale()];
  const formId = useId();
  const [result, setResult] = useState('');

  return (
    <div className="grid gap-3">
      <TRForm
        className="grid gap-3"
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget).getAll('monitoring');
          setResult(`${text.submitted}: ${values.join(', ')}`);
        }}
        onReset={() => setResult(text.resetMessage)}
      >
        <div className="flex flex-wrap gap-2">
          <TRButton type="submit">{text.read}</TRButton>
          <TRButton type="reset" variant="secondary">
            {text.reset}
          </TRButton>
        </div>
      </TRForm>
      <CheckboxPreview
        defaultChecked={false}
        disabled={false}
        form={formId}
        indeterminate={false}
        label={text.monitoring}
        name="monitoring"
        readOnly={false}
        required={false}
        uncheckedValue="disabled"
        value="enabled"
      />
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export function CheckboxValidationPreview() {
  const text = copy[useDemoLocale()];
  const [attempted, setAttempted] = useState(false);
  const [checked, setChecked] = useState(false);
  const invalid = attempted && !checked;

  return (
    <TRForm
      data-docs-example-item=""
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label className="flex min-w-0 items-start gap-2 whitespace-normal">
          <TRCheckbox.Root
            checked={checked}
            name="terms"
            onCheckedChange={(nextChecked) => setChecked(nextChecked)}
            required
          >
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          {text.agreement}
        </TRField.Label>
        {invalid ? <TRField.Error match>{text.error}</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">{text.continue}</TRButton>
      <output aria-live="polite">{attempted && checked ? text.accepted : ''}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Checkbox',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    checked: true,
    disabled: false,
    indeterminate: false,
    label: 'Enable backups',
    readOnly: false,
    uiSize: 'md',
  },
  localizedArgs: {
    ja: { label: copy.ja.backup },
    ko: { label: copy.ko.backup },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <CheckboxPreview
        {...args}
        onCheckedChange={(checked) => updateArgs({ checked, indeterminate: false })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
