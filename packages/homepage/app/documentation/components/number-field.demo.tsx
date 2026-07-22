import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRNumberField } from '@tinyrack/ui/components/number-field';
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
  label: string;
  max: number;
  min: number;
  readOnly: boolean;
  step: number;
  value: number | null;
};

type NumberFieldPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  required?: boolean;
  value?: number | null;
};

export function NumberFieldPreview({
  defaultValue,
  disabled,
  label,
  max,
  min,
  onValueChange,
  readOnly,
  required,
  step,
  value,
}: NumberFieldPreviewProps) {
  const inputId = useId();
  const labelId = useId();
  const normalizedMin = Number.isFinite(min) ? min : 0;
  const normalizedMax = Math.max(
    normalizedMin,
    Number.isFinite(max) ? max : normalizedMin,
  );
  const normalizedStep = Number.isFinite(step) && step > 0 ? step : 1;
  const clampValue = (nextValue: number) =>
    Math.min(normalizedMax, Math.max(normalizedMin, nextValue));
  const stateProps =
    value === undefined
      ? {
          defaultValue:
            defaultValue === undefined ? undefined : clampValue(defaultValue),
        }
      : { value: value === null ? null : clampValue(value) };

  return (
    <TRNumberField.Root
      {...stateProps}
      disabled={disabled}
      max={normalizedMax}
      min={normalizedMin}
      name="replicas"
      onValueChange={onValueChange}
      readOnly={readOnly}
      required={required}
      step={normalizedStep}
    >
      <TRNumberField.ScrubArea>
        <label htmlFor={inputId} id={labelId}>
          {label}
        </label>
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease">−</TRNumberField.Decrement>
        <TRNumberField.Input aria-labelledby={labelId} id={inputId} />
        <TRNumberField.Increment aria-label="Increase">+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}

export function NumberFieldFormatPreview() {
  return (
    <TRNumberField.Root
      defaultValue={64}
      format={{ style: 'unit', unit: 'gigabyte', unitDisplay: 'short' }}
      max={256}
      min={16}
      name="storage"
      step={16}
    >
      <TRNumberField.ScrubArea>
        <label htmlFor="storage-capacity">Storage capacity</label>
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease by 16 gigabytes">
          −
        </TRNumberField.Decrement>
        <TRNumberField.Input id="storage-capacity" />
        <TRNumberField.Increment aria-label="Increase by 16 gigabytes">
          +
        </TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}

export function NumberFieldStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <NumberFieldPreview
        defaultValue={3}
        disabled={false}
        label="Editable replicas"
        max={20}
        min={0}
        readOnly={false}
        step={1}
      />
      <NumberFieldPreview
        defaultValue={8}
        disabled
        label="Disabled replicas"
        max={20}
        min={0}
        readOnly={false}
        step={1}
      />
      <NumberFieldPreview
        defaultValue={12}
        disabled={false}
        label="Read-only replicas"
        max={20}
        min={0}
        readOnly
        step={1}
      />
    </div>
  );
}

export function NumberFieldValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const invalid = attempted && value === null;

  return (
    <TRForm
      className="grid w-80 max-w-full gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <NumberFieldPreview
          disabled={false}
          label="Replica count"
          max={20}
          min={0}
          onValueChange={setValue}
          readOnly={false}
          required
          step={1}
          value={value}
        />
        {invalid ? <TRField.Error match>Choose a replica count.</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">Create service</TRButton>
      <output aria-live="polite">
        {attempted && value !== null ? `Creating ${value} replicas.` : ''}
      </output>
    </TRForm>
  );
}

export function NumberFieldLocalePreview() {
  return (
    <TRNumberField.Root
      defaultValue={1234.5}
      format={{ minimumFractionDigits: 2 }}
      locale="de-DE"
      name="budget"
      step={0.25}
    >
      <TRNumberField.ScrubArea>
        <label htmlFor="localized-budget">Budget (de-DE)</label>
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease budget">
          −
        </TRNumberField.Decrement>
        <TRNumberField.Input id="localized-budget" />
        <TRNumberField.Increment aria-label="Increase budget">
          +
        </TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}

export function NumberFieldResetPreview() {
  const [result, setResult] = useState('');

  return (
    <TRForm
      className="grid w-80 max-w-full gap-3"
      onReset={() => setResult('Reset to 4 replicas.')}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(
          `Submitted ${new FormData(event.currentTarget).get('replicas')} replicas.`,
        );
      }}
    >
      <NumberFieldPreview
        defaultValue={4}
        disabled={false}
        label="Replicas"
        max={20}
        min={0}
        readOnly={false}
        step={1}
      />
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">Submit</TRButton>
        <TRButton type="reset" variant="secondary">
          Reset
        </TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

export const numberFieldBasicSource = `import { TRNumberField } from '@tinyrack/ui/components/number-field';

export function ReplicaCount() {
  return (
    <TRNumberField.Root defaultValue={3} max={20} min={0} name="replicas">
      <TRNumberField.ScrubArea>
        <label htmlFor="replica-count">Replicas</label>
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease">−</TRNumberField.Decrement>
        <TRNumberField.Input id="replica-count" />
        <TRNumberField.Increment aria-label="Increase">+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}`;

export const numberFieldStatesSource = `import { TRNumberField } from '@tinyrack/ui/components/number-field';
import { useId } from 'react';

type NumberFieldSampleProps = {
  disabled?: boolean;
  label: string;
  readOnly?: boolean;
  value: number;
};

function NumberFieldSample({ disabled = false, label, readOnly = false, value }: NumberFieldSampleProps) {
  const id = useId();
  return (
    <TRNumberField.Root defaultValue={value} disabled={disabled} readOnly={readOnly}>
      <TRNumberField.ScrubArea><label htmlFor={id}>{label}</label></TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label={\`Decrease \${label}\`}>−</TRNumberField.Decrement>
        <TRNumberField.Input id={id} />
        <TRNumberField.Increment aria-label={\`Increase \${label}\`}>+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}

export function NumberFieldStates() {
  return (
    <div>
      <NumberFieldSample label="Editable replicas" value={3} />
      <NumberFieldSample disabled label="Disabled replicas" value={8} />
      <NumberFieldSample label="Read-only replicas" readOnly value={12} />
    </div>
  );
}`;

export const numberFieldValidationSource = `import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRNumberField } from '@tinyrack/ui/components/number-field';
import { useState } from 'react';

export function ReplicaForm() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const invalid = attempted && value === null;

  return (
    <TRForm noValidate onSubmit={(event) => { event.preventDefault(); setAttempted(true); }}>
      <TRField.Root invalid={invalid}>
        <TRNumberField.Root max={20} min={0} name="replicas" onValueChange={setValue} required value={value}>
          <TRNumberField.Group>
            <TRNumberField.Decrement aria-label="Decrease">−</TRNumberField.Decrement>
            <TRNumberField.Input aria-label="Replica count" />
            <TRNumberField.Increment aria-label="Increase">+</TRNumberField.Increment>
          </TRNumberField.Group>
        </TRNumberField.Root>
        {invalid ? <TRField.Error match>Choose a replica count.</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">Create service</TRButton>
    </TRForm>
  );
}`;

export const numberFieldFormatSource = `import { TRNumberField } from '@tinyrack/ui/components/number-field';

export function StorageCapacity() {
  return (
    <TRNumberField.Root defaultValue={64} format={{ style: 'unit', unit: 'gigabyte' }} max={256} min={16} name="storage" step={16}>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease by 16 gigabytes">−</TRNumberField.Decrement>
        <TRNumberField.Input aria-label="Storage capacity" />
        <TRNumberField.Increment aria-label="Increase by 16 gigabytes">+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}`;

export const numberFieldLocaleSource = `import { TRNumberField } from '@tinyrack/ui/components/number-field';

export function LocalizedBudget() {
  return (
    <TRNumberField.Root defaultValue={1234.5} format={{ minimumFractionDigits: 2 }} locale="de-DE" name="budget" step={0.25}>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label="Decrease budget">−</TRNumberField.Decrement>
        <TRNumberField.Input aria-label="Budget (de-DE)" />
        <TRNumberField.Increment aria-label="Increase budget">+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>
  );
}`;

export const numberFieldResetSource = `import { TRButton } from '@tinyrack/ui/components/button';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRNumberField } from '@tinyrack/ui/components/number-field';

export function ResettableReplicas() {
  return (
    <TRForm>
      <TRNumberField.Root defaultValue={4} max={20} min={0} name="replicas">
        <TRNumberField.Group>
          <TRNumberField.Decrement aria-label="Decrease replicas">−</TRNumberField.Decrement>
          <TRNumberField.Input aria-label="Replicas" />
          <TRNumberField.Increment aria-label="Increase replicas">+</TRNumberField.Increment>
        </TRNumberField.Group>
      </TRNumberField.Root>
      <TRButton type="submit">Submit</TRButton>
      <TRButton type="reset" variant="secondary">Reset</TRButton>
    </TRForm>
  );
}`;

const meta = {
  title: 'Components/Number Field',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Replicas',
    max: 20,
    min: 0,
    readOnly: false,
    step: 1,
    value: 3,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    max: { control: { type: 'number' } },
    min: { control: { type: 'number' } },
    readOnly: { control: 'boolean' },
    step: { control: { type: 'number', min: 0.1 } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <NumberFieldPreview {...args} onValueChange={(value) => updateArgs({ value })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
