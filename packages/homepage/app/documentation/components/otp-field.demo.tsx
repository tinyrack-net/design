import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TROTPField } from '@tinyrack/ui/components/otp-field';
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
  value: string;
};

type OTPFieldPreviewProps = Omit<StoryArgs, 'value'> & {
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
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <TRField.Root className="grid min-w-0 max-w-full gap-2">
      <TRField.Label id={labelId}>{label}</TRField.Label>
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
  const [event, setEvent] = useState('Waiting for input.');
  const [value, setValue] = useState('');
  return (
    <div className="grid gap-3">
      <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
        Type digits or paste a complete code. Letters are rejected and reported below.
      </p>
      <TROTPField.Root
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
      </TROTPField.Root>
      <output aria-live="polite">{event}</output>
      <TRButton
        appearance="outline"
        onClick={() => {
          setValue('');
          setEvent('Reset.');
        }}
      >
        Reset
      </TRButton>
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
    <TRForm
      className="grid w-full min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label>Verification code</TRField.Label>
        <TROTPField.Root
          aria-label="Verification code"
          length={4}
          name="code"
          onValueChange={setValue}
          required
          value={value}
        >
          <OTPFieldSlots length={4} />
        </TROTPField.Root>
        <TRField.Description>Enter all four digits.</TRField.Description>
        {invalid ? (
          <TRField.Error match>A four-digit code is required.</TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Verify</TRButton>
      <output aria-live="polite">
        {attempted && !invalid ? 'Verification code accepted.' : ''}
      </output>
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
    value: '',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    length: { control: { type: 'range', min: 3, max: 8, step: 1 } },
    readOnly: { control: 'boolean' },
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
