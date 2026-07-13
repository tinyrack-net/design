import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '../../src/components/button/index.js';
import { Field } from '../../src/components/field/index.js';
import { Fieldset } from '../../src/components/fieldset/index.js';
import { Form } from '../../src/components/form/index.js';
import { Radio } from '../../src/components/radio/index.js';
import { RadioGroup } from '../../src/components/radio-group/index.js';

type StoryArgs = {
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  value: string;
};

type RadioGroupPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: string;
  label?: string;
  onValueChange?: (value: string) => void;
  value?: string;
};

const radioOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
] as const;

export function RadioGroupPreview({
  defaultValue,
  disabled,
  label = 'Rack',
  onValueChange,
  readOnly,
  required,
  value,
}: RadioGroupPreviewProps) {
  const baseId = useId();
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <Fieldset.Root className="w-80 max-w-full" disabled={disabled}>
      <Fieldset.Legend>{label}</Fieldset.Legend>
      <RadioGroup
        {...stateProps}
        disabled={disabled}
        name="rack"
        onValueChange={(nextValue) => onValueChange?.(nextValue as string)}
        readOnly={readOnly}
        required={required}
      >
        {radioOptions.map((option, index) => {
          const inputId = `${baseId}-${index}`;
          return (
            <div className="flex items-center gap-2" key={option.value}>
              <Radio.Root id={inputId} value={option.value}>
                <Radio.Indicator />
              </Radio.Root>
              <label
                className={
                  disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'
                }
                htmlFor={inputId}
                style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </RadioGroup>
    </Fieldset.Root>
  );
}

export function RadioGroupStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RadioGroupPreview
        defaultValue="alpha"
        disabled={false}
        label="Editable"
        readOnly={false}
        required={false}
      />
      <RadioGroupPreview
        defaultValue="beta"
        disabled
        label="Disabled"
        readOnly={false}
        required={false}
      />
      <RadioGroupPreview
        defaultValue="gamma"
        disabled={false}
        label="Read only"
        readOnly
        required={false}
      />
    </div>
  );
}

export function RadioGroupValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.length === 0;

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
        <RadioGroupPreview
          disabled={false}
          label="Primary rack"
          onValueChange={setValue}
          readOnly={false}
          required
          value={value}
        />
        <Field.Error match>Choose a primary rack to continue.</Field.Error>
      </Field.Root>
      <Button type="submit">Continue</Button>
      <output aria-live="polite">
        {attempted && value ? `Primary rack: ${value}.` : ''}
      </output>
    </Form>
  );
}

const meta = {
  title: 'Components/Radio Group',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    readOnly: false,
    required: false,
    value: 'alpha',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'select', options: radioOptions.map((option) => option.value) },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <RadioGroupPreview {...args} onValueChange={(value) => updateArgs({ value })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
