import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '../../src/components/button/index.js';
import { Checkbox } from '../../src/components/checkbox/index.js';
import { CheckboxGroup } from '../../src/components/checkbox-group/index.js';
import { Form } from '../../src/components/form/index.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  selectedValues: string[];
};

type CheckboxGroupPreviewProps = Omit<StoryArgs, 'selectedValues'> & {
  defaultSelectedValues?: string[];
  onSelectedValuesChange?: (selectedValues: string[]) => void;
  selectedValues?: string[];
};

const checkboxGroupOptions = [
  { label: 'Metrics', value: 'metrics' },
  { label: 'Alerts', value: 'alerts' },
  { label: 'Automated backups', value: 'backups' },
] as const;

export function CheckboxGroupPreview({
  defaultSelectedValues,
  disabled,
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
        aria-labelledby={labelId}
        disabled={disabled}
        onValueChange={onSelectedValuesChange}
      >
        {checkboxGroupOptions.map((option, index) => {
          const inputId = `${baseId}-${index}`;
          return (
            <div className="flex items-center gap-2" key={option.value}>
              <Checkbox.Root id={inputId} name="rack-features" value={option.value}>
                <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
              </Checkbox.Root>
              <label
                className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                htmlFor={inputId}
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
  const [selectedValues, setSelectedValues] = useState<string[]>(['metrics']);
  const [submittedValues, setSubmittedValues] = useState<string[]>([]);

  return (
    <Form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmittedValues(selectedValues);
      }}
    >
      <CheckboxGroupPreview
        disabled={false}
        label="Included features"
        onSelectedValuesChange={setSelectedValues}
        selectedValues={selectedValues}
      />
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
      control: { type: 'inline-check' },
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
