import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '../../src/components/button/index.js';
import { Field } from '../../src/components/field/index.js';
import { Form } from '../../src/components/form/index.js';
import { OTPField } from '../../src/components/otp-field/index.js';

type StoryArgs = {
  disabled: boolean;
  length: number;
  readOnly: boolean;
  required: boolean;
  value: string;
};

type OTPFieldPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: string;
  label?: string;
  onValueChange?: (value: string) => void;
  value?: string;
};

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
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <div className="grid gap-2">
      <strong id={labelId}>{label}</strong>
      <OTPField.Root
        {...stateProps}
        aria-labelledby={labelId}
        disabled={disabled}
        length={length}
        name="verification-code"
        onValueChange={onValueChange}
        readOnly={readOnly}
        required={required}
      >
        {Array.from({ length }, (_, index) => `slot-${index + 1}`).map((slot) => (
          <OTPField.Input key={slot} />
        ))}
      </OTPField.Root>
    </div>
  );
}

export function OTPFieldStateComparison() {
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
        label="Six-digit code"
        length={6}
        readOnly
        required={false}
      />
      <OTPFieldPreview
        defaultValue="1234"
        disabled
        label="Disabled code"
        length={4}
        readOnly={false}
        required={false}
      />
    </div>
  );
}

export function OTPFieldValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.length !== 4;

  return (
    <Form
      className="grid gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <Field.Root invalid={invalid}>
        <Field.Label>Verification code</Field.Label>
        <OTPField.Root
          aria-label="Verification code"
          length={4}
          name="code"
          onValueChange={setValue}
          required
          value={value}
        >
          <OTPField.Input />
          <OTPField.Input />
          <OTPField.Input />
          <OTPField.Input />
        </OTPField.Root>
        <Field.Description>Enter all four digits.</Field.Description>
        <Field.Error match>A four-digit code is required.</Field.Error>
      </Field.Root>
      <Button type="submit">Verify</Button>
      <output aria-live="polite">
        {attempted && !invalid ? 'Verification code accepted.' : ''}
      </output>
    </Form>
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
    required: true,
    value: '',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    length: { control: { type: 'range', min: 3, max: 8, step: 1 } },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <OTPFieldPreview {...args} onValueChange={(value) => updateArgs({ value })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
