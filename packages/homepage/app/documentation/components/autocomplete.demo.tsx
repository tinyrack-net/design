import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
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

type StoryArgs = {
  autoHighlight: boolean | 'always';
  disabled: boolean;
  disabledItem: boolean;
  mode: 'list' | 'both' | 'inline' | 'none';
  open: boolean;
  openOnInputClick: boolean;
  placeholder: string;
  readOnly: boolean;
  required: boolean;
  submitOnItemClick: boolean;
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
  autoHighlight,
  disabled,
  disabledItem,
  label = 'Rack',
  mode,
  onOpenChange,
  onValueChange,
  open,
  openOnInputClick,
  placeholder,
  readOnly,
  required,
  submitOnItemClick,
  value,
}: AutocompletePreviewProps) {
  const inputId = useId();
  const openProps = open === undefined ? { defaultOpen } : { open };
  const valueProps = value === undefined ? { defaultValue } : { value };

  return (
    <TRAutocomplete.Root
      {...openProps}
      {...valueProps}
      autoHighlight={autoHighlight}
      disabled={disabled}
      items={autocompleteItems}
      mode={mode}
      name="rack-search"
      onOpenChange={onOpenChange}
      openOnInputClick={openOnInputClick}
      onValueChange={onValueChange}
      readOnly={readOnly}
      required={required}
      submitOnItemClick={submitOnItemClick}
    >
      <label className="grid w-full max-w-md gap-2" htmlFor={inputId}>
        {label}
        <TRAutocomplete.InputGroup>
          <TRAutocomplete.InputAdornment aria-hidden="true">
            <Search />
          </TRAutocomplete.InputAdornment>
          <TRAutocomplete.Input id={inputId} placeholder={placeholder} />
          <TRAutocomplete.Clear aria-label="Clear">
            <X aria-hidden="true" />
          </TRAutocomplete.Clear>
          <TRAutocomplete.Trigger aria-label="Show suggestions">
            <TRAutocomplete.Icon aria-hidden="true">
              <ChevronDown />
            </TRAutocomplete.Icon>
          </TRAutocomplete.Trigger>
        </TRAutocomplete.InputGroup>
      </label>
      <TRAutocomplete.Portal>
        <TRAutocomplete.Positioner sideOffset={8}>
          <TRAutocomplete.Popup>
            <TRAutocomplete.Arrow />
            <TRAutocomplete.Status />
            <TRAutocomplete.List>
              <TRAutocomplete.Group>
                <TRAutocomplete.GroupLabel>Production</TRAutocomplete.GroupLabel>
                <TRAutocomplete.Item value="Rack Alpha">Rack Alpha</TRAutocomplete.Item>
                <TRAutocomplete.Item value="Rack Beta">Rack Beta</TRAutocomplete.Item>
                <TRAutocomplete.Item disabled={disabledItem} value="Rack Gamma">
                  Rack Gamma
                </TRAutocomplete.Item>
              </TRAutocomplete.Group>
              <TRAutocomplete.Separator />
              <TRAutocomplete.Group>
                <TRAutocomplete.GroupLabel>Non-production</TRAutocomplete.GroupLabel>
                <TRAutocomplete.Item value="Staging rack">
                  Staging rack
                </TRAutocomplete.Item>
              </TRAutocomplete.Group>
              <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
            </TRAutocomplete.List>
          </TRAutocomplete.Popup>
        </TRAutocomplete.Positioner>
      </TRAutocomplete.Portal>
    </TRAutocomplete.Root>
  );
}

export function AutocompleteStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AutocompletePreview
        defaultValue="Rack Alpha"
        autoHighlight={false}
        disabled={false}
        disabledItem={false}
        mode="list"
        openOnInputClick={false}
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <AutocompletePreview
        defaultValue="Rack Beta"
        autoHighlight={false}
        disabled
        disabledItem={false}
        label="Disabled"
        mode="list"
        openOnInputClick={false}
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <AutocompletePreview
        defaultValue="Rack Gamma"
        autoHighlight={false}
        disabled={false}
        disabledItem={false}
        label="Read only"
        mode="list"
        openOnInputClick={false}
        placeholder="Search racks"
        readOnly
        required={false}
        submitOnItemClick={false}
      />
    </div>
  );
}

export function AutocompleteBehaviorComparison() {
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <AutocompletePreview
        autoHighlight={false}
        defaultValue="Edge rack"
        disabled={false}
        disabledItem={false}
        label="Free-form value"
        mode="both"
        openOnInputClick
        placeholder="Known or custom rack"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <AutocompletePreview
        autoHighlight="always"
        defaultOpen
        defaultValue="No matching region"
        disabled={false}
        disabledItem
        label="Empty and disabled-item flow"
        mode="list"
        openOnInputClick
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick
      />
    </div>
  );
}

export function AutocompleteValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;

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
        <AutocompletePreview
          disabled={false}
          autoHighlight={false}
          disabledItem={false}
          label="Rack search"
          mode="list"
          onValueChange={setValue}
          openOnInputClick={false}
          placeholder="Type a rack name"
          readOnly={false}
          required
          submitOnItemClick={false}
          value={value}
        />
        {invalid ? <TRField.Error match>Enter a rack name.</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">
        {attempted && value ? `Searching for ${value}.` : ''}
      </output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Autocomplete',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    autoHighlight: false,
    disabled: false,
    disabledItem: false,
    mode: 'list',
    open: false,
    openOnInputClick: false,
    placeholder: 'Search racks',
    readOnly: false,
    required: false,
    submitOnItemClick: false,
    value: '',
  },
  argTypes: {
    autoHighlight: { control: 'select', options: [false, true, 'always'] },
    disabled: { control: 'boolean' },
    disabledItem: { control: 'boolean' },
    mode: { control: 'select', options: ['list', 'both', 'inline', 'none'] },
    openOnInputClick: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    submitOnItemClick: { control: 'boolean' },
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
