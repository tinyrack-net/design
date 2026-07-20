import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
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
  form?: string;
  label?: string;
  name?: string;
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
  form,
  label = 'Rack',
  name = 'rack',
  onValueChange,
  readOnly,
  required,
  value,
}: RadioGroupPreviewProps) {
  const baseId = useId();
  const legendId = `${baseId}-legend`;
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <TRFieldset.Root className="w-full max-w-80" disabled={disabled}>
      <TRFieldset.Legend id={legendId}>{label}</TRFieldset.Legend>
      <TRRadioGroup
        {...stateProps}
        aria-labelledby={legendId}
        disabled={disabled}
        form={form}
        name={name}
        onValueChange={(nextValue) => onValueChange?.(nextValue as string)}
        readOnly={readOnly}
        required={required}
      >
        {radioOptions.map((option) => (
          // biome-ignore lint/a11y/noLabelWithoutControl: TRRadio.Root renders the native radio input inside this label.
          <label
            className={`flex items-center gap-2 ${
              disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            key={option.value}
          >
            <TRRadio.Root aria-label={option.label} value={option.value}>
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            <span
              style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
            >
              {option.label}
            </span>
          </label>
        ))}
      </TRRadioGroup>
    </TRFieldset.Root>
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

export const radioGroupStatesSource = `import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
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
    <TRFieldset.Root className="w-full max-w-80" disabled={disabled}>
      <TRFieldset.Legend id={legendId}>{label}</TRFieldset.Legend>
      <TRRadioGroup
        aria-labelledby={legendId}
        defaultValue={defaultValue}
        disabled={disabled}
        name={baseId + '-rack'}
        readOnly={readOnly}
      >
        {rackOptions.map((option) => (
            <label className="flex items-center gap-2" key={option.value}>
              <TRRadio.Root aria-label={option.label} value={option.value}>
                <TRRadio.Indicator aria-hidden="true" />
              </TRRadio.Root>
              <span>{option.label}</span>
            </label>
        ))}
      </TRRadioGroup>
    </TRFieldset.Root>
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
    <TRForm
      className="grid min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <RadioGroupPreview
          disabled={false}
          label="Primary rack"
          onValueChange={setValue}
          readOnly={false}
          required
          value={value}
        />
        {invalid ? (
          <TRField.Error match>Choose a primary rack to continue.</TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">
        {attempted && value ? `Primary rack: ${value}.` : ''}
      </output>
    </TRForm>
  );
}

export function RadioGroupExternalFormPreview() {
  const formId = useId();
  const [result, setResult] = useState('');

  return (
    <div className="grid min-w-0 gap-3">
      <TRForm
        className="flex flex-wrap gap-2"
        id={formId}
        onReset={() => setResult('Reset to alpha.')}
        onSubmit={(event) => {
          event.preventDefault();
          setResult(`Submitted: ${new FormData(event.currentTarget).get('rack')}`);
        }}
      >
        <TRButton type="submit">Submit external group</TRButton>
        <TRButton type="reset" variant="secondary">
          Reset
        </TRButton>
      </TRForm>
      <RadioGroupPreview
        defaultValue="alpha"
        disabled={false}
        form={formId}
        label="Rack outside the form"
        name="rack"
        readOnly={false}
        required
      />
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export const radioGroupValidationSource = `import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
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
    <TRForm
      className="grid min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRFieldset.Root className="w-full max-w-80">
          <TRFieldset.Legend id={legendId}>Primary rack</TRFieldset.Legend>
          <TRRadioGroup
            aria-labelledby={legendId}
            name="rack"
            onValueChange={(nextValue) => setValue(nextValue as string)}
            required
            value={value}
          >
            {rackOptions.map((option) => (
                <label className="flex items-center gap-2" key={option.value}>
                  <TRRadio.Root aria-label={option.label} value={option.value}>
                    <TRRadio.Indicator aria-hidden="true" />
                  </TRRadio.Root>
                  <span>{option.label}</span>
                </label>
            ))}
          </TRRadioGroup>
        </TRFieldset.Root>
        {invalid ? (
          <TRField.Error match>Choose a primary rack to continue.</TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">
        {attempted && value ? 'Primary rack: ' + value + '.' : ''}
      </output>
    </TRForm>
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
