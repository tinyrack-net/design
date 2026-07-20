import { TRButton } from '@tinyrack/ui/components/button';
import { TRCheckbox } from '@tinyrack/ui/components/checkbox';
import { TRCheckboxGroup } from '@tinyrack/ui/components/checkbox-group';
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
  disabled: boolean;
  label: string;
  readOnly: boolean;
  selectedValues: string[];
};

type CheckboxGroupPreviewProps = Omit<StoryArgs, 'readOnly' | 'selectedValues'> & {
  descriptionId?: string;
  defaultSelectedValues?: string[];
  invalid?: boolean;
  onSelectedValuesChange?: (selectedValues: string[]) => void;
  readOnly?: boolean;
  selectedValues?: string[];
};

const checkboxGroupOptions = [
  { label: 'Metrics', value: 'metrics' },
  { label: 'Alerts', value: 'alerts' },
  { label: 'Automated backups', value: 'backups' },
] as const;

export function CheckboxGroupPreview({
  descriptionId,
  defaultSelectedValues,
  disabled,
  invalid,
  label,
  onSelectedValuesChange,
  readOnly = false,
  selectedValues,
}: CheckboxGroupPreviewProps) {
  const baseId = useId();
  const labelId = useId();
  const stateProps =
    selectedValues === undefined
      ? { defaultValue: defaultSelectedValues }
      : { value: selectedValues };

  return (
    <div className="grid gap-2">
      <strong id={labelId}>{label}</strong>
      <TRCheckboxGroup
        {...stateProps}
        aria-describedby={descriptionId}
        aria-invalid={invalid || undefined}
        aria-labelledby={labelId}
        disabled={disabled}
        onValueChange={onSelectedValuesChange}
      >
        {checkboxGroupOptions.map((option, index) => {
          const inputId = `${baseId}-${index}`;
          const optionLabelId = `${inputId}-label`;
          return (
            <div className="flex items-center gap-2" key={option.value}>
              <TRCheckbox.Root
                aria-labelledby={optionLabelId}
                id={inputId}
                name="rack-features"
                readOnly={readOnly}
                value={option.value}
              >
                <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
              </TRCheckbox.Root>
              <label
                className={
                  disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'
                }
                htmlFor={inputId}
                id={optionLabelId}
                style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </TRCheckboxGroup>
    </div>
  );
}

export function CheckboxGroupStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <CheckboxGroupPreview
        defaultSelectedValues={['metrics', 'backups']}
        disabled={false}
        label="Editable features"
      />
      <CheckboxGroupPreview
        defaultSelectedValues={['alerts']}
        disabled
        label="Disabled features"
      />
      <CheckboxGroupPreview
        defaultSelectedValues={['backups']}
        disabled={false}
        label="Read-only features"
        readOnly
      />
    </div>
  );
}

export function CheckboxGroupParentPreview() {
  const groupId = useId();
  const allValues = checkboxGroupOptions.map((option) => option.value);
  const [value, setValue] = useState<string[]>(['metrics']);

  return (
    <TRCheckboxGroup
      allValues={allValues}
      aria-label="Rack permissions"
      onValueChange={setValue}
      value={value}
    >
      <label
        className="flex min-h-6 items-center gap-2 font-semibold"
        htmlFor={`${groupId}-all`}
      >
        <TRCheckbox.Root id={`${groupId}-all`} parent>
          <TRCheckbox.Indicator
            render={(props, state) => (
              <span {...props}>{state.indeterminate ? '−' : '✓'}</span>
            )}
          />
        </TRCheckbox.Root>
        TRSelect all
      </label>
      {checkboxGroupOptions.map((option) => (
        <label
          className="flex min-h-6 items-center gap-2"
          htmlFor={`${groupId}-${option.value}`}
          key={option.value}
        >
          <TRCheckbox.Root
            id={`${groupId}-${option.value}`}
            name="permissions"
            value={option.value}
          >
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          {option.label}
        </label>
      ))}
      <output aria-live="polite">Selected: {value.join(', ') || 'none'}</output>
    </TRCheckboxGroup>
  );
}

export function CheckboxGroupExternalFormPreview() {
  const formId = useId();
  const groupId = useId();
  const [result, setResult] = useState('');

  return (
    <div className="grid gap-3">
      <TRForm
        id={formId}
        onReset={() => setResult('Reset to metrics.')}
        onSubmit={(event) => {
          event.preventDefault();
          setResult(
            `Submitted: ${new FormData(event.currentTarget).getAll('features').join(', ')}`,
          );
        }}
      >
        <div className="flex flex-wrap gap-2">
          <TRButton type="submit">Submit external group</TRButton>
          <TRButton type="reset" variant="secondary">
            Reset
          </TRButton>
        </div>
      </TRForm>
      <TRCheckboxGroup aria-label="External features" defaultValue={['metrics']}>
        {checkboxGroupOptions.slice(0, 2).map((option) => (
          <label
            className="flex min-h-6 items-center gap-2"
            htmlFor={`${groupId}-${option.value}`}
            key={option.value}
          >
            <TRCheckbox.Root
              form={formId}
              id={`${groupId}-${option.value}`}
              name="features"
              value={option.value}
            >
              <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
            </TRCheckbox.Root>
            {option.label}
          </label>
        ))}
      </TRCheckboxGroup>
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export function CheckboxGroupFormPreview() {
  const errorId = useId();
  const [attempted, setAttempted] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(['metrics']);
  const [submittedValues, setSubmittedValues] = useState<string[]>([]);
  const invalid = attempted && (selectedValues.length < 1 || selectedValues.length > 2);
  const errorMessage =
    selectedValues.length < 1
      ? 'TRSelect at least one feature.'
      : 'TRSelect no more than two features.';

  return (
    <TRForm
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        const values = new FormData(event.currentTarget)
          .getAll('rack-features')
          .map((value) => String(value));
        setSubmittedValues(values.length >= 1 && values.length <= 2 ? values : []);
      }}
    >
      <CheckboxGroupPreview
        {...(invalid ? { descriptionId: errorId } : {})}
        disabled={false}
        invalid={invalid}
        label="Included features"
        onSelectedValuesChange={(values) => {
          setSelectedValues(values);
          setSubmittedValues([]);
        }}
        selectedValues={selectedValues}
      />
      {invalid ? (
        <p className="m-0 text-sm text-tinyrack-danger" id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <TRButton type="submit">Save features</TRButton>
      <output aria-live="polite">
        {submittedValues.length > 0 ? `Saved: ${submittedValues.join(', ')}.` : ''}
      </output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Checkbox Group',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Rack features',
    readOnly: false,
    selectedValues: ['metrics', 'backups'],
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    selectedValues: {
      control: { type: 'checklist' },
      options: checkboxGroupOptions.map((option) => option.value),
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <CheckboxGroupPreview
        {...args}
        onSelectedValuesChange={(selectedValues) => updateArgs({ selectedValues })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
