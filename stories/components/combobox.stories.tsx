import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '../../src/components/button/index.js';
import { Combobox } from '../../src/components/combobox/index.js';
import { Field } from '../../src/components/field/index.js';
import { Form } from '../../src/components/form/index.js';

type ComboboxStoryArgs = {
  disabled: boolean;
  disabledOption: boolean;
  open: boolean;
  placeholder: string;
  query: string;
  selected: 'none' | 'Rack A' | 'Rack B' | 'Rack C';
};

type ComboboxExampleProps = ComboboxStoryArgs & {
  onOpenChange?: (open: boolean) => void;
  onQueryChange?: (query: string) => void;
  onSelectedChange?: (selected: ComboboxStoryArgs['selected']) => void;
  required?: boolean;
};

const comboboxItems = ['Rack A', 'Rack B', 'Rack C'];

export function ComboboxExample({
  disabled,
  disabledOption,
  onOpenChange,
  onQueryChange,
  onSelectedChange,
  open,
  placeholder,
  query,
  required = false,
  selected,
}: ComboboxExampleProps) {
  const inputId = useId();
  const openProps = onOpenChange ? { open, onOpenChange } : { defaultOpen: open };
  const queryProps = onQueryChange
    ? { inputValue: query, onInputValueChange: onQueryChange }
    : { defaultInputValue: query };
  const selectionProps = onSelectedChange
    ? {
        value: selected === 'none' ? null : selected,
        onValueChange: (value: unknown) =>
          onSelectedChange((value as ComboboxStoryArgs['selected'] | null) ?? 'none'),
      }
    : { defaultValue: selected === 'none' ? null : selected };

  return (
    <Combobox.Root
      {...openProps}
      {...queryProps}
      {...selectionProps}
      disabled={disabled}
      items={comboboxItems}
      name="rack"
      required={required}
    >
      <Combobox.Label render={<label htmlFor={inputId}>Deployment rack</label>} />
      <Combobox.InputGroup className="tinyrack-combobox-story-layout flex w-full max-w-md items-stretch gap-2">
        <Combobox.Input
          className="min-w-0 flex-1"
          id={inputId}
          placeholder={placeholder}
        />
        <Combobox.Clear aria-label="Clear">×</Combobox.Clear>
        <Combobox.Trigger aria-label="Show racks">
          <Combobox.Icon aria-hidden="true">⌄</Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={8}>
          <Combobox.Popup>
            <Combobox.Arrow />
            <Combobox.Status />
            <Combobox.List>
              <Combobox.Group>
                <Combobox.GroupLabel>Production</Combobox.GroupLabel>
                <Combobox.Item value="Rack A">
                  Rack A
                  <Combobox.ItemIndicator aria-hidden="true">✓</Combobox.ItemIndicator>
                </Combobox.Item>
                <Combobox.Item disabled={disabledOption} value="Rack B">
                  Rack B {disabledOption ? '· Maintenance' : ''}
                  <Combobox.ItemIndicator aria-hidden="true">✓</Combobox.ItemIndicator>
                </Combobox.Item>
              </Combobox.Group>
              <Combobox.Separator />
              <Combobox.Group>
                <Combobox.GroupLabel>Non-production</Combobox.GroupLabel>
                <Combobox.Item value="Rack C">
                  Rack C
                  <Combobox.ItemIndicator aria-hidden="true">✓</Combobox.ItemIndicator>
                </Combobox.Item>
              </Combobox.Group>
              <Combobox.Empty>No matching racks</Combobox.Empty>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export function ComboboxOptionStates() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ComboboxStoryArgs['selected']>('Rack A');
  return (
    <ComboboxExample
      disabled={false}
      disabledOption
      onQueryChange={setQuery}
      onSelectedChange={setSelected}
      open={false}
      placeholder="Choose a rack"
      query={query}
      selected={selected}
    />
  );
}

export function ComboboxValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ComboboxStoryArgs['selected']>('none');
  const invalid = attempted && selected === 'none';

  return (
    <Form
      className="grid w-full max-w-md gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <Field.Root invalid={invalid}>
        <ComboboxExample
          disabled={false}
          disabledOption={false}
          onQueryChange={setQuery}
          onSelectedChange={setSelected}
          open={false}
          placeholder="Choose a rack"
          query={query}
          required
          selected={selected}
        />
        <Field.Error match>Choose a rack from the list.</Field.Error>
      </Field.Root>
      <Button type="submit">Deploy</Button>
      <output aria-live="polite">
        {attempted && selected !== 'none' ? `Deploying to ${selected}.` : ''}
      </output>
    </Form>
  );
}

const meta = {
  title: 'Components/Combobox',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    disabledOption: false,
    open: false,
    placeholder: 'Choose a rack',
    query: '',
    selected: 'none',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    disabledOption: { control: 'boolean' },
    open: { control: 'boolean' },
    placeholder: { control: 'text' },
    query: { control: 'text' },
    selected: { control: 'select', options: ['none', ...comboboxItems] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ComboboxStoryArgs>();
    return (
      <ComboboxExample
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
        onQueryChange={(query) => updateArgs({ query })}
        onSelectedChange={(selected) => updateArgs({ selected })}
      />
    );
  },
} satisfies Meta<ComboboxStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };
