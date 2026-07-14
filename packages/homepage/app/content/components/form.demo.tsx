import { Button } from '@tinyrack/ui/components/button';
import { Field } from '@tinyrack/ui/components/field';
import { Form } from '@tinyrack/ui/components/form';
import { Input } from '@tinyrack/ui/components/input';
import { useId, useState } from 'react';
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

  return (
    <Form
      className="grid w-full max-w-80 min-w-0 gap-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="grid gap-2" htmlFor={inputId}>
        {label}
        <Input
          defaultValue={value === undefined ? defaultValue : undefined}
          id={inputId}
          name="rack"
          onChange={(event) => onValueChange?.(event.currentTarget.value)}
          required={required}
          value={value}
        />
      </label>
      <Button type="submit">{submitLabel}</Button>
    </Form>
  );
}

export function FormNativeValuesPreview() {
  const inputId = useId();
  const [submittedValue, setSubmittedValue] = useState('');

  return (
    <Form
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
        <Input defaultValue="rack-alpha" id={inputId} name="rack" />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Submit rack</Button>
        <Button type="reset">Reset form</Button>
      </div>
      <output aria-live="polite">
        {submittedValue ? `Submitted ${submittedValue}.` : ''}
      </output>
    </Form>
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
    <Form
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
        <Input
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
      <Button type="submit">Save rack</Button>
      <output aria-live="polite">
        {submittedValue ? `Saved ${submittedValue}.` : ''}
      </output>
    </Form>
  );
}

export function FormServerErrorPreview() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');

  return (
    <Form
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
      <Field.Root name="rack">
        <Field.Label>Rack name</Field.Label>
        <Field.Control defaultValue="rack-alpha" required />
        <Field.Description>
          Use a name that is not already registered.
        </Field.Description>
        <Field.Error />
      </Field.Root>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Create rack</Button>
        <Button type="reset">Reset form</Button>
      </div>
      <output aria-live="polite">{result}</output>
    </Form>
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
    value: { control: 'text' },
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
