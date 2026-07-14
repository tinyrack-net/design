import { Button } from '@tinyrack/ui/components/button';
import { Combobox } from '@tinyrack/ui/components/combobox';
import { Field } from '@tinyrack/ui/components/field';
import { Form } from '@tinyrack/ui/components/form';
import { ChevronDown, Search, X } from 'lucide-react';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

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
      <label className="tr-label" htmlFor={inputId}>
        Deployment rack
      </label>
      <Combobox.InputGroup className="tinyrack-combobox-story-layout w-full max-w-md">
        <Combobox.InputAdornment aria-hidden="true">
          <Search />
        </Combobox.InputAdornment>
        <Combobox.Input id={inputId} placeholder={placeholder} />
        <Combobox.Clear aria-label="Clear">
          <X aria-hidden="true" />
        </Combobox.Clear>
        <Combobox.Trigger aria-label="Show racks">
          <Combobox.Icon aria-hidden="true">
            <ChevronDown />
          </Combobox.Icon>
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
  const [query, setQuery] = useState('Rack A');
  const [selected, setSelected] = useState<ComboboxStoryArgs['selected']>('Rack A');
  return (
    <ComboboxExample
      disabled={false}
      disabledOption
      onQueryChange={setQuery}
      onSelectedChange={(nextSelected) => {
        setSelected(nextSelected);
        setQuery(nextSelected === 'none' ? '' : nextSelected);
      }}
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
        {invalid ? <Field.Error match>Choose a rack from the list.</Field.Error> : null}
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

export const playground = definePlayground(meta);
