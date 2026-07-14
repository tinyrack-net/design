import { Button } from '@tinyrack/ui/components/button';
import { Checkbox } from '@tinyrack/ui/components/checkbox';
import { Field } from '@tinyrack/ui/components/field';
import { Form } from '@tinyrack/ui/components/form';
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
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  label: string;
  readOnly: boolean;
  required: boolean;
};

type CheckboxPreviewProps = Omit<StoryArgs, 'checked'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function CheckboxPreview({
  checked,
  defaultChecked,
  disabled,
  indeterminate,
  label,
  onCheckedChange,
  readOnly,
  required,
}: CheckboxPreviewProps) {
  const inputId = useId();
  const stateProps = checked === undefined ? { defaultChecked } : { checked };

  return (
    <div className="flex items-center gap-2">
      <Checkbox.Root
        {...stateProps}
        disabled={disabled}
        id={inputId}
        indeterminate={indeterminate}
        name="backups"
        onCheckedChange={onCheckedChange}
        readOnly={readOnly}
        required={required}
      >
        <Checkbox.Indicator aria-hidden="true">
          {indeterminate ? '−' : '✓'}
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        className={disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}
        htmlFor={inputId}
        style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
      >
        {label}
      </label>
    </div>
  );
}

function CheckboxStateSample({
  checked = false,
  disabled = false,
  indeterminate = false,
  readOnly = false,
  title,
}: {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  readOnly?: boolean;
  title: string;
}) {
  return (
    <div className="grid gap-2">
      <strong>{title}</strong>
      <CheckboxPreview
        defaultChecked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        label="Enable backups"
        readOnly={readOnly}
        required={false}
      />
    </div>
  );
}

export function CheckboxStateComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CheckboxStateSample title="Enabled · Unchecked" />
      <CheckboxStateSample checked title="Enabled · Checked" />
      <CheckboxStateSample indeterminate title="Mixed" />
      <CheckboxStateSample checked readOnly title="Read only" />
      <CheckboxStateSample disabled title="Disabled · Unchecked" />
      <CheckboxStateSample checked disabled title="Disabled · Checked" />
    </div>
  );
}

export function CheckboxValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [checked, setChecked] = useState(false);
  const invalid = attempted && !checked;

  return (
    <Form
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <Field.Root invalid={invalid}>
        <Field.Label className="flex min-w-0 items-start gap-2 whitespace-normal">
          <Checkbox.Root
            checked={checked}
            name="terms"
            onCheckedChange={(nextChecked) => setChecked(nextChecked)}
            required
          >
            <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
          </Checkbox.Root>
          I accept the maintenance window.
        </Field.Label>
        {invalid ? (
          <Field.Error match>Accept the maintenance window to continue.</Field.Error>
        ) : null}
      </Field.Root>
      <Button type="submit">Continue</Button>
      <output aria-live="polite">
        {attempted && checked ? 'Maintenance window accepted.' : ''}
      </output>
    </Form>
  );
}

const meta = {
  title: 'Components/Checkbox',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    checked: true,
    disabled: false,
    indeterminate: false,
    label: 'Enable backups',
    readOnly: false,
    required: false,
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <CheckboxPreview
        {...args}
        onCheckedChange={(checked) => updateArgs({ checked })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
