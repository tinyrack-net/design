import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TROTPField } from '@tinyrack/ui/components/otp-field';
import { Fragment, useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const otpCopy = {
  en: {
    accepted: 'Verification code accepted.',
    changed: (value: string, reason: string) =>
      `Accepted ${value || 'empty'} via ${reason}.`,
    completed: (value: string, reason: string) => `Completed ${value} via ${reason}.`,
    current: 'Current value',
    description: 'Enter all four digits.',
    disabled: 'Disabled code',
    empty: 'Empty',
    error: 'A four-digit code is required.',
    label: 'Verification code',
    readOnly: 'Six-digit code',
    rejected: (value: string, reason: string) => `Rejected ${value} via ${reason}.`,
    reset: 'Reset',
    resetResult: 'Reset.',
    verify: 'Verify',
    waiting: 'Waiting for input.',
  },
  ja: {
    accepted: '確認コードを受け付けました。',
    changed: (value: string, reason: string) =>
      `${reason} により ${value || '空'} を受け付けました。`,
    completed: (value: string, reason: string) =>
      `${reason} により ${value} が完成しました。`,
    current: '現在の値',
    description: '4 桁すべてを入力してください。',
    disabled: '無効なコード',
    empty: '空',
    error: '4 桁のコードが必要です。',
    label: '確認コード',
    readOnly: '6 桁のコード',
    rejected: (value: string, reason: string) =>
      `${reason} により ${value} を拒否しました。`,
    reset: 'リセット',
    resetResult: 'リセットしました。',
    verify: '確認',
    waiting: '入力を待っています。',
  },
  ko: {
    accepted: '인증 코드를 확인했어요.',
    changed: (value: string, reason: string) =>
      `${reason} 방식으로 입력했어요: ${value || '빈 값'}`,
    completed: (value: string, reason: string) =>
      `${reason} 방식으로 ${value} 입력을 마쳤어요.`,
    current: '현재 값',
    description: '네 자리 숫자를 모두 입력하세요.',
    disabled: '비활성 코드',
    empty: '비어 있음',
    error: '네 자리 코드가 필요해요.',
    label: '인증 코드',
    readOnly: '여섯 자리 코드',
    rejected: (value: string, reason: string) =>
      `${reason} 방식의 ${value} 입력을 거부했어요.`,
    reset: '초기화',
    resetResult: '초기화했어요.',
    verify: '확인',
    waiting: '입력을 기다리고 있어요.',
  },
} as const;

type StoryArgs = {
  disabled: boolean;
  length: number;
  readOnly: boolean;
};

type OTPFieldPreviewProps = StoryArgs & {
  defaultValue?: string;
  label?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  value?: string;
};

function OTPFieldSlots({ length }: { length: number }) {
  const separatorIndex = Math.ceil(length / 2);
  const positions = Array.from({ length }, (_, position) => position + 1);
  return positions.map((position) => (
    <Fragment key={`slot-${position}`}>
      {position === separatorIndex + 1 ? (
        <TROTPField.Separator aria-hidden="true" />
      ) : null}
      <TROTPField.Input />
    </Fragment>
  ));
}

export function OTPFieldPreview({
  defaultValue,
  disabled,
  label = 'Verification code',
  length,
  onValueChange,
  readOnly,
  required,
  value,
}: OTPFieldPreviewProps) {
  const labelId = useId();
  const copy = otpCopy[useDemoLocale()];
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <TRField.Root className="grid min-w-0 max-w-full gap-2" data-docs-example-item="">
      <TRField.Label id={labelId}>
        {label === 'Verification code' ? copy.label : label}
      </TRField.Label>
      <TROTPField.Root
        {...stateProps}
        aria-labelledby={labelId}
        disabled={disabled}
        length={length}
        name="verification-code"
        onValueChange={onValueChange}
        readOnly={readOnly}
        required={required}
      >
        <OTPFieldSlots length={length} />
      </TROTPField.Root>
    </TRField.Root>
  );
}

export function OTPFieldInputFlow() {
  const copy = otpCopy[useDemoLocale()];
  const [event, setEvent] = useState<string>(copy.waiting);
  const [value, setValue] = useState('');
  const labelId = useId();
  return (
    <div className="grid gap-3" data-docs-example-item="">
      <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
        Type digits or paste a complete code. Letters are rejected and reported below.
      </p>
      <TRField.Root className="grid gap-2">
        <TRField.Label id={labelId}>{copy.label}</TRField.Label>
        <TROTPField.Root
          aria-labelledby={labelId}
          autoComplete="one-time-code"
          length={4}
          onValueChange={(nextValue, details) => {
            setValue(nextValue);
            setEvent(copy.changed(nextValue, details.reason));
          }}
          onValueComplete={(nextValue, details) =>
            setEvent(copy.completed(nextValue, details.reason))
          }
          onValueInvalid={(attemptedValue, details) =>
            setEvent(copy.rejected(attemptedValue, details.reason))
          }
          value={value}
        >
          <OTPFieldSlots length={4} />
        </TROTPField.Root>
      </TRField.Root>
      <output aria-label={copy.current}>{value || copy.empty}</output>
      <output aria-live="polite">{event}</output>
      <TRButton
        appearance="outline"
        onClick={() => {
          setValue('');
          setEvent(copy.resetResult);
        }}
      >
        {copy.reset}
      </TRButton>
    </div>
  );
}

export function OTPFieldStateComparison() {
  const copy = otpCopy[useDemoLocale()];
  return (
    <div className="grid gap-5">
      <OTPFieldPreview
        defaultValue="1234"
        disabled={false}
        length={4}
        readOnly={false}
        required={false}
      />
      <OTPFieldPreview
        defaultValue="123456"
        disabled={false}
        label={copy.readOnly}
        length={6}
        readOnly
        required={false}
      />
      <OTPFieldPreview
        defaultValue="1234"
        disabled
        label={copy.disabled}
        length={4}
        readOnly={false}
        required={false}
      />
    </div>
  );
}

export function OTPFieldValidationPreview() {
  const copy = otpCopy[useDemoLocale()];
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.length !== 4;

  return (
    <TRForm
      className="grid w-full min-w-0 gap-3"
      data-docs-example-item=""
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label>{copy.label}</TRField.Label>
        <TROTPField.Root
          aria-label={copy.label}
          length={4}
          name="code"
          onValueChange={setValue}
          required
          value={value}
        >
          <OTPFieldSlots length={4} />
        </TROTPField.Root>
        <TRField.Description>{copy.description}</TRField.Description>
        {invalid ? <TRField.Error match>{copy.error}</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">{copy.verify}</TRButton>
      <output aria-live="polite">{attempted && !invalid ? copy.accepted : ''}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/OTP Field',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    length: 4,
    readOnly: false,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    length: { control: { type: 'range', min: 3, max: 8, step: 1 } },
    readOnly: { control: 'boolean' },
  },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="grid gap-3">
        <OTPFieldPreview {...args} onValueChange={setValue} value={value} />
        <output aria-label="Current value">{value || 'Empty'}</output>
      </div>
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
