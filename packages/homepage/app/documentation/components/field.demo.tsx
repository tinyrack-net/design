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
  readOnly: boolean;
  required: boolean;
  size: 'sm' | 'md' | 'lg';
  value: string;
};

type FieldPreviewProps = Omit<FieldStoryArgs, 'readOnly' | 'required' | 'value'> & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
};

export function FieldPreview({
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
  return (
    <TRField.Root
      className="w-full min-w-0 max-w-80"
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
      <TRField.Description>Operational alerts are sent here.</TRField.Description>
      {invalid ? <TRField.Error match>Enter a valid email.</TRField.Error> : null}
    </TRField.Root>
  );
}

export function FieldValidationPreview() {
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
        <TRField.Label>TRAlert email</TRField.Label>
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
        <TRField.Description>Used only for operational alerts.</TRField.Description>
        {invalid ? (
          <TRField.Error match="valueMissing">Email is required.</TRField.Error>
        ) : null}
        {invalid ? (
          <TRField.Error match="typeMismatch">Enter a valid email.</TRField.Error>
        ) : null}
      </TRField.Root>
      <div className="flex gap-2">
        <TRButton type="submit">Save email</TRButton>
        <TRButton type="reset" variant="secondary">
          Reset
        </TRButton>
      </div>
      <output aria-live="polite">{attempted && valid ? `Saved ${value}.` : ''}</output>
    </TRForm>
  );
}

export function FieldStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FieldPreview
          defaultValue={`${size}-rack`}
          disabled={false}
          invalid={false}
          key={size}
          label={`${size.toUpperCase()} field`}
          readOnly={false}
          required={false}
          size={size}
        />
      ))}
      <FieldPreview
        defaultValue="bad value"
        disabled={false}
        invalid
        label="Invalid"
        readOnly={false}
        required={false}
        size="md"
      />
      <FieldPreview
        defaultValue="rack-disabled"
        disabled
        invalid={false}
        label="Disabled"
        readOnly={false}
        required={false}
        size="md"
      />
      <FieldPreview
        defaultValue="rack-managed"
        disabled={false}
        invalid={false}
        label="Read only"
        readOnly
        required={false}
        size="md"
      />
    </div>
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
            Native field state:{' '}
            {state.validity.valid === null
              ? 'not validated'
              : state.validity.valid
                ? 'valid'
                : 'invalid'}
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
    const [, updateArgs] = useArgs<FieldStoryArgs>();
    return <FieldPreview {...args} onValueChange={(value) => updateArgs({ value })} />;
  },
} satisfies Meta<FieldStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
