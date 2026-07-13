import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '../../src/components/button/index.js';
import { Field } from '../../src/components/field/index.js';
import { Form } from '../../src/components/form/index.js';

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
    <Field.Root className="w-80 max-w-full" disabled={disabled} invalid={invalid}>
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
      <Field.Error match>
        {invalid ? 'Enter a valid email.' : 'Email is required.'}
      </Field.Error>
    </Field.Root>
  );
}

export function FieldValidationPreview() {
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = submitted && !value.includes('@');

  return (
    <Form
      className="grid w-80 max-w-full gap-3"
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
        <Field.Error match>
          {value.length === 0 ? 'Email is required.' : 'Enter a valid email.'}
        </Field.Error>
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
