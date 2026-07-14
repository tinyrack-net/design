import { Autocomplete } from '@tinyrack/ui/components/autocomplete';
import { Button } from '@tinyrack/ui/components/button';
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
  disabled: boolean;
  open: boolean;
  placeholder: string;
  readOnly: boolean;
  required: boolean;
  value: string;
};

type AutocompletePreviewProps = Omit<StoryArgs, 'open' | 'value'> & {
  defaultOpen?: boolean;
  defaultValue?: string;
  label?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  open?: boolean;
  value?: string;
};

const autocompleteItems = ['Rack Alpha', 'Rack Beta', 'Rack Gamma', 'Staging rack'];

export function AutocompletePreview({
  defaultOpen,
  defaultValue,
  disabled,
  label = 'Rack',
  onOpenChange,
  onValueChange,
  open,
  placeholder,
  readOnly,
  required,
  value,
}: AutocompletePreviewProps) {
  const inputId = useId();
  const openProps = open === undefined ? { defaultOpen } : { open };
  const valueProps = value === undefined ? { defaultValue } : { value };

  return (
    <Autocomplete.Root
      {...openProps}
      {...valueProps}
      disabled={disabled}
      items={autocompleteItems}
      name="rack-search"
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
      readOnly={readOnly}
      required={required}
    >
      <label className="grid gap-2" htmlFor={inputId}>
        {label}
        <Autocomplete.InputGroup>
          <Autocomplete.Input id={inputId} placeholder={placeholder} />
          <Autocomplete.Clear aria-label="Clear">×</Autocomplete.Clear>
          <Autocomplete.Trigger aria-label="Show suggestions">
            <Autocomplete.Icon aria-hidden="true">⌄</Autocomplete.Icon>
          </Autocomplete.Trigger>
        </Autocomplete.InputGroup>
      </label>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={8}>
          <Autocomplete.Popup>
            <Autocomplete.Arrow />
            <Autocomplete.Status />
            <Autocomplete.List>
              <Autocomplete.Group>
                <Autocomplete.GroupLabel>Production</Autocomplete.GroupLabel>
                <Autocomplete.Item value="Rack Alpha">Rack Alpha</Autocomplete.Item>
                <Autocomplete.Item value="Rack Beta">Rack Beta</Autocomplete.Item>
                <Autocomplete.Item value="Rack Gamma">Rack Gamma</Autocomplete.Item>
              </Autocomplete.Group>
              <Autocomplete.Separator />
              <Autocomplete.Group>
                <Autocomplete.GroupLabel>Non-production</Autocomplete.GroupLabel>
                <Autocomplete.Item value="Staging rack">Staging rack</Autocomplete.Item>
              </Autocomplete.Group>
              <Autocomplete.Empty>No matching racks</Autocomplete.Empty>
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}

export function AutocompleteStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AutocompletePreview
        defaultValue="Rack Alpha"
        disabled={false}
        placeholder="Search racks"
        readOnly={false}
        required={false}
      />
      <AutocompletePreview
        defaultValue="Rack Beta"
        disabled
        label="Disabled"
        placeholder="Search racks"
        readOnly={false}
        required={false}
      />
      <AutocompletePreview
        defaultValue="Rack Gamma"
        disabled={false}
        label="Read only"
        placeholder="Search racks"
        readOnly
        required={false}
      />
    </div>
  );
}

export function AutocompleteValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;

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
        <AutocompletePreview
          disabled={false}
          label="Rack search"
          onValueChange={setValue}
          placeholder="Type a rack name"
          readOnly={false}
          required
          value={value}
        />
        {invalid ? <Field.Error match>Enter a rack name.</Field.Error> : null}
      </Field.Root>
      <Button type="submit">Continue</Button>
      <output aria-live="polite">
        {attempted && value ? `Searching for ${value}.` : ''}
      </output>
    </Form>
  );
}

const meta = {
  title: 'Components/Autocomplete',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    open: false,
    placeholder: 'Search racks',
    readOnly: false,
    required: false,
    value: '',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    open: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <AutocompletePreview
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
        onValueChange={(value) => updateArgs({ value })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
