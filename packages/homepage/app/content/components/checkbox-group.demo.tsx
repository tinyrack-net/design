import { Button } from '@tinyrack/ui/components/button';
import { Checkbox } from '@tinyrack/ui/components/checkbox';
import { CheckboxGroup } from '@tinyrack/ui/components/checkbox-group';
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
  disabled: boolean;
  label: string;
  selectedValues: string[];
};

type CheckboxGroupPreviewProps = Omit<StoryArgs, 'selectedValues'> & {
  descriptionId?: string;
  defaultSelectedValues?: string[];
  invalid?: boolean;
  onSelectedValuesChange?: (selectedValues: string[]) => void;
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
      <CheckboxGroup
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
              <Checkbox.Root
                aria-labelledby={optionLabelId}
                id={inputId}
                name="rack-features"
                value={option.value}
              >
                <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
              </Checkbox.Root>
              <label
                className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                htmlFor={inputId}
                id={optionLabelId}
                style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </CheckboxGroup>
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
      ? 'Select at least one feature.'
      : 'Select no more than two features.';

  return (
    <Form
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
      <Button type="submit">Save features</Button>
      <output aria-live="polite">
        {submittedValues.length > 0 ? `Saved: ${submittedValues.join(', ')}.` : ''}
      </output>
    </Form>
  );
}

const meta = {
  title: 'Components/Checkbox Group',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Rack features',
    selectedValues: ['metrics', 'backups'],
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
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
