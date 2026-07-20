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

type FieldStoryArgs = {
  disabled: boolean;
  invalid: boolean;
  label: string;
  placeholder: string;
  readOnly: boolean;
  required: boolean;
  size: 'sm' | 'md' | 'lg';
  value: string;
};

type FieldPreviewProps = Omit<FieldStoryArgs, 'value'> & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
};

export function FieldPreview({
  defaultValue,
  disabled,
  invalid,
  label,
  onValueChange,
  placeholder,
  readOnly,
  required,
  size,
  value,
}: FieldPreviewProps) {
  return (
    <TRField.Root
      className="w-full min-w-0 max-w-80"
      disabled={disabled}
      invalid={invalid}
      uiSize={size}
    >
      <TRField.Label>{label}</TRField.Label>
      <TRField.Control
        aria-invalid={invalid || undefined}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={(event) => onValueChange?.(event.currentTarget.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        type="email"
        value={value}
      />
      <TRField.Description>Operational alerts are sent here.</TRField.Description>
      {invalid ? <TRField.Error match>Enter a valid email.</TRField.Error> : null}
    </TRField.Root>
  );
}

export function FieldValidationPreview() {
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = submitted && !value.includes('@');

  return (
    <TRForm
      className="grid w-full min-w-0 max-w-80 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.currentTarget.checkValidity();
        setSubmitted(true);
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label>TRAlert email</TRField.Label>
        <TRField.Control
          aria-invalid={invalid || undefined}
          name="email"
          onChange={(event) => setValue(event.currentTarget.value)}
          onInvalid={(event) => event.preventDefault()}
          placeholder="ops@example.com"
          required
          type="email"
          value={value}
        />
        <TRField.Description>Used only for operational alerts.</TRField.Description>
        {invalid ? (
          <TRField.Error match>
            {value.length === 0 ? 'Email is required.' : 'Enter a valid email.'}
          </TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Save email</TRButton>
      <output aria-live="polite">
        {submitted && !invalid ? `Saved ${value}.` : ''}
      </output>
    </TRForm>
  );
}

export function FieldItemValidityPreview() {
  return (
    <TRField.Root className="grid w-full max-w-md gap-3">
      <TRField.Label>Notification channels</TRField.Label>
      <TRField.Item>
        <TRCheckbox.Root defaultChecked name="channel" value="email">
          <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        <div>
          <TRField.Label>Email</TRField.Label>
          <TRField.Description>Send deployment results by email.</TRField.Description>
        </div>
      </TRField.Item>
      <TRField.Item disabled>
        <TRCheckbox.Root disabled name="channel" value="sms">
          <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        <div>
          <TRField.Label>SMS</TRField.Label>
          <TRField.Description>Unavailable for this workspace.</TRField.Description>
        </div>
      </TRField.Item>
      <TRField.Validity>
        {(state) => (
          <output aria-live="polite">
            Native field state: {state.validity.valid ? 'valid' : 'invalid'}
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
    placeholder: 'ops@example.com',
    readOnly: false,
    required: true,
    size: 'md',
    value: 'ops@example.com',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<FieldStoryArgs>();
    return <FieldPreview {...args} onValueChange={(value) => updateArgs({ value })} />;
  },
} satisfies Meta<FieldStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
