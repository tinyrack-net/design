import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '../../src/components/button/index.js';
import { Field } from '../../src/components/field/index.js';
import { Form } from '../../src/components/form/index.js';
import { NumberField } from '../../src/components/number-field/index.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  readOnly: boolean;
  required: boolean;
  value: number;
};

type NumberFieldPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  value?: number | null;
};

export function NumberFieldPreview({
  defaultValue,
  disabled,
  label,
  onValueChange,
  readOnly,
  required,
  value,
}: NumberFieldPreviewProps) {
  const inputId = useId();
  const labelId = useId();
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <NumberField.Root
      {...stateProps}
      disabled={disabled}
      max={20}
      min={0}
      name="replicas"
      onValueChange={onValueChange}
      readOnly={readOnly}
      required={required}
    >
      <NumberField.ScrubArea>
        <label htmlFor={inputId} id={labelId}>
          {label}
        </label>
        <NumberField.ScrubAreaCursor>↕</NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>
      <NumberField.Group>
        <NumberField.Decrement aria-label="Decrease">−</NumberField.Decrement>
        <NumberField.Input aria-labelledby={labelId} id={inputId} />
        <NumberField.Increment aria-label="Increase">+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}

export function NumberFieldStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <NumberFieldPreview
        defaultValue={3}
        disabled={false}
        label="Editable replicas"
        readOnly={false}
        required={false}
      />
      <NumberFieldPreview
        defaultValue={8}
        disabled
        label="Disabled replicas"
        readOnly={false}
        required={false}
      />
      <NumberFieldPreview
        defaultValue={12}
        disabled={false}
        label="Read-only replicas"
        readOnly
        required={false}
      />
    </div>
  );
}

export function NumberFieldValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const invalid = attempted && value === null;

  return (
    <Form
      className="grid w-80 max-w-full gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <Field.Root invalid={invalid}>
        <NumberFieldPreview
          disabled={false}
          label="Replica count"
          onValueChange={setValue}
          readOnly={false}
          required
          value={value}
        />
        <Field.Error match>Choose a replica count.</Field.Error>
      </Field.Root>
      <Button type="submit">Create service</Button>
      <output aria-live="polite">
        {attempted && value !== null ? `Creating ${value} replicas.` : ''}
      </output>
    </Form>
  );
}

const meta = {
  title: 'Components/Number Field',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Replicas',
    readOnly: false,
    required: false,
    value: 3,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: { type: 'number', min: 0, max: 20 } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <NumberFieldPreview
        {...args}
        onValueChange={(value) => updateArgs({ value: value ?? 0 })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
