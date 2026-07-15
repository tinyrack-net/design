import { Button } from '@tinyrack/ui/components/button';
import { Field } from '@tinyrack/ui/components/field';
import { Form } from '@tinyrack/ui/components/form';
import { OTPField } from '@tinyrack/ui/components/otp-field';
import { Fragment, useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

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

function OTPFieldSlots({ length }: { length: number }) {
  const separatorIndex = Math.ceil(length / 2);
  const positions = Array.from({ length }, (_, position) => position + 1);
  return positions.map((position) => (
    <Fragment key={`slot-${position}`}>
      {position === separatorIndex + 1 ? (
        <OTPField.Separator aria-hidden="true" />
      ) : null}
      <OTPField.Input />
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
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <Field.Root className="grid min-w-0 max-w-full gap-2">
      <Field.Label id={labelId}>{label}</Field.Label>
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
        <OTPFieldSlots length={length} />
      </OTPField.Root>
    </Field.Root>
  );
}

export function OTPFieldInputFlow() {
  const [event, setEvent] = useState('Waiting for input.');
  const [value, setValue] = useState('');
  return (
    <div className="grid gap-3">
      <p className="m-0 text-tinyrack-sm text-tinyrack-muted">
        Type digits or paste a complete code. Letters are rejected and reported below.
      </p>
      <OTPField.Root
        aria-label="Interactive verification code"
        length={4}
        onValueChange={(nextValue, details) => {
          setValue(nextValue);
          setEvent(`Accepted ${nextValue || 'empty'} via ${details.reason}.`);
        }}
        onValueComplete={(nextValue, details) =>
          setEvent(`Completed ${nextValue} via ${details.reason}.`)
        }
        onValueInvalid={(attemptedValue, details) =>
          setEvent(`Rejected ${attemptedValue} via ${details.reason}.`)
        }
        value={value}
      >
        <OTPFieldSlots length={4} />
      </OTPField.Root>
      <output aria-live="polite">{event}</output>
      <Button
        appearance="outline"
        onClick={() => {
          setValue('');
          setEvent('Reset.');
        }}
      >
        Reset
      </Button>
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
      className="grid w-full min-w-0 gap-3"
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
          <OTPFieldSlots length={4} />
        </OTPField.Root>
        <Field.Description>Enter all four digits.</Field.Description>
        {invalid ? (
          <Field.Error match>A four-digit code is required.</Field.Error>
        ) : null}
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

export const playground = definePlayground(meta);
