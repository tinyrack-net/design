import { Button } from '@tinyrack/ui/components/button';
import { Field } from '@tinyrack/ui/components/field';
import { Fieldset } from '@tinyrack/ui/components/fieldset';
import { Form } from '@tinyrack/ui/components/form';
import { Radio } from '@tinyrack/ui/components/radio';
import { RadioGroup } from '@tinyrack/ui/components/radio-group';
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
  const legendId = `${baseId}-legend`;
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <Fieldset.Root className="w-full max-w-80" disabled={disabled}>
      <Fieldset.Legend id={legendId}>{label}</Fieldset.Legend>
      <RadioGroup
        {...stateProps}
        aria-labelledby={legendId}
        disabled={disabled}
        name="rack"
        onValueChange={(nextValue) => onValueChange?.(nextValue as string)}
        readOnly={readOnly}
        required={required}
      >
        {radioOptions.map((option) => (
          // biome-ignore lint/a11y/noLabelWithoutControl: Radio.Root renders the native radio input inside this label.
          <label
            className={`flex items-center gap-2 ${
              disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            key={option.value}
          >
            <Radio.Root aria-label={option.label} value={option.value}>
              <Radio.Indicator aria-hidden="true" />
            </Radio.Root>
            <span
              style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
            >
              {option.label}
            </span>
          </label>
        ))}
      </RadioGroup>
    </Fieldset.Root>
  );
}

export function RadioGroupStateComparison() {
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
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

export const radioGroupStatesSource = `import { Fieldset } from '@tinyrack/ui/components/fieldset';
import { Radio } from '@tinyrack/ui/components/radio';
import { RadioGroup } from '@tinyrack/ui/components/radio-group';
import { useId } from 'react';

const rackOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
] as const;

function RackGroup({
  defaultValue,
  disabled = false,
  label,
  readOnly = false,
}: {
  defaultValue: string;
  disabled?: boolean;
  label: string;
  readOnly?: boolean;
}) {
  const baseId = useId();
  const legendId = baseId + '-legend';

  return (
    <Fieldset.Root className="w-full max-w-80" disabled={disabled}>
      <Fieldset.Legend id={legendId}>{label}</Fieldset.Legend>
      <RadioGroup
        aria-labelledby={legendId}
        defaultValue={defaultValue}
        disabled={disabled}
        name={baseId + '-rack'}
        readOnly={readOnly}
      >
        {rackOptions.map((option) => (
            <label className="flex items-center gap-2" key={option.value}>
              <Radio.Root aria-label={option.label} value={option.value}>
                <Radio.Indicator aria-hidden="true" />
              </Radio.Root>
              <span>{option.label}</span>
            </label>
        ))}
      </RadioGroup>
    </Fieldset.Root>
  );
}

export function RadioGroupStates() {
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <RackGroup defaultValue="alpha" label="Editable" />
      <RackGroup defaultValue="beta" disabled label="Disabled" />
      <RackGroup defaultValue="gamma" label="Read only" readOnly />
    </div>
  );
}`;

export function RadioGroupValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.length === 0;

  return (
    <Form
      className="grid min-w-0 gap-3"
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
        {invalid ? (
          <Field.Error match>Choose a primary rack to continue.</Field.Error>
        ) : null}
      </Field.Root>
      <Button type="submit">Continue</Button>
      <output aria-live="polite">
        {attempted && value ? `Primary rack: ${value}.` : ''}
      </output>
    </Form>
  );
}

export const radioGroupValidationSource = `import { Button } from '@tinyrack/ui/components/button';
import { Field } from '@tinyrack/ui/components/field';
import { Fieldset } from '@tinyrack/ui/components/fieldset';
import { Form } from '@tinyrack/ui/components/form';
import { Radio } from '@tinyrack/ui/components/radio';
import { RadioGroup } from '@tinyrack/ui/components/radio-group';
import { useId, useState } from 'react';

const rackOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
] as const;

export function RequiredRack() {
  const baseId = useId();
  const legendId = baseId + '-legend';
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value === '';

  return (
    <Form
      className="grid min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <Field.Root invalid={invalid}>
        <Fieldset.Root className="w-full max-w-80">
          <Fieldset.Legend id={legendId}>Primary rack</Fieldset.Legend>
          <RadioGroup
            aria-labelledby={legendId}
            name="rack"
            onValueChange={(nextValue) => setValue(nextValue as string)}
            required
            value={value}
          >
            {rackOptions.map((option) => (
                <label className="flex items-center gap-2" key={option.value}>
                  <Radio.Root aria-label={option.label} value={option.value}>
                    <Radio.Indicator aria-hidden="true" />
                  </Radio.Root>
                  <span>{option.label}</span>
                </label>
            ))}
          </RadioGroup>
        </Fieldset.Root>
        {invalid ? (
          <Field.Error match>Choose a primary rack to continue.</Field.Error>
        ) : null}
      </Field.Root>
      <Button type="submit">Continue</Button>
      <output aria-live="polite">
        {attempted && value ? 'Primary rack: ' + value + '.' : ''}
      </output>
    </Form>
  );
}`;

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

export const playground = definePlayground(meta);
