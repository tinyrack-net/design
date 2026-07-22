import { TRButton } from '@tinyrack/ui/components/button';
import { TRForm } from '@tinyrack/ui/components/form';
import type { TRInputUiSize } from '@tinyrack/ui/components/input';
import { TRInput } from '@tinyrack/ui/components/input';
import { useId, useRef, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const inputCopy = {
  en: {
    continue: 'Continue',
    default: 'Default',
    disabled: 'Disabled',
    invalid: 'Invalid',
    label: 'Rack name',
    placeholder: 'rack-alpha',
    readOnly: 'Read only',
    required: 'Rack name is required.',
    ready: (value: string) => `Ready to create ${value}.`,
    size: (size: string) => `${size} input`,
  },
  ja: {
    continue: '続行',
    default: 'デフォルト',
    disabled: '無効',
    invalid: '無効な値',
    label: 'ラック名',
    placeholder: 'rack-alpha',
    readOnly: '読み取り専用',
    required: 'ラック名を入力してください。',
    ready: (value: string) => `${value} を作成できます。`,
    size: (size: string) => `${size} 入力`,
  },
  ko: {
    continue: '계속',
    default: '기본',
    disabled: '비활성',
    invalid: '잘못된 값',
    label: '랙 이름',
    placeholder: 'rack-alpha',
    readOnly: '읽기 전용',
    required: '랙 이름을 입력하세요.',
    ready: (value: string) => `${value} 이름으로 만들 준비가 됐어요.`,
    size: (size: string) => `${size} 입력`,
  },
} as const;

type StoryArgs = {
  disabled: boolean;
  label: string;
  placeholder: string;
  readOnly: boolean;
  required: boolean;
  uiSize: TRInputUiSize;
};

type InputPreviewProps = Omit<StoryArgs, 'uiSize'> & {
  defaultValue?: string;
  invalid?: boolean;
  uiSize?: TRInputUiSize;
};

export function InputPreview({
  defaultValue,
  disabled,
  invalid = false,
  label,
  placeholder,
  readOnly,
  required,
  uiSize = 'md',
}: InputPreviewProps) {
  const inputId = useId();
  const locale = useDemoLocale();
  const copy = inputCopy[locale];
  return (
    <label
      className="grid w-80 max-w-full gap-2"
      data-docs-example-item=""
      htmlFor={inputId}
    >
      {label === 'Rack name' ? copy.label : label}
      <TRInput
        aria-invalid={invalid || undefined}
        defaultValue={defaultValue}
        disabled={disabled}
        id={inputId}
        placeholder={placeholder === 'rack-alpha' ? copy.placeholder : placeholder}
        readOnly={readOnly}
        required={required}
        uiSize={uiSize}
      />
    </label>
  );
}

export function InputSizeComparison() {
  const copy = inputCopy[useDemoLocale()];
  return (
    <div className="grid w-80 max-w-full gap-4">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <InputPreview
          disabled={false}
          key={uiSize}
          label={copy.size(uiSize.toUpperCase())}
          placeholder="rack-alpha"
          readOnly={false}
          required={false}
          uiSize={uiSize}
        />
      ))}
    </div>
  );
}

export function InputStateComparison() {
  const copy = inputCopy[useDemoLocale()];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <InputPreview
        defaultValue="rack-alpha"
        disabled={false}
        label={copy.default}
        placeholder="rack-alpha"
        readOnly={false}
        required={false}
      />
      <InputPreview
        defaultValue="rack-disabled"
        disabled
        label={copy.disabled}
        placeholder="rack-alpha"
        readOnly={false}
        required={false}
      />
      <InputPreview
        defaultValue="rack-locked"
        disabled={false}
        label={copy.readOnly}
        placeholder="rack-alpha"
        readOnly
        required={false}
      />
      <InputPreview
        defaultValue="rack duplicate"
        disabled={false}
        invalid
        label={copy.invalid}
        placeholder="rack-alpha"
        readOnly={false}
        required
      />
    </div>
  );
}

export function InputValidationPreview() {
  const copy = inputCopy[useDemoLocale()];
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;

  return (
    <TRForm
      className="grid w-80 max-w-full gap-3"
      data-docs-example-item=""
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const valid = event.currentTarget.checkValidity();
        setAttempted(true);
        setSubmitted(valid);
        if (!valid) inputRef.current?.focus();
      }}
    >
      <label className="grid gap-2" htmlFor={inputId}>
        {copy.label}
        <TRInput
          aria-describedby={invalid ? errorId : undefined}
          aria-invalid={invalid || undefined}
          id={inputId}
          name="rack"
          onValueChange={(nextValue) => {
            setValue(nextValue);
            setSubmitted(false);
          }}
          onInvalid={(event) => event.preventDefault()}
          ref={inputRef}
          required
          value={value}
        />
      </label>
      {invalid ? (
        <p className="m-0 text-sm" id={errorId} role="alert">
          {copy.required}
        </p>
      ) : null}
      <TRButton type="submit">{copy.continue}</TRButton>
      <output aria-live="polite">{submitted ? copy.ready(value) : ''}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Input',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Rack name',
    placeholder: 'rack-alpha',
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
    ja: { label: 'ラック名' },
    ko: { label: '랙 이름' },
  },
  render: function Render(args) {
    return <InputPreview {...args} />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
