import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '../../src/components/button/index.js';
import { Form } from '../../src/components/form/index.js';
import { Input } from '../../src/components/input/index.js';

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
      className="grid w-80 max-w-full gap-3"
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

export function FormValidationPreview() {
  const inputId = useId();
  const errorId = useId();
  const [attempted, setAttempted] = useState(false);
  const [submittedValue, setSubmittedValue] = useState('');
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;

  return (
    <Form
      className="grid w-80 max-w-full gap-3"
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
