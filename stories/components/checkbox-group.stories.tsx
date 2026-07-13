import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Checkbox } from '../../src/components/checkbox/index.js';
import { CheckboxGroup } from '../../src/components/checkbox-group/index.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  selectedValues: string[];
};

type CheckboxGroupPreviewProps = StoryArgs & {
  onSelectedValuesChange?: (selectedValues: string[]) => void;
};

const checkboxGroupOptions = [
  { label: 'Metrics', value: 'metrics' },
  { label: 'Alerts', value: 'alerts' },
  { label: 'Automated backups', value: 'backups' },
] as const;

export function CheckboxGroupPreview({
  disabled,
  label,
  onSelectedValuesChange,
  selectedValues,
}: CheckboxGroupPreviewProps) {
  const [value, setValue] = useState(selectedValues);

  useEffect(() => {
    setValue(selectedValues);
  }, [selectedValues]);

  function handleValueChange(nextValue: string[]) {
    setValue(nextValue);
    onSelectedValuesChange?.(nextValue);
  }

  return (
    <CheckboxGroup
      aria-label={label}
      disabled={disabled}
      onValueChange={handleValueChange}
      value={value}
    >
      {checkboxGroupOptions.map((option) => (
        // biome-ignore lint/a11y/noLabelWithoutControl: Base UI Checkbox.Root renders a hidden input for enclosing labels.
        <label className="flex items-center gap-2" key={option.value}>
          <Checkbox.Root name="rack-features" value={option.value}>
            <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
          </Checkbox.Root>
          {option.label}
        </label>
      ))}
    </CheckboxGroup>
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
        onSelectedValuesChange={(selectedValues) => {
          updateArgs({ selectedValues });
        }}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
