import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '../../src/components/button/index.js';
import { Field } from '../../src/components/field/index.js';
import { Form } from '../../src/components/form/index.js';
import { Select } from '../../src/components/select/index.js';

type StoryArgs = {
  disabled: boolean;
  modal: boolean;
  open: boolean;
  readOnly: boolean;
  required: boolean;
  value: string;
};

type SelectPreviewProps = Omit<StoryArgs, 'open' | 'value'> & {
  defaultOpen?: boolean;
  defaultValue?: string;
  label?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  value?: string | null;
};

const selectItems = {
  alpha: 'Rack Alpha',
  beta: 'Rack Beta',
  gamma: 'Rack Gamma',
  staging: 'Staging rack',
} as const;

export function SelectPreview({
  defaultOpen,
  defaultValue,
  disabled,
  label = 'Deployment rack',
  modal,
  onOpenChange,
  onValueChange,
  open,
  readOnly,
  required,
  value,
}: SelectPreviewProps) {
  const openProps = open === undefined ? { defaultOpen } : { open };
  const valueProps = value === undefined ? { defaultValue } : { value };

  return (
    <Select.Root
      {...openProps}
      {...valueProps}
      disabled={disabled}
      items={selectItems}
      modal={modal}
      name="rack"
      onOpenChange={onOpenChange}
      onValueChange={(nextValue) =>
        onValueChange?.((nextValue as string | null) ?? null)
      }
      readOnly={readOnly}
      required={required}
    >
      <Select.Label>{label}</Select.Label>
      <Select.Trigger>
        <Select.Value placeholder="Choose a rack" />
        <Select.Icon aria-hidden="true">⌄</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        {modal ? <Select.Backdrop /> : null}
        <Select.Positioner sideOffset={8}>
          <Select.Popup>
            <Select.Arrow />
            <Select.ScrollUpArrow aria-label="Scroll up">↑</Select.ScrollUpArrow>
            <Select.List>
              <Select.Group>
                <Select.GroupLabel>Production</Select.GroupLabel>
                <Select.Item value="alpha">
                  <Select.ItemText>Rack Alpha</Select.ItemText>
                  <Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="beta">
                  <Select.ItemText>Rack Beta</Select.ItemText>
                  <Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator>
                </Select.Item>
                <Select.Item disabled value="gamma">
                  <Select.ItemText>Rack Gamma · Offline</Select.ItemText>
                  <Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator>
                </Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.GroupLabel>Non-production</Select.GroupLabel>
                <Select.Item value="staging">
                  <Select.ItemText>Staging rack</Select.ItemText>
                  <Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator>
                </Select.Item>
              </Select.Group>
            </Select.List>
            <Select.ScrollDownArrow aria-label="Scroll down">↓</Select.ScrollDownArrow>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

export function SelectStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectPreview
        defaultValue="alpha"
        disabled={false}
        label="Editable"
        modal={false}
        readOnly={false}
        required={false}
      />
      <SelectPreview
        defaultValue="beta"
        disabled
        label="Disabled"
        modal={false}
        readOnly={false}
        required={false}
      />
      <SelectPreview
        defaultValue="staging"
        disabled={false}
        label="Read only"
        modal={false}
        readOnly
        required={false}
      />
    </div>
  );
}

export function SelectValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const invalid = attempted && value === null;

  return (
    <Form
      className="grid w-80 max-w-full gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <Field.Root invalid={invalid}>
        <SelectPreview
          disabled={false}
          label="Deployment rack"
          modal={false}
          onValueChange={setValue}
          readOnly={false}
          required
          value={value}
        />
        <Field.Error match>Choose a deployment rack.</Field.Error>
      </Field.Root>
      <Button type="submit">Deploy</Button>
      <output aria-live="polite">
        {attempted && value
          ? `Ready to deploy to ${selectItems[value as keyof typeof selectItems]}.`
          : ''}
      </output>
    </Form>
  );
}

const meta = {
  title: 'Components/Select',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    modal: false,
    open: false,
    readOnly: false,
    required: false,
    value: 'alpha',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    modal: { control: 'boolean' },
    open: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'select', options: Object.keys(selectItems) },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <SelectPreview
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
        onValueChange={(value) => updateArgs({ value: value ?? '' })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };
