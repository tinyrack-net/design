import { TRButton } from '@tinyrack/ui/components/button';
import type { TRCheckboxUiSize } from '@tinyrack/ui/components/checkbox';
import { TRCheckbox } from '@tinyrack/ui/components/checkbox';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
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
  uiSize: TRCheckboxUiSize;
};

type CheckboxPreviewProps = Omit<StoryArgs, 'checked' | 'uiSize'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  form?: string;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
  uiSize?: TRCheckboxUiSize;
  uncheckedValue?: string;
  value?: string;
};

export function CheckboxPreview({
  checked,
  defaultChecked,
  disabled,
  form,
  indeterminate,
  label,
  name = 'backups',
  onCheckedChange,
  readOnly,
  required = false,
  uiSize = 'md',
  uncheckedValue,
  value,
}: CheckboxPreviewProps) {
  const inputId = useId();
  const stateProps = checked === undefined ? { defaultChecked } : { checked };

  return (
    <div className="flex items-center gap-2">
      <TRCheckbox.Root
        {...stateProps}
        disabled={disabled}
        form={form}
        id={inputId}
        indeterminate={indeterminate}
        name={name}
        onCheckedChange={onCheckedChange}
        readOnly={readOnly}
        required={required}
        uiSize={uiSize}
        uncheckedValue={uncheckedValue}
        value={value}
      >
        <TRCheckbox.Indicator aria-hidden="true">
          {indeterminate ? '−' : '✓'}
        </TRCheckbox.Indicator>
      </TRCheckbox.Root>
      <label
        className={
          disabled
            ? 'cursor-not-allowed text-tinyrack-text-muted'
            : readOnly
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
        }
        htmlFor={inputId}
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
      <CheckboxStateSample indeterminate readOnly title="Read only · Mixed" />
      <CheckboxStateSample disabled title="Disabled · Unchecked" />
      <CheckboxStateSample disabled indeterminate title="Disabled · Mixed" />
    </div>
  );
}

export function CheckboxFormValuesPreview() {
  const formId = useId();
  const [result, setResult] = useState('');

  return (
    <div className="grid gap-3">
      <TRForm
        className="grid gap-3"
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget).getAll('monitoring');
          setResult(`Submitted: ${values.join(', ')}`);
        }}
      >
        <TRButton type="submit">Read form value</TRButton>
      </TRForm>
      <CheckboxPreview
        defaultChecked={false}
        disabled={false}
        form={formId}
        indeterminate={false}
        label="Monitoring outside the form"
        name="monitoring"
        readOnly={false}
        required={false}
        uncheckedValue="disabled"
        value="enabled"
      />
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export function CheckboxValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [checked, setChecked] = useState(false);
  const invalid = attempted && !checked;

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label className="flex min-w-0 items-start gap-2 whitespace-normal">
          <TRCheckbox.Root
            checked={checked}
            name="terms"
            onCheckedChange={(nextChecked) => setChecked(nextChecked)}
            required
          >
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          I accept the maintenance window.
        </TRField.Label>
        {invalid ? (
          <TRField.Error match>
            Accept the maintenance window to continue.
          </TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">
        {attempted && checked ? 'Maintenance window accepted.' : ''}
      </output>
    </TRForm>
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
    uiSize: 'md',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <CheckboxPreview
        {...args}
        onCheckedChange={(checked) => updateArgs({ checked, indeterminate: false })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
