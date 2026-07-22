import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRTextarea, type TRTextareaUiSize } from '@tinyrack/ui/components/textarea';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const textareaCopy = {
  en: { current: 'Current value', default: 'Default', disabled: 'Disabled', empty: 'Empty', invalid: 'Invalid', notes: 'Maintenance notes', placeholder: 'Operational notes', readOnly: 'Read only', reason: 'Change reason', reasonError: 'Add a reason before submitting.', reset: 'Reset', resetResult: 'Reset to the scheduled maintenance note.', submit: 'Submit', submitChange: 'Submit change', submitted: 'Change submitted.' },
  ja: { current: '現在の値', default: 'デフォルト', disabled: '無効', empty: '空', invalid: '無効な値', notes: 'メンテナンスのメモ', placeholder: '運用メモ', readOnly: '読み取り専用', reason: '変更理由', reasonError: '送信前に理由を入力してください。', reset: 'リセット', resetResult: '予定メンテナンスのメモに戻しました。', submit: '送信', submitChange: '変更を送信', submitted: '変更を送信しました。' },
  ko: { current: '현재 값', default: '기본', disabled: '비활성', empty: '비어 있음', invalid: '잘못된 값', notes: '유지보수 메모', placeholder: '운영 메모', readOnly: '읽기 전용', reason: '변경 이유', reasonError: '제출하기 전에 이유를 입력하세요.', reset: '초기화', resetResult: '예정된 유지보수 메모로 되돌렸어요.', submit: '제출', submitChange: '변경 사항 제출', submitted: '변경 사항을 제출했어요.' },
} as const;

type StoryArgs = {
  disabled: boolean;
  label: string;
  placeholder: string;
  readOnly: boolean;
  required: boolean;
  uiSize: TRTextareaUiSize;
};

export function TextareaPreview({
  label,
  initialValue = '',
  showValue = false,
  ...args
}: StoryArgs & { initialValue?: string; showValue?: boolean }) {
  const id = useId();
  const copy = textareaCopy[useDemoLocale()];
  const [value, setValue] = useState(initialValue);
  return (
    <label className="grid w-80 max-w-full gap-2" data-docs-example-item="" htmlFor={id}>
      {label}
      <TRTextarea
        {...args}
        id={id}
        onChange={(event) => setValue(event.currentTarget.value)}
        value={value}
      />
      {showValue ? (
        <output className="text-tinyrack-sm text-tinyrack-text-muted">
          {copy.current}: {value || copy.empty}
        </output>
      ) : null}
    </label>
  );
}

export function TextareaSizeComparison() {
  const copy = textareaCopy[useDemoLocale()];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <div className="grid min-w-0 gap-2" data-docs-example-item="" key={uiSize}>
          <span>{uiSize}</span>
          <TRTextarea
            aria-label={`${uiSize} ${copy.notes}`}
            defaultValue={copy.notes}
            rows={3}
            uiSize={uiSize}
          />
        </div>
      ))}
    </div>
  );
}

export function TextareaStateComparison() {
  const invalidId = useId();
  const copy = textareaCopy[useDemoLocale()];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <TextareaPreview
        disabled={false}
        label={copy.default}
        placeholder={copy.placeholder}
        readOnly={false}
        required={false}
        uiSize="md"
      />
      <TextareaPreview
        disabled
        label={copy.disabled}
        placeholder="Unavailable"
        readOnly={false}
        required={false}
        uiSize="md"
      />
      <TextareaPreview
        disabled={false}
        initialValue="Locked note"
        label={copy.readOnly}
        placeholder=""
        readOnly
        required={false}
        uiSize="md"
      />
      <label className="grid min-w-0 gap-2" data-docs-example-item="" htmlFor={invalidId}>
        {copy.invalid}
        <TRTextarea aria-invalid="true" defaultValue="Incomplete note" id={invalidId} />
      </label>
    </div>
  );
}

export function TextareaValidationPreview() {
  const id = useId();
  const copy = textareaCopy[useDemoLocale()];
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;
  return (
    <TRForm
      className="grid w-full max-w-md gap-3"
      data-docs-example-item=""
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        const valid = value.trim().length > 0;
        setSubmitted(valid);
        if (!valid) document.getElementById(id)?.focus();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label htmlFor={id}>{copy.reason}</TRField.Label>
        <TRTextarea
          aria-invalid={invalid}
          id={id}
          name="reason"
          onChange={(event) => {
            setValue(event.currentTarget.value);
            setSubmitted(false);
          }}
          required
          value={value}
        />
        <TRField.Error match>
          {invalid ? copy.reasonError : null}
        </TRField.Error>
      </TRField.Root>
      <TRButton type="submit">{copy.submitChange}</TRButton>
      <output aria-live="polite">{submitted ? copy.submitted : ''}</output>
    </TRForm>
  );
}

export function TextareaFormPreview() {
  const id = useId();
  const copy = textareaCopy[useDemoLocale()];
  const [result, setResult] = useState('');

  return (
    <TRForm
      className="grid w-full max-w-md gap-3"
      data-docs-example-item=""
      onReset={() => setResult(copy.resetResult)}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`Submitted: ${String(data.get('notes'))}`);
      }}
    >
      <label className="grid gap-2" htmlFor={id}>
        {copy.notes}
        <TRTextarea
          defaultValue="Scheduled maintenance"
          id={id}
          name="notes"
          required
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">{copy.submit}</TRButton>
        <TRButton appearance="outline" type="reset">
          {copy.reset}
        </TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Textarea',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Rack notes',
    placeholder: 'Operational notes',
    readOnly: false,
    required: false,
    uiSize: 'md',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  localizedArgs: {
    ja: { label: 'ラックのメモ', placeholder: '運用メモ' },
    ko: { label: '랙 메모', placeholder: '운영 메모' },
  },
  render: function Render(args) {
    return <TextareaPreview {...args} showValue />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
