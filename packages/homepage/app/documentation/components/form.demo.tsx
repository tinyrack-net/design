import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm, type TRFormActions } from '@tinyrack/ui/components/form';
import { TRInput } from '@tinyrack/ui/components/input';
import { useId, useRef, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: {
    rack: 'Rack name',
    required: 'Enter a rack name.',
    save: 'Save',
    submitted: (v: string) => `Submitted ${v}.`,
    nativeForm: 'Native rack form',
    submitRack: 'Submit rack',
    reset: 'Reset form',
    saveRack: 'Save rack',
    beforeSaving: 'Enter a rack name before saving.',
    saved: (v: string) => `Saved ${v}.`,
    createForm: 'Create rack form',
    exists: 'Rack Alpha already exists.',
    created: (v: string) => `Created ${v}.`,
    unique: 'Use a name that is not already registered.',
    create: 'Create rack',
    region: 'Region',
    regionRequired: 'Enter a region.',
    validateRack: 'Validate rack',
    validateAll: 'Validate all',
    submit: 'Submit',
    validated: (rack: string, region: string) => `Validated ${rack} in ${region}.`,
  },
  ko: {
    rack: '랙 이름',
    required: '랙 이름을 입력하세요.',
    save: '저장해요',
    submitted: (v: string) => `${v} 값을 제출했어요.`,
    nativeForm: '네이티브 랙 폼',
    submitRack: '랙을 제출해요',
    reset: '폼을 초기화해요',
    saveRack: '랙을 저장해요',
    beforeSaving: '저장하기 전에 랙 이름을 입력하세요.',
    saved: (v: string) => `${v} 값을 저장했어요.`,
    createForm: '랙 생성 폼',
    exists: '랙 알파가 이미 있어요.',
    created: (v: string) => `${v} 랙을 만들었어요.`,
    unique: '아직 등록되지 않은 이름을 사용하세요.',
    create: '랙을 만들어요',
    region: '리전',
    regionRequired: '리전을 입력하세요.',
    validateRack: '랙을 검증해요',
    validateAll: '모두 검증해요',
    submit: '제출해요',
    validated: (rack: string, region: string) => `${region}의 ${rack}을 검증했어요.`,
  },
  ja: {
    rack: 'ラック名',
    required: 'ラック名を入力してください。',
    save: '保存',
    submitted: (v: string) => `${v} を送信しました。`,
    nativeForm: 'ネイティブのラックフォーム',
    submitRack: 'ラックを送信',
    reset: 'フォームをリセット',
    saveRack: 'ラックを保存',
    beforeSaving: '保存する前にラック名を入力してください。',
    saved: (v: string) => `${v} を保存しました。`,
    createForm: 'ラック作成フォーム',
    exists: 'Rack Alpha はすでに存在します。',
    created: (v: string) => `${v} を作成しました。`,
    unique: '未登録の名前を使ってください。',
    create: 'ラックを作成',
    region: 'リージョン',
    regionRequired: 'リージョンを入力してください。',
    validateRack: 'ラックを検証',
    validateAll: 'すべて検証',
    submit: '送信',
    validated: (rack: string, region: string) =>
      `${region} の ${rack} を検証しました。`,
  },
} as const;

type StoryArgs = {
  label: string;
  required: boolean;
  submitLabel: string;
};

export function FormPreview({ label, required, submitLabel }: StoryArgs) {
  const locale = useDemoLocale();
  const text = copy[locale];
  const inputId = useId();
  const [submittedValue, setSubmittedValue] = useState('');
  const [value, setValue] = useState('rack-alpha');

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      onFormSubmit={(values) => setSubmittedValue(String(values['rack'] ?? ''))}
    >
      <TRField.Root name="rack">
        <TRField.Label>{label}</TRField.Label>
        <TRField.Control
          id={inputId}
          onChange={(event) => setValue(event.currentTarget.value)}
          required={required}
          value={value}
        />
        <TRField.Error match>{text.required}</TRField.Error>
      </TRField.Root>
      <TRButton type="submit">{submitLabel}</TRButton>
      <output aria-live="polite">
        {submittedValue ? text.submitted(submittedValue) : ''}
      </output>
    </TRForm>
  );
}

export function FormNativeValuesPreview() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const inputId = useId();
  const [submittedValue, setSubmittedValue] = useState('');

  return (
    <TRForm
      aria-label={text.nativeForm}
      className="grid w-full max-w-80 min-w-0 gap-3"
      onReset={() => setSubmittedValue('')}
      onSubmit={(event) => {
        event.preventDefault();
        const value = String(new FormData(event.currentTarget).get('rack') ?? '');
        setSubmittedValue(value);
      }}
    >
      <label className="grid gap-2" htmlFor={inputId}>
        {text.rack}
        <TRInput defaultValue="rack-alpha" id={inputId} name="rack" />
      </label>
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">{text.submitRack}</TRButton>
        <TRButton type="reset">{text.reset}</TRButton>
      </div>
      <output aria-live="polite">
        {submittedValue ? text.submitted(submittedValue) : ''}
      </output>
    </TRForm>
  );
}

export function FormValidationPreview() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const inputId = useId();
  const errorId = useId();
  const [attempted, setAttempted] = useState(false);
  const [submittedValue, setSubmittedValue] = useState('');
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        if (event.currentTarget.checkValidity()) {
          setSubmittedValue(value);
        }
      }}
    >
      <label className="grid gap-2" htmlFor={inputId}>
        {text.rack}
        <TRInput
          aria-describedby={invalid ? errorId : undefined}
          aria-invalid={invalid || undefined}
          id={inputId}
          name="rack"
          onChange={(event) => {
            setValue(event.currentTarget.value);
            setSubmittedValue('');
          }}
          onInvalid={(event) => {
            event.preventDefault();
            setAttempted(true);
          }}
          required
          value={value}
        />
      </label>
      {invalid ? (
        <p className="m-0 text-sm" id={errorId} role="alert">
          {text.beforeSaving}
        </p>
      ) : null}
      <TRButton type="submit">{text.saveRack}</TRButton>
      <output aria-live="polite">
        {submittedValue ? text.saved(submittedValue) : ''}
      </output>
    </TRForm>
  );
}

export function FormServerErrorPreview() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');

  return (
    <TRForm
      aria-label={text.createForm}
      className="grid w-full max-w-80 min-w-0 gap-3"
      validationMode="onChange"
      errors={errors}
      onFormSubmit={(values) => {
        const rack = String(values['rack'] ?? '');
        if (rack.toLowerCase() === 'rack-alpha') {
          setErrors({ rack: text.exists });
          setResult('');
          return;
        }

        setErrors({});
        setResult(text.created(rack));
      }}
      onReset={() => {
        setErrors({});
        setResult('');
      }}
    >
      <TRField.Root name="rack">
        <TRField.Label>{text.rack}</TRField.Label>
        <TRField.Control defaultValue="rack-alpha" required />
        <TRField.Description>{text.unique}</TRField.Description>
        <TRField.Error />
      </TRField.Root>
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">{text.create}</TRButton>
        <TRButton type="reset">{text.reset}</TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

export function FormActionsPreview() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const actionsRef = useRef<TRFormActions>(null);
  const [result, setResult] = useState('');

  return (
    <TRForm<{ rack: string; region: string }>
      actionsRef={actionsRef}
      className="grid w-full max-w-80 min-w-0 gap-3"
      onFormSubmit={(values) => setResult(text.validated(values.rack, values.region))}
      validationMode="onBlur"
    >
      <TRField.Root name="rack">
        <TRField.Label>{text.rack}</TRField.Label>
        <TRField.Control required />
        <TRField.Error match="valueMissing">{text.required}</TRField.Error>
      </TRField.Root>
      <TRField.Root name="region">
        <TRField.Label>{text.region}</TRField.Label>
        <TRField.Control required />
        <TRField.Error match="valueMissing">{text.regionRequired}</TRField.Error>
      </TRField.Root>
      <div className="flex flex-wrap gap-2">
        <TRButton onClick={() => actionsRef.current?.validate('rack')} type="button">
          {text.validateRack}
        </TRButton>
        <TRButton
          onClick={() => actionsRef.current?.validate()}
          type="button"
          variant="secondary"
        >
          {text.validateAll}
        </TRButton>
        <TRButton type="submit" variant="primary">
          {text.submit}
        </TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Form',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Rack name',
    required: true,
    submitLabel: 'Save',
  },
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
    submitLabel: { control: 'text' },
  },
  render: function Render(args) {
    const locale = useDemoLocale();
    return (
      <FormPreview
        {...args}
        label={args.label === 'Rack name' ? copy[locale].rack : args.label}
        submitLabel={args.submitLabel === 'Save' ? copy[locale].save : args.submitLabel}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
