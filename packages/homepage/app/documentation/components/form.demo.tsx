import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm, type TRFormActions } from '@tinyrack/ui/components/form';
import { TRInput } from '@tinyrack/ui/components/input';
import { useId, useRef, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  label: string;
  required: boolean;
  submitLabel: string;
  value: string;
};

type FormPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
};

export function FormPreview({
  defaultValue,
  label,
  onValueChange,
  required,
  submitLabel,
  value,
}: FormPreviewProps) {
  const inputId = useId();
  const [submittedValue, setSubmittedValue] = useState('');

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      onFormSubmit={(values) => setSubmittedValue(String(values['rack'] ?? ''))}
    >
      <TRField.Root name="rack">
        <TRField.Label>{label}</TRField.Label>
        <TRField.Control
          defaultValue={value === undefined ? defaultValue : undefined}
          id={inputId}
          onChange={(event) => onValueChange?.(event.currentTarget.value)}
          required={required}
          value={value}
        />
        <TRField.Error match>Enter a rack name.</TRField.Error>
      </TRField.Root>
      <TRButton type="submit">{submitLabel}</TRButton>
      <output aria-live="polite">
        {submittedValue ? `Submitted ${submittedValue}.` : ''}
      </output>
    </TRForm>
  );
}

export function FormNativeValuesPreview() {
  const inputId = useId();
  const [submittedValue, setSubmittedValue] = useState('');

  return (
    <TRForm
      aria-label="Native rack form"
      className="grid w-full max-w-80 min-w-0 gap-3"
      onReset={() => setSubmittedValue('')}
      onSubmit={(event) => {
        event.preventDefault();
        const value = String(new FormData(event.currentTarget).get('rack') ?? '');
        setSubmittedValue(value);
      }}
    >
      <label className="grid gap-2" htmlFor={inputId}>
        Rack name
        <TRInput defaultValue="rack-alpha" id={inputId} name="rack" />
      </label>
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">Submit rack</TRButton>
        <TRButton type="reset">Reset form</TRButton>
      </div>
      <output aria-live="polite">
        {submittedValue ? `Submitted ${submittedValue}.` : ''}
      </output>
    </TRForm>
  );
}

export function FormValidationPreview() {
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
        Rack name
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
          Enter a rack name before saving.
        </p>
      ) : null}
      <TRButton type="submit">Save rack</TRButton>
      <output aria-live="polite">
        {submittedValue ? `Saved ${submittedValue}.` : ''}
      </output>
    </TRForm>
  );
}

export function FormServerErrorPreview() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');

  return (
    <TRForm
      aria-label="Create rack form"
      className="grid w-full max-w-80 min-w-0 gap-3"
      errors={errors}
      onFormSubmit={(values) => {
        const rack = String(values['rack'] ?? '');
        if (rack.toLowerCase() === 'rack-alpha') {
          setErrors({ rack: 'Rack Alpha already exists.' });
          setResult('');
          return;
        }

        setErrors({});
        setResult(`Created ${rack}.`);
      }}
      onReset={() => {
        setErrors({});
        setResult('');
      }}
    >
      <TRField.Root name="rack">
        <TRField.Label>Rack name</TRField.Label>
        <TRField.Control defaultValue="rack-alpha" required />
        <TRField.Description>
          Use a name that is not already registered.
        </TRField.Description>
        <TRField.Error />
      </TRField.Root>
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">Create rack</TRButton>
        <TRButton type="reset">Reset form</TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

export function FormActionsPreview() {
  const actionsRef = useRef<TRFormActions>(null);
  const [result, setResult] = useState('');

  return (
    <TRForm<{ rack: string; region: string }>
      actionsRef={actionsRef}
      className="grid w-full max-w-80 min-w-0 gap-3"
      onFormSubmit={(values) =>
        setResult(`Validated ${values.rack} in ${values.region}.`)
      }
      validationMode="onBlur"
    >
      <TRField.Root name="rack">
        <TRField.Label>Rack name</TRField.Label>
        <TRField.Control required />
        <TRField.Error match="valueMissing">Enter a rack name.</TRField.Error>
      </TRField.Root>
      <TRField.Root name="region">
        <TRField.Label>Region</TRField.Label>
        <TRField.Control required />
        <TRField.Error match="valueMissing">Enter a region.</TRField.Error>
      </TRField.Root>
      <div className="flex flex-wrap gap-2">
        <TRButton onClick={() => actionsRef.current?.validate('rack')} type="button">
          Validate rack
        </TRButton>
        <TRButton
          onClick={() => actionsRef.current?.validate()}
          type="button"
          variant="secondary"
        >
          Validate all
        </TRButton>
        <TRButton type="submit" variant="primary">
          Submit
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
    value: 'rack-alpha',
  },
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
    submitLabel: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return <FormPreview {...args} onValueChange={(value) => updateArgs({ value })} />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
