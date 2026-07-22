import { TRButton } from '@tinyrack/ui/components/button';
import { TRCheckbox } from '@tinyrack/ui/components/checkbox';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { useState } from 'react';
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
    description: 'Operational alerts are sent here.',
    error: 'Enter a valid email.',
    alertEmail: 'Alert email',
    required: 'Email is required.',
    save: 'Save email',
    reset: 'Reset',
    saved: (value: string) => `Saved ${value}.`,
    small: 'Small field',
    medium: 'Medium field',
    large: 'Large field',
    invalid: 'Invalid field',
    disabled: 'Disabled field',
    readOnly: 'Read-only field',
    channels: 'Notification channels',
    email: 'Email',
    emailDescription: 'Send deployment results by email.',
    sms: 'SMS',
    unavailable: 'Unavailable for this workspace.',
    validity: 'Native field state:',
    notValidated: 'not validated',
    valid: 'valid',
    invalidState: 'invalid',
  },
  ko: {
    description: '운영 알림을 이 주소로 보내요.',
    error: '올바른 이메일 주소를 입력하세요.',
    alertEmail: '알림 이메일',
    required: '이메일 주소를 입력하세요.',
    save: '이메일을 저장해요',
    reset: '초기화해요',
    saved: (value: string) => `${value} 주소를 저장했어요.`,
    small: '작은 필드',
    medium: '중간 필드',
    large: '큰 필드',
    invalid: '올바르지 않은 필드',
    disabled: '비활성 필드',
    readOnly: '읽기 전용 필드',
    channels: '알림 채널',
    email: '이메일',
    emailDescription: '배포 결과를 이메일로 보내요.',
    sms: '문자 메시지',
    unavailable: '이 작업 공간에서는 사용할 수 없어요.',
    validity: '네이티브 필드 상태:',
    notValidated: '아직 검증하지 않았어요',
    valid: '올바른 값이에요',
    invalidState: '올바르지 않은 값이에요',
  },
  ja: {
    description: '運用アラートをこのアドレスに送信します。',
    error: '有効なメールアドレスを入力してください。',
    alertEmail: 'アラート用メールアドレス',
    required: 'メールアドレスを入力してください。',
    save: 'メールアドレスを保存',
    reset: 'リセット',
    saved: (value: string) => `${value} を保存しました。`,
    small: '小さいフィールド',
    medium: '中サイズのフィールド',
    large: '大きいフィールド',
    invalid: '無効なフィールド',
    disabled: '無効化したフィールド',
    readOnly: '読み取り専用フィールド',
    channels: '通知チャネル',
    email: 'メール',
    emailDescription: 'デプロイ結果をメールで送信します。',
    sms: 'SMS',
    unavailable: 'このワークスペースでは利用できません。',
    validity: 'ネイティブフィールドの状態:',
    notValidated: '未検証',
    valid: '有効',
    invalidState: '無効',
  },
} as const;

type FieldStoryArgs = {
  disabled: boolean;
  invalid: boolean;
  label: string;
  readOnly: boolean;
  required: boolean;
  size: 'sm' | 'md' | 'lg';
  value: string;
};

type FieldPreviewProps = Omit<FieldStoryArgs, 'readOnly' | 'required' | 'value'> & {
  'data-docs-example-item'?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
};

export function FieldPreview({
  'data-docs-example-item': docsExampleItem,
  defaultValue,
  disabled,
  invalid,
  label,
  onValueChange,
  readOnly = false,
  required = false,
  size,
  value,
}: FieldPreviewProps) {
  const locale = useDemoLocale();
  const text = copy[locale];
  return (
    <TRField.Root
      className="w-full min-w-0 max-w-80"
      data-docs-example-item={docsExampleItem}
      disabled={disabled}
      invalid={invalid}
      uiSize={size}
    >
      <TRField.Label>{label}</TRField.Label>
      <TRField.Control
        defaultValue={value === undefined ? defaultValue : undefined}
        name="email"
        onValueChange={onValueChange}
        readOnly={readOnly}
        required={required}
        type="email"
        value={value}
      />
      <TRField.Description>{text.description}</TRField.Description>
      {invalid ? <TRField.Error match>{text.error}</TRField.Error> : null}
    </TRField.Root>
  );
}

export function FieldValidationPreview() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const [valid, setValid] = useState(false);
  const invalid = attempted && !valid;

  return (
    <TRForm
      className="grid w-full min-w-0 max-w-80 gap-3"
      noValidate
      onReset={() => {
        setAttempted(false);
        setValid(false);
        setValue('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        event.currentTarget.checkValidity();
        setAttempted(true);
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label>{text.alertEmail}</TRField.Label>
        <TRField.Control
          name="email"
          onChange={(event) => {
            setValue(event.currentTarget.value);
            setValid(event.currentTarget.validity.valid);
          }}
          onInvalid={(event) => {
            event.preventDefault();
            setValid(false);
          }}
          placeholder="ops@example.com"
          required
          type="email"
          value={value}
        />
        <TRField.Description>{text.description}</TRField.Description>
        {invalid ? (
          <TRField.Error match="valueMissing">{text.required}</TRField.Error>
        ) : null}
        {invalid ? (
          <TRField.Error match="typeMismatch">{text.error}</TRField.Error>
        ) : null}
      </TRField.Root>
      <div className="flex gap-2">
        <TRButton type="submit">{text.save}</TRButton>
        <TRButton type="reset" variant="secondary">
          {text.reset}
        </TRButton>
      </div>
      <output aria-live="polite">{attempted && valid ? text.saved(value) : ''}</output>
    </TRForm>
  );
}

export function FieldSizeComparison() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const labels = { sm: text.small, md: text.medium, lg: text.large } as const;
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FieldPreview
          defaultValue={`${size}-rack`}
          disabled={false}
          invalid={false}
          key={size}
          label={labels[size]}
          readOnly={false}
          required={false}
          size={size}
        />
      ))}
    </div>
  );
}

export function FieldStateComparison() {
  const locale = useDemoLocale();
  const text = copy[locale];
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <FieldPreview
        defaultValue="bad value"
        disabled={false}
        invalid
        label={text.invalid}
        readOnly={false}
        required={false}
        size="md"
      />
      <FieldPreview
        defaultValue="rack-disabled"
        disabled
        invalid={false}
        label={text.disabled}
        readOnly={false}
        required={false}
        size="md"
      />
      <FieldPreview
        defaultValue="rack-managed"
        disabled={false}
        invalid={false}
        label={text.readOnly}
        readOnly
        required={false}
        size="md"
      />
    </div>
  );
}

export function FieldItemValidityPreview() {
  const locale = useDemoLocale();
  const text = copy[locale];
  return (
    <TRField.Root className="grid w-full max-w-md gap-3">
      <TRField.Label>{text.channels}</TRField.Label>
      <TRField.Item>
        <TRCheckbox.Root defaultChecked name="channel" value="email">
          <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        <div>
          <TRField.Label>{text.email}</TRField.Label>
          <TRField.Description>{text.emailDescription}</TRField.Description>
        </div>
      </TRField.Item>
      <TRField.Item disabled>
        <TRCheckbox.Root disabled name="channel" value="sms">
          <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        <div>
          <TRField.Label>{text.sms}</TRField.Label>
          <TRField.Description>{text.unavailable}</TRField.Description>
        </div>
      </TRField.Item>
      <TRField.Validity>
        {(state) => (
          <output aria-live="polite">
            {text.validity}{' '}
            {state.validity.valid === null
              ? text.notValidated
              : state.validity.valid
                ? text.valid
                : text.invalidState}
          </output>
        )}
      </TRField.Validity>
    </TRField.Root>
  );
}

const meta = {
  title: 'Components/Field',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    invalid: false,
    label: 'Email',
    readOnly: false,
    required: true,
    size: 'md',
    value: 'ops@example.com',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const locale = useDemoLocale();
    const [, updateArgs] = useArgs<FieldStoryArgs>();
    return (
      <FieldPreview
        {...args}
        label={args.label === 'Email' ? copy[locale].email : args.label}
        onValueChange={(value) => updateArgs({ value })}
      />
    );
  },
} satisfies Meta<FieldStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
