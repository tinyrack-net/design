import { Button } from '@tinyrack/ui/components/button';
import { Field } from '@tinyrack/ui/components/field';
import { Form } from '@tinyrack/ui/components/form';
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
  value,
}: FieldPreviewProps) {
  return (
    <Field.Root
      className="w-full min-w-0 max-w-80"
      disabled={disabled}
      invalid={invalid}
    >
      <Field.Label>{label}</Field.Label>
      <Field.Control
        aria-invalid={invalid || undefined}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={(event) => onValueChange?.(event.currentTarget.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        type="email"
        value={value}
      />
      <Field.Description>Operational alerts are sent here.</Field.Description>
      {invalid ? <Field.Error match>Enter a valid email.</Field.Error> : null}
    </Field.Root>
  );
}

export function FieldValidationPreview() {
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = submitted && !value.includes('@');

  return (
    <Form
      className="grid w-full min-w-0 max-w-80 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.currentTarget.checkValidity();
        setSubmitted(true);
      }}
    >
      <Field.Root invalid={invalid}>
        <Field.Label>Alert email</Field.Label>
        <Field.Control
          aria-invalid={invalid || undefined}
          name="email"
          onChange={(event) => setValue(event.currentTarget.value)}
          onInvalid={(event) => event.preventDefault()}
          placeholder="ops@example.com"
          required
          type="email"
          value={value}
        />
        <Field.Description>Used only for operational alerts.</Field.Description>
        {invalid ? (
          <Field.Error match>
            {value.length === 0 ? 'Email is required.' : 'Enter a valid email.'}
          </Field.Error>
        ) : null}
      </Field.Root>
      <Button type="submit">Save email</Button>
      <output aria-live="polite">
        {submitted && !invalid ? `Saved ${value}.` : ''}
      </output>
    </Form>
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
    value: 'ops@example.com',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
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
