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
  limit: number;
  mode: 'list' | 'both' | 'inline' | 'none';
  open: boolean;
  openOnInputClick: boolean;
  placeholder: string;
  readOnly: boolean;
  value: string;
};

type AutocompletePreviewProps = Omit<StoryArgs, 'limit' | 'open' | 'value'> & {
  defaultOpen?: boolean;
  defaultValue?: string;
  disabledItem?: boolean;
  label?: string;
  limit?: number;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  open?: boolean;
  required?: boolean;
  submitOnItemClick?: boolean;
  value?: string;
};

const autocompleteGroups = [
  { value: 'Production', items: ['Rack Alpha', 'Rack Beta', 'Rack Gamma'] },
  { value: 'Non-production', items: ['Staging rack'] },
] as const;

type AutocompleteGroup = (typeof autocompleteGroups)[number];

function AutocompleteOptions({
  disabledItem = false,
}: {
  disabledItem?: boolean | undefined;
}) {
  return (
    <>
      <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
      <TRAutocomplete.List>
        {(group: AutocompleteGroup) => (
          <TRAutocomplete.Group key={group.value} items={group.items}>
            <TRAutocomplete.GroupLabel>{group.value}</TRAutocomplete.GroupLabel>
            <TRAutocomplete.Collection>
              {(item: string) => (
                <TRAutocomplete.Item
                  disabled={disabledItem && item === 'Rack Gamma'}
                  key={item}
                  value={item}
                >
                  {item}
                </TRAutocomplete.Item>
              )}
            </TRAutocomplete.Collection>
          </TRAutocomplete.Group>
        )}
      </TRAutocomplete.List>
    </>
  );
}

export function AutocompletePreview({
  defaultOpen,
  defaultValue,
  autoHighlight,
  disabled,
  disabledItem,
  label = 'Rack',
  limit = -1,
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
      items={autocompleteGroups}
      limit={limit}
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
            <AutocompleteOptions disabledItem={disabledItem} />
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

export function AutocompleteResetPreview() {
  const [result, setResult] = useState('');

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      onReset={() => setResult('')}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(`Submitted ${new FormData(event.currentTarget).get('rack-search')}.`);
      }}
    >
      <AutocompletePreview
        autoHighlight={false}
        defaultValue="Rack Alpha"
        disabled={false}
        disabledItem={false}
        mode="list"
        openOnInputClick={false}
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">Submit</TRButton>
        <TRButton type="reset" variant="secondary">
          Reset
        </TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

export const autocompleteBasicSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { ChevronDown, Search, X } from 'lucide-react';

const rackGroups = [
  { value: 'Production', items: ['Rack Alpha', 'Rack Beta', 'Rack Gamma'] },
  { value: 'Non-production', items: ['Staging rack'] },
];

export function RackSearch() {
  return (
    <TRAutocomplete.Root items={rackGroups} name="rack-search">
      <label className="grid w-full max-w-md gap-2" htmlFor="rack-search">
        Rack
        <TRAutocomplete.InputGroup>
          <TRAutocomplete.InputAdornment aria-hidden="true"><Search /></TRAutocomplete.InputAdornment>
          <TRAutocomplete.Input id="rack-search" placeholder="Search racks" />
          <TRAutocomplete.Clear aria-label="Clear"><X aria-hidden="true" /></TRAutocomplete.Clear>
          <TRAutocomplete.Trigger aria-label="Show suggestions"><TRAutocomplete.Icon aria-hidden="true"><ChevronDown /></TRAutocomplete.Icon></TRAutocomplete.Trigger>
        </TRAutocomplete.InputGroup>
      </label>
      <TRAutocomplete.Portal>
        <TRAutocomplete.Positioner sideOffset={8}>
          <TRAutocomplete.Popup>
            <TRAutocomplete.Arrow />
            <TRAutocomplete.Status />
            <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
            <TRAutocomplete.List>
              {(group) => (
                <TRAutocomplete.Group key={group.value} items={group.items}>
                  <TRAutocomplete.GroupLabel>{group.value}</TRAutocomplete.GroupLabel>
                  <TRAutocomplete.Collection>
                    {(rack) => <TRAutocomplete.Item key={rack} value={rack}>{rack}</TRAutocomplete.Item>}
                  </TRAutocomplete.Collection>
                </TRAutocomplete.Group>
              )}
            </TRAutocomplete.List>
          </TRAutocomplete.Popup>
        </TRAutocomplete.Positioner>
      </TRAutocomplete.Portal>
    </TRAutocomplete.Root>
  );
}`;

export const autocompleteStatesSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { useId } from 'react';

function RackState({ disabled = false, label, readOnly = false, value }: { disabled?: boolean; label: string; readOnly?: boolean; value: string }) {
  const id = useId();
  const items = ['Rack Alpha', 'Rack Beta', 'Rack Gamma', 'Staging rack'];
  return (
    <TRAutocomplete.Root defaultValue={value} disabled={disabled} items={items} readOnly={readOnly}>
      <label htmlFor={id}>{label}</label>
      <TRAutocomplete.InputGroup>
        <TRAutocomplete.Input id={id} />
        <TRAutocomplete.Clear aria-label={\`Clear \${label}\`}>Clear</TRAutocomplete.Clear>
        <TRAutocomplete.Trigger aria-label={\`Show \${label} suggestions\`}>Open</TRAutocomplete.Trigger>
      </TRAutocomplete.InputGroup>
      <TRAutocomplete.Portal><TRAutocomplete.Positioner><TRAutocomplete.Popup><TRAutocomplete.List>
        <TRAutocomplete.Collection>
          {(item) => <TRAutocomplete.Item key={item} value={item}>{item}</TRAutocomplete.Item>}
        </TRAutocomplete.Collection>
      </TRAutocomplete.List></TRAutocomplete.Popup></TRAutocomplete.Positioner></TRAutocomplete.Portal>
    </TRAutocomplete.Root>
  );
}

export function AutocompleteStates() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RackState label="Rack" value="Rack Alpha" />
      <RackState disabled label="Disabled" value="Rack Beta" />
      <RackState label="Read only" readOnly value="Rack Gamma" />
    </div>
  );
}`;

export const autocompleteValidationSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { useState } from 'react';

export function RackAutocompleteForm() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;
  return (
    <TRForm noValidate onSubmit={(event) => { event.preventDefault(); setAttempted(true); event.currentTarget.checkValidity(); }}>
      <TRField.Root invalid={invalid}>
        <TRAutocomplete.Root items={['Rack Alpha', 'Rack Beta']} name="rack-search" onValueChange={setValue} required value={value}>
          <label htmlFor="required-rack-search">Rack search</label>
          <TRAutocomplete.InputGroup>
            <TRAutocomplete.Input id="required-rack-search" placeholder="Type a rack name" />
            <TRAutocomplete.Clear aria-label="Clear">Clear</TRAutocomplete.Clear>
            <TRAutocomplete.Trigger aria-label="Show suggestions">Open</TRAutocomplete.Trigger>
          </TRAutocomplete.InputGroup>
          <TRAutocomplete.Portal><TRAutocomplete.Positioner><TRAutocomplete.Popup><TRAutocomplete.Status /><TRAutocomplete.List>
            <TRAutocomplete.Collection>
              {(item) => <TRAutocomplete.Item key={item} value={item}>{item}</TRAutocomplete.Item>}
            </TRAutocomplete.Collection>
            <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
          </TRAutocomplete.List></TRAutocomplete.Popup></TRAutocomplete.Positioner></TRAutocomplete.Portal>
        </TRAutocomplete.Root>
        {invalid ? <TRField.Error match>Enter a rack name.</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">{attempted && value ? \`Searching for \${value}.\` : ''}</output>
    </TRForm>
  );
}`;

export const autocompleteBehaviorsSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';

const items = ['Rack Alpha', 'Rack Beta', 'Rack Gamma', 'Staging rack'];

function BehaviorSample({ disabledItem = false, empty = false, label, mode }: { disabledItem?: boolean; empty?: boolean; label: string; mode: 'both' | 'list' }) {
  return (
    <TRAutocomplete.Root autoHighlight={empty ? 'always' : false} defaultOpen={empty} defaultValue={empty ? 'No matching region' : 'Edge rack'} items={items} mode={mode} openOnInputClick submitOnItemClick={empty}>
      <TRAutocomplete.Input aria-label={label} />
      <TRAutocomplete.Portal><TRAutocomplete.Positioner><TRAutocomplete.Popup><TRAutocomplete.Status /><TRAutocomplete.List>
        <TRAutocomplete.Collection>
          {(item) => <TRAutocomplete.Item disabled={disabledItem && item === 'Rack Gamma'} key={item} value={item}>{item}</TRAutocomplete.Item>}
        </TRAutocomplete.Collection>
        <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
      </TRAutocomplete.List></TRAutocomplete.Popup></TRAutocomplete.Positioner></TRAutocomplete.Portal>
    </TRAutocomplete.Root>
  );
}

export function AutocompleteBehaviors() {
  return <div className="grid gap-5 sm:grid-cols-2"><BehaviorSample label="Free-form value" mode="both" /><BehaviorSample disabledItem empty label="Empty and disabled-item flow" mode="list" /></div>;
}`;

export const autocompleteResetSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRForm } from '@tinyrack/ui/components/form';
import { useState } from 'react';

export function ResettableRackSearch() {
  const [result, setResult] = useState('');
  return (
    <TRForm
      onReset={() => setResult('')}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(\`Submitted \${new FormData(event.currentTarget).get('rack-search')}.\`);
      }}
    >
      <TRAutocomplete.Root defaultValue="Rack Alpha" items={['Rack Alpha', 'Rack Beta']} name="rack-search">
        <TRAutocomplete.Input aria-label="Rack" />
        <TRAutocomplete.Portal><TRAutocomplete.Positioner><TRAutocomplete.Popup><TRAutocomplete.List>
          <TRAutocomplete.Collection>
            {(item) => <TRAutocomplete.Item key={item} value={item}>{item}</TRAutocomplete.Item>}
          </TRAutocomplete.Collection>
        </TRAutocomplete.List></TRAutocomplete.Popup></TRAutocomplete.Positioner></TRAutocomplete.Portal>
      </TRAutocomplete.Root>
      <TRButton type="submit">Submit</TRButton>
      <TRButton type="reset" variant="secondary">Reset</TRButton>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}`;

const meta = {
  title: 'Components/Autocomplete',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    autoHighlight: false,
    disabled: false,
    limit: -1,
    mode: 'list',
    open: false,
    openOnInputClick: false,
    placeholder: 'Search racks',
    readOnly: false,
    value: '',
  },
  argTypes: {
    autoHighlight: { control: 'select', options: [false, true, 'always'] },
    disabled: { control: 'boolean' },
    limit: { control: 'select', options: [-1, 1, 2, 4] },
    mode: { control: 'select', options: ['list', 'both', 'inline', 'none'] },
    openOnInputClick: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
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
